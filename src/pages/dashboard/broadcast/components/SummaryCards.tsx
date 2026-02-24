import {
  AlertOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  SoundOutlined,
  StopOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  List,
  Modal,
  Popconfirm,
  Row,
  Skeleton,
  Slider,
  Space,
  Statistic,
  Tag,
  Tooltip,
  message,
} from "antd";
import type { FC } from "react";
import { useState } from "react";
import type {
  AlertStats,
  BroadcastStats,
  DeviceMarker,
  DeviceStats,
} from "../data.d";

interface SummaryCardsProps {
  loading: boolean;
  deviceStats: DeviceStats;
  broadcastStats: BroadcastStats;
  alertStats: AlertStats;
  devices: DeviceMarker[];
}

type ModalType = "online" | "offline" | "broadcasting" | null;

const STATUS_COLORS: Record<string, string> = {
  online: "#52c41a",
  offline: "#ff4d4f",
  broadcasting: "#faad14",
};

const STATUS_LABELS: Record<string, string> = {
  online: "Đang hoạt động",
  offline: "Mất kết nối",
  broadcasting: "Đang phát sóng",
};

const MODAL_TITLES: Record<string, string> = {
  online: "🟢 Thiết bị đang hoạt động",
  offline: "🔴 Thiết bị mất kết nối",
  broadcasting: "🟡 Thiết bị đang phát sóng",
};

// Sub-modal: Volume control
const VolumeModal: FC<{
  device: DeviceMarker | null;
  onClose: () => void;
}> = ({ device, onClose }) => {
  const [volume, setVolume] = useState(75);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // mock API
    message.success(
      `Đã chỉnh âm lượng thiết bị "${device?.name}" về ${volume}%`
    );
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      open={!!device}
      title={
        <Space>
          <SoundOutlined style={{ color: "#1677ff" }} />
          <span>Chỉnh âm lượng — {device?.name}</span>
        </Space>
      }
      onCancel={onClose}
      width={400}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" loading={saving} onClick={handleSave}>
          Lưu thay đổi
        </Button>,
      ]}
    >
      <div style={{ padding: "12px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            color: "#595959",
            fontSize: 13,
          }}
        >
          <span>Mức âm lượng hiện tại</span>
          <span style={{ fontWeight: 700, color: "#1677ff", fontSize: 16 }}>
            {volume}%
          </span>
        </div>
        <Slider
          min={0}
          max={100}
          value={volume}
          onChange={setVolume}
          marks={{ 0: "0%", 25: "25%", 50: "50%", 75: "75%", 100: "100%" }}
          tooltip={{ formatter: (v) => `${v}%` }}
        />
        <div style={{ color: "#8c8c8c", fontSize: 12, marginTop: 16 }}>
          Địa bàn: {device?.commune}, {device?.district}
        </div>
        {device?.currentBulletin && (
          <div style={{ color: "#faad14", fontSize: 12, marginTop: 4 }}>
            Đang phát: {device.currentBulletin}
          </div>
        )}
      </div>
    </Modal>
  );
};

