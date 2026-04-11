import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const BACKEND_URL = "https://kind-link-bridge-backend-1.onrender.com";


interface NavigationProps {
  variant?: "landing" | "dashboard";
}

export function Navigation({ variant = "landing" }: NavigationProps) {
  const [username, setUsername] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) return JSON.parse(stored).username || "User";
    } catch (e) { }
    return "User";
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.username) {
          setUsername(userData.username);
        }
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const generateNotifications = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      try {
        const userData = JSON.parse(storedUser);
        const userId = userData.id || userData._id || 'default';
        const newNotifications: any[] = [];
        const now = new Date();

        // 1. Donations
        const donationsKey = `donations_${userId}`;
        const donations = JSON.parse(localStorage.getItem(donationsKey) || "[]");
        donations.forEach((d: any, i: number) => {
          newNotifications.push({
            id: `don_${i}`,
            message: `You donated ₹${d.amount} to ${d.ngoName} 🎓`,
            date: new Date(d.date || now).getTime()
          });
        });

        // 2 & 3. Organized Events and upcoming event reminders
        const eventsKey = `events_${userId}`;
        const events = JSON.parse(localStorage.getItem(eventsKey) || "[]");
        events.forEach((e: any, i: number) => {
          // Whenever organize an event
          newNotifications.push({
            id: `evt_org_${i}`,
            message: `You scheduled a ${e.eventType || 'event'} at ${e.ngoName} 📅`,
            date: new Date(e.date || now).getTime() - 1000 // Slightly older so reminders pop up first
          });

          if (e.date) {
            const eventDate = new Date(e.date);
            if (!isNaN(eventDate.getTime())) {
              const timeDiff = eventDate.getTime() - now.getTime();
              const daysDiff = timeDiff / (1000 * 3600 * 24);

              // A day before any future event (between 0 and 2 days away)
              if (daysDiff > 0 && daysDiff <= 2) {
                newNotifications.push({
                  id: `evt_rem_${i}`,
                  message: `Reminder: Your event at ${e.ngoName} is tomorrow! ⏰`,
                  date: now.getTime() // Mark as very recent
                });
              }
            }
          }
        });

        // Add a default if empty
        if (newNotifications.length === 0) {
          newNotifications.push({
            id: 'default_1',
            message: 'Your impact report is ready 📊',
            date: now.getTime() - 100000
          });
        }

        // Sort descending by date
        newNotifications.sort((a, b) => b.date - a.date);

        // Keep top limit
        const topNotifs = newNotifications.slice(0, 5);
        setNotifications(topNotifs);

        // We consider them unread if there are dynamic actions
        setHasUnreadNotifications(events.length > 0 || donations.length > 0);
      } catch (err) {
        console.error("Error generating notifications", err);
      }
    };

    generateNotifications();
    // Refresh periodically in case of additions
    const interval = setInterval(generateNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // 🔴 REQUIRED
      });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      // Clean frontend state
      localStorage.removeItem("user");
      navigate("/"); // or "/login"
    }
  };


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
              <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/smart-donation" className="text-muted-foreground hover:text-primary transition-colors">
                Smart Donation
              </Link>
              <Link to="/causes" className="text-muted-foreground hover:text-primary transition-colors">
                Find Causes
              </Link>
              <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                Events
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative" onClick={() => setHasUnreadNotifications(false)}>
                  <Bell className="h-5 w-5" />
                  {hasUnreadNotifications && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full text-xs"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-h-[300px] overflow-y-auto">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className="text-sm cursor-default">
                    {notif.message}
                  </DropdownMenuItem>
                ))}
                {notifications.length === 0 && (
                  <DropdownMenuItem className="text-muted-foreground">No new notifications</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer flex items-center">
                    👤 My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  🚪 Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    );
  }

  // Landing variant
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="font-bold text-xl text-white">
            HopeConnect
          </span>
        </Link>
      </div>
    </nav>
  );
}
