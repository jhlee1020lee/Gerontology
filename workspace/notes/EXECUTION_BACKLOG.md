# Execution Backlog

Date: 2026-04-07
Status: current working backlog for repository stabilization and quality recovery

## Purpose

- Convert the recent project review into an actionable backlog.
- Keep task size intentionally small because large passes reduce quality and increase approval noise.
- Separate policy cleanup, build/validation fixes, UX cleanup, media-policy fixes, and content-quality work so they do not get mixed into one weak batch.
- Treat this file as the current execution backlog.
- If this file conflicts with detailed normative policy, follow `CONTENT_RULES.md` and then update this backlog.

## Current Baseline

- Inventory: `27` readings
- Fully approved readings: `6`
- Remaining readings needing review or completion: `21`
- Known critical risks:
  - Generated/site-facing text encoding corruption
  - Stage model mismatch between docs and code
  - Deploy HTML still linking to `source_pdfs/` in many cases
  - Build order causing validation to lag one run behind
  - Reading approval and landing/video status mixed together
  - Structural validation stronger than before, but still too weak for benchmark-level quality

## Non-Negotiable Execution Rules

- Default unit of work for reading content remains `1 reading x 1 stage x 1 pass`.
- Default unit of work for Stage 3 remains `1 page family x 1 pass`.
- Default unit of work for docs remains `1 file x 1 section`.
- Default unit of work for code remains `1 task = 1 pass = 1 PR`.
- Code changes should stay within `2 functions` or roughly `120 LOC` when possible.
- Metadata audit should stay within `3 to 6 readings x 1 field`.
- QA should use a fixed representative sample before any broad rebuild:
  - `hulur-et-al-2019`
  - `park-mcdonough-2013`
  - `ch01-gerontology`
  - `ch05-gerontology`
  - one locked reading card such as `ch02-gerontology`
- Do not combine policy rewrite, pipeline refactor, and UI cleanup in the same pass.
- Do not rebuild all reading content as part of documentation or pipeline cleanup.
- Do not touch `docs/` by hand for UX/content corrections; update generators/templates and rebuild.

## Hard Stop Rules

- Stop if a pass begins to modify more than one workstream.
- Stop if a code pass needs more than `2 functions` to stay coherent.
- Stop if a metadata pass touches more than `6` readings.
- Stop if a QA pass tries to validate more than the representative sample plus one target reading.
- Stop if a Stage 1 or Stage 2 pass becomes "finish the whole reading" instead of "finish one contiguous pass".

## Workstream Index

- `RB`: release blockers and stability
- `DG`: documentation and governance
- `BP`: build and validation pipeline
- `WG`: reading operations and approval workflow
- `UX`: site UX and information architecture
- `MD`: PDF, video, image, and media policy
- `CQ`: benchmark quality and content QA

---

## RB. Release Blockers And Stability

These tasks should be handled before wider feature work.

| ID | Priority | Scope | Why | Depends On | Done Criteria | Recommended Batch |
| --- | --- | --- | --- | --- | --- | --- |
| RB-01 | P0 | Confirm whether mojibake seen in generated HTML is a real file/output problem or only shell-display noise. Check `docs/index.html`, one approved reading, one partial reading. | Encoding corruption is potentially release-blocking. | none | Browser or file-level verification concludes `real corruption` or `display-only`; result written to backlog notes or issue log. | `3 files x 1 verification pass` |
| RB-02 | P0 | Add a generated-site smoke check for expected Korean strings in representative HTML files. | Encoding risk should fail fast before shipping. | RB-01 | Smoke check exists and fails when representative Korean strings are corrupted. | `1 script or 1 check path` |
| RB-03 | P0 | Define representative QA fixture set for all later work. | Prevents broad, unfocused QA. | none | One fixed sample list is reused in docs, UX, media, and pipeline work. | `5 readings x 1 note` |
| RB-04 | P1 | Add a short release-gate note describing mandatory checks before calling a reading or build "safe". | Approval signals are currently overloaded. | RB-01, RB-02, RB-03 | Gate includes encoding, canonical links, artifact existence, and representative UI checks. | `1 short checklist` |

---

## DG. Documentation And Governance

Documentation tasks only. No code refactors in this block.

