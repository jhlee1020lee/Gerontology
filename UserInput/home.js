// Homepage components — depends on window.READINGS, window.TIMELINE, window.SITE
function fmtPct(x) { return Math.round(x * 100) + "%"; }

function ProgressDot({ level }) {
  // level 0..1
  const cls = level >= 1 ? "filled" : level > 0 ? "partial" : "";
  return React.createElement("span", { className: "rcard-dot " + cls });
}

function ReadingCard({ reading, onOpen }) {
  const state = reading.state;
  const p = reading.progress;
  const done = [p.read, p.concepts, p.quiz, p.prep].filter((x) => x >= 1).length;
  const label = state === "locked" ? "준비 중" : state === "current" ? "이번 주" : "완료 / 진행 중";
  const isClickable = state !== "locked";

  return React.createElement(
    "button",
    {
      className: `rcard ${state === "locked" ? "is-locked" : ""} ${state === "current" ? "is-current" : ""}`,
      onClick: isClickable ? () => onOpen(reading.slug) : undefined,
      disabled: !isClickable,
    },
    React.createElement("div", { className: "rcard-top" },
      React.createElement("span", { className: "rcard-date" },
        reading.display_date_label,
        React.createElement("span", { className: "wk" }, `W${String(reading.week).padStart(2, "0")}`)
      ),
      React.createElement("span", { className: `rcard-status ${state}` }, label)
    ),
    React.createElement("h4", { className: "rcard-title" }, reading.title),
    React.createElement("p", { className: "rcard-meta" },
      `${reading.type_label} · ${reading.lang} · ${reading.authors_display}`),
    React.createElement("p", { className: "rcard-sub" }, reading.subtitle),
    React.createElement("div", { className: "rcard-foot" },
      React.createElement("div", { className: "rcard-dots" },
        React.createElement(ProgressDot, { level: p.read }),
        React.createElement(ProgressDot, { level: p.concepts }),
        React.createElement(ProgressDot, { level: p.quiz }),
        React.createElement(ProgressDot, { level: p.prep }),
        React.createElement("span", { className: "rcard-dot-label" },
          state === "locked" ? "—" : `${done}/4`
        )
      ),
      React.createElement("span", { className: "rcard-arrow" }, "→")
    )
  );
}

function TimelineRail({ readings, onOpen }) {
  const weeks = window.TIMELINE;
  return React.createElement("aside", { className: "rail" },
    React.createElement("p", { className: "rail-label" }, "학기 일정"),
    React.createElement("ul", { className: "rail-list" },
      weeks.map((w) => {
        const rs = readings.filter((r) => r.week === w.week);
        const doneAny = rs.some((r) => r.state === "ready" && r.progress.read >= 1);
        const isCurrent = rs.some((r) => r.state === "current");
        return React.createElement("li", {
          key: w.week,
          className: `rail-item ${isCurrent ? "is-current" : ""} ${doneAny && !isCurrent ? "is-done" : ""}`
        },
          React.createElement("span", { className: "week-n" }, `W${String(w.week).padStart(2, "0")}`),
          React.createElement("div", { className: "rail-body" },
            React.createElement("div", { className: "rail-date" }, w.date_range),
            React.createElement("ul", { className: "rail-readings" },
              rs.length
                ? rs.map((r) => React.createElement("li", {
                    key: r.slug,
                    className: `rail-reading ${r.state}`,
                    onClick: r.state !== "locked" ? (e) => { e.stopPropagation(); onOpen && onOpen(r.slug); } : undefined,
                    title: r.title,
                  }, r.title))
                : React.createElement("li", { className: "rail-reading empty" }, w.label)
            )
          )
        );
      })
    )
  );
}

