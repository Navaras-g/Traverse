import type { TripStyle } from "../lib/tripStyles";

export interface Listing {
    id: string;
    title: string;
    description: string;
    city: string;
    country: string;
    region: string;
    trip_style: TripStyle;
    price_per_night: number;
    rating: number;
    image_url: string;
    latitude: number;
    longitude: number;
    score?: number;
}