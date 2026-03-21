# Overnight Batch Plan

Milestones in exact target source-file order:

1. `[CH1]Gerontology.pdf` -> `ch01-gerontology`
2. `[CH2]Gerontology.pdf` -> `ch02-gerontology`
3. `Beck, 2016.pdf` -> `beck-2016`
4. `[CH3]Gerontology.pdf` -> `ch03-gerontology`
5. `[CH4]Gerontology.pdf` -> `ch04-gerontology`
6. `Hülür et al., 2019.pdf` -> `hulur-et-al-2019`
7. `[CH5]Gerontology.pdf` -> `ch05-gerontology`
8. `Olshansky & Carnes, 2019.pdf` -> `olshansky-carnes-2019`
9. `Kerrigan, 2018.pdf` -> `kerrigan-2018`
10. `[CH6]Gerontology.pdf` -> `ch06-gerontology`
11. `Park & McDonough, 2013.pdf` -> `park-mcdonough-2013`
12. `[CH7]Gerontology.pdf` -> `ch07-gerontology`
13. `Wagner et al., 2016.pdf` -> `wagner-et-al-2016`

Execution sequence:

1. Ensure durable memory files exist and reflect the fixed scope.
2. Extract `raw.txt` and `cleaned.md` for target readings only.
3. Reuse high-quality existing `beck-2016` content as the reference shape.
4. Generate or update reading content in the order above.
5. After each reading:
   - rebuild `docs`
   - verify required page files exist
   - update `Status.md`
6. If a source PDF is missing or extraction quality is too poor:
   - log the exact blocker to `FailureLog.md`
   - continue with the next target reading
7. Finish with a full rebuild and overnight summary.
