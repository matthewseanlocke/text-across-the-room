import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, MessageSquareText, Moon, Sparkles, Sun, X } from 'lucide-react';
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
  { id: 'lightning', label: 'Lightning', swatch: '#000000' },
  { id: 'siren', label: 'Siren', swatch: '#0000ff' },
  { id: 'heartbeat', label: 'Heartbeat', swatch: '#800000' },
] as const;
const COLOR_PRESETS = PRESETS.slice(0, 3);
const ANIMATED_PRESETS = PRESETS.slice(3);
const TEXT_TREATMENTS = [
  ['solid', 'Solid'], ['outline', 'Outline'], ['black-outline', 'Black outline'], ['glow', 'Glow'], ['shadow', 'Shadow'],
  ['chrome', 'Chrome'], ['split', 'Split color'], ['hollow-glow', 'Hollow glow'],
  ['double-outline', 'Double outline'], ['retro-3d', 'Retro 3D'], ['3d-glasses', '3D glasses'], ['pixel', 'Pixel'],
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
    font, setFont, letterSpacing, setLetterSpacing, textCase, setTextCase, textTreatment, setTextTreatment,
    scrollSpeed, setScrollSpeed, isWordFlash, setIsWordFlash, tapToAdvanceWords, setTapToAdvanceWords, preset, applyPreset,
    darkMode, toggleDarkMode, dualTextMode, toggleDualTextMode,
  } = useTextDisplay();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const visibleMessages = showAllMessages ? QUICK_MESSAGES : QUICK_MESSAGES.slice(0, 9);
  const isAnimatedLook = ANIMATED_PRESETS.some((item) => item.id === preset);

  const renderPreset = (item: typeof PRESETS[number]) => (
    <button type="button" key={item.id} data-preset={item.id} className={`preset-tile ${preset === item.id ? 'selected' : ''}`} onClick={() => applyPreset(item.id)} aria-label={`${item.label} color effect`} title={item.label}>
      <span className="preset-swatch" style={{ background: item.swatch }}><span className="preset-demo-text">TEXT</span></span>
      {preset === item.id && <Check size={16} aria-hidden="true" />}
    </button>
  );

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <a href="/" className="brand" aria-label="Text Across the Room home">
          <span className="brand-mark"><MessageSquareText size={21} /></span>
          <span>text across the room</span>
        </a>
        <div className="header-actions">
          <a className="coffee-button" href="https://buymeacoffee.com/matthewseanwallace" target="_blank" rel="noreferrer" aria-label="Buy me a coffee" title="Buy me a coffee">
            <span className="coffee-cup" aria-hidden="true" />
          </a>
          <button className="icon-button" type="button" onClick={toggleDarkMode} aria-label="Toggle color theme">
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <div className="studio-grid">
        <section className="editor-column">
          <section className="control-card compose-card">
            <div className="section-heading compact-heading"><span className="step-number">1</span><div><h2>Write your message</h2></div></div>
            <div className="message-input-wrap">
              <input id="text-input" value={text} maxLength={80} onChange={(event) => setText(event.target.value)} placeholder="Type something bold…" autoComplete="off" />
              {text && <button type="button" className="clear-message-button" onClick={() => setText('')} aria-label="Clear message" title="Clear message"><X size={18} /></button>}
              <span className="message-count">{text.length}/80</span>
            </div>
            <SpeedSlider value={scrollSpeed} onChange={setScrollSpeed} />
            <div className={`quick-heading ${showAllMessages ? 'is-open' : ''}`}>
              <span>Quick picks</span>
              <button type="button" aria-expanded={showAllMessages} onClick={() => setShowAllMessages(!showAllMessages)}>
                {showAllMessages ? 'Hide' : 'Show quick picks'} <ChevronDown size={14} />
              </button>
            </div>
            {showAllMessages && (
              <div className="quick-grid">
                {visibleMessages.map((message) => <button type="button" key={message} className={text === message ? 'selected' : ''} onClick={() => setText(message)}>{message}</button>)}
              </div>
            )}
          </section>

          <section className="control-card">
            <div className="section-heading compact-heading"><span className="step-number">2</span><div><h2>Choose the look</h2></div></div>
            <div className="look-group">
              <div className="look-group-heading"><strong>Color looks</strong><span>Customize the colors below</span></div>
              <div className="preset-grid color-presets">{COLOR_PRESETS.map(renderPreset)}</div>
            </div>
            <div className={`color-grid custom-colors ${isAnimatedLook ? 'is-locked' : ''}`}>
              <ColorPicker label="Text color" value={textColor} onChange={setTextColor} simple disabled={isAnimatedLook} />
              <ColorPicker label="Background" value={backgroundColor} onChange={setBackgroundColor} simple disabled={isAnimatedLook} />
            </div>
            <div className="look-group animated-look-group">
              <div className="look-group-heading"><strong>Animated looks</strong><span>Colors are built into each effect</span></div>
              <div className="preset-grid animated-presets">{ANIMATED_PRESETS.map(renderPreset)}</div>
            </div>
            <div className="divider" />
            <label className="field-label" htmlFor="font-select">Typeface</label>
            <select id="font-select" value={font} onChange={(event) => setFont(event.target.value as typeof font)}>
              <option value="display">Bold display</option><option value="handwriting">Handwritten</option><option value="monospace">Monospace</option><option value="serif">Classic serif</option>
            </select>
            <div className="text-style-controls" aria-label="Text styling">
              <div className="text-style-row">
                <span>Spacing</span>
                <div className="segmented-control">
                  {(['tight', 'normal', 'wide'] as const).map((value) => <button type="button" key={value} className={letterSpacing === value ? 'selected' : ''} onClick={() => setLetterSpacing(value)} aria-pressed={letterSpacing === value}>{value}</button>)}
                </div>
              </div>
              <div className="text-style-row">
                <span>Case</span>
                <div className="segmented-control two-options">
                  {(['typed', 'uppercase'] as const).map((value) => <button type="button" key={value} className={textCase === value ? 'selected' : ''} onClick={() => setTextCase(value)} aria-pressed={textCase === value}>{value === 'typed' ? 'As typed' : 'UPPERCASE'}</button>)}
                </div>
              </div>
              <div className="text-style-row">
                <span>Treatment</span>
                <div className="segmented-control treatment-options">
                  {TEXT_TREATMENTS.map(([value, label]) => <button type="button" key={value} className={textTreatment === value ? 'selected' : ''} onClick={() => setTextTreatment(value)} aria-pressed={textTreatment === value}>{label}</button>)}
                </div>
              </div>
            </div>
          </section>

          <section className="control-card">
            <div className="section-heading compact-heading"><span className="step-number"><Sparkles size={17} /></span><div><h2>Effects</h2></div></div>
            <div className="toggle-list">
              <ToggleRow label="Flash one word at a time" description="Show each word separately at the chosen speed" checked={isWordFlash} onChange={setIsWordFlash} />
              {isWordFlash && <ToggleRow label="Tap to advance words" description="Tap the display to show the next word" checked={tapToAdvanceWords} onChange={setTapToAdvanceWords} />}
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