| ID | Priority | Scope | Why | Depends On | Done Criteria | Recommended Batch |
| --- | --- | --- | --- | --- | --- | --- |
| DG-01 | P0 | Align top-of-file role statements in `CONTENT_RULES.md`, `AGENTS.md`, and `README.md`. | Document hierarchy exists, but drift is growing. | none | All three files say the same thing about authority, summary role, and conflict resolution. | `1 file x top 10-15 lines` |
| DG-02 | P0 | Add a status and terminology glossary to `CONTENT_RULES.md`: `reading_status`, `stage1_status`, `stage2_status`, `stage3_status`, `page_status`, `landing_video_status`, `lecture_workflow_status`. | Status names are overloaded and currently ambiguous. | DG-01 | Each term has definition, allowed values, and banned ambiguous aliases. | `3-4 terms per pass` |
| DG-03 | P0 | Explicitly define `partial`, `manual_review_required`, `approved`, `blocked`, and when not to use them. | Current docs list values but do not operationalize them enough. | DG-02 | Each status has "use when", "do not use when", and one example. | `1 status per pass` |
| DG-04 | P0 | Document promotion path `schema_pass -> manual_review_required -> approved` and reviewer checklist. | Approval is under-specified. | DG-02, DG-03 | Stage 1, Stage 2, and Stage 3 each have a manual review checklist. | `1 stage per pass` |
| DG-05 | P0 | Rename lecture-bundle `workflow_status` concept in docs to `lecture_workflow_status`. | Reading approval and lecture workflow should not share one name. | DG-02 | Doc wording is consistent across lecture sections. | `1 section` |
| DG-06 | P0 | Define the approval-report contract in docs: required columns, meanings, labels, and sort order. | Approval report is currently legacy-shaped. | DG-02, DG-03, DG-04, DG-05 | Report contract explicitly uses `reading`, `stage1`, `stage2`, `stage3`, `landing/video`. | `1 section` |
| DG-07 | P0 | Shrink `AGENTS.md` into a real execution summary with links instead of restating detailed policy. | `AGENTS.md` currently behaves like a second source-of-truth. | DG-01, DG-02, DG-06 | `AGENTS.md` becomes shorter and points to anchors in `CONTENT_RULES.md`. | `1 section at a time` |
| DG-08 | P0 | Reduce policy restatement in `README.md` and keep it focused on onboarding. | Onboarding doc should not redefine governance. | DG-01, DG-02, DG-06 | `README.md` keeps structure, commands, and links, but not detailed acceptance logic. | `1 small subsection` |
| DG-09 | P1 | Mark `workspace/ops/Plan.md` as legacy / archival / non-authoritative at the top. | It conflicts with one-reading-at-a-time policy. | DG-01 | First lines clearly mark it non-normative. | `1 header pass` |
| DG-10 | P1 | Mark `workspace/ops/Status.md` as historical log only and annotate legacy thresholds. | Historical rules are too easy to misread as current rules. | DG-01 | Old thresholds are clearly labeled as historical snapshots. | `1 header + 1 note pass` |
| DG-11 | P1 | Add legend/explanation block to `APPROVAL_STATUS.md`. | The report should explain itself. | DG-06 | Columns and meanings are explained directly above the table. | `top 10 lines` |
| DG-12 | P1 | Clarify homepage governance versus chatbot/secondary UI. | "Clean reading dashboard" rule is directionally right but not concrete enough. | DG-01, DG-02 | Docs say whether chatbot/search/hidden metadata are allowed and under what constraints. | `1 rule pair` |
| DG-13 | P1 | Audit document wording for `전체 글` vs `전체`, `교수님 구술 대비` vs `professor-prep`, and Stage/status terms. | Same word currently means different things in different files. | DG-02, DG-06, DG-07, DG-08, DG-11 | Terminology is consistent across current docs. | `1 term pair per pass` |
| DG-14 | P2 | Add change-management rule: when policy changes, which docs must be updated in the same pass. | Prevent future drift. | DG-07, DG-08, DG-11 | One short maintenance rule is present. | `1 short rule` |
| DG-15 | P2 | Add a collaborator mini-playbook to `AGENTS.md` or `README.md`: `1 reading x 1 stage x 1 pass` in practical steps. | The rules are strong, but practical execution is not instantly visible. | DG-07, DG-08 | A new collaborator can follow a short 5-7 step checklist. | `1 checklist` |

---

## BP. Build And Validation Pipeline

These tasks should be handled in very small code passes. Prefer one pass per task.

