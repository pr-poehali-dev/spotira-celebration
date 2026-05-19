import { useState, useEffect, useRef } from "react";

const SLIDES = [0, 1, 2, 3, 4];

function FloatingCircles({ color1 = "#c9a96e", color2 = "#8b6f47", count = 6 }: { color1?: string; color2?: string; count?: number }) {
  return (
    <div className="circles-bg" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="circle"
          style={{
            "--c": i % 2 === 0 ? color1 : color2,
            "--delay": `${i * 1.3}s`,
            "--dur": `${8 + i * 1.7}s`,
            "--size": `${80 + i * 55}px`,
            "--x": `${10 + (i * 17) % 80}%`,
            "--y": `${10 + (i * 23) % 75}%`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function Countdown() {
  const target = new Date("2026-06-27T17:30:00");
  const [diff, setDiff] = useState(target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));

  return (
    <div className="countdown">
      {[{ v: d, l: "дней" }, { v: h, l: "часов" }, { v: m, l: "минут" }, { v: s, l: "секунд" }].map(({ v, l }) => (
        <div key={l} className="countdown-unit">
          <span className="countdown-num">{String(v).padStart(2, "0")}</span>
          <span className="countdown-label">{l}</span>
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const [slide, setSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [visible, setVisible] = useState(true);

  const audioRefs = useRef<(HTMLAudioElement | null)[]>([null, null, null, null, null]);

  const TRACKS = [
    "https://files.catbox.moe/dysysh.mp3",
    "https://files.catbox.moe/u4uvph.mp3",
    "https://files.catbox.moe/atzji6.mp3",
    "https://files.catbox.moe/0bohgq.mp3",
    "https://files.catbox.moe/q61c6p.mp3",
  ];

  useEffect(() => {
    TRACKS.forEach((src, i) => {
      const audio = new Audio(src);
      audio.loop = false;
      audio.volume = 0.7;
      audioRefs.current[i] = audio;
    });
    return () => {
      audioRefs.current.forEach(a => a?.pause());
    };
  }, []);

  const stopAll = () => {
    audioRefs.current.forEach(a => {
      if (a) { a.pause(); a.currentTime = 0; }
    });
  };

  const playTrack = (idx: number) => {
    stopAll();
    audioRefs.current[idx]?.play().catch(() => {});
  };

  const goTo = (next: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setSlide(next);
      setVisible(true);
      setTransitioning(false);
      if (next > 0) playTrack(next);
      else if (!musicStarted) stopAll();
    }, 600);
  };

  const handleStart = () => {
    if (!musicStarted) {
      setMusicStarted(true);
      playTrack(0);
    }
  };

  const SLIDE_COLORS = [
    { c1: "#c9a96e", c2: "#3d2b1f" },
    { c1: "#8fb8c8", c2: "#2c4a5a" },
    { c1: "#a8c5a0", c2: "#2d4a28" },
    { c1: "#c9a96e", c2: "#5a3e28" },
    { c1: "#d4a8b8", c2: "#5a2d3e" },
  ];

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .app-root {
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          background: #0d0b08;
          font-family: 'Montserrat', sans-serif;
          position: relative;
        }

        .slide {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          text-align: center;
          transition: opacity 0.6s ease, transform 0.6s ease;
          opacity: 1;
          transform: translateY(0);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .slide.hidden {
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
        }

        .circles-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .circle {
          position: absolute;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: radial-gradient(circle at 40% 40%, color-mix(in srgb, var(--c) 30%, transparent), transparent 70%);
          left: var(--x);
          top: var(--y);
          animation: floatCircle var(--dur) var(--delay) ease-in-out infinite alternate;
          filter: blur(2px);
        }

        @keyframes floatCircle {
          0% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          50% { opacity: 0.45; }
          100% { transform: translate(-30px, -40px) scale(1.15); opacity: 0.2; }
        }

        .content { position: relative; z-index: 1; width: 100%; max-width: 380px; padding-bottom: 48px; }

        .logo {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 6px;
          color: #c9a96e;
          margin-bottom: 36px;
          opacity: 0.9;
        }

        .logo span { color: #fff; }

        .year-badge {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          color: #c9a96e;
          margin-bottom: 20px;
          opacity: 0.7;
          text-transform: uppercase;
        }

        .main-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(24px, 6.5vw, 34px);
          font-weight: 300;
          color: #f5f0e8;
          line-height: 1.35;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .main-title em {
          font-style: italic;
          color: #c9a96e;
        }

        .subtitle {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: #a09080;
          line-height: 1.6;
          margin-bottom: 32px;
          letter-spacing: 0.3px;
        }

        .body-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(17px, 4.5vw, 21px);
          font-weight: 300;
          font-style: italic;
          color: #e8e0d0;
          line-height: 1.7;
          margin-bottom: 32px;
          letter-spacing: 0.3px;
        }

        .track-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          color: #c9a96e;
          margin-bottom: 12px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .track-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 5.5vw, 28px);
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 20px;
        }

        .music-bar {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          justify-content: center;
          height: 24px;
          margin-bottom: 28px;
        }

        .music-bar span {
          width: 3px;
          background: #c9a96e;
          border-radius: 2px;
          animation: musicPulse 0.8s ease-in-out infinite alternate;
        }
        .music-bar span:nth-child(1) { height: 8px; animation-delay: 0s; }
        .music-bar span:nth-child(2) { height: 18px; animation-delay: 0.15s; }
        .music-bar span:nth-child(3) { height: 12px; animation-delay: 0.3s; }
        .music-bar span:nth-child(4) { height: 20px; animation-delay: 0.1s; }
        .music-bar span:nth-child(5) { height: 8px; animation-delay: 0.25s; }

        @keyframes musicPulse {
          from { transform: scaleY(0.4); opacity: 0.5; }
          to { transform: scaleY(1.2); opacity: 1; }
        }

        .btn {
          display: inline-block;
          padding: 14px 36px;
          border-radius: 40px;
          border: 1px solid #c9a96e;
          background: transparent;
          color: #c9a96e;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s, color 0.3s, transform 0.2s;
          margin-bottom: 10px;
          text-decoration: none;
        }

        .btn:hover {
          background: #c9a96e;
          color: #0d0b08;
          transform: scale(1.03);
        }

        .btn-primary {
          background: #c9a96e;
          color: #0d0b08;
          border-color: #c9a96e;
        }

        .btn-primary:hover {
          background: #e0c08a;
          border-color: #e0c08a;
          color: #0d0b08;
        }

        .btn-ghost {
          border-color: rgba(201,169,110,0.3);
          color: #a09080;
          font-size: 10px;
          padding: 10px 28px;
        }

        .btn-ghost:hover {
          background: rgba(201,169,110,0.1);
          color: #c9a96e;
          border-color: #c9a96e;
        }

        .stats-grid {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 28px;
          text-align: left;
        }

        .stat-item {
          border-left: 2px solid #c9a96e;
          padding-left: 16px;
        }

        .stat-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          color: #706050;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(17px, 4.5vw, 22px);
          font-weight: 400;
          color: #f5f0e8;
          line-height: 1.3;
        }

        .stat-value .big {
          font-size: clamp(34px, 9vw, 48px);
          font-weight: 300;
          color: #c9a96e;
          line-height: 1;
          display: block;
          margin-bottom: 2px;
        }

        .final-date {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 5vw, 24px);
          font-weight: 300;
          color: #f5f0e8;
          line-height: 1.6;
          margin-bottom: 6px;
        }

        .final-note {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 1.5px;
          color: #604c3a;
          margin-bottom: 20px;
        }

        .final-tag {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          color: #a09080;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .program-list {
          text-align: left;
          margin-bottom: 24px;
          margin-top: 16px;
        }

        .program-item {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          align-items: flex-start;
        }

        .program-time {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 1px;
          color: #c9a96e;
          min-width: 90px;
          padding-top: 2px;
        }

        .program-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          color: #a09080;
          line-height: 1.5;
          font-weight: 300;
        }

        .divider {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a96e, transparent);
          margin: 0 auto 28px;
        }

        .hint-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 2px;
          color: #504030;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .countdown {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin-bottom: 32px;
        }

        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .countdown-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 7vw, 38px);
          font-weight: 300;
          color: #c9a96e;
          line-height: 1;
        }

        .countdown-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 8px;
          letter-spacing: 1.5px;
          color: #504030;
          text-transform: uppercase;
        }

        .slide-indicator {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 100;
        }

        .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #403020;
          transition: background 0.3s, transform 0.3s;
        }

        .dot.active {
          background: #c9a96e;
          transform: scale(1.4);
        }

        .btn-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        a.btn { display: inline-block; }

        .euro-link {
          color: #c9a96e;
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .euro-link:hover { color: #e0c08a; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-in > * {
          animation: fadeUp 0.7s ease both;
        }
        .animate-in > *:nth-child(1) { animation-delay: 0.05s; }
        .animate-in > *:nth-child(2) { animation-delay: 0.15s; }
        .animate-in > *:nth-child(3) { animation-delay: 0.25s; }
        .animate-in > *:nth-child(4) { animation-delay: 0.35s; }
        .animate-in > *:nth-child(5) { animation-delay: 0.45s; }
        .animate-in > *:nth-child(6) { animation-delay: 0.55s; }
        .animate-in > *:nth-child(7) { animation-delay: 0.65s; }
        .animate-in > *:nth-child(8) { animation-delay: 0.75s; }
      `}</style>

      {/* SLIDE 0 — Welcome */}
      <div
        className={`slide ${slide === 0 && visible ? "animate-in" : "hidden"}`}
        style={{ background: "linear-gradient(160deg, #0d0b08 0%, #1a1208 100%)" }}
      >
        <FloatingCircles color1={SLIDE_COLORS[0].c1} color2={SLIDE_COLORS[0].c2} count={7} />
        <div className="content">
          <div className="logo">spot<span>IRA</span></div>
          <div className="year-badge">2 0 2 6</div>
          <h1 className="main-title">
            Не просто<br />
            <em>музыкальные итоги</em><br />
            а приглашение отметить мои 30
          </h1>
          <div className="divider" />
          <p className="subtitle">привет Настя — это для тебя</p>
          <Countdown />
          <div className="btn-row">
            {!musicStarted ? (
              <>
                <button className="btn btn-primary" onClick={handleStart}>нажми сюда</button>
                <p className="hint-text">включить музыку</p>
              </>
            ) : (
              <>
                <p className="hint-text">♫ музыка играет</p>
                <button className="btn btn-primary" onClick={() => goTo(1)}>смотреть итоги →</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SLIDE 1 — Track */}
      <div
        className={`slide ${slide === 1 && visible ? "animate-in" : "hidden"}`}
        style={{ background: "linear-gradient(160deg, #080d12 0%, #0d1a22 100%)" }}
      >
        <FloatingCircles color1={SLIDE_COLORS[1].c1} color2={SLIDE_COLORS[1].c2} count={6} />
        <div className="content">
          <div className="logo">spot<span>IRA</span></div>
          <div className="track-name">♫ сейчас играет</div>
          <div className="track-title">Трек, который хочет включиться</div>
          <div className="music-bar">
            <span /><span /><span /><span /><span />
          </div>
          <div className="divider" />
          <p className="body-text">
            Каким-то магическим чудом ты влетела в мою жизнь и остаёшься в ней. Как ты однажды сказала мне: «Давай не пропадать из жизни друг друга!» Спасибо, что рядом.
          </p>
          <button className="btn" onClick={() => goTo(2)}>далее →</button>
        </div>
      </div>

      {/* SLIDE 2 — Moments */}
      <div
        className={`slide ${slide === 2 && visible ? "animate-in" : "hidden"}`}
        style={{ background: "linear-gradient(160deg, #080d0a 0%, #0d1a10 100%)" }}
      >
        <FloatingCircles color1={SLIDE_COLORS[2].c1} color2={SLIDE_COLORS[2].c2} count={7} />
        <div className="content">
          <div className="logo">spot<span>IRA</span></div>
          <div className="track-name">♫ момент с тобой</div>
          <div className="music-bar">
            <span /><span /><span /><span /><span />
          </div>
          <div className="divider" />
          <p className="body-text">
            Помнишь, как мы рандомно решили лететь в Китай? Или как «руководили» хостелами? Как гуляли до залива и обратно? И как ты всегда со мной рядом, даже если это не ощущается физически?
          </p>
          <p className="subtitle" style={{ marginBottom: "28px" }}>спасибо тебе за эти моменты</p>
          <button className="btn" onClick={() => goTo(3)}>что там дальше? →</button>
        </div>
      </div>

      {/* SLIDE 3 — Stats */}
      <div
        className={`slide ${slide === 3 && visible ? "animate-in" : "hidden"}`}
        style={{ background: "linear-gradient(160deg, #0d0b08 0%, #1a1208 100%)" }}
      >
        <FloatingCircles color1={SLIDE_COLORS[3].c1} color2={SLIDE_COLORS[3].c2} count={6} />
        <div className="content">
          <div className="logo">spot<span>IRA</span></div>
          <div className="year-badge">статистика дружбы</div>
          <div className="divider" />
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Сколько мы дружим</div>
              <div className="stat-value">
                <span className="big">2697</span>дней
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Раз на моём дне рождения</div>
              <div className="stat-value">
                <span className="big">6</span>раз
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Как сильно я дорожу тобой</div>
              <div className="stat-value" style={{ fontSize: "clamp(14px, 3.5vw, 16px)", fontStyle: "italic" }}>
                Так же сокровенно и искренне, как всё, что показывает Mirror of Erised
              </div>
            </div>
          </div>
          <p className="subtitle" style={{ fontSize: "12px", marginBottom: "24px" }}>
            И далее я хочу разделить с тобой свои 30 лет и переход в новое десятилетие
          </p>
          <button className="btn btn-primary" onClick={() => goTo(4)}>подробности →</button>
        </div>
      </div>

      {/* SLIDE 4 — Invite */}
      <div
        className={`slide ${slide === 4 && visible ? "animate-in" : "hidden"}`}
        style={{ background: "linear-gradient(160deg, #0d0810 0%, #1a0d1a 100%)" }}
      >
        <FloatingCircles color1={SLIDE_COLORS[4].c1} color2={SLIDE_COLORS[4].c2} count={7} />
        <div className="content">
          <div className="logo">spot<span>IRA</span></div>
          <div className="music-bar" style={{ marginBottom: "16px" }}>
            <span /><span /><span /><span /><span />
          </div>
          <p className="final-date">
            27 июня в 17:30<br />
            Московский проспект 139А<br />
            <span style={{ fontSize: "0.75em", color: "#a09080" }}>м Электросила</span>
          </p>
          <p className="final-note">вход с торца здания через железную калитку</p>
          <div className="final-tag">
            тематика:{" "}
            <a
              href="https://docs.google.com/document/d/19nD4DwoFk2GaUhR5G1j0_YAmeqTiTXoMtmebOjLU_JA/edit?tab=t.0"
              target="_blank"
              rel="noopener noreferrer"
              className="euro-link"
            >
              Eurovision
            </a>
          </div>
          <p className="hint-text" style={{ marginBottom: "16px" }}>нажми, чтобы узнать подробности</p>
          <div className="program-list">
            <div className="program-item">
              <span className="program-time">17:30 – 18:30</span>
              <span className="program-desc">сбор, лёгкий перекус, первые тосты</span>
            </div>
            <div className="program-item">
              <span className="program-time">18:30 – 20:30</span>
              <span className="program-desc">вкусно кушаем, вкусно пьём и проходим квиз по Иришке</span>
            </div>
            <div className="program-item">
              <span className="program-time">20:30 – 22:00</span>
              <span className="program-desc">слушаем музыку, общаемся</span>
            </div>
          </div>
          <div className="btn-row">
            <p className="subtitle" style={{ fontSize: "11px", marginBottom: "8px" }}>Мой номер знаешь!</p>
            <a
              className="btn btn-primary"
              href="https://docs.google.com/spreadsheets/d/1Ku3rdanulnFMoDGRRYnycAnj4sJThtFrm7mCLC-oufE/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              wishlist 🎁
            </a>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="slide-indicator">
        {SLIDES.map(i => <div key={i} className={`dot ${i === slide ? "active" : ""}`} />)}
      </div>
    </div>
  );
}
