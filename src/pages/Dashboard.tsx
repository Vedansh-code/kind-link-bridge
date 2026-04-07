import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "@/components/Navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Heart, Users, Clock, TrendingUp, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { checkAuth } from "../lib/auth";

// 🔑 API Base URL (local vs deployed)
const API_BASE_URL = "https://kind-link-bridge-backend-1.onrender.com";

const featuredCauses = [
  {
    id: 1,
    name: "Hope Foundation",
    mission:
      "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Delhi",
  },
  {
    id: 2,
    name: "Sunshine Home",
    mission:
      "Building sustainable communities through environmental initiatives",
    image: "🌱",
    location: "Bangalore",
  },
  {
    id: 3,
    name: "Little Steps",
    mission: "Providing essential medical care to rural communities",
    image: "🏥",
    location: "Chennai",
  },
  {
    id: 4,
    name: "Smile Care Trust",
    mission:
      "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Mumbai",
  },
  {
    id: 5,
    name: "Green Future Initiative",
    mission:
      "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Delhi",
  },
  {
    id: 6,
    name: "Health for All",
    mission:
      "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Kolkata",
  },
];

export default function Dashboard() {
    const [username, setUsername] = useState(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) return JSON.parse(stored).username || "User";
        } catch (e) {}
        return "User";
    });
    const [donations, setDonations] = useState(0);
    const [hours, setHours] = useState(0);
    const [causes, setCauses] = useState<string[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [isProfileComplete, setIsProfileComplete] = useState(true);

    const fetchDashboard = async (id: number) => {
        try {
            // First, calculate local stats from mock donations
            const localDonations = JSON.parse(localStorage.getItem(`donations_${id}`) || '[]');
            let localTotal = 0;
            const causesSet = new Set<string>();
            const monthlyMap = new Map<string, number>();
            const categoryMap = new Map<string, number>();

            // Always add a baseline so chart isn't empty
            monthlyMap.set("Jan", 0);
            monthlyMap.set("Feb", 0);
            monthlyMap.set("Mar", 0);
            monthlyMap.set("Apr", 0);

            localDonations.forEach((d: any) => {
                localTotal += d.amount;
                if (d.ngoName) causesSet.add(d.ngoName);
                
                const date = new Date(d.date);
                const month = date.toLocaleString('default', { month: 'short' });
                monthlyMap.set(month, (monthlyMap.get(month) || 0) + d.amount);

                categoryMap.set(d.category, (categoryMap.get(d.category) || 0) + d.amount);
            });

            // Try backend fetch, merge if successful, otherwise fallback entirely
            let backendDonations = 0;
            let backendHours = 0;
            let backendCauses: string[] = [];
            let backendMonthly: any[] = [];
            let backendCategories: any[] = [];

            try {
                const res = await axios.get(`${API_BASE_URL}/dashboard/${id}`);
                backendDonations = res.data.total_donations || 0;
                backendHours = res.data.total_hours || 0;
                backendCauses = res.data.causes || [];
                backendMonthly = res.data.monthly || [];
                backendCategories = res.data.categories || [];
            } catch (err) {
                console.log("Backend not reachable, using local data only.");
            }

            const localEvents = JSON.parse(localStorage.getItem(`events_${id}`) || "[]");
            let localHours = 0;
            localEvents.forEach((e: any) => {
               localHours += (e.hours || 0);
               if (e.ngoName) causesSet.add(e.ngoName);
            });

            // Merge local and backend
            const combinedDonations = Math.max(localTotal, backendDonations);
            const combinedHours = Math.max(localHours, backendHours);
            
            const finalCauses = Array.from(new Set([...backendCauses, ...Array.from(causesSet)]));

            // Merge monthly
            backendMonthly.forEach((item: any) => {
                monthlyMap.set(item.month, Math.max(item.amount, monthlyMap.get(item.month) || 0));
            });
            const mergedMonthly = Array.from(monthlyMap.entries()).map(([month, amount]) => ({ month, amount }));

            // Merge categories
            backendCategories.forEach((item: any) => {
                categoryMap.set(item.name, Math.max(item.value, categoryMap.get(item.name) || 0));
            });
            const mergedCategories: any[] = [];
            const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#FF69B4", "#48D1CC", "#FFD700"];
            let i = 0;
            for (let [name, value] of categoryMap.entries()) {
                mergedCategories.push({ name, value, color: colors[i % colors.length] });
                i++;
            }

            setDonations(combinedDonations);
            setHours(combinedHours);
            setCauses(finalCauses);
            setMonthlyData(mergedMonthly.length ? mergedMonthly : [{ month: "-", amount: 0 }]);
            setCategoryData(mergedCategories.length ? mergedCategories : [{ name: "None", value: 100, color: "#ccc" }]);

        } catch (err) {
            console.error("Critical error building dashboard:", err);
        }
    };

    useEffect(() => {
        const initializeDashboard = async () => {
            try {
                // Ask backend to verify who is logged in via cookie
                const realUser = await checkAuth();
                
                if (realUser && !realUser.error) {
                    const userData = {
                        id: realUser._id || realUser.id,
                        username: realUser.username,
                        email: realUser.email
                    };
                    localStorage.setItem("user", JSON.stringify(userData));

                    setUserId(userData.id);
                    setUsername(userData.username);
                    fetchDashboard(userData.id);

                    const profileData = localStorage.getItem(`profile_${userData.id}`);
                    if (!profileData) {
                        setIsProfileComplete(false);
                    }

                    const newSocket = io(API_BASE_URL);
                    setSocket(newSocket);

                    newSocket.on(`donation-update-${userData.id}`, () => {
                        fetchDashboard(userData.id);
                    });
                }
            } catch (err) {
                console.error("Not authenticated", err);
            }
        };

        initializeDashboard();

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navigation variant="dashboard" />

            <main className="container mx-auto p-6">
                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Welcome back, {username}!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's your impact summary and new opportunities to
                        help.
                    </p>
                </div>

                {!isProfileComplete && (
                    <Alert className="mb-8 bg-primary/5 border-primary/20">
                        <Info className="h-4 w-4 text-primary" />
                        <AlertTitle>Complete your profile</AlertTitle>
                        <AlertDescription className="mt-2 flex items-center justify-between">
                            <span>Help us match you with the best causes by telling us your preferences.</span>
                            <Button asChild size="sm" variant="outline" className="ml-4 border-primary/20 hover:bg-primary/10 hover:text-primary">
                                <Link to="/profile">Complete Profile</Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Key Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Donations
                            </CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                ₹{donations}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Your lifetime contributions
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Causes Supported
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {causes.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {causes.join(", ") || "No causes yet"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Volunteer Hours
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {hours} Hours
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This quarter
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="card-hover">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <span>Monthly Contributions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={
                                        monthlyData.length
                                            ? monthlyData
                                            : [{ month: "-", amount: 0 }]
                                    }
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [
                                            `₹${value}`,
                                            "Amount",
                                        ]}
                                    />
                                    <Bar
                                        dataKey="amount"
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="card-hover">
                        <CardHeader>
                            <CardTitle>Donation Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={
                                            categoryData.length
                                                ? categoryData
                                                : [
                                                      {
                                                          name: "None",
                                                          value: 100,
                                                          color: "#ccc",
                                                      },
                                                  ]
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="hsl(var(--primary))"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color || "#8884d8"}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [
                                            `${value}%`,
                                            "Percentage",
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap gap-4 mt-4">
                                {categoryData.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        ></div>
                                        <span className="text-sm text-muted-foreground">
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

        {/* Featured Causes */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Support a Cause</CardTitle>
            <p className="text-muted-foreground">
              Discover new organizations making a difference
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCauses.map((cause) => (
                <Card
                  key={cause.id}
                  className="card-hover border-0 bg-accent/50"
                >
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">
                      {cause.image}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {cause.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {cause.mission}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      📍 {cause.location}
                    </p>
                    <Button
                      asChild
                      variant="default"
                      className="w-full"
                    >
                      <Link to={`/ngo/${cause.id}`}>
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
