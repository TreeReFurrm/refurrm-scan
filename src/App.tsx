import { loadStripe } from '@stripe/stripe-js';
// use process.env.VITE_STRIPE_PUBLISHABLE_KEY in your Vite app
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/index";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import NotFound from "./pages/404";
import Rescue from "./pages/rescue";
import Stories from "./pages/stories";
import Scanner from "./pages/scanner";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Admin from "./pages/admin";
import Analytics from "./pages/analytics";
import Community from "./pages/community";
import FacilityPortal from "./pages/facility";
import ImpactDashboard from "./pages/impact";
import Marketplace from "./pages/marketplace";
import MobileCamper from "./pages/camper";
import Resources from "./pages/resources";
import Shop from "./pages/shop";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/rescue", element: <Rescue /> },
    { path: "/stories", element: <Stories /> },
    { path: "/scanner", element: <ProtectedRoute><Scanner /></ProtectedRoute> },
    { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
    { path: "/admin", element: <ProtectedRoute><Admin /></ProtectedRoute> },
    { path: "/analytics", element: <ProtectedRoute><Analytics /></ProtectedRoute> },
    { path: "/community", element: <Community /> },
    { path: "/facility", element: <ProtectedRoute><FacilityPortal /></ProtectedRoute> },
    { path: "/impact", element: <ImpactDashboard /> },
    { path: "/marketplace", element: <Marketplace /> },
    { path: "/camper", element: <MobileCamper /> },
    { path: "/resources", element: <Resources /> },
    { path: "/shop", element: <Shop /> },
    { path: "/terms", element: <Terms /> },
    { path: "/privacy", element: <Privacy /> },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
          <VercelAnalytics />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
