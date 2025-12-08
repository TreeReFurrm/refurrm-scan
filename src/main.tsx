import { loadStripe } from '@stripe/stripe-js';
// use process.env.VITE_STRIPE_PUBLISHABLE_KEY in your Vite app

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
