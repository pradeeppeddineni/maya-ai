---
name: panchanga
description: Google Workspace integration — Named after Panchanga (पञ्चाङ्ग), the traditional Hindu almanac that tracks five elements of time (tithi, vara, nakshatra, yoga, karana). A comprehensive guide for Gmail, Calendar, Drive, Contacts, Tasks, and Sheets operations. Inspired by steipete/gogcli.
version: 1.0.0
tags: [google, gmail, calendar, drive, sheets, contacts, tasks, workspace]
---

# Google Workspace — Panchanga (पञ्चाङ्ग)

You manage Google Workspace like the Panchanga tracks celestial movements — with precision, comprehensiveness, and awareness of time. Gmail, Calendar, Drive, Contacts, Tasks, Sheets — all in harmony.

## When to Use

- Check/send Gmail messages
- Manage Google Calendar events
- Search/upload Google Drive files
- Work with Google Sheets data
- Manage contacts and tasks
- Any Google Workspace automation

## Setup

### Option A: gogcli (Recommended CLI)
```bash
# Install
brew install steipete/tap/gogcli  # macOS
# or build from source:
git clone https://github.com/steipete/gogcli.git && cd gogcli && make

# Authenticate
gog auth add --client-id YOUR_ID --client-secret YOUR_SECRET
```

### Option B: Direct API with OAuth
```bash
# Get token via OAuth2 flow, then:
curl -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5"
```

## Gmail Operations

### Read Messages
```bash
gog gmail list --max 10 --json  # Latest messages
gog gmail search "from:boss@company.com is:unread" --max 5
gog gmail get MESSAGE_ID --json  # Full message
```

### Send Email
```bash
gog gmail send --to "recipient@email.com" --subject "Subject" --body "Message body"
gog gmail send --to "a@b.com" --cc "c@d.com" --subject "Re: Thread" --body "Reply" --thread THREAD_ID
```

### Labels & Filters
```bash
gog gmail labels list
gog gmail labels add MESSAGE_ID "Important"
gog gmail filters list
```

## Calendar Operations

### View Events
```bash
gog calendar list --days 7 --json  # Next 7 days
gog calendar list --date 2025-01-15  # Specific date
gog calendar freebusy --days 3  # Find free slots
```

### Create Events
```bash
gog calendar create --title "Meeting" --start "2025-01-15T10:00" --end "2025-01-15T11:00" \
  --attendees "person@email.com" --description "Agenda: ..."
```

### Conflict Detection
```bash
gog calendar freebusy --attendees "person1@co.com,person2@co.com" --days 5
```

## Drive Operations

```bash
gog drive list --max 20  # Recent files
gog drive search "name contains 'report'"
gog drive download FILE_ID -o ./local-file.pdf
gog drive upload ./document.pdf --parent FOLDER_ID
```

## Sheets Operations

```bash
gog sheets read SPREADSHEET_ID --range "Sheet1!A1:D10" --json
gog sheets write SPREADSHEET_ID --range "Sheet1!A1" --values '[["Name","Value"],["Test",42]]'
gog sheets append SPREADSHEET_ID --range "Sheet1" --values '[["New Row", 123]]'
```

## Tasks Operations

```bash
gog tasks list  # All task lists
gog tasks get TASKLIST_ID  # Tasks in a list
gog tasks add TASKLIST_ID --title "Buy groceries" --due "2025-01-20"
gog tasks done TASKLIST_ID TASK_ID
```

## Contacts

```bash
gog contacts search "John"
gog contacts list --max 50
gog contacts create --name "Jane Doe" --email "jane@example.com" --phone "+1234567890"
```

## Best Practices

- **Batch operations**: Group related API calls to minimize round-trips
- **Rate limits**: Google APIs have per-user quotas; add small delays between bulk ops
- **Token refresh**: OAuth tokens expire; gogcli handles this automatically
- **JSON output**: Always use `--json` for programmatic processing
- **Least privilege**: Request only needed scopes during auth
- **Privacy**: Never log full email bodies in shared contexts
