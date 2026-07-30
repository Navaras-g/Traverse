export type TripStyle =
    | "culture"
    | "adventure"
    | "relaxation"
    | "food"
    | "nightlife"
    | "wildlife"
    | "pilgrimage";

interface TripStyleMeta {
    label: string;
    color: string;
    bg: string;
    text: string;
}

export const TRIP_STYLES: Record<TripStyle, TripStyleMeta> = {
    culture: { label: "Culture", color: "#A9814A", bg: "#F1E7D6", text: "#7A5E33" },
    adventure: { label: "Adventure", color: "#5C7350", bg: "#E4EADF", text: "#47593D" },
    relaxation: { label: "Relaxation", color: "#7C9BA6", bg: "#E3EBED", text: "#3F636D" },
    food: { label: "Food", color: "#A85C42", bg: "#F1E1DA", text: "#7A3F2C" },
    nightlife: { label: "Nightlife", color: "#7C6485", bg: "#ECE5EF", text: "#5A4763" },
    wildlife: { label: "Wildlife", color: "#4F7566", bg: "#DEE8E3", text: "#375A4C" },
    pilgrimage: { label: "Pilgrimage", color: "#8B5058", bg: "#F0E0E2", text: "#6B3A40" },
};