| ID | Priority | Scope | Why | Depends On | Done Criteria | Recommended Batch |
| --- | --- | --- | --- | --- | --- | --- |
| BP-01 | P0 | Add one central stage-definition block in the validator/build path. | Current code does not match documented stage semantics. | none | Stage definitions are centralized and reused. | `1 constant block + 1 reference` |
| BP-02 | P0 | Add explicit `stage3` to `buildValidationSnapshot`. | Stage 3 is currently not a first-class status in code. | BP-01 | Snapshot contains `stage1`, `stage2`, `stage3`, `landing`, and `reading`. | `1 snapshot path` |
| BP-03 | P0 | Make `translation` count toward Stage 2, not Stage 1, for English readings. | Align code with docs. | BP-01, BP-02 | English reading stage mapping matches docs. | `1 calculation rule` |
| BP-04 | P0 | Separate reading approval from landing/video approval in aggregate status logic. | Optional video should not sink reading approval. | BP-01, BP-02, BP-03 | Reading can be `approved` while landing/video remains a separate non-blocking state. | `1 aggregator function` |
| BP-05 | P0 | Reorder full build flow to `build artifacts -> validate -> write meta/report`. | Current order causes one-run lag. | BP-02, BP-04 | One build run is enough to converge latest artifact status. | `1 build entry path` |
| BP-06 | P0 | Apply the same ordering fix to `--slug` mode. | Slug builds currently suffer from the same stale validation issue. | BP-05 | One slug build converges target status. | `1 slug path` |
| BP-07 | P0 | Split prebuild meta seeding from postbuild status writeback. | `ensureContentPlaceholders` is doing too much and causing churn. | BP-05, BP-06 | Build-before state writes only minimal seed; final status writes happen postbuild. | `1 helper split` |
| BP-08 | P1 | Move `requireBuiltArtifacts` control out of generated `meta.json` and into CLI/config. | Validation policy should not depend on previous generated state. | BP-05 | Clean checkout and current repo use the same explicit control. | `1 option path` |
| BP-09 | P1 | Define the allowed output scope of `--slug` mode. | Incremental builds are currently not truly incremental. | BP-06, BP-07 | Code clearly defines what slug mode may update. | `1 scope table + 1 filter` |
| BP-10 | P1 | Make slug mode skip `docs/index.html`, chatbot corpus, and approval report by default. Add explicit opt-in if needed. | One-reading work should not cause global churn by default. | BP-09 | Slug build changes only target reading files unless opt-in is requested. | `1 global output at a time` |
| BP-11 | P1 | Prevent slug mode from writing non-target `content/readings/*/meta.json`. | Current diff noise makes review and trust harder. | BP-07, BP-09, BP-10 | Slug build diff contains no unrelated meta files. | `1 write filter` |
| BP-12 | P1 | Expand artifact validation categories: HTML, public PDF, video, copied assets, hub links. | Current validation is too shallow. | BP-05 | Validator reports artifact failures by category, not as one vague result. | `1 category per pass` |
| BP-13 | P1 | Add validation for markdown asset targets and generated relative links. | Broken images and links matter to quality and deployability. | BP-12 | Missing asset files and broken hub/tab links are caught. | `1 asset rule + 1 link rule` |
| BP-14 | P1 | Redesign approval report generation to include `Stage 3` and separate `Landing/Video`. | Current report reflects outdated stage semantics. | BP-02, BP-04 | Report contract and generated report both reflect the new model. | `report schema 1 pass` |
| BP-15 | P0 | Add smoke/regression scenarios: one-build PDF convergence, slug no-unrelated-diff, approval report stage alignment. | Prevent repeat of current failure modes. | BP-05, BP-06, BP-10, BP-11, BP-14 | At least three repeatable checks exist and are documented. | `1 scenario per pass` |

---

## WG. Reading Operations And Approval Workflow

These are operational rules and templates, not site features.

