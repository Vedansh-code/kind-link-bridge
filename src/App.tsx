// App.tsx - CORRECTED VERSION

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // CHANGE: BrowserRouter -> HashRouter
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NGODetail from "./pages/NGODetail";
import Payment from "./pages/Payment";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import MyImpact from "./pages/MyImpact";
import SupportCauses from "./pages/SupportCauses";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter> {/* CHANGE: BrowserRouter -> HashRouter */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* ADDED a placeholder for your missing routes */}
          <Route path="/causes" element={<SupportCauses />} />
          <Route path="/impact" element={<MyImpact />} />
          <Route path="/events" element={<div>Events Page</div>} />

          <Route path="/ngo/:id" element={<NGODetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;