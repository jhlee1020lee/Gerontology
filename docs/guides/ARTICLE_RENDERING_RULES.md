# Article Rendering Rules

이 문서는 markdown 또는 JSON 콘텐츠를 HTML로 렌더링할 때 쓰는 컴포넌트 계약이다.

## Components

- `article-header`: 읽기 제목, 날짜, 자료 유형, 탭, PDF 액션을 포함한다.
- `abstract-card`: 초록 또는 읽기 핵심 질문을 별도 시각 영역으로 둔다.
- `section-block`: h2 단위 본문 구획이다.
- `original-toggle`: 번역문에서 원문을 여는 disclosure control이다.
- `original-translation-pair`: 번역 segment와 원문 reveal의 연결 단위다.
- `translation-block`: 한국어 번역 문단 단위다.
- `key-concept-callout`: 핵심 용어, 태그, 복습 키워드 영역이다.
- `method-note`: 표본, 측정, 분석 같은 방법 정보를 표시한다.
- `caution-note`: 제한점, 인과 주의, 과장 금지를 표시한다.
- `quote-block`: 원문 인용 또는 중요한 문장 블록이다.
- `table-note`: 표를 읽는 법 또는 표 segment 설명이다.
- `figure-note`: 그림을 읽는 법 또는 figure segment 설명이다.
- `professor-question-card`: 구술 대비 답변 카드다.
- `inline-quiz-card`: 본문 흐름 안에 들어가는 self-check 문항이다.
- `quiz-entry-card`: OX/단답/객관식 문항 카드다.
- `reading-progress`: full/translation 장문 페이지 진행률이다.
- `sticky-toc`: 데스크톱 우측 목차다.
- `source-segment-anchor`: segment_id로 연결 가능한 앵커다.

## 구현 규칙

- 빌드 시점에 가능한 구조는 런타임 DOM 조작보다 우선한다.
- `details`/`summary`는 원문 공개 기본 패턴이다.
- 런타임 JS는 active TOC와 reading progress처럼 상태 표시만 담당한다.
- 모든 링크는 상대 경로를 유지한다.
