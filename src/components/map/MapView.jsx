import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
import { MapPin, TriangleAlert } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = (color) =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `<span style="background:${color}; box-shadow: 0 0 18px ${color};"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const defaultCenter = [12.93, 80.11];

export default function MapView({ zones = [], route = [], markers = [], center = defaultCenter, showRoute = false }) {
  return (
    <div className="map-shell">
      <MapContainer center={center} zoom={13} scrollWheelZoom className="map-view" zoomControl={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        {zones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius || 300}
            pathOptions={{
              color: zone.type === 'critical' ? '#ff5b57' : zone.type === 'flood' ? '#ff9f43' : zone.type === 'moderate' ? '#f6d365' : '#3be7c7',
              fillColor: zone.type === 'critical' ? '#ff5b57' : zone.type === 'flood' ? '#ff9f43' : zone.type === 'moderate' ? '#f6d365' : '#3be7c7',
              fillOpacity: 0.28,
              weight: 1.5,
            }}
          />
        ))}

        {showRoute && route.length > 0 ? (
          <Polyline positions={route} pathOptions={{ color: '#67f3ff', weight: 4, opacity: 0.95 }} />
        ) : null}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={customIcon(marker.color || '#67f3ff')}
          >
            <Popup>{marker.label}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="map-overlay-tools">
        <div className="map-tool-button"><MapPin size={15} /></div>
        <div className="map-tool-button"><TriangleAlert size={15} /></div>
      </div>
    </div>
  );
}