| ID | Priority | Scope | Why | Depends On | Done Criteria | Recommended Batch |
| --- | --- | --- | --- | --- | --- | --- |
| WG-01 | P0 | Rebuild the status dictionary for operations: `partial`, `manual_review_required`, `approved`, `blocked`, plus optional candidate values such as `landing_pending` or `revalidate_required`. | `partial` currently carries too many meanings. | DG-02, DG-03 | One operational table maps each status to real usage. | `3 statuses per pass` |
| WG-02 | P0 | Fix stage handoff rules: when Stage 2 may start, when Stage 3 may start, and when it may not. | Prevents drifting into large-batch multitask work. | WG-01 | Handoff rules exist in one short operational section. | `1 stage boundary per pass` |
| WG-03 | P0 | Create pass stop-condition cards for Stage 1, Stage 2, and Stage 3. | Teams need a concrete "stop and review now" trigger. | WG-02 | Each stage has a short card for continue/review/rework decisions. | `1 card per pass` |
| WG-04 | P0 | Standardize the manual-review submission packet. | Approval quality depends on reviewer context. | WG-03 | Review request template includes slug, stage/pass, changed pages, risks, build mode, screenshots, open questions. | `1 review template` |
| WG-05 | P0 | Standardize manual-review decision logs: `approve`, `rework`, `block`, `defer`. | Current review traces are too thin. | WG-04 | One structured log format exists with reason and affected pages. | `1 decision type per pass` |
| WG-06 | P0 | Separate reading-package completion from landing/video completion in weekly operations. | Current reporting mixes them and causes misreads. | WG-01, WG-02 | Weekly status can clearly show "reading complete, landing pending". | `2 status combinations per pass` |
| WG-07 | P1 | Set WIP limit: default active work stays at `1 reading x 1 stage x 1 pass`; at most one queued reading. | Lowers context and approval debt. | WG-02 | Operations board can be explained with `active`, `review`, `queued`. | `1 WIP rule` |
| WG-08 | P1 | Define when to use slug build vs full build operationally. | Build modes must map to workflow stages. | BP-06, BP-10, WG-07 | Writing phase uses slug builds; scheduled approval phase uses full build and report. | `1 command rule set` |
| WG-09 | P1 | Create a weekly operating rhythm: selection, authoring passes, review, approve/rework, full-check. | Policies exist, but cadence is not explicit enough. | WG-07, WG-08 | One sample week plan exists and caps approvals to `1-2` readings per week. | `1 weekly template` |
| WG-10 | P1 | Define revalidation triggers: validator changes, shared bundle changes, media-policy changes, stage-model changes. | Old approvals can become stale. | WG-01, WG-08 | One trigger table maps change types to revalidation scope. | `1 trigger family per pass` |
| WG-11 | P2 | Re-audit existing 27 readings against the new status model, beginning with approved readings first. | New rules are useless if old states remain dirty. | WG-01 through WG-10 | Each reading is marked `keep`, `re-review`, or `status-fix required`. | `approved 1 reading` or `partial 2 readings` |

---

## UX. Site UX And Information Architecture

All UX work should change generators/templates, not hand-edited `docs/`.

