Session notes

## Lessons Learned

- DOM vs API boundary: when structured API data exists, use it instead of parsing rendered text.
- Overfitting to specific strings such as `Örebro` led to brittle parsing assumptions.
- Partial parsing caused column misalignment when optional fields were missing or merged.
- Stable anchors matter: date patterns were consistent; city strings were not.
- Inspect the response shape before mapping fields. The correct array is `results`, not `items`.
- Keep extraction and export separate. Clipboard and Excel behavior are export problems, not extraction problems.

## Debugging Log

- DOM extraction worked for some fields but failed on merged text blobs like `Örebro · 24/3 - 14/4`.
- Regex-based city/date splitting introduced shifting columns and fragile behavior.
- Repeated DOM tweaks were abandoned because the page lacked reliable selectors.
- Network inspection exposed `/api/favorites?pageSize=30&page=1`, which returned structured records.
- After confirming the payload shape, extraction moved to `d.results` and DOM parsing stopped being the primary path.
- Clipboard export from DevTools was unreliable because browser focus/security rules can block writes.
- CSV opened through Excel may corrupt Swedish characters unless encoding is handled explicitly.

## Decisions

### 2026-06-15

Primary extraction strategy changed from DOM parsing to API extraction.

Reason:

- Structured fields are available through `/api/favorites`.
- This avoids city/company/title contamination from rendered text.
- The DOM version remains useful as a historical baseline, but is not the preferred path.

### 2026-06-15

Created a separate Excel export experiment instead of mutating the API baseline.

Reason:

- `f12.api.js` should stay focused on extraction.
- Excel/CSV/clipboard behavior should be tested separately.
- This avoids losing track of which file represents the stable baseline.

## Current State

- `f12.v0.date-ok.js`
  - DOM-based extraction baseline
  - dates mostly reliable
  - city extraction unstable
  - kept for comparison only

- `f12.api.js`
  - API-based extraction prototype
  - uses `/api/favorites`
  - extracts:
    - `date_posted`
    - `date_ends`
    - `municipality_name`
    - `company_name`
    - `heading`
  - avoids DOM parsing for core fields
  - current baseline for extraction

- `f12.api.excel.js`
  - experimental Excel-oriented export path
  - uses the same API source as `f12.api.js`
  - normalizes `2650-*` end dates to `tills vidare`
  - downloads `jobs.csv` instead of relying on the clipboard
  - prepends a UTF-8 BOM to reduce Swedish character corruption in Excel

## Known Issues

- API `date_ends` values starting with `2650` appear to be sentinel values for `tills vidare`.
- Excel import/open behavior may still depend on locale and delimiter settings.
- Clipboard export from DevTools is not reliable enough to be the main workflow.
