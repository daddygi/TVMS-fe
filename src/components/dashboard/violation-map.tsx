import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Metro Manila center
const MAP_CENTER: [number, number] = [14.5995, 120.9842];

export interface LocationAggregation {
  key: string;
  name: string;
  coords: [number, number];
  count: number;
}

interface ViolationMapProps {
  locations: LocationAggregation[];
  isLoading?: boolean;
}

function MapController() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function getMarkerRadius(count: number): number {
  // Scale radius based on count (min 8, max 40)
  const minRadius = 8;
  const maxRadius = 40;
  const scale = Math.log10(count + 1) / 4; // Logarithmic scaling
  return Math.min(maxRadius, Math.max(minRadius, minRadius + scale * (maxRadius - minRadius)));
}

function getMarkerColor(count: number): string {
  // Color based on count intensity
  if (count >= 1000) return "#dc2626"; // red-600
  if (count >= 500) return "#ea580c"; // orange-600
  if (count >= 100) return "#ca8a04"; // yellow-600
  return "#2563eb"; // blue-600
}

export function ViolationMap({ locations, isLoading }: ViolationMapProps) {
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1a3a5c]" />
          <p className="mt-2 text-sm text-gray-500">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={MAP_CENTER}
        zoom={11}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <CircleMarker
            key={location.key}
            center={location.coords}
            radius={getMarkerRadius(location.count)}
            pathOptions={{
              fillColor: getMarkerColor(location.count),
              fillOpacity: 0.7,
              color: "#1a3a5c",
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-[#1a3a5c]">{location.name}</p>
                <p className="text-gray-600">
                  <span className="font-medium">{location.count.toLocaleString()}</span> violations
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
