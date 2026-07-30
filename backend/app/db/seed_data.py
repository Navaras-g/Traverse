TRIP_STYLE_TEMPLATES = {
    "culture": {
        "title": "{area} Heritage Stay",
        "desc": "A boutique stay steps from {area}'s centuries-old courtyards and temples, "
                "with views over {city}'s skyline of pagodas and prayer flags.",
        "pexels_query": "{city} Nepal temple architecture",
        "price_range": (25, 60),
    },
    "adventure": {
        "title": "{area} Trekker's Lodge",
        "desc": "A no-frills teahouse lodge near {area} — hearty dal bhat, "
                "hot showers, and a front-row seat to the Himalayas at sunrise.",
        "pexels_query": "{city} Nepal mountains trekking",
        "price_range": (10, 35),
    },
    "relaxation": {
        "title": "{area} Retreat",
        "desc": "A slow-paced escape in {area}, built around long mornings, "
                "mountain views, and evenings that end with tea and silence.",
        "pexels_query": "{city} Nepal scenic view",
        "price_range": (30, 80),
    },
    "food": {
        "title": "{area} Kitchen Homestay",
        "desc": "Stay with a local family in {area} and eat what they eat — "
                "fresh, seasonal Nepali cooking taught hands-on if you're curious.",
        "pexels_query": "Nepal traditional food cooking",
        "price_range": (15, 40),
    },
    "nightlife": {
        "title": "{area} Rooftop Stay",
        "desc": "Right above {area}'s liveliest lanes — live music bars, street food "
                "stalls, and a rooftop that stays busy well past midnight.",
        "pexels_query": "Kathmandu Thamel street nightlife",
        "price_range": (20, 50),
    },
    "wildlife": {
        "title": "{area} Jungle Lodge",
        "desc": "An eco-lodge on the edge of {area}, built for early jeep safaris, "
                "canoe rides at dawn, and evenings spent listening for tigers.",
        "pexels_query": "{city} Nepal wildlife safari jungle",
        "price_range": (25, 70),
    },
    "pilgrimage": {
        "title": "{area} Pilgrim's Rest",
        "desc": "A simple, traditional guesthouse a short walk from {area}, "
                "used by pilgrims and travelers alike for generations.",
        "pexels_query": "{city} Nepal temple pilgrimage",
        "price_range": (10, 30),
    },
}

