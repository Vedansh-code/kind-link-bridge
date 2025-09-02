// App.tsx - CORRECTED VERSION

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // CHANGE: BrowserRouter -> HashRouter
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NGODetail from "./pages/NGODetail";
import Payment from "./pages/Payment";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import Impact from "@/pages/Impact";
import Causes from "./pages/Causes";
import Events from "./pages/Events";
import Login from "./pages/Login";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter> {/* CHANGE: BrowserRouter -> HashRouter */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* ADDED a placeholder for your missing routes */}
          <Route path="/causes" element={<Causes />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/events" element={<Events />} />

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