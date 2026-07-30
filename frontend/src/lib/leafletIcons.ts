import L from "leaflet";
import type { TripStyle } from "./tripStyles";
import { TRIP_STYLES } from "./tripStyles";

// Leaflet's default icon paths break under Vite — remove the broken default
// and build our own color-coded pin per trip style instead.
delete (L.Icon.Default.prototype as any)._getIconUrl;

export function tripStyleIcon(style: TripStyle): L.DivIcon {
    const color = TRIP_STYLES[style].color;
    return L.divIcon({
        className: "",
        html: `<div style="
      width: 16px; height: 16px; border-radius: 50%;
      background: ${color}; border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
    "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
}