import { GridContent } from "@ant-design/pro-components";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Skeleton } from "antd";
import type { FC } from "react";
import { useState } from "react";
import BroadcastTrendChart from "./components/BroadcastTrendChart";
import ContentTopicChart from "./components/ContentTopicChart";
import DashboardFilters from "./components/DashboardFilters";
import DeviceErrorLog from "./components/DeviceErrorLog";
import GisMap from "./components/GisMap";
import RecentBulletinFeed from "./components/RecentBulletinFeed";
import SummaryCards from "./components/SummaryCards";
import type { FilterState } from "./data.d";
import { fetchDashboardData } from "./service";

const BroadcastDashboard: FC = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["broadcast-dashboard", filters],
    queryFn: async () => {
      const result = await fetchDashboardData(filters);
      setLastUpdated(new Date());
      return result;
    },
    refetchInterval: 30_000,
    staleTime: 25_000,
  });

  return (
    <GridContent>
      {/* Filter Bar */}
      <DashboardFilters
        onChange={setFilters}
        onRefresh={() => refetch()}
        lastUpdated={lastUpdated}
      />

      {/* Row 1: Summary Cards */}
      <div style={{ marginBottom: 16 }}>
        <SummaryCards
          loading={isLoading}
          devices={data?.devices ?? []}
          deviceStats={
            data?.deviceStats ?? {
              total: 0,
              online: 0,
              offline: 0,
              broadcasting: 0,
            }
          }
          broadcastStats={
            data?.broadcastStats ?? {
              totalMinutesToday: 0,
              newBulletinsToday: 0,
              totalBulletinsThisMonth: 0,
            }
          }
          alertStats={
            data?.alertStats ?? { technicalIncidents: 0, pendingApproval: 0 }
          }
        />
      </div>

      {/* Row 2: GIS Map — full width */}
      <div style={{ marginBottom: 16 }}>
        <Card
          title="Bản đồ thiết bị phát sóng"
          style={{ borderRadius: 12, height: 500 }}
          styles={{ body: { padding: 8, height: 440 } }}
          extra={
            <span style={{ fontSize: 12, color: "#8c8c8c" }}>
              🟢 Hoạt động &nbsp;🔴 Mất kết nối &nbsp;🟡 Đang phát
            </span>
          }
        >
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : (
            <GisMap
              devices={data?.devices ?? []}
              filterStatus={filters.status}
            />
          )}
        </Card>
      </div>

      {/* Row 3: Trend Chart + Content Topic Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={14}>
          <BroadcastTrendChart
            loading={isLoading}
            data={data?.broadcastTrend ?? []}
          />
        </Col>
        <Col xs={24} lg={10}>
          <ContentTopicChart
            loading={isLoading}
            data={data?.contentByTopic ?? []}
          />
        </Col>
      </Row>

      {/* Row 4: Recent Bulletins + Error Log */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <RecentBulletinFeed
            loading={isLoading}
            data={data?.recentBulletins ?? []}
          />
        </Col>
        <Col xs={24} lg={12}>
          <DeviceErrorLog
            loading={isLoading}
            data={data?.deviceErrorLogs ?? []}
          />
        </Col>
      </Row>
    </GridContent>
  );
};

export default BroadcastDashboard;
