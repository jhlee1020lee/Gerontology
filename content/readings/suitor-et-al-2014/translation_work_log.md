# Suitor et al. (2014) 한국어 번역 재검수 로그

- 재검수 일자: `2026-04-21`
- 대상 읽기: `suitor-et-al-2014`
- 목표: `full.md` 기준 완역 여부와 숫자/표/참고문헌 정확성 재점검
- 상태: `Stage 2 재검수 완료, approved`

## Pass 계획

- `Pass 1`: 표지 메타데이터 + 초록 + 서론
- `Pass 2`: 방법 + 표 1
- `Pass 3`: 결과 + 표 2 + 논의/함의 + 연구비/감사 + 참고문헌 + reveal 재정렬

## Micro-chunk 상태

- `P1-C1`
  - source scope: 표지 메타데이터, structured abstract, 서론 도입 2문단
  - status: merged
  - source-order spot check: `full.md` 초반부 대조 완료, 메타데이터/초록/서론 도입 범위에서 새 번역 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: copyright/permissions, 소속/교신저자 주소 보강, structured abstract를 원문 구조대로 재번역, 서론 첫 2문단을 요약투에서 원문 대응 번역으로 교체

- `P1-C2`
  - source scope: 이론 배경 2섹션 (`Within-Family Differences...`, `Perceptions of Favoritism...`)
  - status: merged
  - source-order spot check: `full.md` 이론 배경 2섹션 대조 완료, 새 번역 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: 기존 요약투 문단을 원문 문장 흐름에 맞춰 재번역, `표현적/도구적 자원`, `관계적 공정성`, 세 번째 가설 문장까지 원문 순서대로 복원

- `P2-C1`
  - source scope: methods, procedures, measures, table 1
  - status: merged
  - source-order spot check: `full.md` 방법/절차/측정/표 1 범위 대조 완료, 새 번역 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: WFDS 설계 설명 참고문장과 기존 출판 언급 복원, 참여 자녀 특성 문장 주어를 어머니가 아닌 성인자녀 기준으로 수정, `64% vs 72%` 방향 명시, 표 1 소개문 보강

- `P3-C1`
  - source scope: results, table 2
  - status: merged
  - source-order spot check: 표 2 계수 재확인 완료
  - source-only QA: rerun complete, reading reopened as `manual_review_required`
  - notes: `Married` 계수를 `-1.10 / -1.08`로 수정

- `P3-C2`
  - source scope: discussion, implications, funding, acknowledgments, references
  - status: merged
  - source-order spot check: `full.md` 논의/실천적 함의/연구비·감사/참고문헌 범위 대조 완료, 새 번역 누락 없음 확인
  - source-only QA: rerun complete, 청크 변경으로 인한 새 source 오류 없음 확인
  - notes: 돌봄 맥락 편애 연구 수를 `단 한 편`으로 명시해 원문 어조 복원, 마지막 함의 문단을 원문 논지에 맞게 미세 조정, Gentry(2001) 참고문헌 페이지 범위를 `31-47`로 수정

- `P3-C3`
  - source scope: `translation original reveal`
  - status: merged
  - source-order spot check: 검증기와 동일한 `skipFirstTitleHeading + collectFrontmatter` 기준으로 locator 재산출 후 재정렬 완료
  - source-only QA: resolver 오류 `0`건 확인 후 `node scripts/build_site.js --slug suitor-et-al-2014`, `node scripts/validate_content.js --slug suitor-et-al-2014 --json` 재실행 완료
  - notes: 잘못 잡힌 translation flat index를 전면 보정한 뒤, source 문단 경계 정리까지 반영해 `translation` 전체 문단 `37/37`에 reveal을 연결했다. 최종 빌드/검증에서 `translation` 페이지는 `schema_pass`, original reveal은 `37`개 엔트리로 확인되었고 Stage 2 승인 핀까지 반영함
