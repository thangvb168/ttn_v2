import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FC } from "react";
import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { DeviceMarker } from "../data.d";

// Fix Leaflet default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

const MEDIA_TYPE_LABELS: Record<string, string> = {
  smart_speaker: "Loa thông minh",
  fm_speaker: "Loa FM",
  led_screen: "Màn hình LED",
};

// Auto-resize map when container resizes
const ResizeHandler: FC = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

interface GisMapProps {
  devices: DeviceMarker[];
  filterStatus?: string;
}

const GisMap: FC<GisMapProps> = ({ devices, filterStatus }) => {
  const filtered =
    filterStatus && filterStatus !== "all"
      ? devices.filter((d) => d.status === filterStatus)
      : devices;

  return (
    <MapContainer
      center={[10.8231, 106.6297]}
      zoom={10}
      style={{ height: "100%", width: "100%", minHeight: 420, borderRadius: 8 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ResizeHandler />
      {filtered.map((device) => (
        <CircleMarker
          key={device.id}
          center={[device.lat, device.lng]}
          radius={device.status === "broadcasting" ? 12 : 9}
          pathOptions={{
            color: STATUS_COLORS[device.status],
            fillColor: STATUS_COLORS[device.status],
            fillOpacity: device.status === "offline" ? 0.5 : 0.85,
            weight: device.status === "broadcasting" ? 3 : 2,
          }}
        >
          <Popup maxWidth={280}>
            <div style={{ fontFamily: "sans-serif", minWidth: 220 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 6,
                  borderBottom: "1px solid #f0f0f0",
                  paddingBottom: 6,
                }}
              >
                {device.name}
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ color: "#8c8c8c", fontSize: 12 }}>
                  Loại thiết bị:{" "}
                </span>
                <span style={{ fontSize: 12 }}>
                  {MEDIA_TYPE_LABELS[device.type]}
                </span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ color: "#8c8c8c", fontSize: 12 }}>
                  Địa bàn:{" "}
                </span>
                <span style={{ fontSize: 12 }}>
                  {device.commune}, {device.district}
                </span>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ color: "#8c8c8c", fontSize: 12 }}>Tọa độ: </span>
                <span style={{ fontSize: 12 }}>
                  {device.lat.toFixed(4)}, {device.lng.toFixed(4)}
                </span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "1px 8px",
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    background: `${STATUS_COLORS[device.status]}22`,
                    color: STATUS_COLORS[device.status],
                    border: `1px solid ${STATUS_COLORS[device.status]}44`,
                  }}
                >
                  {STATUS_LABELS[device.status]}
                </span>
              </div>
              {device.currentBulletin && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: "#8c8c8c", fontSize: 12 }}>
                    Đang phát:{" "}
                  </span>
                  <span
                    style={{ fontSize: 12, color: "#faad14", fontWeight: 600 }}
                  >
                    {device.currentBulletin}
                  </span>
                </div>
              )}
              <div>
                <div
                  style={{ color: "#8c8c8c", fontSize: 11, marginBottom: 4 }}
                >
                  5 bản tin gần nhất:
                </div>
                {device.history.slice(0, 5).map((h, i) => (
                  <div
                    key={h.id}
                    style={{
                      fontSize: 11,
                      padding: "2px 0",
                      borderBottom: i < 4 ? "1px solid #f5f5f5" : undefined,
                      color: "#595959",
                    }}
                  >
                    {h.title}
                    <span
                      style={{ float: "right", color: "#bfbfbf", fontSize: 10 }}
                    >
                      {new Date(h.broadcastedAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default GisMap;