function HeroThisWeek({ reading, onOpen }) {
  if (!reading) return null;
  const p = reading.progress;
  return React.createElement("section", { className: "hero" },
    React.createElement("div", { className: "hero-body" },
      React.createElement("span", { className: "hero-kicker" },
        React.createElement("span", { className: "pulse" }),
        `이번 주 · W${String(reading.week).padStart(2, "0")} · ${reading.display_date_label}`
      ),
      React.createElement("h2", null, reading.title),
      React.createElement("p", { className: "hook" },
        reading.overview_hook || reading.subtitle),
      React.createElement("div", { className: "hero-meta" },
        React.createElement("span", { className: "chip strong" }, reading.type_label),
        React.createElement("span", { className: "chip" }, reading.lang),
        React.createElement("span", { className: "chip" }, reading.authors_display),
        ...(reading.tags || []).slice(0, 2).map((t, i) =>
          React.createElement("span", { className: "chip brand", key: i }, `# ${t}`))
      ),
      React.createElement("div", { className: "hero-cta-row" },
        React.createElement("button", {
          className: "btn-primary",
          onClick: () => onOpen(reading.slug)
        }, "읽기 →"),
        React.createElement("button", { className: "btn-ghost" }, "교수님 답변 대비"),
        React.createElement("button", { className: "btn-ghost" }, "PDF 다운로드")
      )
    )
  );
}

function Home({ onOpen }) {
  const { useState, useMemo } = React;
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const all = window.READINGS;
  const current = all.find((r) => r.state === "current");

  const filtered = useMemo(() => {
    return all.filter((r) => {
      if (filter === "textbook" && r.lang !== "한국어") return false;
      if (filter === "english" && r.lang !== "영어") return false;
      if (q) {
        const hay = (r.title + " " + r.subtitle + " " + r.authors_display + " " + (r.tags || []).join(" ")).toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [filter, q, all]);

  const readyCount = all.filter((r) => r.state === "ready").length;
  const doneCount = all.filter((r) => r.state === "ready" && r.progress.read >= 1).length;

  return React.createElement("div", { className: "home-shell" },
    React.createElement(TimelineRail, { readings: all, onOpen }),
    React.createElement("div", { className: "home-main" },
      React.createElement("header", { className: "greet" },
        React.createElement("div", null,
          React.createElement("h1", null, "안녕하세요. 오늘 읽을 것을 꺼내 두었습니다."),
          React.createElement("p", { className: "sub" },
            "수업 날짜 순서대로 읽고, 정리와 퀴즈, 교수님 질문 대비까지 한 흐름으로 이어 갑니다.")
        ),
        React.createElement("div", { className: "greet-stats" },
          React.createElement("div", null,
            React.createElement("p", { className: "greet-stat-k" }, "이번 학기"),
            React.createElement("p", { className: "greet-stat-v" },
              all.length, React.createElement("small", null, "개 읽기"))
          ),
          React.createElement("div", null,
            React.createElement("p", { className: "greet-stat-k" }, "공개됨"),
            React.createElement("p", { className: "greet-stat-v" },
              readyCount, React.createElement("small", null, "개"))
          ),
          React.createElement("div", null,
            React.createElement("p", { className: "greet-stat-k" }, "완독"),
            React.createElement("p", { className: "greet-stat-v" },
              doneCount, React.createElement("small", null, "개"))
          )
        )
      ),
      React.createElement(HeroThisWeek, { reading: current, onOpen }),
      React.createElement("section", null,
        React.createElement("div", { className: "section-head" },
          React.createElement("h3", null, "전체 읽기"),
          React.createElement("span", { className: "count" }, `${filtered.length} / ${all.length}`)
        ),
        React.createElement("div", { className: "filter-row" },
          React.createElement("input", {
            className: "filter-search",
            placeholder: "제목, 저자, 태그로 검색",
            value: q,
            onChange: (e) => setQ(e.target.value),
          }),
          ...[
            ["all", "전체"],
            ["textbook", "교재"],
            ["english", "영어 리딩"],
          ].map(([k, label]) =>
            React.createElement("button", {
              key: k,
              className: `filter-chip ${filter === k ? "is-active" : ""}`,
              onClick: () => setFilter(k),
            }, label)
          )
        ),
        React.createElement("div", { className: "reading-grid" },
          filtered.map((r) =>
            React.createElement(ReadingCard, { key: r.slug, reading: r, onOpen })
          )
        )
      )
    )
  );
}

Object.assign(window, { Home });
