# Reading Workflow

이 문서는 날짜별 읽기 하나를 추가하거나 재작업할 때 따르는 실행 순서다. 상세 정책 충돌 시 루트 `CONTENT_RULES.md`를 우선한다.

## 기본 원칙

- 작업 단위는 `1 reading x 1 stage x 1 pass`다.
- 영어 읽기는 `전체 글`과 `한국어 번역`을 반드시 분리한다.
- 최종 산출물은 `docs/`에만 생성한다.
- 읽기 목록 source of truth는 `manifest/readings.json`이다.
- 원문과 번역은 segment alignment가 준비되기 전에는 approval-ready로 보지 않는다.

## 신규 읽기 절차

1. 논문 정보 확인
   - 제목, 저자, 연도, 언어, 자료 유형, 수업 날짜를 확인한다.
   - `manifest/readings.json`에 한 reading record만 추가한다.

2. 원문 추출
   - `content/readings/<slug>/full.md`를 작성한다.
   - 영어 논문은 `source_segments.json`을 함께 작성한다.
   - 큰 구간을 한 번에 요약하지 않고 섹션/문단 단위로 segment_id를 붙인다.

3. 원문 세그먼트 검수
   - `source_segments.json`의 segment_id, section, paragraph_index, original_text, word_count, char_count를 확인한다.
   - 표, 그림, 참고문헌, 부록은 별도 segment로 남긴다.

4. 번역
   - `translation.md`와 `translation_segments.json`을 같은 순서로 작성한다.
   - 원문 segment 하나에 번역 segment 하나를 대응시킨다.
   - 번역문이 요약문으로 바뀌면 실패다.

5. alignment 검수
   - `node scripts/check-alignment.js --slug <slug> --strict --write-report`를 실행한다.
   - 생성된 `alignment_report.md`와 `translation_qa_checklist.md`를 확인한다.

6. Stage 3 작성
   - `summary`, `concepts`, `pitfalls`, `quiz-ox`, `quiz-short`, `quiz-mcq`, `review-sheet`, `professor-prep` 순서로 작업한다.
   - 퀴즈 문항은 `evidence_segment_id`를 가진다.

7. manifest 및 로컬 검증
   - `node scripts/build_site.js --slug <slug>`
   - `node scripts/validate_content.js --slug <slug>`
   - 읽기 페이지, 번역 원문 보기, 퀴즈, 모바일 레이아웃을 확인한다.

## 실패 처리

- 누락 segment가 있으면 번역이나 퀴즈를 먼저 확장하지 않는다.
- `alignment_report.md`가 FAIL이면 manifest나 meta에서 final/approved처럼 취급하지 않는다.
- 검수 실패 이유를 작업 로그에 남기고 누락 segment부터 보완한다.
