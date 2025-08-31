import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Heart, Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function Impact() {
  const [donations, setDonations] = useState(0);
  const [hours, setHours] = useState(0);
  const [causes, setCauses] = useState<string[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        fetch(`http://localhost:5000/dashboard/${userData.id}`)
          .then((res) => res.json())
          .then((data) => {
            setDonations(data.total_donations || 0);
            setHours(data.total_hours || 0);
            setCauses(data.causes || []);
            setMonthlyData(data.monthly || []);
            setCategoryData(data.categories || []);
          })
          .catch((err) => console.error("Error fetching impact:", err));
      } catch (err) {
        console.error("Error parsing user", err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation variant="dashboard" />


      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Your Impact</h1>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{donations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Causes Supported</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{causes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Volunteer Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{hours} Hours</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData.length ? monthlyData : [{month:"-", amount:0}]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => [`₹${v}`, "Amount"]} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
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
                  >
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color || "#8884d8"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
