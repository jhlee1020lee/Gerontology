# Source Segmentation Rules

원문은 통째로 번역하지 않는다. 먼저 `source_segments.json`으로 섹션/문단 단위 segment를 만든다.

## 파일 위치

- `content/readings/<slug>/source_segments.json`
- 사람이 읽는 보조 메모가 필요하면 `source_segments.md`를 둘 수 있지만 자동 검수 기준은 JSON이다.

## Segment ID 체계

- `ABS-001`: abstract
- `INTRO-001`: introduction
- `THEORY-001`: theory/background
- `METHOD-001`: methods/sample/measures/analysis
- `RESULT-001`: results
- `DISCUSSION-001`: discussion
- `LIMIT-001`: limitations
- `TABLE-001`: table
- `FIGURE-001`: figure
- `APPENDIX-001`: appendix
- `REF-001`: references

## JSON Schema

```json
{
  "paper_id": "string",
  "title": "string",
  "segments": [
    {
      "segment_id": "ABS-001",
      "section": "Abstract",
      "paragraph_index": 1,
      "source_location": "p.1",
      "original_text": "...",
      "word_count": 120,
      "char_count": 740,
      "contains_numbers": true,
      "contains_citations": true,
      "contains_table_or_figure_reference": false,
      "notes": ""
    }
  ]
}
```

## 작성 규칙

- segment_id는 중복하지 않는다.
- `original_text`는 원문을 보존하며 요약하지 않는다.
- 표, 그림, 참고문헌은 짧아도 별도 segment로 둔다.
- source_location은 페이지, 섹션, PDF 위치 중 확인 가능한 정보를 쓴다.
- word_count와 char_count는 검수자가 길이 변화를 판단할 수 있게 남긴다.
