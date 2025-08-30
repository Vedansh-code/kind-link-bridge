import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { MapPin, CheckCircle, Heart } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ngos } from "@/data/ngos";

export default function NGODetail() {
    const { id } = useParams();
    const ngo = ngos.find((n) => String(n.id) === id);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [donationItems, setDonationItems] = useState("");
    const [donationAmount, setDonationAmount] = useState("");

    const categories = ["Education", "Health", "Food", "Arts", "Shelter"];
    const presetAmounts = ["₹500", "₹1,000", "₹2,500", "₹5,000"];

    if (!ngo)
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                NGO not found
            </div>
        );

    // Helper to format impact key labels
    const formatLabel = (key) =>
        key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

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
                            {ngo.verified && (
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
                                <span>{ngo.locations}</span>
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
                                <p className="text-muted-foreground leading-relaxed">
                                    {ngo.about}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Child Spotlight */}
                        <Card className="card-hover border-l-4 border-l-primary">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Heart className="h-5 w-5 text-primary" />
                                    <span>Child Spotlight</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                                        👦
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">
                                            {ngo.childSpotlight.name}, Age{" "}
                                            {ngo.childSpotlight.age}
                                        </h3>
                                        <p className="text-muted-foreground mb-2">
                                            {ngo.childSpotlight.hobbies}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Current Need:</strong>{" "}
                                            {ngo.childSpotlight.needs}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

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
                                            {ngo.founded}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Locations
                                        </p>
                                        <p className="font-medium">
                                            {ngo.locations}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Status
                                        </p>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <CheckCircle className="h-4 w-4 text-success" />
                                            <span className="text-success font-medium">
                                                {ngo.verified
                                                    ? "Verified"
                                                    : "Unverified"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Impact Stats */}
                        <Card className="card-hover">
                            <CardHeader>
                                <CardTitle>Our Impact So Far</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {Object.entries(ngo.impact).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="text-center"
                                            >
                                                <StatCard
                                                    icon="📊"
                                                    value={value}
                                                    label={formatLabel(key)}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
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
                                        className="space-y-4"
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
                                        >
                                            Arrange Donation
                                        </Button>
                                    </TabsContent>

                                    <TabsContent
                                        value="money"
                                        className="space-y-4"
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
                                            <Link to="/payment">
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
