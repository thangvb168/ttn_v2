import { Column } from "@ant-design/plots";
import { Card, Col, Row, Skeleton, Statistic } from "antd";
import type { FC } from "react";
import type { BroadcastTrendPoint } from "../data.d";

interface BroadcastTrendChartProps {
  loading: boolean;
  data: BroadcastTrendPoint[];
}

const BroadcastTrendChart: FC<BroadcastTrendChartProps> = ({
  loading,
  data,
}) => {
  const totalSuccess = data.reduce((s, d) => s + d.success, 0);
  const totalFailed = data.reduce((s, d) => s + d.failed, 0);
  const totalAll = data.reduce((s, d) => s + d.total, 0);
  const successRate =
    totalAll > 0 ? Math.round((totalSuccess / totalAll) * 100) : 0;

  // Flatten for stacked column (success + failed)
  const columnData = data.flatMap((d) => [
    { month: d.month, value: d.success, type: "Thành công" },
    { month: d.month, value: d.failed, type: "Thất bại" },
  ]);

  const columnConfig = {
    data: columnData,
    xField: "month",
    yField: "value",
    colorField: "type",
    stack: true,
    scale: {
      color: { range: ["#52c41a", "#ff4d4f"] },
    },
    label: false as const,
    legend: { position: "top-right" as const },
    tooltip: {
      title: (d: any) => d.month,
    },
    axis: {
      y: { title: "Số lần phát sóng" },
      x: { title: "" },
    },
  };

  return (
    <Card
      title="Thống kê phát sóng theo tháng"
      style={{ borderRadius: 12 }}
      extra={
        <span style={{ fontSize: 12, color: "#8c8c8c" }}>
          12 tháng gần nhất
        </span>
      }
    >
      <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
        {/* Summary stats row */}
        <Row
          gutter={24}
          style={{
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Col span={8}>
            <Statistic
              title={<span style={{ fontSize: 12 }}>Tổng phát sóng</span>}
              value={totalAll}
              suffix="lần"
              valueStyle={{ fontSize: 18, fontWeight: 700, color: "#1677ff" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title={<span style={{ fontSize: 12 }}>Thành công</span>}
              value={totalSuccess}
              suffix={
                <span style={{ fontSize: 11, color: "#8c8c8c", marginLeft: 2 }}>
                  ({successRate}%)
                </span>
              }
              valueStyle={{ fontSize: 18, fontWeight: 700, color: "#52c41a" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title={<span style={{ fontSize: 12 }}>Thất bại</span>}
              value={totalFailed}
              suffix={
                <span style={{ fontSize: 11, color: "#8c8c8c", marginLeft: 2 }}>
                  ({100 - successRate}%)
                </span>
              }
              valueStyle={{ fontSize: 18, fontWeight: 700, color: "#ff4d4f" }}
            />
          </Col>
        </Row>

        <div>
          <Column {...columnConfig} height={240} />
        </div>
      </Skeleton>
    </Card>
  );
};

export default BroadcastTrendChart;
