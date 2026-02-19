---
name: disha
description: Location search and Google Places integration — Named after Disha (दिशा), Sanskrit for direction/compass point. Search for places, get business details, find restaurants, and navigate. Inspired by steipete/goplaces.
version: 1.0.0
tags: [places, location, maps, search, restaurants, navigation, google-places]
---

# Places & Location — Disha (दिशा)

You are the compass. Like Disha — the cardinal direction that guides travelers — you find places, provide directions, and help navigate the physical world.

## When to Use

- Find restaurants, cafes, shops nearby
- Get business hours, ratings, reviews
- Search for specific types of places
- Get directions or distance estimates
- Look up addresses and coordinates

## Using goplaces CLI

```bash
# Install
brew install steipete/tap/goplaces
# or: go install github.com/steipete/goplaces@latest

# Search nearby
goplaces search "coffee shop" --near "San Francisco" --radius 1000

# Place details
goplaces details PLACE_ID --json

# Autocomplete
goplaces autocomplete "starbucks near"
```

Requires `GOOGLE_PLACES_API_KEY` in environment.

## Google Places API (Direct)

### Nearby Search
```bash
curl -s "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=LAT,LNG&radius=1500&type=restaurant&key=$GOOGLE_PLACES_API_KEY" \
  | jq '.results[] | {name, rating, vicinity, opening_hours: .opening_hours.open_now}'
```

### Text Search
```bash
curl -s "https://maps.googleapis.com/maps/api/place/textsearch/json?query=best+pizza+in+NYC&key=$GOOGLE_PLACES_API_KEY" \
  | jq '.results[:5] | .[] | {name, rating, address: .formatted_address}'
```

### Place Details
```bash
curl -s "https://maps.googleapis.com/maps/api/place/details/json?place_id=PLACE_ID&fields=name,rating,formatted_phone_number,opening_hours,reviews,website&key=$GOOGLE_PLACES_API_KEY"
```

## Alternative: Free APIs

### Nominatim (OpenStreetMap, free, no key)
```bash
# Geocode address
curl -s "https://nominatim.openstreetmap.org/search?q=pizza+near+NYC&format=json&limit=5" \
  | jq '.[] | {name: .display_name, lat, lon}'

# Reverse geocode
curl -s "https://nominatim.openstreetmap.org/reverse?lat=40.7128&lon=-74.0060&format=json"
```

### Overpass API (OSM, structured queries)
```bash
# Find all cafes within 500m of a point
curl -s "https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=cafe](around:500,40.7128,-74.0060);out;" \
  | jq '.elements[] | {name: .tags.name, lat, lon}'
```

## Common Use Cases

### "Find me a restaurant"
1. Get user's location (or ask for area)
2. Search with type + cuisine preference
3. Filter by: rating > 4.0, open now, within radius
4. Present top 3-5 with name, rating, distance, hours

### "How far is X from Y?"
```bash
# Google Distance Matrix
curl -s "https://maps.googleapis.com/maps/api/distancematrix/json?origins=ORIGIN&destinations=DEST&key=$KEY" \
  | jq '.rows[0].elements[0] | {distance: .distance.text, duration: .duration.text}'
```

### "What's near me?"
Use device location (if available via nodes tool) + nearby search with broad categories.

## Best Practices

1. **Cache results**: Place details don't change often; cache for hours
2. **Rate limits**: Free tier is limited; use wisely
3. **User preference**: Remember dietary restrictions, favorite cuisines
4. **Context**: Consider time of day (breakfast vs dinner suggestions)
5. **Fallback**: If Google API unavailable, use free Nominatim/Overpass
