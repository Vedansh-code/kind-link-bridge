import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { MapPin, CheckCircle, Heart, Loader2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://kind-link-bridge-backend-1.onrender.com";

export default function NGODetail() {
    const { id } = useParams();
    const [ngo, setNgo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [donationItems, setDonationItems] = useState("");
    const [donationAmount, setDonationAmount] = useState("");

    const categories = ["Education", "Health", "Food", "Arts", "Shelter"];
    const presetAmounts = ["₹500", "₹1,000", "₹2,500", "₹5,000"];
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserId(parsed.id);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleArrangeDonation = () => {
        if (!userId) {
            toast.error("You must be logged in to arrange a donation");
            navigate("/login");
            return;
        }
        if (!selectedCategory || !donationItems.trim()) {
            toast.error("Please select a category and specify the items");
            return;
        }

        const localDonations = JSON.parse(localStorage.getItem(`donations_${userId}`) || '[]');
        localDonations.push({
            amount: 0,
            ngoName: ngo.name || "Unknown NGO",
            category: selectedCategory,
            items: donationItems,
            date: new Date().toISOString()
        });
        localStorage.setItem(`donations_${userId}`, JSON.stringify(localDonations));

        toast.success("Goods donation pledge submitted successfully!");
        navigate("/thank-you");
    };

    useEffect(() => {
        const fetchNgo = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/ngos/${id}`);
                if (!res.ok) throw new Error("Failed to fetch NGO details");
                const data = await res.json();
                setNgo(data);
            } catch (err) {
                toast.error("Failed to load NGO details");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchNgo();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!ngo)
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                NGO not found
            </div>
        );

    // Helper to format impact key labels
    const formatLabel = (key: string) =>
        key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

    const childSpotlight = ngo.childrenInCare && ngo.childrenInCare.length > 0 ? ngo.childrenInCare[0] : null;

    return (
        <div className="min-h-screen bg-background">
            <Navigation variant="dashboard" />

            {/* Hero Header */}
            <section className="hero-gradient text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {ngo.name}
                        </h1>
                        <p className="text-xl opacity-90 mb-6">{ngo.tagline}</p>
                        <div className="flex items-center space-x-4">
                            {ngo.isVerified && (
                                <Badge
                                    variant="secondary"
                                    className="bg-white/20 text-white border-white/30"
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Verified Organization
                                </Badge>
                            )}
                            <div className="flex items-center space-x-1 text-white/80">
                                <MapPin className="h-4 w-4" />
                                <span>{ngo.city}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content + Donation Grid */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Us */}
                        <Card className="card-hover">
                            <CardHeader>
                                <CardTitle>About Us</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {ngo.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Child Spotlight */}
                        {childSpotlight && (
                            <Card className="card-hover border-l-4 border-l-primary">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Heart className="h-5 w-5 text-primary" />
                                        <span>Child Spotlight</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                                            👦
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">
                                                {childSpotlight.name}, Age{" "}
                                                {childSpotlight.age}
                                            </h3>
                                            <p className="text-muted-foreground mb-2">
                                                {childSpotlight.interests}
                                            </p>
                                            <p className="text-sm">
                                                <strong>Current Need:</strong>{" "}
                                                {childSpotlight.primaryNeeds}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Key Information */}
                        <Card className="card-hover">
                            <CardHeader>
                                <CardTitle>Key Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Category
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="mt-1"
                                        >
                                            {ngo.category}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Founded
                                        </p>
                                        <p className="font-medium">
                                            {new Date(ngo.foundedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Operating Locations
                                        </p>
                                        <p className="font-medium">
                                            {ngo.operatingLocations?.join(", ") || ngo.city}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Status
                                        </p>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <CheckCircle className="h-4 w-4 text-success" />
                                            <span className="text-success font-medium">
                                                {ngo.isVerified
                                                    ? "Verified"
                                                    : "Unverified"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Impact Stats */}
                        {ngo.impactMetrics && (
                            <Card className="card-hover">
                                <CardHeader>
                                    <CardTitle>Our Impact So Far</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {Object.entries(ngo.impactMetrics).map(
                                            ([key, value]) => {
                                                if (key === "_id") return null;
                                                return (
                                                    <div
                                                        key={key}
                                                        className="text-center"
                                                    >
                                                        <StatCard
                                                            icon="📊"
                                                            value={String(value)}
                                                            label={formatLabel(key)}
                                                        />
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Donation Widget */}
                    <div className="lg:sticky lg:top-8">
                        <Card className="card-hover">
                            <CardHeader>
                                <CardTitle>Make a Donation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="goods" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="goods">
                                            Donate Goods
                                        </TabsTrigger>
                                        <TabsTrigger value="money">
                                            Donate Money
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value="goods"
                                        className="space-y-4 mt-4"
                                    >
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Select Category
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map((category) => (
                                                    <Button
                                                        key={category}
                                                        variant={
                                                            selectedCategory ===
                                                            category
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedCategory(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        {category}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Specify Items
                                            </label>
                                            <Textarea
                                                placeholder="e.g., 10 notebooks, 5 geometry boxes..."
                                                value={donationItems}
                                                onChange={(e) =>
                                                    setDonationItems(
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                            />
                                        </div>

                                        <Button
                                            className="w-full"
                                            size="lg"
                                            variant="cta"
                                            onClick={handleArrangeDonation}
                                        >
                                            Arrange Donation
                                        </Button>
                                    </TabsContent>

                                    <TabsContent
                                        value="money"
                                        className="space-y-4 mt-4"
                                    >
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Choose Amount
                                            </label>
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                {presetAmounts.map((amount) => (
                                                    <Button
                                                        key={amount}
                                                        variant={
                                                            donationAmount ===
                                                            amount
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        onClick={() =>
                                                            setDonationAmount(
                                                                amount
                                                            )
                                                        }
                                                    >
                                                        {amount}
                                                    </Button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Custom amount"
                                                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                value={
                                                    donationAmount.startsWith(
                                                        "₹"
                                                    )
                                                        ? ""
                                                        : donationAmount
                                                }
                                                onChange={(e) =>
                                                    setDonationAmount(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <Button
                                            asChild
                                            className="w-full"
                                            size="lg"
                                            variant="success"
                                        >
                                            <Link to="/payment" state={{ ngo, amount: donationAmount || "₹1,000" }}>
                                                Donate Now
                                            </Link>
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
