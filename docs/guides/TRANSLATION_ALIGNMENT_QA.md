# Translation Alignment QA

이 문서는 번역 누락 방지를 위한 최우선 검수 기준이다.

## 입력 파일

- `content/readings/<slug>/source_segments.json`
- `content/readings/<slug>/translation_segments.json`
- 선택: `content/readings/<slug>/alignment_report.md`
- 선택: `content/readings/<slug>/translation_qa_checklist.md`

## translation_segments.json Schema

```json
{
  "paper_id": "string",
  "translations": [
    {
      "segment_id": "ABS-001",
      "ko_translation": "...",
      "translator_note": "",
      "is_summary": false,
      "review_status": "pending"
    }
  ]
}
```

## 자동 검수 명령

```powershell
node scripts/check-alignment.js --slug <slug> --strict --write-report
```

## 실패 조건

- 원문 segment_id 중 번역이 없는 항목이 하나라도 있으면 실패
- 번역 segment_id가 원문 segment_id와 다르면 실패
- 원문 문단 2개 이상을 하나의 번역문으로 병합했는데 이유가 없으면 실패
- 표, 그림, 수치, 괄호 안 조건, 인용, 연구대상 수, 분석방법이 빠지면 실패
- 번역문이 요약형 표현으로 원문을 대체하면 실패
- 원문에는 있는 제한점, 한계, 주의 표현이 빠지면 실패
- 인과가 아닌 표현을 인과처럼 번역하면 실패
- 번역자가 임의로 수업 해석을 끼워 넣으면 실패

## 수동 spot-check

- Abstract 1개 이상
- Methods 또는 연구 설계 1개 이상
- Results 또는 Discussion 1개 이상
- Limitations 또는 caveat 1개 이상
- Appendix, table, figure, references 중 존재하는 영역 1개 이상

## 승인 규칙

- 자동 검사 PASS만으로 approval-ready가 아니다.
- 수동 spot-check 결과를 `translation_qa_checklist.md`에 남긴 뒤 승인한다.
- FAIL이면 `partial`로 유지하고 누락 segment부터 보완한다.
