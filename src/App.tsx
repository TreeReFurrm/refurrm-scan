import { loadStripe } from '@stripe/stripe-js';
// use process.env.VITE_STRIPE_PUBLISHABLE_KEY in your Vite app
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Rescue from "./pages/Rescue";
import Stories from "./pages/Stories";
import Scanner from "./pages/Scanner";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import FacilityPortal from "./pages/FacilityPortal";
import ImpactDashboard from "./pages/ImpactDashboard";
import Marketplace from "./pages/Marketplace";
import MobileCamper from "./pages/MobileCamper";
import Resources from "./pages/Resources";
import Shop from "./pages/Shop";

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
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
