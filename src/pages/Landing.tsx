import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { FeatureCard } from "@/components/FeatureCard";
import { Navigation } from "@/components/Navigation";
import { Link, useNavigate } from "react-router-dom"; // ADDED useNavigate
import heroImage from "@/assets/hero-community.jpg";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"; // ADDED Dialog components
import signup from "@/pages/Signup"

export default function Landing() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Community coming together to help others"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 hero-gradient opacity-80"></div>
                </div>

                <Navigation variant="landing" />

                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
                        HopeConnect
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Connecting kindness with those who need it most.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <Button asChild variant="hero" size="lg" className="text-lg px-8 py-6">
                            <Link to="/signup">I'm a Donor</Link>
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="hero" size="lg" className="text-lg px-8 py-6 cursor-pointer">
                                    I'm a NGO
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-center">Welcome Partner</DialogTitle>
                                    <DialogDescription className="text-center text-lg mt-2">
                                        Are you already a registered member of our platform?
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 mt-6">
                                    <Button asChild size="lg" className="w-full text-lg bg-emerald-600 hover:bg-emerald-700">
                                        <Link to="/ngo-login">Yes, I'm already a member</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="w-full text-lg">
                                        <Link to="/ngo-register">No, I want to register</Link>
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                        What We Do
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        HopeConnect is a bridge between compassionate donors and
                        organizations making real change. We make giving simple,
                        transparent, and impactful by connecting you directly
                        with verified NGOs and showing you exactly where your
                        contributions go.
                    </p>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="py-16 bg-accent/50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <Card className="card-hover">
                            <CardContent className="p-8">
                                <div className="text-4xl mb-4">👥</div>
                                <h3 className="text-2xl font-bold mb-4 text-foreground">
                                    ✅ For Donors
                                </h3>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        <span>Easy sign-up process</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        <span>Secure donation platform</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        <span>Verified NGO partners</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        <span>Real-time impact tracking</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="card-hover">
                            <CardContent className="p-8">
                                <div className="text-4xl mb-4">🏢</div>
                                <h3 className="text-2xl font-bold mb-4 text-foreground">
                                    ✅ For NGOs / Organizations
                                </h3>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                        <span>Register your cause easily</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                        <span>Reach more potential donors</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                        <span>Showcase your impact</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                        <span>
                                            Manage donations efficiently
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Impact Stats Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
                        Our Impact So Far
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCard
                            icon="👥"
                            value="5200+"
                            label="Users"
                            delay={0}
                        />
                        <StatCard
                            icon="🏢"
                            value="120+"
                            label="NGOs Registered"
                            delay={200}
                        />
                        <StatCard
                            icon="💰"
                            value="25000000"
                            label="Donated"
                            delay={400}
                        />
                        <StatCard
                            icon="🍲"
                            value="45000+"
                            label="Meals Served"
                            delay={600}
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 bg-accent/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
                        Why Choose Us?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🔍"
                            title="Transparent"
                            description="You see where every rupee goes with detailed tracking and impact reports."
                        />
                        <FeatureCard
                            icon="🤖"
                            title="Smart"
                            description="ML-powered impact predictions help you make informed giving decisions."
                        />
                        <FeatureCard
                            icon="🤝"
                            title="Community-driven"
                            description="Together we create bigger change through collective action and shared purpose."
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Join today and make your impact.</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="hero" size="lg" className="text-lg px-8 py-6">
                            <Link to="/Signup">Sign Up as Donor</Link>
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="hero" size="lg" className="text-lg px-8 py-6 cursor-pointer">
                                    Sign Up as NGO
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-center">Welcome Partner</DialogTitle>
                                    <DialogDescription className="text-center text-lg mt-2">
                                        Are you already a registered member of our platform?
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 mt-6">
                                    <Button asChild size="lg" className="w-full text-lg bg-emerald-600 hover:bg-emerald-700">
                                        <Link to="/ngo-login">Yes, I'm already a member</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="w-full text-lg">
                                        <Link to="/ngo-register">No, I want to register</Link>
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </section>
        </div>
    );
}
