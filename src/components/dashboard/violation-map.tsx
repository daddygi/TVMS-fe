import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface ViolationMarker {
  id: string;
  position: [number, number];
  location: string;
  behavior: string;
  ticketNumber: string;
  risk: "HIGH" | "HAZARD" | "ROUTINE";
}

const sampleMarkers: ViolationMarker[] = [
  {
    id: "1",
    position: [14.6282, 121.0355],
    location: "G. Araneta Ave",
    behavior: "Reckless Driving",
    ticketNumber: "22022115",
    risk: "HIGH",
  },
  {
    id: "2",
    position: [14.6488, 120.9664],
    location: "R10 / Navotas",
    behavior: "Overloading (RA 8794)",
    ticketNumber: "22158636",
    risk: "HIGH",
  },
  {
    id: "3",
    position: [14.6181, 121.0562],
    location: "EDSA / Cubao",
    behavior: "Obstructing Traffic",
    ticketNumber: "21812847",
    risk: "HAZARD",
  },
  {
    id: "4",
    position: [14.5565, 120.9822],
    location: "Roxas Blvd",
    behavior: "Disregarding Signs",
    ticketNumber: "22021617",
    risk: "HIGH",
  },
  {
    id: "5",
    position: [14.6395, 121.0764],
    location: "Katipunan Ave",
    behavior: "Illegal Change Color",
    ticketNumber: "22159590",
    risk: "ROUTINE",
  },
];

function MapController() {
  const map = useMap();

  useEffect(() => {
    // Invalidate size after mount to fix rendering issues
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

export function ViolationMap() {
  // Metro Manila center
  const center: [number, number] = [14.5995, 120.9842];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={10}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sampleMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={marker.risk === "HIGH" || marker.risk === "HAZARD" ? redIcon : defaultIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{marker.location}</p>
                <p className="text-gray-600">{marker.behavior}</p>
                <p className="text-xs text-gray-400">
                  Ticket: {marker.ticketNumber}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export { sampleMarkers, type ViolationMarker };