| ID | Priority | Scope | Why | Depends On | Done Criteria | Recommended Batch |
| --- | --- | --- | --- | --- | --- | --- |
| UX-00 | P0 | Lock the representative UX sample set and checklist. | UX changes need consistent verification targets. | RB-03 | Sample list and test checklist are fixed. | `5 readings x 1 QA note` |
| UX-01 | P0 | Make homepage ready-card destination canonical: recommended rule is all ready cards open `readings/<slug>/index.html`. | Current IA is inconsistent. | UX-00 | No ready card goes straight to `full.html` by default. | `1 link rule` |
| UX-02 | P0 | Align homepage card state labels with real entry behavior. Start with `ready` and `locked` only. | State language and click result must match. | UX-01 | Ready cards always open a coherent entry point; locked cards always gate cleanly. | `1 state rule` |
| UX-03 | P1 | Align homepage footer copy and color semantics with real status. | Visual trust matters. | UX-02 | Sample cards show no mismatch between color, copy, and click behavior. | `1 footer block` |
| UX-04 | P0 | Add a top summary block to reading hub showing what is currently available: video, full, translation, professor-prep, study pages. | Hub should work as a hub even when not everything exists. | UX-01 | A user can tell what is usable from the top of hub page. | `1 module` |
| UX-05 | P0 | For video-missing hubs, add fallback CTA near top to `전체 글`, `한국어 번역`, or `교수님 구술 대비`. | Avoid dead-end hub experience. | UX-04, BP-04, MD-06 | Video-missing readings still have a useful hub landing. | `1 no-video state` |
| UX-06 | P1 | On desktop, expose 3-4 core study pages without hiding them all behind overflow. | Study pages are not edge actions. | UX-04 | Core study pages are directly discoverable on desktop. | `1 desktop nav layout` |
| UX-07 | P1 | On mobile, keep overflow but improve active-state clarity and grouping. | Desktop fix should not break mobile. | UX-06 | Mobile tabs remain legible and current page is obvious. | `1 mobile overflow pass` |
| UX-08 | P1 | Render homepage search box using existing JS wiring. | Search logic exists in JS but not in HTML. | UX-00 | Search box is visible and filters cards. | `1 control wrapper + 1 input` |
| UX-09 | P1 | Add homepage type filter. | Small, high-value discoverability improvement. | UX-08 | Type filter works while preserving syllabus order. | `1 filter` |
| UX-10 | P2 | Add homepage tag filter and empty-state panel. | Complete the existing feature path cleanly. | UX-08 | Tag filter and empty state both behave correctly. | `1 filter` or `1 panel` |
| UX-11 | P1 | Mount `data-reader-root` and `data-article-body` in article templates. | Reader JS features are currently disconnected from DOM. | UX-00 | Representative article pages contain required hooks. | `2 hooks` |
| UX-12 | P1 | Render reader toolbar with bookmark and resume controls only. | High value, small scope. | UX-11 | Bookmark and resume work with existing localStorage logic. | `1 toolbar block` |
| UX-13 | P2 | Add TOC and important-headings panel to article templates. | Existing study-support JS is otherwise invisible. | UX-11 | TOC and important list both render and update. | `1 side panel pair` |
| UX-14 | P2 | Mount `data-prep-root` and difficult-card support on `professor-prep` template. | Oral-practice page should support repeated study. | UX-11 | Difficult-card support appears and updates in-page. | `1 prep support block` |
| UX-15 | P0 | Run representative QA after each UX cluster, on desktop and mobile. | UX regressions are easy to miss when states vary widely. | UX-00 plus target changes | Sample QA confirms no dead-end entry path and no state contradiction. | `5 readings x 2 viewport` |

---

## MD. PDF, Video, Image, And Media Policy

These tasks should be split even more carefully than normal because policy, data, build logic, and validation all interact.

