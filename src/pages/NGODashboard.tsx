import { useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
    Package,
    Loader2,
    Phone
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://kind-link-bridge-backend-1.onrender.com";

const NGODashboard = () => {
    const location = useLocation();
    const [ngoData, setNgoData] = useState<any>(location.state || null);
    const [activeTab, setActiveTab] = useState("overview");

    const [donations, setDonations] = useState<any[]>([]);
    const [visits, setVisits] = useState<any[]>([]);
    const [callbacks, setCallbacks] = useState<any[]>([]);
    const [loadingDonations, setLoadingDonations] = useState(false);
    const [loadingVisits, setLoadingVisits] = useState(false);
    const [loadingCallbacks, setLoadingCallbacks] = useState(false);

    // State for Events (Client-side only)
    const [events, setEvents] = useState([
        { id: 1, title: "Annual Fundraising Gala", date: "2024-04-15", location: "Grand Hall, Mumbai" },
        { id: 2, title: "Community Health Camp", date: "2024-03-30", location: "Sector 4 Community Center" }
    ]);
    const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "" });

    const fetchNgoProfile = async (ngoId: string) => {
        try {
            const profileRes = await fetch(`${BACKEND_URL}/api/ngos/${ngoId}`);
            if (profileRes.ok) {
                const profile = await profileRes.json();
                const dashboardData = {
                    id: profile._id || profile.id,
                    orgName: profile.name,
                    category: profile.category,
                    about: profile.description,
                    isVerified: profile.isVerified,
                    hoursProvided: profile.impactMetrics?.hoursProvided || 0,
                    childrenConnected: profile.impactMetrics?.childrenConnected || 0,
                    schoolsConnected: profile.impactMetrics?.schoolsConnected || 0,
                    officeAddress: profile.city,
                    locations: profile.operatingLocations?.join(", ") || profile.city,
                    children: profile.childrenInCare?.map((c: any) => ({
                        name: c.name,
                        age: c.age,
                        interests: c.interests,
                        currentNeeds: c.primaryNeeds
                    })) || []
                };
                setNgoData(dashboardData);
            }
        } catch (err) {
            console.error("Failed to fetch NGO profile", err);
        }
    };

    const fetchNgoActions = async (ngoId: string) => {
        setLoadingDonations(true);
        setLoadingVisits(true);
        setLoadingCallbacks(true);
        try {
            const donRes = await fetch(`${BACKEND_URL}/api/ngos/${ngoId}/donations`);
            if (donRes.ok) setDonations(await donRes.json());
        } catch (e) { console.error("Error fetching donations:", e); }
        finally { setLoadingDonations(false); }

        try {
            const visRes = await fetch(`${BACKEND_URL}/api/ngos/${ngoId}/visits`);
            if (visRes.ok) setVisits(await visRes.json());
        } catch (e) { console.error("Error fetching visits:", e); }
        finally { setLoadingVisits(false); }

        try {
            const cbRes = await fetch(`${BACKEND_URL}/api/ngos/${ngoId}/callbacks`);
            if (cbRes.ok) setCallbacks(await cbRes.json());
        } catch (e) { console.error("Error fetching callbacks:", e); }
        finally { setLoadingCallbacks(false); }
    };

    useEffect(() => {
        const stored = localStorage.getItem("user");
        let ngoId = "";
        if (location.state && (location.state.id || location.state._id)) {
            ngoId = location.state.id || location.state._id;
        } else if (stored) {
            try {
                const userObj = JSON.parse(stored);
                if (userObj.role === 'ngo' && userObj.id) {
                    ngoId = userObj.id;
                    if (!ngoData) {
                        fetchNgoProfile(ngoId);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
        
        if (ngoId) {
            fetchNgoActions(ngoId);
        }
    }, [location.state]);

    const handleAddEvent = () => {
        if (newEvent.title && newEvent.date) {
            setEvents([...events, { id: events.length + 1, ...newEvent }]);
            setNewEvent({ title: "", date: "", location: "" });
        }
    };

    if (!ngoData) {
        const stored = localStorage.getItem("user");
        if (!stored) {
            return <Navigate to="/ngo-register" replace />;
        }
        try {
            const userObj = JSON.parse(stored);
            if (userObj.role !== 'ngo') {
                return <Navigate to="/ngo-register" replace />;
            }
        } catch (e) {
            return <Navigate to="/ngo-register" replace />;
        }
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    const data = ngoData;

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
                                { id: "visits", label: "Visits", icon: Calendar },
                                { id: "callbacks", label: "Callbacks", icon: Phone },
                                { id: "events", label: "Events", icon: Clock },
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
                                            {loadingDonations ? (
                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                                    Loading donations...
                                                </p>
                                            ) : donations.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No donations received yet.</p>
                                            ) : (
                                                donations.map((req) => (
                                                    <div key={req._id || req.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-white transition-colors">
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-slate-900">{req.itemsDescription || "General Donation"}</p>
                                                            <p className="text-sm text-slate-500">From: {req.userName || "Anonymous"} • Received on: {req.date ? new Date(req.date).toLocaleDateString() : "N/A"}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Badge variant="default">
                                                                Pledge
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* VISITS TAB */}
                        {activeTab === "visits" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold tracking-tight">Scheduled Visits</h2>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Visitor Logs</CardTitle>
                                        <CardDescription>View and manage visits scheduled by volunteers.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {loadingVisits ? (
                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                                    Loading visits...
                                                </p>
                                            ) : visits.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No visits scheduled yet.</p>
                                            ) : (
                                                visits.map((req) => (
                                                    <div key={req._id || req.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-white transition-colors">
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-slate-900">Visit Scheduled</p>
                                                            <p className="text-sm text-slate-500">Visitor: {req.userName || "Anonymous"} • Date: {req.date || "N/A"}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Badge variant={req.status === 'Completed' ? 'default' : req.status === 'Approved' ? 'secondary' : 'outline'}>
                                                                {req.status || 'Pending'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* CALLBACKS TAB */}
                        {activeTab === "callbacks" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold tracking-tight">Callback Requests</h2>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Requested Callbacks</CardTitle>
                                        <CardDescription>Contact request logs from interested donors.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {loadingCallbacks ? (
                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                                    Loading callbacks...
                                                </p>
                                            ) : callbacks.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No callback requests yet.</p>
                                            ) : (
                                                callbacks.map((req) => (
                                                    <div key={req._id || req.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-white transition-colors">
                                                        <div className="space-y-1">
                                                            <p className="font-semibold text-slate-900">Callback Requested</p>
                                                            <p className="text-sm text-slate-500">User: {req.userName || "Anonymous"} • Requested on: {req.date ? new Date(req.date).toLocaleString() : "N/A"}</p>
                                                            {req.phoneNumber && (
                                                                <p className="text-sm font-mono text-emerald-600">📞 {req.phoneNumber}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Badge variant="outline">
                                                                Requested
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
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
