import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/press-start-2p/400.css'
import '@fontsource/permanent-marker/latin-400.css'
import '@fontsource/black-ops-one/latin-400.css'
import '@fontsource/fredoka/latin-700.css'
import '@fontsource/bungee/latin-400.css'
import '@fontsource/graduate/latin-400.css'

createRoot(document.getElementById("root")!).render(<App />);
