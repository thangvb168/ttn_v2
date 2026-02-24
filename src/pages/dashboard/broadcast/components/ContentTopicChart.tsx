import { Column } from "@ant-design/plots";
import { Card, Skeleton } from "antd";
import type { FC } from "react";
import type { ContentByTopic } from "../data.d";

interface ContentTopicChartProps {
  loading: boolean;
  data: ContentByTopic[];
}

const ContentTopicChart: FC<ContentTopicChartProps> = ({ loading, data }) => {
  const config = {
    data,
    xField: "month",
    yField: "count",
    colorField: "topic",
    stack: true,
    label: false as const,
    legend: { position: "top-right" as const },
    scale: {
      color: {
        range: ["#1677ff", "#722ed1", "#eb2f96", "#52c41a", "#fa8c16"],
      },
    },
    tooltip: {
      title: (d: any) => d.month,
    },
    axis: {
      y: { title: "Số bản tin" },
      x: { title: "" },
    },
  };

  return (
    <Card
      title="Phân loại bản tin theo chủ đề"
      style={{ borderRadius: 12 }}
      extra={
        <span style={{ fontSize: 12, color: "#8c8c8c" }}>4 tháng gần nhất</span>
      }
    >
      <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
        <Column {...config} height={240} />
      </Skeleton>
    </Card>
  );
};

export default ContentTopicChart;
