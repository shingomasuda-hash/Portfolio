import { useEffect } from "react";
import { portfolioProjects, type PortfolioProject } from "../data/portfolioProjects";
import { approachGloss, categoryLabel, outputTypeLabel } from "../data/glossary";
import { SCENE_COUNT, SCENE_LABELS, useExperience } from "../state/experience";

const num = (n: number) => String(n + 1).padStart(2, "0");

/* ------------------------------------------------------------------ */
/*  Per-scene copy — short on screen, the rest in CASE STUDY           */
/* ------------------------------------------------------------------ */

function sceneCopy(p: PortfolioProject, scene: number) {
  switch (scene) {
    case 0:
      return { head: p.story.intro, body: p.subtitle };
    case 1:
      return { head: p.story.challengeCopy, body: p.challenge };
    case 2:
      return { head: p.story.approachCopy, body: "" };
    case 3:
      return { head: p.story.outputCopy, body: "" };
    default:
      return { head: p.story.resultCopy, body: "" };
  }
}

/**
 * The block under the headline. This is where "what did they actually do"
 * gets answered — scope, the work itself, and what changed.
 */
function SceneDetail({ p, scene }: { p: PortfolioProject; scene: number }) {
  if (scene === 0) {
    return (
      <div className="block">
        <h4>
          担当領域<em>SCOPE</em>
        </h4>
        <ul className="scope">
          {p.approach.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (scene === 1) {
    return (
      <div className="block">
        <h4>
          課題<em>CHALLENGE</em>
        </h4>
        <p className="lede">{p.challenge}</p>
      </div>
    );
  }

  if (scene === 2) {
    return (
      <div className="block">
        <h4>
          やったこと<em>WHAT WE DID</em>
        </h4>
        <ol className="did">
          {p.approach.map((a, i) => (
            <li key={a}>
              <i>{num(i)}</i>
              <b>{a}</b>
              <span>{approachGloss[a] ?? ""}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (scene === 3) {
    return (
      <div className="block">
        <h4>
          つくったもの<em>OUTPUT</em>
        </h4>
        <ul className="made">
          {p.outputs.map((o) => (
            <li key={o.label}>
              <b>
                {o.label}
                <i>{outputTypeLabel[o.type] ?? o.type}</i>
              </b>
              <span>{o.description}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="block">
      <h4>
        変わったこと<em>RESULT</em>
      </h4>
      <ul className="got">
        {p.results.map((r) => (
          <li key={r.label}>
            <b>
              {r.value && <em>{r.value}</em>}
              {r.label}
            </b>
            {r.description && <span>{r.description}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
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
    setHovered,
    setCaseOpen,
    setInfoOpen,
  } = useExperience();

  const project = portfolioProjects[index];
  const preview = portfolioProjects[hovered ?? index];
  const reading = mode === "reading";
  const busy = phase !== "idle";
  const copy = sceneCopy(project, scene);

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
      {!reading && <div className="uiRight" />}
      <div className="ui" data-mode={mode}>
        <header className="top">
          <div className="mark">
            <b>ANYWARE ARCHIVE</b>
            <span>事業を編集する。</span>
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

        {reading ? (
          <>
            <div className="col" key={`${project.id}-${scene}`}>
              <div className="colHead">
                <b>{project.title}</b>
                <span>{project.titleJa}</span>
                <span className="fine">
                  {project.clientLabel} · {project.year}
                </span>
              </div>
              <div className="eyebrow">
                <s />
                SCENE {num(scene)} — {SCENE_LABELS[scene]}
              </div>
              <h2>{copy.head}</h2>
              {copy.body && <p>{copy.body}</p>}
              <SceneDetail p={project} scene={scene} />
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
          </>
        ) : (
          <>
            <div className="col shelfCol">
              <div className="eyebrow">
                <s />
                10 VOLUMES — 2025 / 2026
              </div>
              <h1>
                本を開くと、
                <br />
                その業種が
                <br />
                立ち上がる。
              </h1>
              <p>
                ブランド、店舗、商品、採用、Web、SNS、AI。
                領域ごとの制作物ではなく、事業そのものを編集した記録です。
              </p>
              <div className="fields">
                {["BRAND", "STORE", "RECRUIT", "LOCAL", "WEB", "SNS", "AI", "BUSINESS"].map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            </div>

            <nav className="index" aria-label="Volumes">
              <h4>
                目次<em>INDEX</em>
              </h4>
              <ol>
                {portfolioProjects.map((p, i) => (
                  <li key={p.id}>
                    <button
                      data-on={hovered === i}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(i)}
                      onBlur={() => setHovered(null)}
                      onClick={() => openBook(i)}
                    >
                      <i>{num(i)}</i>
                      <b>{p.title}</b>
                      <span>{categoryLabel[p.category] ?? p.category}</span>
                      {p.featured && <u aria-label="featured" />}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="foot">
              <div className="volume" data-on={hovered !== null}>
                <span className="eyebrow">{preview.cover.eyebrow}</span>
                <b>{preview.titleJa}</b>
                <span>
                  {preview.industry} — {preview.clientLabel}
                </span>
                <span className="fine">{preview.theme.material}</span>
              </div>
              <div className="hint">
                <i />
                背表紙を選ぶ
              </div>
            </div>
          </>
        )}
      </div>

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
        <ol className="did">
          {project.approach.map((a, i) => (
            <li key={a}>
              <i>{num(i)}</i>
              <b>{a}</b>
              <span>{approachGloss[a] ?? ""}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h4>Output</h4>
        <ul className="made">
          {project.outputs.map((o) => (
            <li key={o.label}>
              <b>
                {o.label}
                <i>{outputTypeLabel[o.type] ?? o.type}</i>
              </b>
              <span>{o.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Result</h4>
        <ul className="got">
          {project.results.map((r) => (
            <li key={r.label}>
              <b>
                {r.value && <em>{r.value}</em>}
                {r.label}
              </b>
              {r.description && <span>{r.description}</span>}
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
        <div className="fields">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
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
        <ul className="made">
          <li>
            <b>Brand &amp; Store</b>
            <span>コンセプト設計、店舗体験、商品・メニュー開発、ショップツール。</span>
          </li>
          <li>
            <b>Recruit</b>
            <span>採用戦略、採用LP、社員インタビュー、動画、SNS、広告運用。</span>
          </li>
          <li>
            <b>Local</b>
            <span>地域資源のリサーチ、ブランディング、イベント、体験設計。</span>
          </li>
          <li>
            <b>Digital &amp; AI</b>
            <span>Web・LP、UX設計、開発、業務フロー分析、生成AIの実装と自動化。</span>
          </li>
        </ul>
      </section>

      <section>
        <h4>How to read</h4>
        <ul className="made">
          <li>
            <b>Shelf</b>
            <span>背表紙か右の目次を選ぶと、その本が棚から出て開きます。</span>
          </li>
          <li>
            <b>Pages</b>
            <span>
              ← → キー、ホイール、画面右下のボタンでページを送ります。1冊は INTRO /
              CHALLENGE / WHAT WE DID / OUTPUT / RESULT の5場面です。
            </span>
          </li>
          <li>
            <b>Case Study</b>
            <span>詳細な背景・施策・成果は各本の CASE STUDY から読めます。</span>
          </li>
        </ul>
      </section>

      <section>
        <h4>Volumes</h4>
        <div className="fields">
          {portfolioProjects.map((p, i) => (
            <button
              key={p.id}
              className="chip"
              onClick={() => {
                onClose();
                if (mode === "shelf") onPick(i);
              }}
              disabled={mode !== "shelf"}
            >
              {num(i)} · {p.title}
            </button>
          ))}
        </div>
        {mode !== "shelf" && (
          <p style={{ marginTop: 14, opacity: 0.6, fontSize: 12 }}>棚に戻ると、他の本を開けます。</p>
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
