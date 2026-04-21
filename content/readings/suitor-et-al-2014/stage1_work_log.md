# Suitor et al. (2014) 전체 글 재검수 로그

- 재검수 일자: `2026-04-21`
- 대상 읽기: `suitor-et-al-2014`
- 목표: PDF 원문 기준 `full.md` 누락/줄나눔/OCR 잔여 오류 점검
- 상태: `Stage 1 재검수 완료, 재승인 반영 완료`

## Pass 계획

- `Pass 1`: 표지 메타데이터 + 초록 + 서론
- `Pass 2`: 이론 배경 + 방법 + 표 1
- `Pass 3`: 결과 + 표 2 + 논의/함의 + 연구비/감사 + 참고문헌 + 종단 QA

## Micro-chunk 상태

- `P1-C1`
  - source scope: page 1 상단 메타데이터, structured abstract, 서론 도입
  - status: merged
  - source-order spot check: PDF page 1 대조 완료
  - source-only QA: rerun complete, reading reopened as `manual_review_required`
  - notes: 저자/소속 블록과 structured abstract를 원문 순서대로 재정리

- `P1-C2`
  - source scope: pages 2-3 전반, 이론 배경 두 섹션
  - status: merged
  - source-order spot check: PDF page 2-3 대조 완료, 이론 배경 문단 누락 없음 확인
  - source-only QA: rerun complete, overall reading remains `partial` while later chunks and approval sync are still pending
  - notes: `favor-itism`, `rela-tions`, `per-ceptions`, `inter-actions`, `responsibil-ity`, `experi-ence` 등 줄분절 잔여를 원문 문장 흐름대로 정리

- `P2-C1`
  - source scope: pages 3-4 methods 도입, procedures
  - status: merged
  - source-order spot check: PDF page 3-4 대조 완료, methods/procedures 범위에서 새 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: `col-lected`, `col-lecting`, `collec-tion`, `par-ticipating`, `educa-tion`, `con-sistent` 줄분절 잔여 정리

- `P2-C2`
  - source scope: pages 4-5 measures, control variables, table 1
  - status: merged
  - source-order spot check: PDF page 4-5 대조 완료, measures/control variables/table 1 범위에서 새 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: `combined`, `provided`, `following`, `caregiving`, `perception`, `preferring`, `caregiver`, `measured`, `ethnicity`, `family` 등 줄분절/OCR 잔여와 table 1 머리글 표기 정리

- `P3-C1`
  - source scope: pages 5-6 results, table 2
  - status: merged
  - source-order spot check: PDF page 5-6 대조 완료, results/table 2 범위에서 새 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: table 2 앞뒤 결과 문장 연결 상태 재확인, `independently`, `favoritism` 줄분절 잔여 정리

- `P3-C2`
  - source scope: pages 6-7 discussion, implications
  - status: merged
  - source-order spot check: PDF page 6-7 대조 완료, discussion/implications 범위에서 새 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: `important`, `perceptions`, `preferred`, `favoritism`, `sibling`, `regarding`, `previous`, `personality`, `experiences`, `experienced`, `questions`, `frustration`, `children`, `within-family`, `has examined` 등 discussion/implications 구간 줄분절·OCR 잔여 정리

- `P3-C3`
  - source scope: pages 7-9 funding, acknowledgments, references
  - status: merged
  - source-order spot check: PDF page 7-9 대조 완료, funding/acknowledgments/references 범위에서 새 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: `regarding`, AARP URL, `parents`, `differential`, `anticipated`, `theory`, `advance directives`, `moderators of the effects`, `mortality`, `daughters: Findings`, `violated caregiver`, `individuals’`, `stressors`, `personal`, `relations`, `married` 등 참고문헌/감사 구간 줄분절·OCR 잔여 정리, tail 구간 줄끝 하이픈 잔여 없음 확인

- approval sync
  - status: complete
  - notes: translation reveal 정합성을 높이기 위해 서론/이론배경/분석계획의 문단 경계를 source order 기준으로 바로잡았고, `full.md` 새 해시로 Stage 1 승인을 다시 고정함
