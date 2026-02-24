import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import type { FC } from "react";
import { useState } from "react";
import type { FilterState } from "../data.d";

const { RangePicker } = DatePicker;

interface DashboardFiltersProps {
  onChange: (filters: FilterState) => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

const DISTRICT_OPTIONS = [
  { label: "Toàn thành phố", value: "" },
  { label: "Quận 1", value: "q1" },
  { label: "Quận 3", value: "q3" },
  { label: "Gò Vấp", value: "govap" },
  { label: "Bình Thạnh", value: "binhthanh" },
  { label: "Tân Bình", value: "tanbinh" },
  { label: "Thủ Đức", value: "thuduc" },
  { label: "Quận 12", value: "q12" },
  { label: "Hóc Môn", value: "hocmon" },
  { label: "Củ Chi", value: "cuchi" },
  { label: "Bình Chánh", value: "binhchanh" },
  { label: "Nhà Bè", value: "nhabe" },
  { label: "Cần Giờ", value: "cangio" },
];

const STATUS_OPTIONS = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "🟢 Đang hoạt động", value: "online" },
  { label: "🔴 Mất kết nối", value: "offline" },
  { label: "🟡 Đang phát sóng", value: "broadcasting" },
];

const QUICK_DATE_OPTIONS = [
  { label: "Hôm nay", days: 0 },
  { label: "7 ngày", days: 7 },
  { label: "Tháng này", days: 30 },
];

const DashboardFilters: FC<DashboardFiltersProps> = ({
  onChange,
  onRefresh,
  lastUpdated,
}) => {
  const [district, setDistrict] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [activeQuick, setActiveQuick] = useState<number | null>(null);

  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    onChange({ district: val, status: status as FilterState["status"] });
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    onChange({ district, status: val as FilterState["status"] });
  };

  const handleQuickDate = (days: number, idx: number) => {
    setActiveQuick(idx);
    const end = dayjs().format("YYYY-MM-DD");
    const start =
      days === 0 ? end : dayjs().subtract(days, "day").format("YYYY-MM-DD");
    onChange({
      district,
      status: status as FilterState["status"],
      dateRange: [start, end],
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
        padding: "12px 16px",
        background: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <Space wrap size={8}>
        <FilterOutlined style={{ color: "#1677ff" }} />
        <Select
          value={district}
          onChange={handleDistrictChange}
          options={DISTRICT_OPTIONS}
          style={{ width: 180 }}
          placeholder="Đơn vị hành chính"
        />
        <Select
          value={status}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          style={{ width: 180 }}
        />
        <RangePicker
          style={{ width: 240 }}
          format="DD/MM/YYYY"
          placeholder={["Từ ngày", "Đến ngày"]}
          onChange={(_, dateStrings) => {
            setActiveQuick(null);
            if (dateStrings[0] && dateStrings[1]) {
              onChange({
                district,
                status: status as FilterState["status"],
                dateRange: dateStrings as [string, string],
              });
            }
          }}
        />
        <Space size={4}>
          {QUICK_DATE_OPTIONS.map((opt, idx) => (
            <Button
              key={opt.label}
              size="small"
              type={activeQuick === idx ? "primary" : "default"}
              onClick={() => handleQuickDate(opt.days, idx)}
            >
              {opt.label}
            </Button>
          ))}
        </Space>
      </Space>
      <Space>
        {lastUpdated && (
          <span style={{ fontSize: 12, color: "#8c8c8c" }}>
            Cập nhật: {dayjs(lastUpdated).format("HH:mm:ss")}
          </span>
        )}
        <Button icon={<ReloadOutlined />} onClick={onRefresh} size="small">
          Làm mới
        </Button>
      </Space>
    </div>
  );
};

export default DashboardFilters;
