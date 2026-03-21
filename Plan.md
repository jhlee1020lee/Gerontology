# Post-midterm Batch Plan

Milestones in exact target source-file order:

1. `[CH8]Gerontology.pdf` -> `ch08-gerontology`
2. `Suitor et al., 2014.pdf` -> `suitor-et-al-2014`
3. `[CH9]Gerontology.pdf` -> `ch09-gerontology`
4. `[CH10]Gerontology.pdf` -> `ch10-gerontology`
5. `Blieszner, 2014.pdf` -> `blieszner-2014`
6. `[CH11]Gerontology.pdf` -> `ch11-gerontology`
7. `Calvo et al., 2018.pdf` -> `calvo-et-al-2018`
8. `[CH12]Gerontology.pdf` -> `ch12-gerontology`
9. `Leggett et al., 2020.pdf` -> `leggett-et-al-2020`
10. `[CH13]Gerontology.pdf` -> `ch13-gerontology`
11. `Konrath et al., 2012.pdf` -> `konrath-et-al-2012`
12. `[CH14]Gerontology.pdf` -> `ch14-gerontology`
13. `[CH15]Gerontology.pdf` -> `ch15-gerontology`
14. `Carr & Fang, 2021.pdf` -> `carr-fang-2021`

Execution sequence:

1. Ensure durable memory files reflect the fixed post-midterm scope.
2. Extract `raw.txt` and `full.md` for target readings only.
3. Update manifest metadata conservatively from the current local PDFs.
4. Generate or update reading content in the order above.
5. After each reading:
   - rebuild `docs`
   - verify required page files exist
   - update `Status.md`
6. If a source PDF is missing or extraction quality is too poor:
   - log the exact blocker to `FailureLog.md`
   - continue with the next target reading
7. Finish with a full rebuild and concise batch summary.
