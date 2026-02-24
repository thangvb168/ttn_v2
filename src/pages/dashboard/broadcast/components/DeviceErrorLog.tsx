import { Card, Skeleton, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { FC } from "react";
import type { DeviceErrorLogItem } from "../data.d";

interface DeviceErrorLogProps {
  loading: boolean;
  data: DeviceErrorLogItem[];
}

const DeviceErrorLog: FC<DeviceErrorLogProps> = ({ loading, data }) => {
  const columns: ColumnsType<DeviceErrorLogItem> = [
    {
      title: "Thiết bị",
      dataIndex: "deviceName",
      key: "deviceName",
      render: (name, _, index) => (
        <span
          style={{
            fontWeight: index === 0 ? 600 : 400,
            color: index === 0 ? "#ff4d4f" : undefined,
          }}
        >
          {name}
        </span>
      ),
    },
    {
      title: "Địa bàn",
      key: "location",
      render: (_, record) => (
        <span style={{ fontSize: 12 }}>
          {record.commune}, {record.district}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => (
        <Tag color="error" style={{ fontSize: 11 }}>
          Mất tín hiệu
        </Tag>
      ),
    },
    {
      title: "Thời điểm mất",
      dataIndex: "lostAt",
      key: "lostAt",
      render: (val, _, index) => (
        <span
          style={{ fontSize: 12, color: index === 0 ? "#ff4d4f" : "#8c8c8c" }}
        >
          {dayjs(val).format("DD/MM HH:mm")}
        </span>
      ),
    },
  ];

  return (
    <Card
      title="Nhật ký lỗi thiết bị"
      style={{ borderRadius: 12, height: "100%" }}
      extra={
        <span style={{ fontSize: 12, color: "#8c8c8c" }}>Gần đây nhất</span>
      }
    >
      <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="deviceId"
          pagination={false}
          size="small"
          rowClassName={(_, index) =>
            index === 0 ? "error-row-highlight" : ""
          }
          style={{ marginTop: -4 }}
        />
      </Skeleton>
      <style>{`
        .error-row-highlight td {
          background-color: #fff2f0 !important;
        }
      `}</style>
    </Card>
  );
};

export default DeviceErrorLog;
