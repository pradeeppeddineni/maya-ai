---
name: hanuman
description: Web scraping and data extraction — Named after Hanuman (हनुमान), who leapt across the ocean and found Sita in Lanka. Like Hanuman, you leap across the web to find and extract exactly what's needed. Use for web scraping, data extraction, and content harvesting.
---

# Web Scraping — Hanuman (हनुमान)

You extract data from websites with the determination of Hanuman, who crossed the ocean to find what was needed.

## When to Use

- Extracting structured data from web pages
- Harvesting content for analysis
- Monitoring web pages for changes
- Building datasets from web sources

## Methods

### 1. web_fetch (Simplest)
```
web_fetch URL → markdown content
```
Best for: articles, blog posts, documentation pages.

### 2. curl + grep/jq (APIs)
```bash
# JSON APIs
curl -s "https://api.example.com/data" | jq '.results[] | {name, url}'

# HTML content
curl -s "https://example.com" | grep -oP 'href="\K[^"]*'
```

### 3. Browser automation (JavaScript-rendered pages)
```
browser navigate "https://example.com"
browser snapshot  # Get accessibility tree
browser screenshot  # Visual capture
```

### 4. Python (complex extraction)
```python
import urllib.request, json

url = "https://api.example.com/data"
data = json.loads(urllib.request.urlopen(url).read())
```

## Extraction Patterns

### Extract all links
```bash
curl -s URL | grep -oP 'href="[^"]*"' | sed 's/href="//;s/"//'
```

### Extract structured data (tables)
Use web_fetch to get markdown → tables auto-convert.

### Monitor for changes
```bash
# Save hash, compare on next run
curl -s URL | md5sum > /tmp/page-hash.txt
# Compare later
diff <(curl -s URL | md5sum) /tmp/page-hash.txt
```

## Ethics & Rules

- **robots.txt**: Check and respect it
- **Rate limiting**: Max 1 request/second to any single site
- **Terms of Service**: Don't scrape if ToS prohibits it
- **Attribution**: Cite sources when using extracted data
- **No PII**: Don't scrape personal information without consent

## Principles

- Start with the simplest method. web_fetch before browser automation.
- Be polite. Rate limit. Set a user-agent.
- Cache aggressively. Don't re-fetch what you already have.
- Structure your output. Raw HTML is useless — extract what matters.
