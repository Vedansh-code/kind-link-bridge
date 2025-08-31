import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Heart, Users, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const featuredCauses = [
  {
    id: 1,
    name: "Udaan Educational Trust",
    mission: "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Delhi, Mumbai"
  },
  {
    id: 2,
    name: "GreenFuture Foundation",
    mission: "Building sustainable communities through environmental initiatives",
    image: "🌱",
    location: "Bangalore"
  },
  {
    id: 3,
    name: "Hope Healthcare",
    mission: "Providing essential medical care to rural communities",
    image: "🏥",
    location: "Chennai"
  }
];

export default function Dashboard() {
  const [username, setUsername] = useState("User");
  const [donations, setDonations] = useState(0);
  const [hours, setHours] = useState(0);
  const [causes, setCauses] = useState<string[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchDashboard = async (id: number) => {
    try {
      const res = await axios.get(`http://localhost:5000/dashboard/${id}`);
      setDonations(res.data.total_donations || 0);
      setHours(res.data.total_hours || 0);
      setCauses(res.data.causes || []);
      setMonthlyData(res.data.monthly || []);  
      setCategoryData(res.data.categories || []); 
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const userData = JSON.parse(storedUser);
    setUserId(userData.id);
    if (userData.username) setUsername(userData.username);
    fetchDashboard(userData.id);

    // Initialize Socket.io client
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Listen for donation updates
    newSocket.on(`donation-update-${userData.id}`, () => {
      fetchDashboard(userData.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation variant="dashboard" />
      
      <main className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {username}!</h1>
          <p className="text-muted-foreground">Here's your impact summary and new opportunities to help.</p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{donations}</div>
              <p className="text-xs text-muted-foreground">Your lifetime contributions</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Causes Supported</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{causes.length}</div>
              <p className="text-xs text-muted-foreground">{causes.join(", ") || "No causes yet"}</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volunteer Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{hours} Hours</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
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
                <BarChart data={monthlyData.length ? monthlyData : [{month:"-", amount:0}]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
                    data={categoryData.length ? categoryData : [{name:"None", value:100, color:"#ccc"}]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-muted-foreground">{item.name}</span>
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
            <p className="text-muted-foreground">Discover new organizations making a difference</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCauses.map((cause) => (
                <Card key={cause.id} className="card-hover border-0 bg-accent/50">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{cause.image}</div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{cause.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{cause.mission}</p>
                    <p className="text-xs text-muted-foreground mb-4">📍 {cause.location}</p>
                    <Button asChild variant="default" className="w-full">
                      <Link to={`/ngo/${cause.id}`}>Learn More</Link>
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
