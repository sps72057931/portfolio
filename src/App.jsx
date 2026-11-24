import { useEffect, useRef, useState } from "react";
import { profile, stats, projects, skills, experience, education, achievements, endpoints } from "./data.js";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView(once = true) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); if (once) io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, seen];
}

function Counter({ value, suffix }) {
  const [ref, seen] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced()) return setN(value);
    const t0 = performance.now(), dur = 1400;
    let raf;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Typer({ words }) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (reduced()) return setTxt(words[0]);
    const w = words[i];
    const id = setTimeout(() => {
      if (!del && txt === w) return setDel(true);
      if (del && txt === "") { setDel(false); return setI((i + 1) % words.length); }
      setTxt(del ? w.slice(0, txt.length - 1) : w.slice(0, txt.length + 1));
    }, !del && txt === w ? 1400 : del ? 28 : 60);
    return () => clearTimeout(id);
  }, [txt, del, i, words]);
  return <span className="typer">{txt}<i className="caret" /></span>;
}

function Console() {
  const [i, setI] = useState(0);
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const body = JSON.stringify(endpoints[i].body, null, 2);
    if (reduced()) { setOut(body); setDone(true); return; }
    let n = 0;
    setOut(""); setDone(false);
    const id = setInterval(() => {
      n += 5;
      setOut(body.slice(0, n));
      if (n >= body.length) { clearInterval(id); setDone(true); }
    }, 14);
    return () => clearInterval(id);
  }, [i]);
  return (
    <div className="console" role="region" aria-label="Interactive API console">
      <div className="console-bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="console-title">portfolio-api</span>
      </div>
      <div className="routes" role="tablist">
        {endpoints.map((e, k) => (
          <button key={e.path} role="tab" aria-selected={k === i} className={k === i ? "route on" : "route"} onClick={() => setI(k)}>
            <b>GET</b> {e.path}
          </button>
        ))}
      </div>
      <div className="status">
        {done ? <><span className="ok">200 OK</span><span>{endpoints[i].ms} ms</span></> : <span>sending request…</span>}
      </div>
      <pre className="json" aria-live="polite">{out}{!done && <i className="caret" />}</pre>
    </div>
  );
}

function Project({ p }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={open ? "card open" : "card"}>
      <div className="card-head">
        <h3>{p.title}</h3>
        <span className="period">{p.period}</span>
      </div>
      <p className="lead">{p.summary}</p>
      <ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
      <div className="details" aria-hidden={!open}>
        <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
      </div>
      <div className="card-actions">
        <button className="link-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide details" : "Show details"}</button>
        <a href={p.live} target="_blank" rel="noreferrer">Live demo</a>
        <a href={p.github} target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </article>
  );
}

function Skills() {
  const tabs = Object.keys(skills);
  const [tab, setTab] = useState(tabs[1]);
  return (
    <div className="skills">
      <div className="tabs" role="tablist">
        {tabs.map((t) => <button key={t} role="tab" aria-selected={t === tab} className={t === tab ? "tab on" : "tab"} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <ul className="pills" key={tab}>{skills[tab].map((s, k) => <li key={s} style={{ animationDelay: `${k * 40}ms` }}>{s}</li>)}</ul>
    </div>
  );
}

function Contact() {
  const [f, setF] = useState({ name: "", msg: "" });
  const send = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${f.name || "your portfolio"}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(f.msg)}`;
  };
  return (
    <form className="form" onSubmit={send}>
      <label>Your name<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ada Lovelace" /></label>
      <label>Message<textarea rows="4" required value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} placeholder="Tell me about the role or project" /></label>
      <button className="btn" type="submit">Send email</button>
    </form>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { const s = localStorage.getItem("theme"); if (s) return s; } catch (e) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }, [theme]);

  const heroRef = useRef(null);
  const onMove = (e) => {
    const r = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    heroRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const nav = [["projects", "Projects"], ["skills", "Skills"], ["experience", "Experience"], ["contact", "Contact"]];
  return (
    <>
      <header className="nav">
        <a className="brand" href="#top">SPS</a>
        <nav>{nav.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>
        <button className="theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle colour theme">
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </header>

      <main id="top">
        <section className="hero" ref={heroRef} onMouseMove={onMove}>
          <div className="hero-copy">
            <p className="hello">Hi, I'm</p>
            <h1>Shivendra<br />Pratap Singh</h1>
            <p className="sub">{profile.role} who builds <Typer words={profile.roles} /></p>
            <p className="tag">{profile.tagline}</p>
            <div className="cta">
              <a className="btn" href="#projects">See my work</a>
              <a className="btn ghost" href="#contact">Get in touch</a>
            </div>
            <div className="socials">
              {Object.entries(profile.links).map(([k, v]) => <a key={k} href={v} target="_blank" rel="noreferrer">{k === "github" ? "GitHub" : k === "linkedin" ? "LinkedIn" : k === "leetcode" ? "LeetCode" : "CodeChef"}</a>)}
            </div>
          </div>
          <Console />
        </section>

        <section className="stats">
          {stats.map((s) => (
            <div key={s.label}><strong><Counter value={s.value} suffix={s.suffix} /></strong><span>{s.label}</span></div>
          ))}
        </section>

        <section id="projects" className="block">
          <h2>Projects</h2>
          <p className="blurb">Three deployed full-stack apps. Open a card for the engineering detail.</p>
          <div className="grid">{projects.map((p) => <Project key={p.title} p={p} />)}</div>
        </section>

        <section id="skills" className="block">
          <h2>Skills</h2>
          <p className="blurb">Pick a category.</p>
          <Skills />
        </section>

        <section id="experience" className="block two">
          <div>
            <h2>Experience</h2>
            <div className="tl">
              <h3>{experience.role}, {experience.company}</h3>
              <span className="period">{experience.period}, {experience.place}</span>
              <ul>{experience.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <div className="certs">{experience.certs.map((c) => <a key={c.label} href={c.href} target="_blank" rel="noreferrer">{c.label}</a>)}</div>
            </div>
          </div>
          <div>
            <h2>Education</h2>
            {education.map((e) => (
              <div className="tl" key={e.detail}>
                <h3>{e.school}</h3>
                <span className="period">{e.period}</span>
                <p>{e.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="block">
          <h2>Achievements</h2>
          <ul className="wins">{achievements.map((a) => <li key={a}>{a}</li>)}</ul>
        </section>

        <section id="contact" className="block two contact">
          <div>
            <h2>Let's work together</h2>
            <p className="blurb">I'm open to internships and full-time roles. The fastest way to reach me is email.</p>
            <p><a className="big" href={`mailto:${profile.email}`}>{profile.email}</a></p>
            <p className="muted">{profile.phone} · {profile.location}</p>
          </div>
          <Contact />
        </section>
      </main>
      <footer>Built with React and Vite by {profile.name}</footer>
    </>
  );
}
