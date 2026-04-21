// Reading detail page components — pure React.createElement (no JSX)

function TabBar({ tabs, active, onPick }) {
  return React.createElement("div", { className: "tab-row" },
    tabs.map((t) =>
      React.createElement("button", {
        key: t.id,
        className: `tab ${active === t.id ? "is-active" : ""}`,
        onClick: () => onPick(t.id),
      },
        t.label,
        t.count != null ? React.createElement("span", { className: "count-pill" }, t.count) : null
      )
    )
  );
}

function OverviewPanel({ reading }) {
  return React.createElement("div", { className: "rpanel" },
    React.createElement("div", { className: "rpanel-main" },
      React.createElement("div", { className: "section-head" },
        React.createElement("h3", null, "수업에서 강조된 포인트"),
        React.createElement("span", { className: "count" },
          `${(reading.classroom_points || []).length}개`)
      ),
      React.createElement("ol", { className: "points-list" },
        (reading.classroom_points || []).map((p, i) =>
          React.createElement("li", { key: i },
            React.createElement("span", { className: "n" }, String(i + 1).padStart(2, "0")),
            React.createElement("span", null, p)
          )
        )
      )
    ),
    React.createElement("aside", { className: "rpanel-side" },
      React.createElement("div", { className: "toc" },
        React.createElement("h4", null, "학습 목차"),
        [
          { id: "overview", label: "개요", done: true },
          { id: "concepts", label: "핵심 개념", done: reading.progress.concepts >= 1 },
          { id: "quiz", label: "퀴즈", done: reading.progress.quiz >= 1 },
          { id: "prep", label: "교수님 대비", done: reading.progress.prep >= 1 },
          { id: "full", label: "본문 원문", done: reading.progress.read >= 1 },
        ].map((it, i) =>
          React.createElement("div", {
            key: it.id,
            className: `toc-item ${i === 0 ? "is-active" : ""}`
          },
            React.createElement("span", null, it.label),
            React.createElement("span", { className: `toc-check ${it.done ? "done" : ""}` },
              it.done ? "✓" : "")
          )
        )
      ),
      React.createElement("div", { className: "toc" },
        React.createElement("h4", null, "태그"),
        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "0.4rem" } },
          (reading.tags || []).map((t, i) =>
            React.createElement("span", { className: "chip", key: i }, `# ${t}`)
          )
        )
      )
    )
  );
}

function ConceptsPanel({ reading }) {
  const details = (window.READING_DETAILS || {})[reading.slug];
  const items = (details && details.concepts) || [];
  if (!items.length) {
    return React.createElement("div", { className: "rpanel" },
      React.createElement("div", { className: "rpanel-main" },
        React.createElement("p", { style: { color: "var(--muted)" } },
          "이 읽기의 개념 카드는 아직 준비 중입니다.")
      )
    );
  }
  return React.createElement("div", null,
    React.createElement("div", { className: "section-head" },
      React.createElement("h3", null, "핵심 개념"),
      React.createElement("span", { className: "count" }, `${items.length}개 카드`)
    ),
    React.createElement("div", { className: "concept-list" },
      items.map((c, i) =>
        React.createElement("article", { className: "concept", key: i },
          React.createElement("div", { className: "concept-top" },
            React.createElement("h4", null, c.term),
            React.createElement("span", { className: "en" }, c.ko)
          ),
          React.createElement("p", null, c.body),
          c.anchors && c.anchors.length
            ? React.createElement("div", { className: "anchors" },
                c.anchors.map((a, j) => React.createElement("span", { className: "anchor", key: j }, a)))
            : null
        )
      )
    )
  );
}

