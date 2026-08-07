import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

function Routes() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/:rest*" component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider delayDuration={200}>
          <Routes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "Inter, system-ui, sans-serif",
                borderRadius: "10px",
                border: "1px solid #E2E8F0",
              },
            }}
          />
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
