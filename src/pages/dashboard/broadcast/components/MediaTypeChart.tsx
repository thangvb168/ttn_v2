import { Pie } from "@ant-design/plots";
import { Card, Skeleton } from "antd";
import type { FC } from "react";
import type { MediaTypeRatio } from "../data.d";

interface MediaTypeChartProps {
  loading: boolean;
  data: MediaTypeRatio[];
}

const MediaTypeChart: FC<MediaTypeChartProps> = ({ loading, data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const config = {
    data,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    label: {
      text: (d: MediaTypeRatio) => `${d.type}\n${d.value}`,
      style: { fontSize: 11 },
    },
    legend: { position: "bottom" as const },
    tooltip: {
      title: (d: MediaTypeRatio) => d.type,
      items: [{ field: "value", name: "Số lượng" }],
    },
    annotations: [
      {
        type: "text",
        style: {
          text: `${total}`,
          x: "50%",
          y: "46%",
          textAlign: "center",
          fontSize: 24,
          fontWeight: 700,
          fill: "#262626",
        },
      },
      {
        type: "text",
        style: {
          text: "Tổng thiết bị",
          x: "50%",
          y: "56%",
          textAlign: "center",
          fontSize: 11,
          fill: "#8c8c8c",
        },
      },
    ],
    scale: {
      color: {
        range: ["#1677ff", "#52c41a", "#faad14"],
      },
    },
  };

  return (
    <Card
      title="Loại hình truyền thông"
      style={{ borderRadius: 12, height: "100%" }}
    >
      <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
        <Pie {...config} height={260} />
      </Skeleton>
    </Card>
  );
};

export default MediaTypeChart;