| ID | Priority | Scope | Why | Depends On | Done Criteria | Recommended Batch |
| --- | --- | --- | --- | --- | --- | --- |
| MD-01 | P0 | Define PDF visibility states in docs: `public`, `local_only`, `private`, `none`. | `public_pdf: null` is doing too much work today. | DG-02 | States and examples are documented. | `1 concept block` |
| MD-02 | P0 | Document rule: deploy HTML must never directly link to `source_pdfs/`. | Current generated HTML violates deploy boundary. | MD-01 | Docs state the rule clearly and consistently. | `1 rule in 2 docs` |
| MD-03 | P0 | Redefine meaning of `public_pdf`: only used when PDF visibility is `public`. | Clarifies field semantics. | MD-01 | Truth table exists in docs or schema notes. | `1 truth table` |
| MD-04 | P0 | Define landing video policy: `optional` vs `required`. | Current docs and validation disagree. | DG-02 | Policy values and meanings are documented. | `1 policy block` |
| MD-05 | P1 | Define figure applicability: `required`, `decorative_only`, `none`. | "Where applicable" is too vague for automation. | DG-02 | Applicability values and examples are documented. | `1 policy block` |
| MD-06 | P0 | Define relation between optional media and approval state. | Optional media should not create blocking approval failure. | MD-04, MD-05 | Docs say exactly when media omission is warning vs blocking. | `1 rule block` |
| MD-07 | P0 | Add `pdf_visibility` to reading data contract. | Policy needs explicit data. | MD-01 | Field exists in manifest/schema contract. | `1 field pass` |
| MD-08 | P0 | Add `landing_video_policy` to reading data contract. | Needed for rendering and validation. | MD-04 | Field exists in canonical source. | `1 field pass` |
| MD-09 | P1 | Add `figure_applicability` to reading data contract. | Needed for image-aware validation. | MD-05 | Field exists in canonical source. | `1 field pass` |
| MD-10 | P0 | Decide and document media source-of-truth: manifest-centered or reading-meta-centered. | Current merge behavior is ambiguous. | MD-07, MD-08, MD-09 | One canonical source is explicitly chosen. | `1 design decision` |
| MD-11 | P0 | Update `normalizeReading()` to read new media fields from canonical source only. | Prevent implicit/local behavior from overriding policy. | MD-07, MD-08, MD-09, MD-10 | New fields appear consistently in normalized reading object. | `1 function x 3 fields` |
| MD-12 | P0 | Remove `source_pdfs` fallback from `pdfHref()`. | This is the core deploy-boundary bug. | MD-02, MD-11 | Generated HTML no longer contains `source_pdfs/` PDF actions. | `1 function x 1 rule` |
| MD-13 | P0 | Render PDF buttons only for `pdf_visibility=public`. | UI should reflect public deployability. | MD-12 | Non-public readings show no public PDF button. | `1 render function` |
| MD-14 | P1 | If local-only PDF access is still needed, isolate it to dev-only tooling rather than deploy HTML. | Keep developer convenience separate from public behavior. | MD-12, MD-13 | Local-only path is either removed or fully separated. | `1 decision + 1 helper` |
| MD-15 | P0 | Make public PDF copying conditional on explicit public visibility. | Copy behavior must match UI behavior. | MD-07, MD-11 | Only public readings copy into `docs/pdfs/`. | `1 function` |
| MD-16 | P0 | Make landing placeholder copy neutral and policy-consistent for optional video cases. | Avoid making optional enhancement look like a schema failure to users. | MD-04, MD-06 | Optional-video readings use non-failing copy. | `1 template text pass` |
| MD-17 | P0 | Reorder media copy and snapshot calculation so one build is enough after adding PDF/video. | Fixes stale artifact validation. | BP-05, MD-15 | One build run converges latest media status. | `1 build path` |
| MD-18 | P1 | Make video copy/render logic honor explicit policy rather than local file detection alone. | Policy should win over incidental local files. | MD-08, MD-10, MD-11 | Video behavior is policy-driven. | `1 function or 1 branch` |
| MD-19 | P1 | Pass `figure_applicability` into render/validation context. | Needed for figure-aware rules. | MD-09, MD-11 | Render and validator can see applicability state. | `1 data path` |
| MD-20 | P0 | Update artifact validator so public PDF is required only when visibility is `public`. | Prevent false failures. | MD-07, MD-15 | Non-public readings are not flagged for missing public PDFs. | `1 validator rule` |
| MD-21 | P0 | Update landing/video validator so optional video is warning or non-blocking state. | Remove current policy contradiction. | MD-08, MD-16, MD-18 | Optional-video readings are no longer schema-fail blockers. | `1 validator rule` |
| MD-22 | P1 | Add full-page image requirement when `figure_applicability=required`. | Figure-rich readings need stronger checks. | MD-09, MD-19 | `full.md` without required images fails. | `1 validator rule` |
| MD-23 | P1 | Add parity check between `full.md` and `translation.md` image usage for English readings when required. | Translation must preserve figures too. | MD-22 | Image count/order mismatch is caught. | `1 validator rule` |
| MD-24 | P1 | Add exceptions for `decorative_only` and `none` plus media metrics. | Avoid over-failing legitimate no-figure readings. | MD-05, MD-22, MD-23 | Required/no-figure cases are distinguished correctly. | `1 exception rule family` |
| MD-25 | P0 | Audit all 27 readings for `pdf_visibility`. | Policy change must become data. | MD-07 | All readings are classified. | `6 readings x 1 field` |
| MD-26 | P0 | Audit all 27 readings for `landing_video_policy`. | Needed before validator change is safe. | MD-08 | All readings are classified. | `6 readings x 1 field` |
| MD-27 | P1 | Audit all 27 readings for `figure_applicability`. | Needed before figure validation is safe. | MD-09 | All readings are classified. | `4 readings x 1 field` |
| MD-28 | P0 | Patch manifest/meta values based on the audits in small groups. | Data migration must be controlled. | MD-25, MD-26, MD-27 | Target readings contain the new media fields. | `3 readings x 1 field pass` |
| MD-29 | P0 | Rebuild and verify zero `source_pdfs/` references remain in deploy HTML. | Confirms deploy-boundary fix actually landed. | MD-12, MD-13, MD-28 | Grep count is `0`. | `1 rebuild x 1 grep` |
| MD-30 | P1 | Run manual spot-checks on representative media cases: figure-rich, no-figure, video-present, video-missing. | Confirms policy, render, and validation match real pages. | MD-29 | Representative readings behave as expected. | `1 reading x 1 scenario` |

