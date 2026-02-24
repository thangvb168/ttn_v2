import { Badge, Card, List, Skeleton, Tag } from "antd";
import dayjs from "dayjs";
import type { FC } from "react";
import type {
  BulletinStatus,
  ContentTopic,
  RecentBulletinItem,
} from "../data.d";

interface RecentBulletinFeedProps {
  loading: boolean;
  data: RecentBulletinItem[];
}

const STATUS_CONFIG: Record<BulletinStatus, { color: string; label: string }> =
  {
    broadcasting: { color: "blue", label: "Đang phát" },
    approved: { color: "green", label: "Đã duyệt" },
    pending: { color: "orange", label: "Chờ duyệt" },
  };

const TOPIC_CONFIG: Record<ContentTopic, { color: string; label: string }> = {
  politics: { color: "red", label: "Chính trị" },
  culture: { color: "purple", label: "Văn hóa" },
  health: { color: "cyan", label: "Y tế" },
  education: { color: "geekblue", label: "Giáo dục" },
  other: { color: "default", label: "Khác" },
};

const RecentBulletinFeed: FC<RecentBulletinFeedProps> = ({ loading, data }) => {
  return (
    <Card
      title={
        <span>
          Bản tin gần đây
          <Badge
            count={data.filter((d) => d.status === "pending").length}
            style={{ marginLeft: 8, backgroundColor: "#faad14" }}
          />
        </span>
      }
      style={{ borderRadius: 12, height: "100%" }}
      extra={
        <span style={{ fontSize: 12, color: "#8c8c8c" }}>
          8 bản tin gần nhất
        </span>
      }
    >
      <Skeleton loading={loading} active paragraph={{ rows: 8 }}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => {
            const status = STATUS_CONFIG[item.status];
            const topic = TOPIC_CONFIG[item.topic];
            return (
              <List.Item
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
                extra={
                  <span
                    style={{
                      fontSize: 11,
                      color: "#bfbfbf",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dayjs(item.approvedAt).format("DD/MM HH:mm")}
                  </span>
                }
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        marginTop: 7,
                        background:
                          status.color === "blue"
                            ? "#1677ff"
                            : status.color === "green"
                            ? "#52c41a"
                            : "#faad14",
                      }}
                    />
                  }
                  title={
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        display: "block",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.title}
                    </span>
                  }
                  description={
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        flexWrap: "wrap",
                        marginTop: 2,
                      }}
                    >
                      <Tag
                        color={topic.color}
                        style={{ fontSize: 10, margin: 0, lineHeight: "16px" }}
                      >
                        {topic.label}
                      </Tag>
                      <Tag
                        color={status.color}
                        style={{ fontSize: 10, margin: 0, lineHeight: "16px" }}
                      >
                        {status.label}
                      </Tag>
                      {item.broadcastedBy && (
                        <span style={{ fontSize: 11, color: "#8c8c8c" }}>
                          — {item.broadcastedBy}
                        </span>
                      )}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Skeleton>
    </Card>
  );
};

export default RecentBulletinFeed;
