import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Heart, Users, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const monthlyData = [
    { month: "Aug", amount: 1200 },
    { month: "Sep", amount: 800 },
    { month: "Oct", amount: 2100 },
    { month: "Nov", amount: 1500 },
    { month: "Dec", amount: 1900 },
    { month: "Jan", amount: 2300 },
];

const categoryData = [
    { name: "Education", value: 40, color: "#1f77b4" },
    { name: "Healthcare", value: 30, color: "#ff7f0e" },
    { name: "Food", value: 20, color: "#2ca02c" },
    { name: "Shelter", value: 10, color: "#d62728" },
];

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
    return (
        <div className="min-h-screen bg-background">
            <Navigation variant="dashboard" />

            <main className="container mx-auto p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Welcome back, Jane!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's your impact summary and new opportunities to
                        help.
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
                                ₹1,480.00
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +12% from last month
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
                                8
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Across 4 categories
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
                                32 Hours
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
                                        data={categoryData}
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
                                                fill={entry.color}
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
