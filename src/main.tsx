import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/vietnamese-400.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/vietnamese-400-italic.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/cormorant-garamond/vietnamese-600.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/be-vietnam-pro/vietnamese-300.css'
import '@fontsource/be-vietnam-pro/latin-300.css'
import '@fontsource/be-vietnam-pro/vietnamese-400.css'
import '@fontsource/be-vietnam-pro/latin-400.css'
import './index.css'
import { App } from './App'
import { LanguageProvider } from './lib/language'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
