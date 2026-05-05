# 시험 직전 정리

## 1분 안에 붙잡을 축

- 질문: 치매 배우자 돌봄자는 사망위험이 높아지는가, 아니면 낮아지는가? 그리고 그 패턴은 자기평가 건강 수준에 따라 달라지는가?
- 자료: HRS 2000-2012, 51세 이상 기혼 성인 10,650명, 치매돌봄자 917명.
- 노출: 치매가 있는 배우자에게 ADL 도움을 제공한 spousal dementia caregiving.
- 결과: NDI로 확인한 time-to-death, 전체 사망과 심장질환·암·뇌혈관질환 사망.
- 해석: 치매돌봄은 부담이 큰 역할이지만, 이 논문에서는 낮은 사망위험과 연결되며 그 보호적 관련성은 poor self-rated health 쪽에서 특히 컸다.
- 한계: 관찰자료라 인과 단정은 금물이다. 선택효과, reverse causation, healthy survivor effect를 남긴다.

## 꼭 외울 숫자

- 표본: 전체 10,650명, 치매돌봄자 917명, 치매돌봄자 비율 8.6%.
- 12년 사망: 치매돌봄자 26%, 비돌봄자 28%.
- Model 1: 치매돌봄자 HR 0.71, 95% CI [0.63, 0.80]; 비치매 돌봄자 HR 0.74, 95% CI [0.62, 0.89].
- 상호작용: dementia care x self-rated health, F(4,52)=38.61, p<.01.
- 핵심 대비: excellent 건강 비돌봄자 기준, poor 건강 비돌봄자 HR 4.78 vs poor 건강 치매돌봄자 HR 1.51.
- 원인별 사망: 심장질환 HR 0.77, 암 HR 0.79, 뇌혈관질환 HR 0.69. 암과 뇌혈관질환은 CI가 넓어 과장하지 않는다.

## 꼭 구분할 대비쌍

- burden vs mortality benefit: 돌봄이 힘들다는 경험과 사망위험이 낮게 나온 통계 결과는 동시에 가능하다.
- noncaregiver vs nondementia caregiver vs dementia caregiver: 배우자 ADL 도움 여부와 배우자 치매 여부로 갈라진다.
- main effect vs interaction: HR 0.71은 전체 차이, poor health에서 대비가 커지는 것은 상호작용 결과다.
- Healthy Caregiver Hypothesis vs 이 논문의 결과: 이름만 보면 건강한 돌봄자만 이익을 볼 것 같지만, 결과는 낮은 자기평가 건강 집단에서 보호적 관련성이 더 컸다.
- all-cause mortality vs cause-specific mortality: 전체 사망만 본 것이 아니라 심장질환, 암, 뇌혈관질환 사망도 경쟁위험 틀에서 봤다.
- protective direction vs statistical certainty: HR이 1보다 낮은 방향과 CI까지 봐서 단정 가능한지는 구분한다.
- self-rated health vs objective health: 자기평가 건강은 전반적 건강 대리변수이지 질병진단 자체가 아니다.

## 팝업퀴즈 감각

- OX: “이 논문은 치매돌봄자의 사망위험이 비돌봄자보다 높다고 결론낸다”는 X.
- OX: “치매돌봄의 보호적 관련성은 excellent self-rated health 집단에서만 나타났다”는 X.
- OX: “poor health 비돌봄자와 poor health 치매돌봄자의 HR 대비가 논문의 핵심이다”는 O.
- OX: “암과 뇌혈관질환 결과도 심장질환 결과만큼 통계적으로 강하게 단정할 수 있다”는 X.
- 객관식 포인트: Cox proportional hazards model은 time-to-death와 censored observation을 함께 다룬다.
- 객관식 포인트: competing risks 분석은 한 사망원인을 볼 때 다른 원인의 사망이 해당 사건을 막는 문제를 다룬다.

## 영어 용어 암기

- PLWD: persons living with dementia.
- spousal dementia caregiving: 배우자 치매돌봄.
- self-rated health / self-reported health status: 자기평가 건강.
- mortality benefit / caregiving survival advantage: 돌봄의 사망위험 감소 관련성.
- Healthy Caregiver Hypothesis: 건강한 돌봄자 가설.
- Cox proportional hazards model: Cox 비례위험 생존모형.
- hazard ratio: HR, 위험비.
- all-cause mortality: 전체 사망.
- cause-specific mortality / leading causes of mortality: 원인별 사망 / 주요 사망원인.
- competing risks analysis: 경쟁위험 분석.
- reverse causation: 역인과.
- healthy survivor effect: 건강한 생존자 효과.
