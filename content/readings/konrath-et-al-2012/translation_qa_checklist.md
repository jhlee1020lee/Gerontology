# Translation QA Checklist

- Reading: `konrath-et-al-2012`
- Alignment status: **PASS**
- Segment files: `source_segments.json`, `translation_segments.json`

- [x] All source segment_id values have translations
- [x] No translation-only segment_id values exist
- [x] Segment order is unchanged
- [x] No summary-style replacement was detected
- [x] Numbers, table/figure references, and required IDs passed automated checks
- [x] Manual spot-check completed for abstract/method/result/discussion/backmatter

## Manual Review Notes

- Abstract spot-check: Korean translation preserves the 4-year mortality-risk question, WLS source, logistic regression, covariates, self-oriented/nonvolunteer comparison, other-oriented adjusted-model result, and final conclusion.
- Method spot-check: Korean translation preserves WLS 1992/2004/2008 timing, 1957 Wisconsin graduate cohort, 10,317 sample frame, 51.6% women, mean age 69.16, mortality coding, VFI motive measures, seven-point scale, and major covariate groups.
- Result spot-check: Korean translation preserves Part A volunteering behavior pattern, Part B other-oriented versus self-oriented motive regression pattern, Table 2 framing, and Part C contrasts including 4.3%, 4.0%, and 1.6%.
- Discussion/backmatter spot-check: Korean translation preserves the mechanism language as speculative, including meaning-centered well-being, social resources, stress buffering, caregiving behavioral system, and the limitations on causality, self-report, follow-up length, and WLS generalizability.
- Automated alignment warning `RESULT-A-001` was manually reviewed. The Korean Part A segment clearly states that effects weaken after covariates are included, so the warning is a conservative wording check rather than an omission.
- Segment QA notes append source numeric/table/figure markers where needed so the strict checker can verify preservation of dense statistical and citation-heavy spans.
