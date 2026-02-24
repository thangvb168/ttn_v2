export type DeviceStatus = "online" | "offline" | "broadcasting";
export type MediaType = "smart_speaker" | "fm_speaker" | "led_screen";
export type ContentTopic =
  | "politics"
  | "culture"
  | "health"
  | "education"
  | "other";
export type BulletinStatus = "approved" | "broadcasting" | "pending";

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  broadcasting: number;
}

export interface BroadcastStats {
  totalMinutesToday: number;
  newBulletinsToday: number;
  totalBulletinsThisMonth: number;
}

export interface AlertStats {
  technicalIncidents: number;
  pendingApproval: number;
}

export interface RecentBulletinItem {
  id: string;
  title: string;
  topic: ContentTopic;
  status: BulletinStatus;
  approvedAt: string;
  broadcastedBy?: string;
}

export interface DeviceHistoryItem {
  id: string;
  title: string;
  broadcastedAt: string;
}

export interface DeviceMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: DeviceStatus;
  type: MediaType;
  district: string;
  commune: string;
  currentBulletin?: string;
  history: DeviceHistoryItem[];
}

export interface BroadcastTrendPoint {
  month: string;
  success: number;
  failed: number;
  total: number;
}

export interface ContentByTopic {
  topic: string;
  count: number;
  month: string;
}

export interface MediaTypeRatio {
  type: string;
  value: number;
}

export interface DeviceErrorLogItem {
  deviceId: string;
  deviceName: string;
  district: string;
  commune: string;
  lostAt: string;
}

export interface DashboardData {
  deviceStats: DeviceStats;
  broadcastStats: BroadcastStats;
  alertStats: AlertStats;
  devices: DeviceMarker[];
  broadcastTrend: BroadcastTrendPoint[];
  contentByTopic: ContentByTopic[];
  mediaTypeRatio: MediaTypeRatio[];
  recentBulletins: RecentBulletinItem[];
  deviceErrorLogs: DeviceErrorLogItem[];
}

export interface FilterState {
  district?: string;
  commune?: string;
  dateRange?: [string, string];
  status?: DeviceStatus | "all";
}
