import { useEffect } from "react";
import { portfolioProjects, type PortfolioProject } from "../data/portfolioProjects";
import { SCENE_COUNT, SCENE_LABELS, useExperience } from "../state/experience";

const num = (n: number) => String(n + 1).padStart(2, "0");

/* ------------------------------------------------------------------ */
/*  Per-scene copy — short on screen, everything else in CASE STUDY    */
/* ------------------------------------------------------------------ */

function sceneCopy(p: PortfolioProject, scene: number) {
  switch (scene) {
    case 0:
      return { head: p.story.intro, body: p.subtitle };
    case 1:
      return { head: p.story.challengeCopy, body: p.challenge };
    case 2:
      return { head: p.story.approachCopy, body: p.description };
    case 3:
      return { head: p.story.outputCopy, body: "" };
    default:
      return { head: p.story.resultCopy, body: "" };
  }
}

/* ------------------------------------------------------------------ */

export function Overlay() {
  const {
    mode,
    index,
    scene,
    phase,
    hovered,
    caseOpen,
    infoOpen,
    openBook,
    closeBook,
    next,
    prev,
    goScene,
    setCaseOpen,
    setInfoOpen,
  } = useExperience();

  const project = portfolioProjects[index];
  const preview = portfolioProjects[hovered ?? index];
  const reading = mode === "reading";
  const busy = phase !== "idle";
  const copy = sceneCopy(project, scene);

  /* keyboard + wheel paging */
  useEffect(() => {
    let lock = 0;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (caseOpen) return setCaseOpen(false);
        if (infoOpen) return setInfoOpen(false);
        if (reading) closeBook();
        return;
      }
      if (!reading || caseOpen || infoOpen) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    const wheel = (e: WheelEvent) => {
      if (!reading || caseOpen || infoOpen) return;
      const now = performance.now();
      if (now - lock < 900) return;
      if (Math.abs(e.deltaY) < 28) return;
      lock = now;
      if (e.deltaY > 0) next();
      else prev();
    };
    window.addEventListener("keydown", key);
    window.addEventListener("wheel", wheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("wheel", wheel);
    };
  }, [reading, caseOpen, infoOpen, next, prev, closeBook, setCaseOpen, setInfoOpen]);

  return (
    <>
      <div className="ui">
        <header className="top">
          <div className="mark">
            <b>ANYWARE ARCHIVE</b>
            <span>事業を編集する。</span>
            {reading && (
              <div className="projectTag">
                <b>{project.title}</b>
                <span>
                  {project.clientLabel} — {project.industry}
                </span>
                <span>{project.year}</span>
              </div>
            )}
          </div>
          <div className="topRight">
            {reading && (
              <button className="chip" data-on={caseOpen} onClick={() => setCaseOpen(!caseOpen)}>
                Case Study
              </button>
            )}
            <button className="chip" data-on={infoOpen} onClick={() => setInfoOpen(!infoOpen)}>
              Info
            </button>
            {reading && (
              <button className="chip" onClick={closeBook} disabled={busy}>
                Shelf
              </button>
            )}
          </div>
        </header>

        <div />

        {reading ? (
          <div className="read">
            <div className="caption" key={`${project.id}-${scene}`}>
              <div className="eyebrow">
                <s />
                SCENE {num(scene)} — {SCENE_LABELS[scene]}
              </div>
              <h2>{copy.head}</h2>
              {copy.body && <p>{copy.body}</p>}

              {scene === 2 && (
                <div className="tags">
                  {project.approach.map((a) => (
                    <span className="tag" key={a}>
                      {a}
                    </span>
                  ))}
                </div>
              )}

              {scene === 3 && (
                <div className="tags">
                  {project.outputs.map((o) => (
                    <span className="tag" key={o.label}>
                      {o.label}
                    </span>
                  ))}
                </div>
              )}

              {scene === 4 && (
                <div className="figures">
                  {project.results.map((r) => (
                    <div className="figure" data-quiet={!r.value} key={r.label}>
                      {r.value && <b>{r.value}</b>}
                      <span>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="controls">
              <div className="dots">
                {SCENE_LABELS.map((l, i) => (
                  <button
                    key={l}
                    className="dot"
                    data-on={i === scene}
                    disabled={busy}
                    onClick={() => goScene(i)}
                    aria-label={`Scene ${num(i)} ${l}`}
                  >
                    {num(i)}
                  </button>
                ))}
              </div>
              <div className="nav">
                <button className="arrow" onClick={prev} disabled={busy || scene === 0} aria-label="前のページ">
                  ←
                </button>
                <button
                  className="arrow"
                  onClick={next}
                  disabled={busy || scene === SCENE_COUNT - 1}
                  aria-label="次のページ"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="shelfFoot">
            <div className="shelfLead">
              <div className="eyebrow">10 VOLUMES — 2025 / 2026</div>
              <h1>
                本を開くと、
                <br />
                その業種が立ち上がる。
              </h1>
              <p>
                ブランド、店舗、商品、採用、Web、SNS、AI。
                領域ごとの制作物ではなく、事業そのものを編集した記録です。
              </p>
            </div>
            <div className="hint">
              <i />
              背表紙を選ぶ
            </div>
          </div>
        )}
      </div>

      {!reading && (
        <div className="volume" data-on={hovered !== null}>
          <div className="eyebrow">{preview.cover.eyebrow}</div>
          <h3>{preview.title}</h3>
          <h4>{preview.titleJa}</h4>
          <dl>
            <dt>Field</dt>
            <dd>{preview.industry}</dd>
            <dt>Client</dt>
            <dd>{preview.clientLabel}</dd>
            <dt>Year</dt>
            <dd>{preview.year}</dd>
            <dt>Material</dt>
            <dd>{preview.theme.material}</dd>
          </dl>
        </div>
      )}

      <CaseStudy project={project} open={caseOpen} onClose={() => setCaseOpen(false)} />
      <Info open={infoOpen} onClose={() => setInfoOpen(false)} onPick={openBook} />
      <div
        className="scrim"
        data-on={caseOpen || infoOpen}
        onClick={() => {
          setCaseOpen(false);
          setInfoOpen(false);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */

function CaseStudy({
  project,
  open,
  onClose,
}: {
  project: PortfolioProject;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <aside className="sheet" data-on={open} aria-hidden={!open}>
      <button className="sheetClose" onClick={onClose}>
        Close ✕
      </button>
      <div className="eyebrow">{project.cover.eyebrow}</div>
      <h2>{project.title}</h2>
      <h3>{project.titleJa}</h3>

      <section>
        <h4>Overview</h4>
        <p>{project.description}</p>
      </section>

      <section>
        <h4>Challenge</h4>
        <p>{project.challenge}</p>
      </section>

      <section>
        <h4>What we did</h4>
        <div className="tags">
          {project.approach.map((a) => (
            <span className="tag" key={a}>
              {a}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h4>Output</h4>
        <ul>
          {project.outputs.map((o) => (
            <li key={o.label}>
              <b>
                {o.label} — {o.type}
              </b>
              <p>{o.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Result</h4>
        <ul>
          {project.results.map((r) => (
            <li key={r.label}>
              <b>
                {r.value ? `${r.value} — ` : ""}
                {r.label}
              </b>
              {r.description && <p>{r.description}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Credit</h4>
        <p>
          {project.clientLabel} / {project.industry} / {project.year}
        </p>
        <div className="rule" />
        <div className="tags">
          {project.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}

function Info({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (i: number) => void;
}) {
  const mode = useExperience((s) => s.mode);
  return (
    <aside className="sheet" data-on={open} aria-hidden={!open}>
      <button className="sheetClose" onClick={onClose}>
        Close ✕
      </button>
      <div className="eyebrow">About</div>
      <h2>ANYWARE</h2>
      <h3>事業そのものを編集する。</h3>

      <section>
        <h4>Position</h4>
        <p>
          Web制作会社でも、SNS運用会社でも、広告代理店でもありません。
          人・地域・食・店舗・企業・採用・デジタル・AI。
          領域をまたいで、事業が動くところまで一緒につくります。
        </p>
      </section>

      <section>
        <h4>Fields</h4>
        <ul>
          <li>
            <b>Brand &amp; Store</b>
            <p>コンセプト設計、店舗体験、商品・メニュー開発、ショップツール。</p>
          </li>
          <li>
            <b>Recruit</b>
            <p>採用戦略、採用LP、社員インタビュー、動画、SNS、広告運用。</p>
          </li>
          <li>
            <b>Local</b>
            <p>地域資源のリサーチ、ブランディング、イベント、体験設計。</p>
          </li>
          <li>
            <b>Digital &amp; AI</b>
            <p>Web・LP、UX設計、開発、業務フロー分析、生成AIの実装と自動化。</p>
          </li>
        </ul>
      </section>

      <section>
        <h4>How to read</h4>
        <ul>
          <li>
            <b>Shelf</b>
            <p>背表紙をクリックすると、その本が棚から出て開きます。</p>
          </li>
          <li>
            <b>Pages</b>
            <p>
              ← → キー、ホイール、画面右下のボタンでページを送ります。
              1冊はINTRO / CHALLENGE / WHAT WE DID / OUTPUT / RESULTの5場面です。
            </p>
          </li>
          <li>
            <b>Case Study</b>
            <p>詳細な背景・施策・成果は各本のCASE STUDYから読めます。</p>
          </li>
        </ul>
      </section>

      <section>
        <h4>Volumes</h4>
        <ul>
          {portfolioProjects.map((p, i) => (
            <li key={p.id}>
              <button
                className="chip"
                onClick={() => {
                  onClose();
                  if (mode === "shelf") onPick(i);
                }}
                disabled={mode !== "shelf"}
              >
                {String(i + 1).padStart(2, "0")} · {p.title}
              </button>
            </li>
          ))}
        </ul>
        {mode !== "shelf" && (
          <p style={{ marginTop: 14, opacity: 0.6, fontSize: 12 }}>
            棚に戻ると、他の本を開けます。
          </p>
        )}
      </section>

      <section>
        <h4>Note</h4>
        <p>
          守秘のため、企業名・店舗名・ロゴは掲載していません。
          業種、課題、取り組み、成果として記録しています。
        </p>
      </section>
    </aside>
  );
}
