# dom-to-table

F12-based extraction workspace for job listings.

- `scripts/api.extract.js`: canonical API extraction baseline
- `scripts/api.excel-export.js`: active Excel export experiment
- `scripts/dom.current-csv.js`: historical DOM extraction script
- `prototypes/dom.v0.date-ok.tsv.js`: preserved v0 DOM baseline
- `fixtures/page.html`: frozen input placeholder
- `NOTE.md`: debugging notes and decisions

Rule: no abstraction, no expansion.

## Current Workflow

- Use `scripts/api.extract.js` as the default extraction script.
- Use `scripts/api.excel-export.js` when testing direct Excel-compatible export.
- Keep DOM scripts as historical prototypes for comparison and debugging context.

## Extraction Strategy

The original workflow used DOM scraping from DevTools to extract listings into Excel. That approach was unstable on this site and is no longer the recommended default.

## Export Format

- The canonical export format is semicolon-separated CSV.
- TSV exists only in the preserved v0 DOM baseline.

Why DOM parsing was fragile:

- The page is JavaScript-heavy and rendered by Next.js.
- Rendered HTML does not expose reliable semantic selectors for all fields.
- Some fields appear as merged text blobs such as `Örebro · 24/3 - 14/4`.
- Regex-heavy splitting caused column shifting when optional or merged fields changed shape.

Current approach:

- Prefer the network/API response over rendered DOM text.
- Treat date as the primary invariant.
- Treat title and company as reliable structured fields.
- Treat city as optional metadata: best-effort or omitted.
- Inspect the response shape before mapping fields.

Minimal working example:

```js
fetch("/api/favorites?pageSize=30&page=1")
  .then((r) => r.json())
  .then((d) => {
    const rows = d.results;
    console.table(rows);
  });
```

Important detail:

- The array is `d.results`, not `d.items`.
- Structured API data removes the need for fragile DOM parsing and regex cleanup.
