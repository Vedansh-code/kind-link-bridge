import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationProps {
  variant?: "landing" | "dashboard";
}

export function Navigation({ variant = "landing" }: NavigationProps) {
  if (variant === "dashboard") {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-xl text-foreground">HopeConnect</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/causes" className="text-muted-foreground hover:text-primary transition-colors">
                Find Causes
              </Link>
              <Link to="/impact" className="text-muted-foreground hover:text-primary transition-colors">
                My Impact
              </Link>
              <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                Events
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full text-xs"></span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Jane Doe</span>
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="font-bold text-xl text-white">HopeConnect</span>
        </Link>
      </div>
    </nav>
  );
}