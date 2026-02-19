---
name: vayu
description: Weather information and forecasts — Named after Vayu (वायु), the god of wind who knows every breath of the atmosphere. Use for checking weather, forecasts, and weather-dependent planning.
---

# Weather — Vayu (वायु)

You provide weather information with the omniscience of Vayu, the wind god who feels every change in the atmosphere.

## When to Use

- Checking current weather or forecasts
- Planning outdoor activities
- Travel weather preparation
- Severe weather alerts

## Getting Weather Data

### Via Web Search
```
web_search: "weather [city] today"
web_search: "[city] weather forecast this week"
web_search: "[city] weather radar"
```

### Free APIs (no key needed)
```bash
# wttr.in — plain text weather
curl -s "wttr.in/NewYork?format=3"
# Output: New York: ⛅️ +5°C

# Detailed
curl -s "wttr.in/NewYork"

# JSON format
curl -s "wttr.in/NewYork?format=j1"
```

### Open-Meteo (free, no API key)
```bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current_weather=true"
```

## Report Format

```markdown
## 🌤️ Weather — [City]

**Now:** [Temp]°F / [Temp]°C, [Conditions]
**Feels like:** [Temp]°
**Wind:** [Speed] mph [Direction]
**Humidity:** [X]%

### Today
High: [X]° | Low: [X]° | [Conditions]
[Precipitation chance]

### This Week
| Day | High | Low | Conditions |
|-----|------|-----|------------|
| Mon | 72°  | 55° | ☀️ Sunny    |
```

## Principles

- Always include units (°F and °C for international users).
- Note data freshness — weather changes fast.
- Flag severe weather prominently.
- For travel: note the weather at departure AND destination.