// Device list modal with actions
const DeviceListModal: FC<{
  open: boolean;
  type: ModalType;
  devices: DeviceMarker[];
  onClose: () => void;
}> = ({ open, type, devices, onClose }) => {
  const [volumeDevice, setVolumeDevice] = useState<DeviceMarker | null>(null);
  const [stopTarget, setStopTarget] = useState<DeviceMarker | null>(null);

  const filtered = type ? devices.filter((d) => d.status === type) : [];
  const canAct = type === "broadcasting" || type === "online";

  const handleEmergencyStop = async () => {
    if (!stopTarget) return;
    await new Promise((r) => setTimeout(r, 600));
    message.warning(`Đã dừng khẩn cấp thiết bị "${stopTarget.name}"`);
    setStopTarget(null);
  };

  const getMenuItems = (device: DeviceMarker) => ({
    items: [
      {
        key: "volume",
        icon: <SoundOutlined />,
        label: "Chỉnh âm lượng",
        onClick: () => setVolumeDevice(device),
      },
      ...(type === "broadcasting"
        ? [
            { type: "divider" as const },
            {
              key: "stop",
              icon: <StopOutlined style={{ color: "#ff4d4f" }} />,
              label: <span style={{ color: "#ff4d4f" }}>Dừng khẩn cấp</span>,
              onClick: () => setStopTarget(device),
            },
          ]
        : []),
    ],
  });

  return (
    <>
      <Modal
        open={open}
        title={type ? MODAL_TITLES[type] : ""}
        onCancel={onClose}
        footer={null}
        width={540}
      >
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 24, color: "#8c8c8c" }}>
            Không có thiết bị
          </div>
        ) : (
          <List
            dataSource={filtered}
            renderItem={(device) => (
              <List.Item
                style={{ padding: "10px 0" }}
                actions={
                  canAct
                    ? [
                        <Dropdown
                          key="actions"
                          menu={getMenuItems(device)}
                          trigger={["click"]}
                          placement="bottomRight"
                        >
                          <Button
                            size="small"
                            type="text"
                            icon={<MoreOutlined style={{ fontSize: 16 }} />}
                          />
                        </Dropdown>,
                      ]
                    : undefined
                }
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        marginTop: 6,
                        background: STATUS_COLORS[device.status],
                        flexShrink: 0,
                      }}
                    />
                  }
                  title={<span style={{ fontWeight: 500 }}>{device.name}</span>}
                  description={
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                      {device.commune}, {device.district}
                      {device.currentBulletin && (
                        <span style={{ marginLeft: 8, color: "#faad14" }}>
                          · Đang phát: {device.currentBulletin}
                        </span>
                      )}
                    </div>
                  }
                />
                <Tag
                  color={
                    type === "online"
                      ? "success"
                      : type === "offline"
                      ? "error"
                      : "warning"
                  }
                  style={{ fontSize: 11 }}
                >
                  {type ? STATUS_LABELS[type] : ""}
                </Tag>
              </List.Item>
            )}
            style={{ maxHeight: 440, overflowY: "auto" }}
          />
        )}
      </Modal>

      {/* Volume slider modal */}
      <VolumeModal
        device={volumeDevice}
        onClose={() => setVolumeDevice(null)}
      />

      {/* Emergency stop confirm */}
      <Popconfirm
        open={!!stopTarget}
        title="Dừng khẩn cấp"
        description={
          <span>
            Bạn có chắc muốn dừng khẩn cấp
            <br />
            <b>{stopTarget?.name}</b>?
          </span>
        }
        okText="Dừng ngay"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        onConfirm={handleEmergencyStop}
        onCancel={() => setStopTarget(null)}
      >
        {/* invisible anchor for controlled Popconfirm */}
        <span style={{ position: "fixed", top: "50%", left: "50%" }} />
      </Popconfirm>
    </>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

