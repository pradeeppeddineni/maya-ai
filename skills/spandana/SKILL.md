---
name: spandana
description: Spotify and music control from terminal — Named after Spandana (स्पन्दन), Sanskrit for vibration/pulse/rhythm. Control Spotify playback, search music, manage playlists from the CLI. Inspired by steipete/spogo.
version: 1.0.0
tags: [spotify, music, audio, playback, playlist, streaming]
---

# Music Control — Spandana (स्पन्दन)

You control the rhythm. Like Spandana — the cosmic pulse underlying all creation — you manage music playback, discovery, and playlists.

## When to Use

- Play/pause/skip tracks on Spotify
- Search for songs, albums, or artists
- Manage playlists
- Get currently playing info
- Music recommendations

## Using spogo CLI

```bash
# Install
brew install steipete/tap/spogo  # macOS
# or: go install github.com/steipete/spogo@latest

# Authenticate (uses browser cookies — be logged into Spotify)
spogo auth

# Now playing
spogo now

# Playback control
spogo play
spogo pause
spogo next
spogo prev
spogo volume 70

# Search
spogo search "Bohemian Rhapsody"
spogo search --type artist "AR Rahman"

# Queue
spogo queue "track:URI"
spogo queue list
```

## Spotify Web API (Direct)

### Authentication
```bash
# Get access token via client credentials
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$SPOTIFY_CLIENT_ID&client_secret=$SPOTIFY_CLIENT_SECRET"
```

### Common Operations
```bash
# Search
curl -s "https://api.spotify.com/v1/search?q=Rahman&type=track&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.tracks.items[] | {name, artist: .artists[0].name}'

# Currently playing (requires user auth)
curl -s "https://api.spotify.com/v1/me/player/currently-playing" \
  -H "Authorization: Bearer $USER_TOKEN"

# Play/pause
curl -X PUT "https://api.spotify.com/v1/me/player/play" -H "Authorization: Bearer $TOKEN"
curl -X PUT "https://api.spotify.com/v1/me/player/pause" -H "Authorization: Bearer $TOKEN"
```

## Music Recommendations

### By Mood
| Mood | Spotify Parameters |
|------|-------------------|
| Focus/Work | `energy:0.4-0.6, instrumentalness:>0.5` |
| Workout | `energy:>0.8, tempo:>120` |
| Relax | `energy:<0.3, acousticness:>0.6` |
| Party | `energy:>0.7, danceability:>0.7` |

### Recommendation API
```bash
curl "https://api.spotify.com/v1/recommendations?seed_genres=classical,electronic&target_energy=0.5&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

## Best Practices

1. **Respect auth scopes**: Request only playback control scopes you need
2. **Rate limits**: Spotify API has rate limits; cache responses
3. **Cookie auth**: spogo uses browser cookies — simpler but less portable
4. **Fallback**: If API fails, provide track name for manual search
