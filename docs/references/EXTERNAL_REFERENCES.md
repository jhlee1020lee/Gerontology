# External References

이 파일은 `gerontology_reading_pipeline_quality_upgrade.md` 작업에서 확인한 외부 기준과 적용 방식을 기록한다. 외부 문구는 장문 복사하지 않고 구조와 원칙만 이 저장소에 맞게 재구성했다.

| 자료 | URL | 자료 성격 | 참고한 이유 | 적용한 부분 | 직접 복사 | 라이선스/저작권 확인 |
| --- | --- | --- | --- | --- | --- | --- |
| AGENTS.md official | https://agents.md/ | AI agent 지침 파일 관례 | 루트 지침 파일의 역할 분리 참고 | `AGENTS.md`를 요약 체크리스트로 유지 | 없음 | 사이트 문구 복사 없음, 추가 확인 필요 |
| OpenAI Codex AGENTS.md guide | https://developers.openai.com/codex/guides/agents-md | Codex project instruction guide | Codex가 `AGENTS.md`를 읽는 방식 확인 | `CONTENT_RULES.md`와 `AGENTS.md` 연결 구조 | 없음 | OpenAI docs, 문구 복사 없음 |
| OpenAI Codex Skills | https://developers.openai.com/codex/skills | 반복 작업 Skill 구조 | 반복 workflow를 작은 작업 단위로 분리하는 방식 참고 | guide 파일을 기능별로 분리 | 없음 | OpenAI docs, 문구 복사 없음 |
| OpenAI skills repo | https://github.com/openai/skills | Skill 예시 저장소 | `SKILL.md` 중심 구조 확인 | 반복 작업 guide의 scope/trigger 개념 참고 | 없음 | GitHub repo, 라이선스는 저장소 기준 확인 필요 |
| awesome-claude-md | https://github.com/josix/awesome-claude-md | AI onboarding 문서 모음 | 사람도 읽기 쉬운 프로젝트 지침 구조 참고 | 상세 규칙을 별도 문서로 분리 | 없음 | GitHub repo, 라이선스 확인 필요 |
| getdesign.md | https://getdesign.md/ | DESIGN.md 자료 모음 | UI 규칙을 Markdown으로 명시하는 방식 참고 | `READING_UI_RULES.md`, `ARTICLE_RENDERING_RULES.md` | 없음 | 사이트 문구 복사 없음 |
| awesome-design-md | https://github.com/VoltAgent/awesome-design-md | DESIGN.md collection | 디자인 토큰/컴포넌트/반응형 규칙 문서 구조 참고 | UI guide 파일 구조 | 없음 | MIT license 표시 확인, 문구 복사 없음 |
| GOV.UK Design System | https://design-system.service.gov.uk/ | 공공 서비스 디자인 시스템 | 명확성, 접근성, layout discipline 참고 | 읽기 화면의 절제된 계층과 spacing | 없음 | Open Government Licence 표시 확인 |
| GOV.UK Styles | https://design-system.service.gov.uk/styles/ | Typography/layout styles | 제목, 문단, spacing 항목 구조 참고 | 본문 measure, heading, paragraph checklist | 없음 | Open Government Licence 표시 확인 |
| Writing for GOV.UK | https://www.gov.uk/guidance/content-design/writing-for-gov-uk | 콘텐츠 작성 가이드 | UI 문구 명확성 참고 | 짧고 직접적인 버튼/안내 문구 원칙 | 없음 | Open Government Licence 계열, 문구 복사 없음 |
| IBM Carbon content overview | https://carbondesignsystem.com/guidelines/content/overview/ | UI content guide | 제품 UI 문구의 일관성 참고 | 버튼, 탭, 태그 문구 규칙 | 없음 | IBM copyright, 문구 복사 없음 |
| IBM Carbon writing style | https://carbondesignsystem.com/guidelines/content/writing-style/ | Writing style | 단순하고 명확한 UI copy 원칙 참고 | guide 문서의 문구 일관성 | 없음 | IBM copyright, 문구 복사 없음 |
| Apple HIG Typography | https://developer.apple.com/design/human-interface-guidelines/typography | Typography guide | 가독성 계층 참고 | 큰 본문/제목 대비 원칙 | 없음 | 페이지가 JS 필요로 본문 확인 제한, 확인 필요 |
| W3C WCAG Text Spacing | https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html | Accessibility criterion explanation | 줄간격/문단간격 접근성 기준 참고 | reader line-height, spacing, no overlap checklist | 없음 | W3C 문서, 문구 복사 없음 |
| Baymard line length | https://baymard.com/blog/line-length-readability | UX readability article | 긴 본문의 줄 길이 제한 참고 | 60~70ch 본문 measure | 없음 | 기사 문구 복사 없음, 라이선스 확인 필요 |
| APA JARS | https://apastyle.apa.org/jars | 논문 보고 기준 | 연구 질문/방법/결과/한계 체크포인트 | `PAPER_EXTRACTION_RULES.md` | 없음 | 사이트 접근 제한으로 상세 확인 제한 |
| EQUATOR reporting guidelines | https://www.equator-network.org/reporting-guidelines/ | 연구보고 guideline database | 연구 유형별 누락 방지 방식 참고 | 실증/리뷰/이론 논문 체크리스트 | 없음 | 사이트 문구 복사 없음 |
| PRISMA 2020 checklist | https://www.prisma-statement.org/prisma-2020-checklist | Systematic review checklist | 리뷰 논문 처리 기준 참고 | 검색/선정/포함 문헌 수 항목 | 없음 | CC BY 4.0 표시 확인, 문구 복사 없음 |
| IMRaD structure | https://libguides.umn.edu/StructureResearchPaper | Research paper structure guide | 실증 논문 섹션 흐름 참고 | segment ID section defaults | 없음 | 사이트 문구 복사 없음, 라이선스 확인 필요 |
| ISO 17100 | https://www.iso.org/standard/59149.html | Translation services standard | 번역 품질 프로세스 참고 | 번역-검토-품질확인-승인 흐름 | 없음 | ISO copyright 및 제한 표시 확인, 문구 복사 없음 |
| Google global audience style | https://developers.google.com/style/translation | Translation/localization writing guide | 번역 가능한 명확한 문장 원칙 참고 | `TRANSLATION_RULES.md`의 명확성/용어 일관성 | 없음 | Google docs, 문구 복사 없음 |
| Microsoft Localization Style Guides | https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides | Localization style guide index | 한국어 포함 언어별 스타일 가이드 존재 확인 | 용어표/문체 일관성 원칙 | 없음 | Microsoft Learn, 일부 권한 안내 표시 |
| Moodle GIFT format | https://docs.moodle.org/en/GIFT_format | Text quiz format | 텍스트 기반 퀴즈 구조 참고 | quiz schema의 명시적 문항 단위 | 없음 | MoodleDocs, 문구 복사 없음 |
| 1EdTech QTI | https://www.1edtech.org/standards/qti/index | Assessment interoperability spec | 평가 문항의 구조화 방식 참고 | evidence/difficulty/misconception 필드 설계 | 없음 | 상세 spec 라이선스는 추가 확인 필요 |
| LiaScript | https://liascript.github.io/ | Markdown interactive learning | Markdown 기반 self-check UI 참고 | inline/self-test card 개념 | 없음 | 사이트 문구 복사 없음 |
| LiaScript repo | https://github.com/LiaScript/LiaScript | Interactive content implementation | Markdown course/quiz 구조 참고 | static site에서 가벼운 quiz card 유지 | 없음 | GitHub repo, 라이선스 확인 필요 |
| UT Austin MCQ guide | https://ctl.utexas.edu/multiple-choice-questions | University MCQ writing guide | 좋은 오답 선택지 기준 참고 | `QUIZ_RULES.md` 객관식 규칙 | 없음 | 페이지 하단 CC BY-NC-SA 표시 확인 |
| UBC CWSEI MCQ guide | https://www.eoas.ubc.ca/research/cwsei/resources/mc-guidelines.html | University MCQ writing guide | plausible distractor와 stem 작성 기준 참고 | 오답은 그럴듯하지만 명확히 틀리게 작성 | 없음 | 사이트 문구 복사 없음, 라이선스 확인 필요 |

## 적용 메모

- 외부 기준은 이 저장소의 정적 HTML/vanilla JS 구조에 맞춰 재구성했다.
- 라이선스가 명확하지 않은 자료의 문구는 복사하지 않았다.
- APA JARS와 Apple HIG Typography는 웹 도구에서 본문 확인이 제한되어 상세 인용 없이 고수준 원칙만 반영했다.