# Each destination: city/site name, area label, province, coordinates, and the
# trip styles that genuinely fit — a place can (and often does) serve more than one purpose.
DESTINATIONS = [
    # --- Bagmati Province (Kathmandu Valley & central hills) ---
    {"city": "Kathmandu", "area": "Thamel", "province": "Bagmati", "lat": 27.7154, "lng": 85.3123, "styles": ["culture", "nightlife"]},
    {"city": "Kathmandu", "area": "Pashupatinath", "province": "Bagmati", "lat": 27.7106, "lng": 85.3487, "styles": ["pilgrimage"]},
    {"city": "Kathmandu", "area": "Boudhanath", "province": "Bagmati", "lat": 27.7215, "lng": 85.3620, "styles": ["pilgrimage", "culture"]},
    {"city": "Bhaktapur", "area": "Durbar Square", "province": "Bagmati", "lat": 27.6710, "lng": 85.4298, "styles": ["culture", "food"]},
    {"city": "Patan", "area": "Lalitpur", "province": "Bagmati", "lat": 27.6648, "lng": 85.3188, "styles": ["culture", "food"]},
    {"city": "Nagarkot", "area": "Hillside", "province": "Bagmati", "lat": 27.7154, "lng": 85.5215, "styles": ["relaxation", "adventure"]},
    {"city": "Dhulikhel", "area": "Hillside", "province": "Bagmati", "lat": 27.6211, "lng": 85.5480, "styles": ["relaxation", "adventure"]},
    {"city": "Panauti", "area": "Old Town", "province": "Bagmati", "lat": 27.5872, "lng": 85.5153, "styles": ["culture"]},
    {"city": "Chandragiri", "area": "Hilltop", "province": "Bagmati", "lat": 27.6667, "lng": 85.2167, "styles": ["relaxation"]},
    {"city": "Sundarijal", "area": "Trailhead", "province": "Bagmati", "lat": 27.7833, "lng": 85.4333, "styles": ["adventure"]},
    {"city": "Langtang Valley", "area": "Kyanjin Gompa", "province": "Bagmati", "lat": 28.2108, "lng": 85.5658, "styles": ["adventure", "wildlife"]},
    {"city": "Gosaikunda", "area": "High Lakes", "province": "Bagmati", "lat": 28.0836, "lng": 85.4123, "styles": ["adventure", "pilgrimage"]},
    {"city": "Helambu", "area": "Sherpagaon", "province": "Bagmati", "lat": 27.9833, "lng": 85.5333, "styles": ["adventure", "culture"]},
    {"city": "Sailung", "area": "Ridge", "province": "Bagmati", "lat": 27.5333, "lng": 86.1667, "styles": ["relaxation"]},
    {"city": "Chitwan", "area": "Sauraha", "province": "Bagmati", "lat": 27.5291, "lng": 84.3542, "styles": ["wildlife", "adventure"]},
    {"city": "Kathmandu", "area": "Basantapur", "province": "Bagmati", "lat": 27.7040, "lng": 85.3070, "styles": ["culture", "pilgrimage"]},
    {"city": "Kathmandu", "area": "Swayambhunath", "province": "Bagmati", "lat": 27.7149, "lng": 85.2903, "styles": ["pilgrimage", "culture"]},
    {"city": "Kirtipur", "area": "Old Town", "province": "Bagmati", "lat": 27.6783, "lng": 85.2778, "styles": ["culture"]},
    {"city": "Kathmandu", "area": "Budhanilkantha", "province": "Bagmati", "lat": 27.7833, "lng": 85.3667, "styles": ["pilgrimage"]},
    {"city": "Kathmandu", "area": "Dakshinkali", "province": "Bagmati", "lat": 27.6167, "lng": 85.2833, "styles": ["pilgrimage"]},
    {"city": "Kathmandu", "area": "Shivapuri", "province": "Bagmati", "lat": 27.8167, "lng": 85.4167, "styles": ["adventure", "wildlife"]},
    {"city": "Kathmandu", "area": "Phulchowki", "province": "Bagmati", "lat": 27.5764, "lng": 85.3986, "styles": ["adventure"]},
    {"city": "Kathmandu", "area": "Godawari", "province": "Bagmati", "lat": 27.5964, "lng": 85.3958, "styles": ["relaxation"]},
    {"city": "Kathmandu", "area": "Taudaha", "province": "Bagmati", "lat": 27.6608, "lng": 85.2856, "styles": ["relaxation", "wildlife"]},
    {"city": "Kathmandu", "area": "Garden of Dreams", "province": "Bagmati", "lat": 27.7139, "lng": 85.3145, "styles": ["relaxation"]},
    {"city": "Kathmandu", "area": "Hattiban", "province": "Bagmati", "lat": 27.6333, "lng": 85.2500, "styles": ["adventure"]},
    {"city": "Kathmandu", "area": "Kopan Monastery", "province": "Bagmati", "lat": 27.7397, "lng": 85.3667, "styles": ["pilgrimage", "culture"]},
    {"city": "Kathmandu", "area": "Pharping", "province": "Bagmati", "lat": 27.6167, "lng": 85.2667, "styles": ["pilgrimage", "culture"]},
    {"city": "Bhaktapur", "area": "Changu Narayan", "province": "Bagmati", "lat": 27.7192, "lng": 85.4298, "styles": ["culture", "pilgrimage"]},
    {"city": "Kathmandu", "area": "Nagarjun Forest", "province": "Bagmati", "lat": 27.7500, "lng": 85.2667, "styles": ["adventure", "wildlife"]},
    {"city": "Bhaktapur", "area": "Suryabinayak", "province": "Bagmati", "lat": 27.6667, "lng": 85.4500, "styles": ["pilgrimage"]},
    {"city": "Bhaktapur", "area": "Thimi", "province": "Bagmati", "lat": 27.6833, "lng": 85.3833, "styles": ["culture", "food"]},

    # --- Gandaki Province ---
    {"city": "Pokhara", "area": "Lakeside", "province": "Gandaki", "lat": 28.2096, "lng": 83.9856, "styles": ["relaxation", "nightlife"]},
    {"city": "Pokhara", "area": "Sarangkot", "province": "Gandaki", "lat": 28.2380, "lng": 83.9463, "styles": ["adventure"]},
    {"city": "Ghandruk", "area": "Annapurna Foothills", "province": "Gandaki", "lat": 28.3757, "lng": 83.8104, "styles": ["adventure", "culture"]},
    {"city": "Ghorepani", "area": "Poon Hill", "province": "Gandaki", "lat": 28.4000, "lng": 83.6833, "styles": ["adventure"]},
    {"city": "Annapurna Base Camp", "area": "Base Camp", "province": "Gandaki", "lat": 28.5308, "lng": 83.8792, "styles": ["adventure"]},
    {"city": "Manang", "area": "Circuit Trail", "province": "Gandaki", "lat": 28.6667, "lng": 84.0167, "styles": ["adventure"]},
    {"city": "Muktinath", "area": "Temple Grounds", "province": "Gandaki", "lat": 28.8167, "lng": 83.8722, "styles": ["pilgrimage"]},
    {"city": "Upper Mustang", "area": "Lo Manthang", "province": "Gandaki", "lat": 28.9986, "lng": 83.7326, "styles": ["adventure", "culture"]},
    {"city": "Bandipur", "area": "Old Bazaar", "province": "Gandaki", "lat": 27.9333, "lng": 84.4167, "styles": ["culture", "relaxation"]},
    {"city": "Gorkha", "area": "Durbar", "province": "Gandaki", "lat": 28.0000, "lng": 84.6333, "styles": ["culture", "pilgrimage"]},
    {"city": "Manaslu", "area": "Samagaon", "province": "Gandaki", "lat": 28.5833, "lng": 84.6167, "styles": ["adventure"]},
    {"city": "Panchase", "area": "Forest Ridge", "province": "Gandaki", "lat": 28.1667, "lng": 83.8333, "styles": ["relaxation"]},
    {"city": "Sirubari", "area": "Model Village", "province": "Gandaki", "lat": 28.0333, "lng": 83.7667, "styles": ["culture"]},
    {"city": "Ghale Gaun", "area": "Gurung Village", "province": "Gandaki", "lat": 28.2167, "lng": 84.3667, "styles": ["culture"]},
    {"city": "Barpak", "area": "Tamang Village", "province": "Gandaki", "lat": 28.1667, "lng": 84.9667, "styles": ["culture"]},
    {"city": "Pikey Peak", "area": "Viewpoint", "province": "Koshi", "lat": 27.4667, "lng": 86.4667, "styles": ["adventure", "relaxation"]},

    # --- Lumbini Province ---
    {"city": "Lumbini", "area": "Sacred Garden", "province": "Lumbini", "lat": 27.4833, "lng": 83.2767, "styles": ["pilgrimage", "culture"]},
    {"city": "Tansen", "area": "Palpa", "province": "Lumbini", "lat": 27.8667, "lng": 83.5500, "styles": ["culture", "relaxation"]},
    {"city": "Ridi Bazaar", "area": "Riverside", "province": "Lumbini", "lat": 27.9000, "lng": 83.4167, "styles": ["pilgrimage"]},

    # --- Karnali Province ---
    {"city": "Rara Lake", "area": "Mugu", "province": "Karnali", "lat": 29.5330, "lng": 82.0850, "styles": ["relaxation", "adventure"]},
    {"city": "Khaptad", "area": "National Park", "province": "Karnali", "lat": 29.3500, "lng": 81.1667, "styles": ["relaxation", "wildlife"]},
    {"city": "Jumla", "area": "Highlands", "province": "Karnali", "lat": 29.2747, "lng": 82.1838, "styles": ["adventure"]},
    {"city": "Shey Phoksundo", "area": "Dolpo", "province": "Karnali", "lat": 29.1667, "lng": 82.9333, "styles": ["adventure", "relaxation"]},

    # --- Sudurpashchim Province ---
    {"city": "Bardia", "area": "National Park", "province": "Sudurpashchim", "lat": 28.3667, "lng": 81.3667, "styles": ["wildlife", "adventure"]},
    {"city": "Shuklaphanta", "area": "National Park", "province": "Sudurpashchim", "lat": 28.8667, "lng": 80.1667, "styles": ["wildlife"]},
    {"city": "Api Nampa", "area": "Darchula", "province": "Sudurpashchim", "lat": 29.9000, "lng": 80.6167, "styles": ["adventure"]},

    # --- Koshi Province ---
    {"city": "Namche Bazaar", "area": "Khumbu", "province": "Koshi", "lat": 27.8069, "lng": 86.7140, "styles": ["adventure", "culture"]},
    {"city": "Lukla", "area": "Gateway", "province": "Koshi", "lat": 27.6869, "lng": 86.7314, "styles": ["adventure"]},
    {"city": "Dingboche", "area": "Everest Trail", "province": "Koshi", "lat": 27.8934, "lng": 86.8300, "styles": ["adventure"]},
    {"city": "Taplejung", "area": "Kanchenjunga", "province": "Koshi", "lat": 27.3500, "lng": 87.6667, "styles": ["adventure"]},
    {"city": "Pathivara", "area": "Devi Temple", "province": "Koshi", "lat": 27.3392, "lng": 87.8149, "styles": ["pilgrimage"]},
    {"city": "Koshi Tappu", "area": "Wildlife Reserve", "province": "Koshi", "lat": 26.6500, "lng": 87.0333, "styles": ["wildlife"]},
    {"city": "Ilam", "area": "Tea Gardens", "province": "Koshi", "lat": 26.9098, "lng": 87.9309, "styles": ["relaxation", "food"]},
    {"city": "Dharan", "area": "Foothills", "province": "Koshi", "lat": 26.8065, "lng": 87.2846, "styles": ["relaxation", "culture"]},

    # --- Madhesh Province ---
    {"city": "Janakpur", "area": "Janaki Mandir", "province": "Madhesh", "lat": 26.7288, "lng": 85.9266, "styles": ["pilgrimage", "culture"]},
]


def build_listings():
    import random

    random.seed(42)  # reproducible seed data
    listings = []

    for dest in DESTINATIONS:
        for style in dest["styles"]:
            tmpl = TRIP_STYLE_TEMPLATES[style]
            lo, hi = tmpl["price_range"]
            listings.append({
                "title": tmpl["title"].format(area=dest["area"], city=dest["city"]),
                "description": tmpl["desc"].format(area=dest["area"], city=dest["city"]),
                "city": dest["city"],
                "country": "Nepal",
                "region": dest["province"],
                "trip_style": style,
                "price_per_night": round(random.uniform(lo, hi), 2),
                "rating": round(random.uniform(3.8, 5.0), 1),
                "latitude": dest["lat"],
                "longitude": dest["lng"],
                "pexels_query": tmpl["pexels_query"].format(city=dest["city"]),
            })

    return listings