function QuizPanel({ reading }) {
  const useStateRDP = React.useState;
  const details = (window.READING_DETAILS || {})[reading.slug];
  const quiz = (details && details.quiz) || [];
  const [idx, setIdx] = useStateRDP(0);
  const [picked, setPicked] = useStateRDP({});
  const [shortText, setShortText] = useStateRDP("");

  if (!quiz.length) {
    return React.createElement("div", null,
      React.createElement("p", { style: { color: "var(--muted)" } },
        "이 읽기의 퀴즈는 아직 준비 중입니다.")
    );
  }
  const cur = quiz[idx];
  const chosen = picked[idx];
  const done = chosen != null;
  const correct = done && chosen === cur.a;

  function pick(v) {
    if (done) return;
    setPicked({ ...picked, [idx]: v });
  }
  function next() {
    setShortText("");
    setIdx(Math.min(quiz.length - 1, idx + 1));
  }
  function prev() {
    setShortText("");
    setIdx(Math.max(0, idx - 1));
  }
  function submitShort() {
    if (done) return;
    setPicked({ ...picked, [idx]: shortText.trim() });
  }

  return React.createElement("div", null,
    React.createElement("div", { className: "quiz-head" },
      React.createElement("div", null,
        React.createElement("h3", { style: { margin: 0, fontSize: "1.1rem" } }, "형성 퀴즈"),
        React.createElement("p", { style: { margin: "0.2rem 0 0", color: "var(--muted)", fontSize: "0.88rem" } },
          "OX · 단답으로 개념을 가볍게 점검합니다.")
      ),
      React.createElement("div", { className: "quiz-progress" },
        React.createElement("span", null, `${idx + 1} / ${quiz.length}`),
        React.createElement("div", { className: "quiz-progress-bar" },
          React.createElement("span", { style: { width: `${((idx + 1) / quiz.length) * 100}%` } })
        )
      )
    ),
    React.createElement("div", { className: "quiz-card" },
      React.createElement("span", { className: "quiz-kind" }, cur.kind),
      React.createElement("p", { className: "quiz-q" }, cur.q),
      cur.kind === "OX"
        ? React.createElement("div", { className: "quiz-options" },
            ["O", "X"].map((v) => {
              let cls = "quiz-opt";
              if (done) {
                if (v === cur.a) cls += " is-correct";
                else if (v === chosen) cls += " is-wrong";
              } else if (chosen === v) cls += " is-selected";
              return React.createElement("button", {
                key: v,
                className: cls,
                onClick: () => pick(v),
              }, v);
            })
          )
        : React.createElement("div", { style: { display: "flex", gap: "0.6rem", alignItems: "stretch", flexWrap: "wrap" } },
            React.createElement("input", {
              className: "quiz-input",
              placeholder: "답을 입력하세요",
              value: done ? chosen : shortText,
              disabled: done,
              onChange: (e) => setShortText(e.target.value),
              onKeyDown: (e) => { if (e.key === "Enter") submitShort(); },
              style: { flex: 1, minWidth: "16rem" }
            }),
            React.createElement("button", {
              className: "btn-primary",
              onClick: submitShort,
              disabled: done || !shortText.trim(),
              style: done ? { opacity: 0.4, cursor: "default" } : {}
            }, "제출")
          ),
      done
        ? React.createElement("p", { className: "quiz-explain" },
            cur.kind === "OX"
              ? (correct ? "정답입니다. " : "아쉽게도 오답입니다. ") + (cur.explain || "")
              : `예시 답: ${cur.a}` + (cur.explain ? ` — ${cur.explain}` : ""))
        : null,
      React.createElement("div", { className: "quiz-nav" },
        React.createElement("button", {
          className: "btn-ghost",
          onClick: prev,
          disabled: idx === 0,
          style: idx === 0 ? { opacity: 0.4, cursor: "default" } : {}
        }, "← 이전"),
        React.createElement("button", {
          className: "btn-primary",
          onClick: next,
          disabled: idx === quiz.length - 1,
          style: idx === quiz.length - 1 ? { opacity: 0.4, cursor: "default" } : {}
        }, "다음 →")
      )
    )
  );
}

function ReadingDetail({ slug, onBack }) {
  const useStateRDP = React.useState;
  const reading = window.READINGS.find((r) => r.slug === slug);
  const [tab, setTab] = useStateRDP("overview");
  const details = (window.READING_DETAILS || {})[slug] || {};
  const conceptsCount = (details.concepts || []).length;
  const quizCount = (details.quiz || []).length;

  const tabs = [
    { id: "overview", label: "개요" },
    { id: "concepts", label: "핵심 개념", count: conceptsCount || null },
    { id: "quiz", label: "퀴즈", count: quizCount || null },
    { id: "prep", label: "교수님 대비" },
    { id: "full", label: "본문" },
  ];

  let panel;
  if (tab === "overview") panel = React.createElement(OverviewPanel, { reading });
  else if (tab === "concepts") panel = React.createElement(ConceptsPanel, { reading });
  else if (tab === "quiz") panel = React.createElement(QuizPanel, { reading });
  else panel = React.createElement("div", { className: "rpanel" },
    React.createElement("div", { className: "rpanel-main" },
      React.createElement("p", { style: { color: "var(--muted)" } },
        tab === "prep" ? "교수님 대비 카드는 아직 준비 중입니다." : "본문 뷰는 prototype 범위에 포함되지 않았습니다.")
    )
  );

  return React.createElement("div", { className: "reading-shell" },
    React.createElement("button", { className: "rdp-backlink", onClick: onBack }, "← 전체 읽기로"),
    React.createElement("header", { className: "rdp-header" },
      React.createElement("div", null,
        React.createElement("div", { className: "rdp-kicker" },
          React.createElement("span", { className: "chip brand" },
            `W${String(reading.week).padStart(2, "0")} · ${reading.display_date_label}`),
          React.createElement("span", { className: "chip strong" }, reading.type_label),
          React.createElement("span", { className: "chip" }, reading.lang),
          ...(reading.tags || []).slice(0, 2).map((t, i) =>
            React.createElement("span", { className: "chip", key: i }, `# ${t}`))
        ),
        React.createElement("h1", { className: "rdp-title" }, reading.title),
        React.createElement("p", { className: "rdp-authors" },
          `${reading.authors_display} · ${reading.year}`),
        reading.overview_hook
          ? React.createElement("p", { className: "rdp-hook" }, reading.overview_hook)
          : null,
        React.createElement("div", { style: { display: "flex", gap: "0.5rem", flexWrap: "wrap", paddingTop: "1rem" } },
          React.createElement("button", { className: "btn-primary" }, "읽기 →"),
          React.createElement("button", { className: "btn-ghost" }, "교수님 답변 대비"),
          React.createElement("button", { className: "btn-ghost" }, "PDF 다운로드")
        )
      )
    ),
    React.createElement(TabBar, { tabs, active: tab, onPick: setTab }),
    panel
  );
}

Object.assign(window, { ReadingDetail });
