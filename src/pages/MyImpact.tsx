import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { TrendingUp, Heart, Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://kind-link-bridge-backend-1.onrender.com";

export default function MyImpact() {
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

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) return;
                const user = JSON.parse(storedUser);
                const id = user.id;

                // local mock calculations
                const localDonations = JSON.parse(localStorage.getItem(`donations_${id}`) || '[]');
                let localTotal = 0;
                const causesSet = new Set<string>();
                const monthlyMap = new Map<string, number>();
                const categoryMap = new Map<string, number>();

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

                const localEvents = JSON.parse(localStorage.getItem(`events_${id}`) || "[]");
                let localHours = 0;
                localEvents.forEach((e: any) => {
                    localHours += (e.hours || 0);
                    if (e.ngoName) causesSet.add(e.ngoName);
                });

                // backend mock processing
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

                // merge
                const combinedDonations = Math.max(localTotal, backendDonations);
                const combinedHours = Math.max(localHours, backendHours);
                const finalCauses = Array.from(new Set([...backendCauses, ...Array.from(causesSet)]));

                backendMonthly.forEach((item: any) => {
                    monthlyMap.set(item.month, Math.max(item.amount, monthlyMap.get(item.month) || 0));
                });
                const mergedMonthly = Array.from(monthlyMap.entries()).map(([month, amount]) => ({ month, amount }));

                backendCategories.forEach((item: any) => {
                    categoryMap.set(item.name, Math.max(item.value, categoryMap.get(item.name) || 0));
                });
                const mergedCategories: any[] = [];
                const colors = ["#4f46e5", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#FF69B4", "#48D1CC", "#FFD700"];
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

        fetchDashboard();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navigation variant="dashboard" />

            <main className="container mx-auto p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Welcome back, {username}!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's your comprehensive impact summary and community footprint.
                    </p>
                </div>

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
                                Your collective financial impact
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
                                Active organizations
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
                                Volunteered to date
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-6">
                    My Impact Analytics
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Contributions */}
                    <Card className="card-hover">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <span>Monthly Contributions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
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
                                        fill="#4f46e5"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Donation Categories */}
                    <Card className="card-hover">
                        <CardHeader>
                            <CardTitle>Donation Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [
                                            `₹${value}`,
                                            "Donated",
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
                                        <span className="text-sm text-muted-foreground mr-2">
                                            {item.name} 
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
