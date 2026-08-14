import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, MessageSquareText, Moon, Sparkles, Sun, X } from 'lucide-react';
import ColorPicker from '@/components/ColorPicker';
import SpeedSlider from '@/components/SpeedSlider';
import TextPreview from '@/components/TextPreview';
import { useTextDisplay } from '@/context/TextDisplayContext';

const QUICK_MESSAGES = [
  'HELLO', 'KISS ME 💋', 'CALL ME 📞', '♡ ♡ ♡ ♡ ♡', 'I LOVE YOU', 'BACK OFF!',
  'H E L P !', 'HOTTY ALERT!', '911', 'LETS GO!', 'DISCO!', 'L F G', 'FEED ME!',
  'MISS IT! \u{1F3C0} \u{1F3C0}', 'MISS IT! \u{1F3C8} \u{1F3C8}', 'USA! USA! USA!', 'L M A O', '🤣 🤣 🤣', 'I 👀 YOU', 'I 💘 YOU',
  'SWISH! \u{1F3C0}', 'TOUCHDOWN! \u{1F3C8}', 'SEND IT! \u{1F680}', 'DANCE BREAK \u{1FAA9}',
  'YOU GOT THIS!', 'LOOKING GOOD \u{1F60E}', 'MAIN CHARACTER ENERGY \u{2728}', 'PLOT TWIST!',
  'IF YOU CAN READ THIS, BEER ME \u{1F37A}',
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
  { id: 'usa', label: 'USA', swatch: '#000000' },
] as const;
const COLOR_PRESETS = PRESETS.slice(0, 3);
const ANIMATED_PRESETS = PRESETS.slice(3);
const TEXT_TREATMENTS = [
  ['solid', 'Solid'], ['outline', 'Outline'],
  ['chrome', 'Chrome'], ['split', 'Split color'], ['hollow-glow', 'Hollow glow'],
  ['retro-3d', 'Retro 3D'], ['3d-glasses', '3D glasses'], ['pixel', 'Pixel'],
] as const;
const PRESET_DEMO_LABELS: Partial<Record<typeof PRESETS[number]['id'], string>> = {
  party: 'RAINBOW',
  disco: 'RAINBOW',
  lightning: 'LIGHTNING',
  siren: 'POLICE',
  heartbeat: 'HEARTBEAT',
  usa: 'USA',
};

