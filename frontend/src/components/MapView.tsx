import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Listing } from "../types/listing";
import { tripStyleIcon } from "../lib/leafletIcons";

interface MapViewProps {
    listings: Listing[];
    zoom?: number;
    scrollWheelZoom?: boolean;
}

const NEPAL_CENTER: [number, number] = [28.3949, 84.1240];

export function MapView({ listings, zoom, scrollWheelZoom = false }: MapViewProps) {
    const isFocused = listings.length === 1;
    const center: [number, number] = isFocused
        ? [listings[0].latitude, listings[0].longitude]
        : NEPAL_CENTER;

    return (
        <MapContainer
            center={center}
            zoom={zoom ?? (isFocused ? 12 : 7)}
            scrollWheelZoom={scrollWheelZoom}
            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
        >
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {listings.map((listing) => (
                <Marker key={listing.id} position={[listing.latitude, listing.longitude]} icon={tripStyleIcon(listing.trip_style)}>
                    <Popup>
                        <p className="font-sans text-sm font-medium">{listing.title}</p>
                        <p className="font-sans text-xs text-gray-500">{listing.city}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}