import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/index.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <AppProvider>
        <AuthProvider>
          <TooltipProvider>
            <Component {...pageProps} />
            <Toaster />
            <Sonner />
            <SpeedInsights />
          </TooltipProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
