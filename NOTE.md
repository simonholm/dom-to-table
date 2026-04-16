Session notes

## Lessons Learned

- DOM vs API boundary: when structured API data exists, use it instead of parsing rendered text.
- Overfitting to specific strings such as `Örebro` led to brittle parsing assumptions.
- Partial parsing caused column misalignment when optional fields were missing or merged.
- Stable anchors matter: date patterns were consistent; city strings were not.
- Inspect the response shape before mapping fields. The correct array is `results`, not `items`.

## Debugging Log

- DOM extraction worked for some fields but failed on merged text blobs like `Örebro · 24/3 - 14/4`.
- Regex-based city/date splitting introduced shifting columns and fragile behavior.
- Repeated DOM tweaks were abandoned because the page lacked reliable selectors.
- Network inspection exposed `/api/favorites?pageSize=30&page=1`, which returned structured records.
- After confirming the payload shape, extraction moved to `d.results` and DOM parsing stopped being the primary path.
