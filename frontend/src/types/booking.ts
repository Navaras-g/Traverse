import type { Listing } from "./listing";

export interface Booking {
    id: string;
    listing: Listing;
    check_in: string;
    check_out: string;
    guests: number;
    status: string;
    created_at: string;
}