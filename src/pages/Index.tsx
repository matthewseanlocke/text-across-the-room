import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, MessageSquareText, Moon, Sparkles, Sun } from 'lucide-react';
import ColorPicker from '@/components/ColorPicker';
import SpeedSlider from '@/components/SpeedSlider';
import TextPreview from '@/components/TextPreview';
import { useTextDisplay } from '@/context/TextDisplayContext';

const QUICK_MESSAGES = [
  'HELLO', 'KISS ME 💋', 'CALL ME 📞', '♡ ♡ ♡ ♡ ♡', 'I LOVE YOU', 'BACK OFF!',
  'H E L P !', 'HOTTY ALERT!', '911', 'LETS GO!', 'DISCO!', 'L F G', 'FEED ME!',
  'MISS IT!', 'USA! USA! USA!', 'L M A O', '🤣 🤣 🤣', 'I 👀 YOU', 'I 💘 YOU',
];

const PRESETS = [
  { id: 'day', label: 'Day', swatch: 'linear-gradient(135deg,#fff,#dbeafe)' },
  { id: 'night', label: 'Night', swatch: 'linear-gradient(135deg,#172033,#020617)' },
  { id: 'emergency', label: 'Emergency', swatch: 'linear-gradient(135deg,#ef4444,#991b1b)' },
  { id: 'party', label: 'Party', swatch: 'linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4)' },
  { id: 'disco', label: 'Disco', swatch: 'linear-gradient(135deg,#f59e0b,#ec4899,#3b82f6)' },
  { id: 'lightning', label: 'Lightning', swatch: 'linear-gradient(135deg,#111827 45%,#fde047 46%,#fff 54%,#111827 55%)' },
] as const;

function ToggleRow({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string }) {
  return (
    <label className="toggle-row">
      <span><strong>{label}</strong>{description && <small>{description}</small>}</span>
      <button type="button" role="switch" aria-checked={checked} className={`switch ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)}>
        <span />
      </button>
    </label>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const [showAllMessages, setShowAllMessages] = useState(false);
  const {
    text, setText, textColor, setTextColor, backgroundColor, setBackgroundColor,
    font, setFont, scrollSpeed, setScrollSpeed, isStaticText, setIsStaticText, isWordFlash, setIsWordFlash, autoFitWords, setAutoFitWords, preset, applyPreset,
    setRainbowText, isRainbowText,
    darkMode, toggleDarkMode, dualTextMode, toggleDualTextMode,
    isRainbowBackground, setRainbowBackground, isLightningMode, setLightningMode,
    isSirenMode, setSirenMode, isHeartbeatMode, setHeartbeatMode,
  } = useTextDisplay();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const visibleMessages = showAllMessages ? QUICK_MESSAGES : QUICK_MESSAGES.slice(0, 9);

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <a href="/" className="brand" aria-label="Text Across the Room home">
          <span className="brand-mark"><MessageSquareText size={21} /></span>
          <span>text across the room</span>
        </a>
        <button className="icon-button" type="button" onClick={toggleDarkMode} aria-label="Toggle color theme">
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </header>

      <div className="studio-grid">
        <section className="editor-column">
          <section className="control-card compose-card">
            <div className="section-heading"><span className="step-number">1</span><div><h2>Write your message</h2><p>Keep it short for the biggest impact.</p></div></div>
            <label className="field-label" htmlFor="text-input">Message</label>
            <div className="message-input-wrap">
              <input id="text-input" value={text} maxLength={80} onChange={(event) => setText(event.target.value)} placeholder="Type something bold…" autoComplete="off" />
              <span>{text.length}/80</span>
            </div>
            <div className="quick-heading"><span>Quick picks</span><button type="button" onClick={() => setShowAllMessages(!showAllMessages)}>{showAllMessages ? 'Show less' : 'See all'} <ChevronDown size={14} /></button></div>
            <div className="quick-grid">
              {visibleMessages.map((message) => <button type="button" key={message} className={text === message ? 'selected' : ''} onClick={() => setText(message)}>{message}</button>)}
            </div>
          </section>

          <section className="control-card">
            <div className="section-heading"><span className="step-number">2</span><div><h2>Choose the look</h2><p>Start with a preset or make it yours.</p></div></div>
            <div className="preset-grid">
              {PRESETS.map((item) => (
                <button type="button" key={item.id} className={`preset-tile ${preset === item.id ? 'selected' : ''}`} onClick={() => applyPreset(item.id)}>
                  <span className="preset-swatch" style={{ background: item.swatch }} />
                  <span>{item.label}</span>{preset === item.id && <Check size={14} />}
                </button>
              ))}
            </div>
            <div className="divider" />
            <div className="color-grid">
              <ColorPicker label="Text color" value={textColor} onChange={setTextColor} simple disabled={isRainbowText} />
              <ColorPicker label="Background" value={backgroundColor} onChange={setBackgroundColor} simple disabled={isRainbowBackground || isLightningMode || isSirenMode || isHeartbeatMode} />
            </div>
            <label className="field-label" htmlFor="font-select">Typeface</label>
            <select id="font-select" value={font} onChange={(event) => setFont(event.target.value as typeof font)}>
              <option value="display">Bold display</option><option value="handwriting">Handwritten</option><option value="monospace">Monospace</option><option value="serif">Classic serif</option>
            </select>
            <SpeedSlider value={scrollSpeed} onChange={setScrollSpeed} />
          </section>

          <section className="control-card">
            <div className="section-heading"><span className="step-number"><Sparkles size={17} /></span><div><h2>Effects</h2><p>Add motion only when the moment calls for it.</p></div></div>
            <div className="toggle-list">
              <ToggleRow label="Keep text still" description="Center the message without scrolling" checked={isStaticText} onChange={(on) => { setIsStaticText(on); if (on) setIsWordFlash(false); }} />
              <ToggleRow label="Flash one word at a time" description="Show each word separately at the chosen speed" checked={isWordFlash} onChange={(on) => { setIsWordFlash(on); if (on) setIsStaticText(false); }} />
              {isWordFlash && <ToggleRow label="Auto-fit flashed words" description="Shrink long words so they stay on screen" checked={autoFitWords} onChange={setAutoFitWords} />}
              <ToggleRow label="Rainbow text" description="Cycle through vivid colors" checked={isRainbowText} onChange={(on) => on ? setRainbowText() : setTextColor(textColor)} />
              <ToggleRow label="Disco background" checked={isRainbowBackground} onChange={setRainbowBackground} />
              <ToggleRow label="Lightning flash" checked={isLightningMode} onChange={setLightningMode} />
              <ToggleRow label="Siren flash" checked={isSirenMode} onChange={setSirenMode} />
              <ToggleRow label="Heartbeat" checked={isHeartbeatMode} onChange={setHeartbeatMode} />
              <ToggleRow label="Two rows in portrait" description="Fill tall phone screens" checked={dualTextMode} onChange={() => toggleDualTextMode()} />
            </div>
          </section>
        </section>

        <aside className="preview-column">
          <div className="preview-sticky">
            <div className="preview-label"><span>LIVE PREVIEW</span><span className="live-dot" /> Ready</div>
            <button className="preview-frame" type="button" onClick={() => navigate('/display')} disabled={!text.trim()} aria-label="Display message full screen">
              <TextPreview />
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Index;
