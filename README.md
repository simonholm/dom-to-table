# dom-to-table

F12-based extraction workspace for job listings.

- `page.html`: frozen input
- `f12.js`: browser console script
- `latest.tsv`: last output
- `NOTE.md`: debugging notes

Rule: no abstraction, no expansion.

## Extraction Strategy

The original workflow used DOM scraping from DevTools to extract listings into TSV/Excel. That approach was unstable on this site and is no longer the recommended default.

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
