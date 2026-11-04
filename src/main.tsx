import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DEMO_PREFILL } from './utils/demoDefaults';
import { seedDemoData } from './utils/demoSeed';

if (DEMO_PREFILL) seedDemoData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