const SummaryCards: FC<SummaryCardsProps> = ({
  loading,
  deviceStats,
  broadcastStats,
  alertStats,
  devices,
}) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const onlinePercent =
    deviceStats.total > 0
      ? Math.round((deviceStats.online / deviceStats.total) * 100)
      : 0;
  const offlinePercent =
    deviceStats.total > 0
      ? Math.round((deviceStats.offline / deviceStats.total) * 100)
      : 0;
  const broadcastingPercent =
    deviceStats.total > 0
      ? Math.round((deviceStats.broadcasting / deviceStats.total) * 100)
      : 0;
  const hasAlerts =
    alertStats.technicalIncidents + alertStats.pendingApproval > 0;

  const ProgressBar = ({
    percent,
    color,
    count,
    label,
    type,
  }: {
    percent: number;
    color: string;
    count: number;
    label: string;
    type: ModalType;
  }) => (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <span style={{ fontSize: 12, color, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, color, fontWeight: 600 }}>{count}</span>
      </div>
      <Tooltip
        title={
          type !== "offline"
            ? "Click để xem & điều khiển thiết bị"
            : "Click để xem danh sách"
        }
      >
        <div
          onClick={() => setModalType(type)}
          style={{
            cursor: "pointer",
            background: "#f5f5f5",
            borderRadius: 6,
            overflow: "hidden",
            height: 10,
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: color,
              borderRadius: 6,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </Tooltip>
      <div
        style={{
          textAlign: "right",
          fontSize: 11,
          color: "#8c8c8c",
          marginTop: 1,
        }}
      >
        {percent}%
      </div>
    </div>
  );

  return (
    <>
      <Row gutter={[16, 16]}>
        {/* Card 1 - Device Status */}
        <Col xs={24} sm={24} md={8}>
          <Card
            style={{ borderRadius: 12, height: "100%" }}
            styles={{ body: { padding: "20px 24px" } }}
          >
            <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #52c41a, #237804)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <WifiOutlined style={{ color: "#fff", fontSize: 18 }} />
                </div>
                <div>
                  <div
                    style={{ fontSize: 12, color: "#8c8c8c", lineHeight: 1.4 }}
                  >
                    Trạng thái thiết bị
                  </div>
                  <div
                    style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}
                  >
                    {deviceStats.total} thiết bị
                  </div>
                </div>
              </div>

              <ProgressBar
                percent={onlinePercent}
                color="#52c41a"
                count={deviceStats.online}
                label="Đang hoạt động"
                type="online"
              />
              <ProgressBar
                percent={offlinePercent}
                color="#ff4d4f"
                count={deviceStats.offline}
                label="Mất kết nối"
                type="offline"
              />
              <ProgressBar
                percent={broadcastingPercent}
                color="#faad14"
                count={deviceStats.broadcasting}
                label="Đang phát sóng"
                type="broadcasting"
              />
            </Skeleton>
          </Card>
        </Col>

        {/* Card 2 - Broadcast Stats */}
        <Col xs={24} sm={24} md={8}>
          <Card
            style={{ borderRadius: 12, height: "100%" }}
            styles={{ body: { padding: "20px 24px" } }}
          >
            <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #1677ff, #0050b3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <ClockCircleOutlined
                    style={{ color: "#fff", fontSize: 18 }}
                  />
                </div>
                <div>
                  <div
                    style={{ fontSize: 12, color: "#8c8c8c", lineHeight: 1.4 }}
                  >
                    Lưu lượng phát sóng
                  </div>
                  <div style={{ fontSize: 12, color: "#8c8c8c" }}>Hôm nay</div>
                </div>
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 12 }}>Tổng phút phát</span>}
                    value={broadcastStats.totalMinutesToday}
                    suffix="phút"
                    valueStyle={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#1677ff",
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 12 }}>Bản tin mới</span>}
                    value={broadcastStats.newBulletinsToday}
                    suffix="bản tin"
                    valueStyle={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#52c41a",
                    }}
                  />
                </Col>
              </Row>
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Statistic
                  title={<span style={{ fontSize: 12 }}>Tổng tháng này</span>}
                  value={broadcastStats.totalBulletinsThisMonth}
                  suffix="bản tin"
                  valueStyle={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#595959",
                  }}
                />
              </div>
            </Skeleton>
          </Card>
        </Col>

        {/* Card 3 - Alerts */}
        <Col xs={24} sm={24} md={8}>
          <Card
            style={{
              borderRadius: 12,
              height: "100%",
              border: hasAlerts ? "1px solid #ffccc7" : undefined,
              background: hasAlerts
                ? "linear-gradient(135deg, #fff2f0, #fff)"
                : undefined,
            }}
            styles={{ body: { padding: "20px 24px" } }}
          >
            <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: hasAlerts
                      ? "linear-gradient(135deg, #ff4d4f, #cf1322)"
                      : "linear-gradient(135deg, #d9d9d9, #8c8c8c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <AlertOutlined style={{ color: "#fff", fontSize: 18 }} />
                </div>
                <div>
                  <div
                    style={{ fontSize: 12, color: "#8c8c8c", lineHeight: 1.4 }}
                  >
                    Cảnh báo khẩn cấp
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: hasAlerts ? "#ff4d4f" : "#595959",
                    }}
                  >
                    {alertStats.technicalIncidents + alertStats.pendingApproval}
                  </div>
                </div>
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 12 }}>Sự cố kỹ thuật</span>}
                    value={alertStats.technicalIncidents}
                    valueStyle={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#ff4d4f",
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={<span style={{ fontSize: 12 }}>Chờ duyệt gấp</span>}
                    value={alertStats.pendingApproval}
                    valueStyle={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#faad14",
                    }}
                  />
                </Col>
              </Row>
              <div style={{ marginTop: 12 }}>
                <Badge
                  status={hasAlerts ? "processing" : "default"}
                  color={hasAlerts ? "#ff4d4f" : undefined}
                  text={
                    <span style={{ fontSize: 12, color: "#8c8c8c" }}>
                      {hasAlerts
                        ? "Cần xử lý ngay lập tức"
                        : "Không có cảnh báo"}
                    </span>
                  }
                />
              </div>
            </Skeleton>
          </Card>
        </Col>
      </Row>

      {/* Device list modal */}
      <DeviceListModal
        open={modalType !== null}
        type={modalType}
        devices={devices}
        onClose={() => setModalType(null)}
      />
    </>
  );
};

export default SummaryCards;