---

## CQ. Benchmark Quality And Content QA

These tasks define "good enough" beyond counts and schemas.

| ID | Priority | Scope | Why | Depends On | Done Criteria | Recommended Batch |
| --- | --- | --- | --- | --- | --- | --- |
| CQ-01 | P0 | Formalize Stage 1 benchmark from `hulur-et-al-2019`: structure, section preservation, figure/table insertion, captions, readable flow. | Benchmark exists socially but not operationally. | none | At least 10 observable criteria are written down. | `1 reading x full only` |
| CQ-02 | P0 | Formalize Stage 2 benchmark from `hulur-et-al-2019`: section alignment, figure parity, translation fidelity, tone/term consistency. | Translation quality needs better anchors than length ratios. | CQ-01 | At least 10 observable translation criteria are written down. | `1 reading x translation only` |
| CQ-03 | P0 | Formalize Stage 3 `summary` benchmark from `hulur-et-al-2019`. | Summary is the only allowed compression page and needs a clear bar. | none | Minimum structure and banned patterns are documented. | `1 reading x summary only` |
| CQ-04 | P1 | Formalize `concepts` benchmark. | Concepts can pass structurally while being shallow. | none | Required concept fields and explanation shape are documented. | `1 reading x concepts only` |
| CQ-05 | P1 | Formalize `professor-prep` benchmark from `hulur-et-al-2019`. | Card counts alone do not guarantee quality. | none | Title style, answer structure, specificity, and directness criteria are documented. | `1 reading x professor-prep only` |
| CQ-06 | P0 | Build a placeholder/boilerplate phrase inventory from current content and published pages. | Needed to catch fake-complete pages. | none | Placeholder phrase families are categorized. | `1 phrase family per pass` |
| CQ-07 | P0 | Convert placeholder inventory into page-family-specific allow/deny rules. | Placeholder on `index` is not the same as placeholder on `full`. | CQ-06 | Each page family has its own allow/deny list. | `1 page family per pass` |
| CQ-08 | P0 | Define contradiction rule: `approved` published page cannot still be placeholder. | Current meta and public pages can disagree. | CQ-07 | One explicit QA rule and any narrow exceptions are documented. | `1 contradiction rule` |
| CQ-09 | P0 | Extend `summary` quality threshold beyond structure and counts. | Avoid templated but technically valid summaries. | CQ-03, CQ-06 | Threshold includes unique claims, evidence anchors, and non-template requirements. | `1 page-family threshold` |
| CQ-10 | P0 | Extend `concepts` quality threshold beyond count. | Concepts need completeness and contextual value. | CQ-04, CQ-06 | Threshold requires concept name, English term, exact definition, student explanation, relevance, confusion point. | `1 page-family threshold` |
| CQ-11 | P1 | Define `pitfalls` quality threshold. | Pitfalls can degrade into generic bullet lists. | CQ-06 | Threshold requires misconception/correction pairs with text-grounded distinction. | `1 page-family threshold` |
| CQ-12 | P1 | Define `review-sheet` quality threshold. | Review sheet can become summary copy-paste. | CQ-06 | Threshold requires compression, exam usefulness, and low redundancy. | `1 page-family threshold` |
| CQ-13 | P0 | Define `professor-prep` threshold beyond 15 cards. | Need to detect weak but count-complete answer sets. | CQ-05, CQ-06 | Threshold includes title uniqueness, direct answer, at least one concrete anchor, filler ban. | `1 page-family threshold` |
| CQ-14 | P1 | Define `quiz-ox` threshold. | OX questions are easy to mass-produce badly. | none | Threshold covers evidence grounding, balance, and explanation quality. | `1 page-family threshold` |
| CQ-15 | P1 | Define `quiz-short` threshold. | Short-answer often drifts into mini-essays or range answers. | none | Threshold enforces true short-answer shapes and answer-format rules. | `1 page-family threshold` |
| CQ-16 | P1 | Define `quiz-mcq` threshold. | MCQ distractor quality matters. | none | Threshold covers plausible distractors, balance, and text-grounded explanations. | `1 page-family threshold` |
| CQ-17 | P0 | Lock regression core set: `hulur-et-al-2019`, `park-mcdonough-2013`, `ch01-gerontology`. | Need excellent, acceptable-minimum, and known-partial examples. | none | Regression set and role of each reading are documented. | `1 reading at a time` |
| CQ-18 | P0 | Build expected-results matrix for regression set by page family: `pass`, `fail`, `warning expected`. | Makes regression review concrete. | CQ-08, CQ-09 through CQ-16, CQ-17 | A reading x page-family matrix exists. | `1 page family per pass` |
| CQ-19 | P0 | Calibrate thresholds against regression set and record false positives/negatives. | Thresholds will be wrong on first draft unless calibrated. | CQ-18 | One calibration memo exists with adjustments. | `1 reading x 1 page family` |
| CQ-20 | P1 | Define final content QA release gate before moving to next reading. | Prevents fast-but-thin progression. | CQ-19, WG-03 | One operational QA sequence is documented. | `1 rule set` |