const Index = () => {
  const navigate = useNavigate();
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showCustomColors, setShowCustomColors] = useState(false);
  const {
    text, setText, textColor, setTextColor, backgroundColor, setBackgroundColor,
    font, setFont, letterSpacing, setLetterSpacing, textCase, setTextCase, textTreatment, setTextTreatment,
    hasBlackOutline, setHasBlackOutline, hasShadow, setHasShadow, hasGlow, setHasGlow,
    scrollSpeed, setScrollSpeed, isWordFlash, setIsWordFlash, tapToAdvanceWords, setTapToAdvanceWords, preset, applyPreset,
    darkMode, toggleDarkMode, dualTextMode, toggleDualTextMode, disableAnimatedLook,
    scrollPosition, setScrollPosition,
  } = useTextDisplay();

  useLayoutEffect(() => {
    if (scrollPosition <= 0) return;
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: scrollPosition, behavior: 'instant' }));
    return () => window.cancelAnimationFrame(frame);
  }, [scrollPosition]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (dualTextMode) toggleDualTextMode();
  }, [dualTextMode, toggleDualTextMode]);

  const visibleMessages = showAllMessages ? QUICK_MESSAGES : QUICK_MESSAGES.slice(0, 9);
  const textColorLocked = preset === 'party' || preset === 'usa' || preset === 'lightning';
  const backgroundColorLocked = preset === 'disco' || preset === 'lightning' || preset === 'siren' || preset === 'heartbeat';
  const animatedLooksOn = ANIMATED_PRESETS.some((item) => item.id === preset);
  const lastAnimatedPreset = useRef<typeof ANIMATED_PRESETS[number]['id']>('party');

  useEffect(() => {
    if (animatedLooksOn) lastAnimatedPreset.current = preset as typeof ANIMATED_PRESETS[number]['id'];
  }, [animatedLooksOn, preset]);

  const renderPreset = (item: typeof PRESETS[number]) => (
    <button type="button" key={item.id} data-preset={item.id} className={`preset-tile ${preset === item.id ? 'selected' : ''}`} onClick={() => applyPreset(item.id)} aria-label={`${item.label} color effect`} title={item.label}>
      <span className="preset-swatch" style={{ background: item.swatch }}><span className="preset-demo-text">{PRESET_DEMO_LABELS[item.id] ?? 'TEXT'}</span></span>
      {preset === item.id && <Check size={16} aria-hidden="true" />}
    </button>
  );

  const openDisplay = () => {
    setScrollPosition(window.scrollY);
    navigate('/display');
  };

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

          <section className="control-card playback-card">
            <div className="section-heading compact-heading"><span className="step-number">2</span><div><h2>Choose how it displays</h2><p>Pick how your message moves across the screen</p></div></div>
            <div className="playback-control-group">
              <span className="field-label">Display mode</span>
              <div className="segmented-control two-options playback-mode-control" role="group" aria-label="Display mode">
                <button type="button" className={!isWordFlash ? 'selected' : ''} onClick={() => setIsWordFlash(false)} aria-pressed={!isWordFlash}>← Scroll</button>
                <button type="button" className={isWordFlash ? 'selected' : ''} onClick={() => setIsWordFlash(true)} aria-pressed={isWordFlash}>Word flash</button>
              </div>
              <p className="playback-help">{isWordFlash ? 'Shows one large word at a time.' : 'Moves the full message continuously from right to left.'}</p>
            </div>
            <div className={`playback-control-group advance-control-group ${!isWordFlash ? 'is-disabled' : ''}`} aria-disabled={!isWordFlash}>
              <span className="field-label">Advance words</span>
              <div className="segmented-control two-options playback-mode-control" role="group" aria-label="Advance words">
                <button type="button" disabled={!isWordFlash} className={!tapToAdvanceWords ? 'selected' : ''} onClick={() => setTapToAdvanceWords(false)} aria-pressed={!tapToAdvanceWords}>Automatic</button>
                <button type="button" disabled={!isWordFlash} className={tapToAdvanceWords ? 'selected' : ''} onClick={() => setTapToAdvanceWords(true)} aria-pressed={tapToAdvanceWords}>Tap screen</button>
              </div>
              <p className="playback-help">{!isWordFlash ? 'Available in Word flash mode.' : '\u00A0'}</p>
            </div>
            <SpeedSlider disabled={isWordFlash && tapToAdvanceWords} label={isWordFlash ? 'Word speed' : 'Scroll speed'} value={scrollSpeed} onChange={setScrollSpeed} />
            <p className="playback-help speed-disabled-help">{isWordFlash && tapToAdvanceWords ? 'Speed is controlled by your taps.' : '\u00A0'}</p>
          </section>

          <section className="control-card">
            <div className="section-heading compact-heading"><span className="step-number">3</span><div><h2>Choose the look</h2></div></div>
            <div className="look-group">
              <div className="look-group-heading"><strong>Color looks</strong><span>Customize the colors below</span></div>
              <div className="preset-grid color-presets">{COLOR_PRESETS.map(renderPreset)}</div>
            </div>
            <div className={`quick-heading color-picker-heading ${showCustomColors ? 'is-open' : ''}`}>
              <span>Custom colors</span>
              <button type="button" aria-expanded={showCustomColors} onClick={() => setShowCustomColors(!showCustomColors)}>
                {showCustomColors ? 'Hide colors' : 'Show colors'} <ChevronDown size={14} />
              </button>
            </div>
            {showCustomColors && (
              <div className="color-grid custom-colors">
                <ColorPicker label="Text color" value={textColor} onChange={setTextColor} simple disabled={textColorLocked} />
                <ColorPicker label="Background" value={backgroundColor} onChange={setBackgroundColor} simple disabled={backgroundColorLocked} />
              </div>
            )}
            <div className="divider" />
            <label className="field-label" htmlFor="font-select">Typeface</label>
            <select id="font-select" value={font} onChange={(event) => setFont(event.target.value as typeof font)}>
              <option value="display">Bold display</option><option value="handwriting">Marker</option><option value="monospace">Monospace</option><option value="serif">Classic serif</option><option value="condensed">Stencil</option><option value="rounded">Rounded</option><option value="arcade">Arcade</option><option value="varsity">Varsity</option>
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
              <div className="text-style-row">
                <span>Finishing</span>
                <div className="segmented-control text-effect-toggles">
                  <button type="button" className={hasBlackOutline ? 'selected' : ''} onClick={() => setHasBlackOutline(!hasBlackOutline)} aria-pressed={hasBlackOutline}>Black outline</button>
                  <button type="button" className={hasShadow ? 'selected' : ''} onClick={() => setHasShadow(!hasShadow)} aria-pressed={hasShadow}>Shadow</button>
                  <button type="button" className={hasGlow ? 'selected' : ''} onClick={() => setHasGlow(!hasGlow)} aria-pressed={hasGlow}>Glow</button>
                </div>
              </div>
            </div>
          </section>

          <section className="control-card animated-effects-card">
            <div className="section-heading compact-heading live-effects-heading">
              <span className="step-number"><Sparkles size={17} /></span>
              <div><h2>Live effects</h2><p>Bring your message to life</p></div>
              <button type="button" role="switch" aria-checked={animatedLooksOn} className={`animation-master-switch ${animatedLooksOn ? 'is-on' : ''}`} onClick={() => animatedLooksOn ? disableAnimatedLook() : applyPreset(lastAnimatedPreset.current)}>
                <b>{animatedLooksOn ? 'ON' : 'OFF'}</b><i aria-hidden="true" />
              </button>
            </div>
            <div className={`look-group animated-look-group ${animatedLooksOn ? 'animations-on' : 'animations-off'}`}>
              <div className="look-group-heading live-effects-helper"><span>Customize any color the effect does not animate</span></div>
              <div className="preset-grid animated-presets">{ANIMATED_PRESETS.map(renderPreset)}</div>
            </div>
          </section>
        </section>

        <aside className="preview-column">
          <div className="preview-sticky">
            <div className="preview-label"><span>LIVE PREVIEW</span><span className="live-dot" /> Ready</div>
            <button className="preview-frame" type="button" onClick={openDisplay} disabled={!text.trim()} aria-label="Display message full screen">
              <TextPreview />
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Index;
