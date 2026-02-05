## 2025-01-23 - [Caching Template Files]
**Learning:** Even with fast SSDs and OS-level caching, synchronous filesystem calls (`fs.readFileSync`) in a hot path add significant overhead (context switching, buffer allocation). Caching content in a simple JS Map reduced execution time drastically.
**Action:** Always cache static assets (templates, config files) in memory during application startup or on first access if they are read frequently.

## 2025-01-24 - [Template Pre-compilation]
**Learning:** `String.replace` with regex in a hot path is costly compared to simple string concatenation. Pre-splitting a template into static and dynamic parts ("compiling") and then joining them allows for O(n) generation where n is the number of parts, avoiding repeated regex state machine overhead.
**Action:** For string interpolation in hot paths, pre-parse the template into an array of tokens and use concatenation or array joining instead of repeated replace calls.
