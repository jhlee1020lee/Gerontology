# Quiz Rules

퀴즈는 읽기 근거를 확인하는 학습 도구다. 모든 신규 문항은 원문 segment 근거를 가져야 한다.

## 공통 Schema

```json
{
  "question_id": "string",
  "type": "ox | mcq | short",
  "question": "string",
  "choices": [],
  "answer": "string",
  "explanation": "string",
  "evidence_segment_id": "RESULT-003",
  "difficulty": "basic | medium | hard",
  "misconception_targeted": "string"
}
```

기존 파일은 `prompt`, `source`, `accepted_answers` 같은 legacy 필드를 읽을 수 있지만, 신규/재승인 문항은 `evidence_segment_id`를 추가한다.

## OX

- 정답이 명확해야 한다.
- 문항은 오해 방지형으로 만든다.
- 설명은 왜 O/X인지 segment 근거로 짧게 쓴다.

## 단답형

- 답은 한 용어, 짧은 구, 이름, 숫자 중 하나다.
- 허용 정답은 8단어 미만이다.
- 영어 용어가 원문에 있으면 accepted_answers에 obvious variant를 포함한다.

## 객관식

- 정답은 하나만 명확해야 한다.
- 오답은 그럴듯하지만 원문 근거상 틀려야 한다.
- “모두 정답”, “위 내용 모두 아님”은 기본적으로 쓰지 않는다.
- 해설은 가장 유혹적인 오답을 최소 하나 반박한다.

## 실패 조건

- evidence_segment_id가 없으면 신규 approval-ready가 아니다.
- 논문 밖 상식이나 수업 해석만으로 만든 문항은 실패다.
- 결과를 과장하거나 인과처럼 바꾸면 실패다.