---

## Suggested Execution Order

### Phase 0. Confirm blockers before changing behavior

- `RB-01`
- `RB-03`
- `DG-01`
- `DG-02`
- `DG-03`

### Phase 1. Fix governance and state meaning first

- `DG-04`
- `DG-05`
- `DG-06`
- `WG-01`
- `WG-02`
- `WG-03`
- `WG-06`

### Phase 2. Fix build/status model before wider data migration

- `BP-01`
- `BP-02`
- `BP-03`
- `BP-04`
- `BP-05`
- `BP-06`
- `BP-07`
- `BP-15`

### Phase 3. Fix media/public-deploy boundaries

- `MD-01`
- `MD-02`
- `MD-03`
- `MD-04`
- `MD-06`
- `MD-07`
- `MD-08`
- `MD-10`
- `MD-11`
- `MD-12`
- `MD-13`
- `MD-15`
- `MD-17`
- `MD-20`
- `MD-21`

### Phase 4. Improve operations and reporting

- `WG-04`
- `WG-05`
- `WG-07`
- `WG-08`
- `WG-09`
- `WG-10`
- `BP-08`
- `BP-09`
- `BP-10`
- `BP-11`
- `BP-14`
- `DG-11`

### Phase 5. Improve UX once state semantics are stable

- `UX-00`
- `UX-01`
- `UX-02`
- `UX-04`
- `UX-05`
- `UX-15`
- `UX-06`
- `UX-07`
- `UX-08`
- `UX-09`
- `UX-10`
- `UX-11`
- `UX-12`
- `UX-13`
- `UX-14`

### Phase 6. Improve benchmark quality and stronger QA

- `CQ-01`
- `CQ-02`
- `CQ-03`
- `CQ-06`
- `CQ-07`
- `CQ-08`
- `CQ-09` through `CQ-16`
- `CQ-17`
- `CQ-18`
- `CQ-19`
- `CQ-20`

### Phase 7. Migrate and audit data carefully

- `MD-05`
- `MD-09`
- `MD-18`
- `MD-19`
- `MD-22`
- `MD-23`
- `MD-24`
- `MD-25`
- `MD-26`
- `MD-27`
- `MD-28`
- `MD-29`
- `MD-30`
- `WG-11`

---

## First Ten Tasks To Start With

If the goal is "highest impact with lowest batch size," start here:

1. `RB-01` real-vs-display encoding confirmation
2. `DG-01` doc hierarchy alignment
3. `DG-02` status/term glossary
4. `DG-03` status definitions
5. `WG-01` operations status dictionary
6. `BP-01` central stage definition
7. `BP-02` explicit stage3 in snapshot
8. `BP-04` separate landing/video from reading approval
9. `MD-12` remove `source_pdfs` fallback
10. `BP-05` reorder build/validation/writeback

## Explicitly Avoid These Large Batches

- Do not rewrite `CONTENT_RULES.md`, `AGENTS.md`, and `README.md` in one pass.
- Do not fix Stage model, approval report, and slug-build scope in one code pass.
- Do not migrate all 27 readings for three new media fields in one pass.
- Do not rebuild all Stage 3 quality thresholds before defining regression samples.
- Do not combine homepage IA cleanup with reader-toolbar rollout in one pass.
- Do not touch `docs/` manually while also changing generators.

## Suggested Tracking Format

Use one line per task in future logs:

`[ID] status | owner | scope | last pass date | next smallest pass | blockers`

Example:

`[BP-05] in_progress | build | reorder full build flow only | 2026-04-08 | patch writeback after artifacts | waiting on BP-04`
