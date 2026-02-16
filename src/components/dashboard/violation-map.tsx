import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

const MAP_CENTER: [number, number] = [14.5995, 120.9842];
const HEATMAP_ZOOM_THRESHOLD = 12;

export interface LocationAggregation {
  key: string;
  name: string;
  coords: [number, number];
  count: number;
}

interface ViolationMapProps {
  locations: LocationAggregation[];
  isLoading?: boolean;
  focusCoords?: [number, number] | null;
}

function MapController({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    onZoomChange(map.getZoom());

    const handleZoom = () => onZoomChange(map.getZoom());
    map.on("zoomend", handleZoom);

    return () => {
      clearTimeout(timer);
      map.off("zoomend", handleZoom);
    };
  }, [map, onZoomChange]);

  return null;
}

function MapFocus({
  coords,
}: {
  coords?: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13, { duration: 0.8 });
    } else {
      map.flyTo(MAP_CENTER, 11, { duration: 0.8 });
    }
  }, [map, coords]);

  return null;
}

function HeatLayer({ locations }: { locations: LocationAggregation[] }) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    const maxCount = Math.max(...locations.map((l) => l.count), 1);
    const points: [number, number, number][] = locations.map((l) => [
      l.coords[0],
      l.coords[1],
      l.count,
    ]);

    const heat = (L as unknown as { heatLayer: (points: [number, number, number][], opts: object) => L.Layer }).heatLayer(points, {
      radius: 50,
      blur: 35,
      max: maxCount,
      maxZoom: 17,
      minOpacity: 0.4,
      gradient: {
        0.2: "#ffffb2",
        0.4: "#fed976",
        0.6: "#feb24c",
        0.8: "#f03b20",
        1.0: "#bd0026",
      },
    });

    heat.addTo(map);
    layerRef.current = heat;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, locations]);

  return null;
}

function HeatmapLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-1000 rounded-md bg-white/90 px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-semibold text-gray-700">
        Violation Density
      </p>
      <div className="flex items-center gap-1.5">
        <div
          className="h-3 w-20 rounded-sm"
          style={{
            background:
              "linear-gradient(to right, #ffffb2, #fed976, #feb24c, #f03b20, #bd0026)",
          }}
        />
      </div>
      <div className="mt-0.5 flex justify-between text-[10px] text-gray-500">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

function getMarkerRadius(count: number): number {
  const minRadius = 8;
  const maxRadius = 40;
  const scale = Math.log10(count + 1) / 4;
  return Math.min(
    maxRadius,
    Math.max(minRadius, minRadius + scale * (maxRadius - minRadius))
  );
}

function getMarkerColor(count: number): string {
  if (count >= 1000) return "#dc2626";
  if (count >= 500) return "#ea580c";
  if (count >= 100) return "#ca8a04";
  return "#2563eb";
}

export function ViolationMap({ locations, isLoading, focusCoords }: ViolationMapProps) {
  const [zoom, setZoom] = useState(11);
  const showHeatmap = zoom > HEATMAP_ZOOM_THRESHOLD;

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
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <MapContainer
        center={MAP_CENTER}
        zoom={11}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <MapController onZoomChange={setZoom} />
        <MapFocus coords={focusCoords} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showHeatmap ? (
          <HeatLayer locations={locations} />
        ) : (
          locations.map((location) => (
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
                  <p className="font-semibold text-[#1a3a5c]">
                    {location.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">
                      {location.count.toLocaleString()}
                    </span>{" "}
                    violations
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))
        )}
      </MapContainer>
      {showHeatmap && <HeatmapLegend />}
    </div>
  );
}
