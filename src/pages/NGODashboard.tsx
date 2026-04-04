import { useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    LayoutDashboard,
    Heart,
    Calendar,
    Settings,
    Plus,
    MapPin,
    Building2,
    Users,
    CheckCircle2,
    AlertCircle,
    Clock,
    TrendingUp,
    DollarSign,
    Package
} from "lucide-react";

// Mock Data for Donations
const MOCK_DONATION_REQUESTS = [
    { id: 1, donor: "Amit Patel", item: "Textbooks (Grades 1-5)", quantity: "50 sets", status: "Pending", date: "2024-03-10" },
    { id: 2, donor: "Sarah Jenkins", item: "Winter Blankets", quantity: "20 units", status: "Approved", date: "2024-03-08" },
    { id: 3, donor: "Tech Corp Inc.", item: "Laptops", quantity: "5 units", status: "Completed", date: "2024-03-01" },
];

const NGODashboard = () => {
    const location = useLocation();
    const data = location.state;
    const [activeTab, setActiveTab] = useState("overview");

    // State for Events (Client-side only)
    const [events, setEvents] = useState([
        { id: 1, title: "Annual Fundraising Gala", date: "2024-04-15", location: "Grand Hall, Mumbai" },
        { id: 2, title: "Community Health Camp", date: "2024-03-30", location: "Sector 4 Community Center" }
    ]);
    const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "" });

    // If no data is passed (direct access), redirect back to register
    // In a real app, you'd fetch the NGO profile from the backend here.
    if (!data) {
        return <Navigate to="/ngo-register" replace />;
    }

    const handleAddEvent = () => {
        if (newEvent.title && newEvent.date) {
            setEvents([...events, { id: events.length + 1, ...newEvent }]);
            setNewEvent({ title: "", date: "", location: "" });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative flex flex-col">
            {/* Top Navbar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-emerald-600" />
                        <span className="font-bold text-xl text-slate-800 tracking-tight">NGO Partner Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900">{data.orgName}</p>
                            <p className="text-xs text-slate-500">{data.category}</p>
                        </div>
                        <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.orgName}`} />
                            <AvatarFallback>{data.orgName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <nav className="space-y-1">
                            {[
                                { id: "overview", label: "Overview", icon: LayoutDashboard },
                                { id: "donations", label: "Donations", icon: Heart },
                                { id: "events", label: "Events", icon: Calendar },
                                { id: "profile", label: "Profile Settings", icon: Settings },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <Card className="mt-6 border-emerald-100 bg-emerald-50/50">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-emerald-900">Verification Status</h4>
                                        <p className="text-xs text-emerald-700 mt-1">
                                            {data.isVerified ? "Pending Review" : "Unverified"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3 space-y-6">

                        {/* OVERVIEW TAB */}
                        {activeTab === "overview" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Impact Hours</CardTitle>
                                            <Clock className="h-4 w-4 text-emerald-600" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{data.hoursProvided}</div>
                                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Children Supported</CardTitle>
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{data.childrenConnected}</div>
                                            <p className="text-xs text-muted-foreground">Across {data.schoolsConnected} schools</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Active Needs</CardTitle>
                                            <Package className="h-4 w-4 text-orange-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">12</div>
                                            <p className="text-xs text-muted-foreground">Donation requests open</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Activity</CardTitle>
                                        <CardDescription>Latest updates from your organization profile.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <p className="text-sm text-slate-600">Profile created successfully for <span className="font-semibold text-slate-900">{data.orgName}</span></p>
                                                <span className="ml-auto text-xs text-slate-400">Just now</span>
                                            </div>
                                            {data.isVerified && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    <p className="text-sm text-slate-600">Verification documents uploaded for review</p>
                                                    <span className="ml-auto text-xs text-slate-400">Just now</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* DONATIONS TAB */}
                        {activeTab === "donations" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold tracking-tight">Donation Requests</h2>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700">Create New Request</Button>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Incoming Donations</CardTitle>
                                        <CardDescription>Track and manage contributions from donors.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {MOCK_DONATION_REQUESTS.map((req) => (
                                                <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-white transition-colors">
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-slate-900">{req.item}</p>
                                                        <p className="text-sm text-slate-500">From: {req.donor} • {req.quantity}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant={req.status === 'Completed' ? 'default' : req.status === 'Approved' ? 'secondary' : 'outline'}>
                                                            {req.status}
                                                        </Badge>
                                                        <Button size="sm" variant="ghost">Manage</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* EVENTS TAB */}
                        {activeTab === "events" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold tracking-tight">Events Management</h2>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Upcoming Events</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {events.map((event) => (
                                                <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border border-slate-100">
                                                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-md text-center min-w-[60px]">
                                                        <span className="block text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                        <span className="block text-xl font-bold">{new Date(event.date).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900">{event.title}</h4>
                                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                            <MapPin className="w-3 h-3" /> {event.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Post New Event</CardTitle>
                                            <CardDescription>Share your upcoming activities with donors.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Event Title</label>
                                                <Input
                                                    placeholder="e.g. Charity Run"
                                                    value={newEvent.title}
                                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Date</label>
                                                <Input
                                                    type="date"
                                                    value={newEvent.date}
                                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Location</label>
                                                <Input
                                                    placeholder="Event Venue"
                                                    value={newEvent.location}
                                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                                />
                                            </div>
                                            <Button onClick={handleAddEvent} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                <Plus className="w-4 h-4 mr-2" /> Post Event
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* PROFILE TAB (Read-only view of submitted data) */}
                        {activeTab === "profile" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Organization Profile</CardTitle>
                                                <CardDescription>Manage your public facing information.</CardDescription>
                                            </div>
                                            <Button variant="outline" size="sm">Edit Details</Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-500">Organization Name</label>
                                                <p className="font-semibold">{data.orgName}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-500">Category</label>
                                                <Badge variant="outline">{data.category}</Badge>
                                            </div>
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-sm font-medium text-slate-500">Mission Statement</label>
                                                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-md">
                                                    {data.about}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-500">Office Address</label>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    <span>{data.officeAddress}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-500">Operational Locations</label>
                                                <p>{data.locations}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Children Profiles</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {data.children?.map((child: any, i: number) => (
                                                <div key={i} className="p-4 rounded-lg border border-slate-200 flex flex-col gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-slate-800">{child.name}</span>
                                                        <Badge variant="secondary">Age {child.age}</Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-2">Needs: {child.currentNeeds}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default NGODashboard;
