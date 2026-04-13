# Wagner et al. (2016) 한국어 번역 재시작 로그

- 재시작 일자: `2026-04-10`
- 대상 읽기: `wagner-et-al-2016`
- 사유: 기존 `translation.md`를 폐기하고 `full.md` 기준으로 처음부터 다시 번역
- 상태: `Stage 2 재시작`
- 공개 원문 확인(`translation original reveal`): 번역 본문이 다시 안정화될 때까지 비활성화

## Pass 계획

- `Pass 1`: 제목/저자/초록 + 서론 전반 + 후기 노년기 발달 논의 초반
- `Pass 2`: 자원·위험요인 논의 + 현재 연구 + 방법
- `Pass 3`: 결과 + 논의 + 참고문헌/부록 + 종단 QA

## Micro-chunk 상태

- `P1-C1`
  - source scope: 제목/저자, `Abstract`, 서론 첫 3개 문단
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P1-C2`
  - source scope: 후기 노년기 성격 발달의 연령 차이, 죽음 근접성 차이
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P1-C3`
  - source scope: 개인차, 자원/위험요인의 역할
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P2-C1`
  - source scope: `The Present Study`, `Method` 도입, `Participants and Procedure`
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P2-C2`
  - source scope: `Measures`
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P2-C3`
  - source scope: `Data Preparation and Statistical Procedure`
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C1`
  - source scope: `Results` 도입 + 무조건 모형 + 성격 특성 변화 기본 궤적
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C2`
  - source scope: 연령/사망시간 선택성 검정 + 자원·위험요인 모형 도입
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C3`
  - source scope: `Physical health` 결과 + Figure 1 맥락
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C4`
  - source scope: `Cognitive performance`, `Perceived control`, `Social inclusion`
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C5`
  - source scope: `Discussion` 도입 + 핵심 결과 요약
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C6`
  - source scope: `Personality Trait Development Late in Life` 해석 본문
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C7`
  - source scope: `The Role of Resources and Risk Factors for Personality Trait Development Late in Life` 중 `health`, `cognitive performance`
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C8`
  - source scope: `The Role of Resources and Risk Factors for Personality Trait Development Late in Life` 중 `perceived control`, `social inclusion`
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remains partial as expected

- `P3-C9`
  - source scope: `fully conditional models` 해석 + `Limitations and Outlook` 앞부분
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, overall translation remained pending approval until ratio fix

- `P3-C10`
  - source scope: `Limitations and Outlook` 뒷부분 + practical implications + 결론 문단
  - status: merged
  - source-order spot check: complete
  - source-only QA: run after merge, manual-review gate only

- `P3-C11`
  - source scope: `References` 복구로 translation ratio 승인선 회복
  - status: merged
  - source-order spot check: complete
  - source-only QA: `translation_ratio = 0.552`, `translation = schema_pass`

- `P3-C12`
  - source scope: `References` 후반부 추가 병합
  - status: merged
  - source-order spot check: complete
  - source-only QA: `translation_ratio = 0.668`, `translation = approved`
  - built-artifact QA: `stage2 = approved`, `workflow_status = approved`

- `P3-C13`
  - source scope: `Appendix Table A1-A3` + `Received / Revision received / Accepted`
  - status: merged
  - source-order spot check: complete
  - source-only QA: backmatter omission corrected; reveal alignment extended for appendix/publication history
  - built-artifact QA: rerun after alignment and label refresh

- `P3-C14`
  - source scope: 재검증 reopen pass for `Introduction`, `Discussion / Limitations and Outlook`, and `translation original reveal`
  - status: reopened
  - source-order spot check: missing sentences confirmed in intro/discussion; figure/table caption-note coverage needs recheck
  - source-only QA: translation approval removed after 2026-04-13 review
  - built-artifact QA: reveal label refresh is live, but early/mid reveal ids such as `wagner-tr-004`, `005`, `021`, `023`-`035` remain misaligned; appendix reveal still contains OCR noise

- `P3-C15`
  - source scope: `Introduction` 누락 문장 복구 + `Results/Discussion/Limitations` 캡션/주 보강 + `translation original reveal` 재정렬
  - status: merged
  - source-order spot check: intro, discussion opening, limitations omission, figure/table caption-note 문장 반영 완료
  - source-only QA: `translation_ratio = 0.764`, heading structure reflowed to publish-safe depth, title-only reveal entries downgraded from `verified`
  - built-artifact QA: targeted reveal overrides refreshed for abstract tail, intro middle, resources/risk factors section, results, discussion opening, and appendix tables; reapproval follow-up required

## Reset 메모

- 기존 `translation_alignment.json`은 폐기했다.
- 새 정렬 파일은 번역 본문이 안정화된 뒤 다시 만든다.
- 이후 모든 청크는 `full.md` 기준 source order를 유지해 병합한다.
