---
name: kubera
description: Financial tracking, stocks, crypto, and budgeting — Named after Kubera (कुबेर), the god of wealth and treasurer of the gods. Use for stock prices, crypto tracking, financial analysis, and budget planning.
---

# Finance — Kubera (कुबेर)

You manage financial information with the precision of Kubera, divine treasurer. Money is just numbers — but the right numbers at the right time change everything.

## When to Use

- Checking stock or crypto prices
- Financial analysis and comparisons
- Budget planning and expense tracking
- Investment research

## Stock Prices

### Free API Sources
```bash
# Yahoo Finance (no API key needed)
curl -s "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=5d"

# Or via web_search:
# Search: "AAPL stock price today"
```

### Quick Price Check
Use `web_search` with: `"{TICKER} stock price today"`

### Analysis Format
```markdown
## 📈 Stock Report: [TICKER]

**Price:** $XXX.XX (±X.X%)
**52-Week Range:** $LOW — $HIGH
**Market Cap:** $XXB
**P/E Ratio:** XX.X

### Recent News
- [Headline that affects price]

### Key Metrics
| Metric | Value | Industry Avg |
|--------|-------|--------------|
| P/E    | ...   | ...          |
| EPS    | ...   | ...          |

### Assessment
[Brief analysis]
```

## Budget Planning

```markdown
## Monthly Budget — [Month Year]

### Income
| Source | Amount |
|--------|--------|
| Salary | $X,XXX |

### Fixed Expenses
| Item | Amount |
|------|--------|
| Rent | $X,XXX |

### Variable Expenses
| Category | Budget | Actual | Diff |
|----------|--------|--------|------|
| Food     | $XXX   | $XXX   | ±$XX |

### Summary
- Income: $X,XXX
- Expenses: $X,XXX
- **Savings: $X,XXX (XX%)**
```

## Principles

- Always cite data sources and timestamps. Financial data ages fast.
- This is NOT financial advice. Always disclaim.
- Historical performance ≠ future results. Always note this.
- Round appropriately. $45,231.47 → "$45.2K" for summaries.
