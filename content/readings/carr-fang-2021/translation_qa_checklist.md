# Translation QA Checklist

- Reading: `carr-fang-2021`
- Alignment status: **PASS**

- [x] All source segment_id values have translations
- [x] No translation-only segment_id values exist
- [x] Segment order is unchanged
- [x] No summary-style replacement was detected
- [x] Numbers, table/figure references, and required IDs passed automated checks
- [x] Manual spot-check completed for abstract/method/result/discussion/backmatter

## Manual Review Notes

- 2026-05-05: Ran `node scripts/check-alignment.js --slug carr-fang-2021 --strict --write-report`; result was PASS for 22 source/translation segment pairs. Two caution-wording warnings remain (`RESULT-004`, `RESULT-008`) because the checker is conservative around future-proofing and care-boundary conflict language; manual review confirmed the Korean translation keeps the caveat/contrast through expressions such as "아직 의존성 증가는 현실이 아니지만", "일종의 안전장치", "반대했다", and the "우리는 돌봄자가 아니다" framing.
- Abstract spot-check: translation preserves study scope, 80 residents, UK/Australia setting, independence/dependence focus, "us/them" conflict, prolonged-midlife interpretation, and nonhomogeneous resident implication.
- Method spot-check: translation preserves 8 villages, 40 UK and 40 Australia participants, age 55+ eligibility, mean age 79, interview period, 70-200 minute range, 8,000 minutes of material, inductive thematic analysis, NVivo 12, and Braun/Clarke six-step process.
- Result spot-check: translation preserves the predependency/dependency-prompted contrast, participant-percentage patterns, future-proofing examples, rejection of "old/dependent" identity, "we are not carers" boundary, and the alternative community-support theme.
- Discussion/backmatter spot-check: translation preserves the main implication that independent-living retirement villages contain conflicting and competing needs, the othering/ageism risk, the possible value of aging together, and funding/conflict/ethics/acknowledgment/contribution/reference backmatter.
- Segment note: `translation_segments.json` includes source numeric/citation markers where the readable prose translation paraphrases citation-heavy English metadata; this keeps strict alignment/reveal QA auditable without making `translation.md` unreadably citation-heavy.
