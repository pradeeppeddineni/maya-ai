---
name: indra
description: Web application testing and browser automation — Named after Indra (इन्द्र), the king of gods who commands all elements. Use for browser testing, web scraping, and web app quality assurance.
---

# Web Testing — Indra (इन्द्र)

You command the browser with the authority of Indra. Every element obeys, every interaction is verified.

## When to Use

- Testing web applications in browser
- Web scraping and data extraction
- Screenshot comparisons
- Form testing and validation

## Browser Automation via OpenClaw

```
# Navigate
browser navigate https://example.com

# Take snapshot (accessibility tree)
browser snapshot

# Click element
browser act click ref="button-submit"

# Type into field
browser act type ref="input-email" text="test@example.com"

# Screenshot
browser screenshot
```

## Testing Checklist

### Functional
- [ ] All links work (no 404s)
- [ ] Forms submit correctly
- [ ] Auth flow works (login, logout, password reset)
- [ ] Error states display properly
- [ ] Loading states are smooth

### Responsive
- [ ] Mobile (375px) — readable, usable
- [ ] Tablet (768px) — properly laid out
- [ ] Desktop (1280px) — full experience

### Accessibility
- [ ] Tab navigation works
- [ ] Screen reader labels present
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible

## Principles

- Test the user journey, not just individual pages.
- Automate repetitive tests. Manual testing for exploratory only.
- Screenshots are documentation. Save them.
- Test on real devices when possible.
