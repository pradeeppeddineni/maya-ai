---
name: chitranga
description: GIF search and reaction finder — Named after Chitranga (चित्रांग), meaning "colorful/animated body", from the vibrant celestial beings. Search, download, and share GIFs from Tenor and Giphy. Inspired by steipete/gifgrep.
version: 1.0.0
tags: [gif, search, media, reactions, fun]
---

# GIF Search — Chitranga (चित्रांग)

You find the perfect GIF for any moment. Like Chitranga — vibrant and expressive — you match emotions, reactions, and moments to animated imagery.

## When to Use

- Find a reaction GIF for a conversation
- Search for GIFs by keyword, mood, or situation
- Download GIFs for use in messages
- Add visual flair to responses

## Search Strategy

### API-Based Search (Preferred)

#### Tenor API (no key required for basic use)
```bash
# Search GIFs
curl -s "https://tenor.googleapis.com/v2/search?q=QUERY&key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&limit=5&media_filter=gif" \
  | jq -r '.results[] | {title: .content_description, url: .media_formats.gif.url, preview: .media_formats.tinygif.url}'
```

#### Giphy API (requires GIPHY_API_KEY)
```bash
curl -s "https://api.giphy.com/v1/gifs/search?api_key=$GIPHY_API_KEY&q=QUERY&limit=5" \
  | jq -r '.data[] | {title: .title, url: .images.original.url, preview: .images.preview_gif.url}'
```

### Search Tips

| Want | Search Query |
|------|-------------|
| Reaction | "mind blown", "slow clap", "facepalm" |
| Emotion | "excited", "sad", "confused", "happy dance" |
| Pop culture | "office michael scott", "seinfeld", "marvel" |
| Animal | "cat typing", "dog excited", "monkey thinking" |
| Specific | Combine: "celebration confetti" |

### GIF Selection Criteria

1. **Relevance**: Does it match the context/emotion?
2. **Clarity**: Is the action readable at small sizes?
3. **Length**: Short loops (2-5 sec) work best
4. **Size**: Prefer under 5MB for messaging
5. **Appropriateness**: SFW for professional contexts

## Sending GIFs

### Via Telegram
```bash
# Send GIF URL directly — Telegram auto-embeds
# Or download and send as animation
curl -o /tmp/reaction.gif "GIF_URL"
```

### Via message tool
Use the `media` parameter to send a GIF URL directly.

## Common Reaction GIFs (Quick Reference)

| Situation | Good Searches |
|-----------|--------------|
| Agreement | "thumbs up", "nod yes", "exactly" |
| Amazement | "mind blown", "wow", "jaw drop" |
| Celebration | "party", "dance", "celebration" |
| Confusion | "confused", "what", "huh" |
| Disappointment | "facepalm", "sigh", "disappointed" |
| Excitement | "excited", "yes", "lets go" |
| Gratitude | "thank you", "bow", "appreciate" |
| Humor | "laughing", "lol", "rofl" |
| Thinking | "thinking", "hmm", "calculating" |
| Waiting | "waiting", "popcorn", "watching" |

## Best Practices

- **Context-aware**: Match the tone of the conversation
- **Don't overuse**: One GIF per exchange maximum
- **Fallback**: If no good GIF found, an emoji reaction works too
- **Cultural sensitivity**: Some GIFs don't translate across cultures
- **File size**: Compress large GIFs or use preview/tinygif versions for mobile
