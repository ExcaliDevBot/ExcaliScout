// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {SpeedInsights} from "@vercel/speed-insights/dist/react/index";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
<SpeedInsights/>
