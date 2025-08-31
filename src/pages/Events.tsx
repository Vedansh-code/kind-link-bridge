import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrganizationCard } from "@/components/OrganizationCard";
import { EventsTable } from "@/components/EventsTable";
import { EventScheduleModal } from "@/components/EventScheduleModal";
import { CheckCircle, Users, Calendar, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Events = () => {
  const [selectedNGO, setSelectedNGO] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const organizations = [
    {
      id: "1",
      name: "Asha Children's Home",
      location: "Delhi, India",
      focus: "Education & Shelter for Girls",
      residents: "Approx. 50 children",
    },
    {
      id: "2", 
      name: "Hope Foundation",
      location: "Mumbai, India",
      focus: "Street Children Rehabilitation",
      residents: "Approx. 75 children",
    },
    {
      id: "3",
      name: "Little Stars Orphanage",
      location: "Bangalore, India", 
      focus: "Special Needs Children Care",
      residents: "Approx. 35 children",
    },
    {
      id: "4",
      name: "Bright Future Trust",
      location: "Chennai, India",
      focus: "Education & Skill Development",
      residents: "Approx. 60 children",
    },
    {
      id: "5",
      name: "Rainbow Children's Center",
      location: "Pune, India",
      focus: "Holistic Child Development",
      residents: "Approx. 40 children",
    },
    {
      id: "6",
      name: "Sunrise Shelter",
      location: "Kolkata, India",
      focus: "Emergency Child Care",
      residents: "Approx. 55 children",
    },
  ];

  const userEvents = [
    {
      id: "1",
      ngoName: "Asha Children's Home",
      eventDate: "Oct 25, 2025",
      status: "pending" as const,
    },
    {
      id: "2", 
      ngoName: "Hope Foundation",
      eventDate: "Aug 15, 2025",
      status: "confirmed" as const,
    },
    {
      id: "3",
      ngoName: "Little Stars Orphanage", 
      eventDate: "Jul 05, 2025",
      status: "completed" as const,
    },
  ];

  const handleScheduleEvent = (ngoName: string) => {
    setSelectedNGO(ngoName);
    setIsModalOpen(true);
  };

  const howItWorksSteps = [
    {
      number: "1",
      title: "Choose an NGO",
      description: "Browse our list of verified partners and find a cause that resonates with you.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "2", 
      title: "Propose Your Event",
      description: "Select a date and fill out a simple form with your event idea.",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      number: "3",
      title: "Collaborate & Confirm", 
      description: "The NGO will review your request and contact you to finalize the details.",
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-soft-gradient">
        <Navigation variant="dashboard" />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-orange mb-6">
            Host a Memorable Event
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Connect directly with our partner NGOs and orphanages to create a day of joy and learning for their residents.
          </p>
          <Button variant="secondary" size="lg" className="mt-8 text-lg px-8 py-4">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* How It Works Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Creating meaningful connections with children in need is simple and rewarding
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-card p-8 rounded-xl shadow-soft hover:shadow-medium transition-smooth text-center h-full">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="text-primary">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {step.number}. {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Find an Organization Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find an Organization
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our trusted partner organizations and start making a difference today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <OrganizationCard
                key={org.id}
                name={org.name}
                location={org.location}
                focus={org.focus}
                residents={org.residents}
                onScheduleEvent={() => handleScheduleEvent(org.name)}
              />
            ))}
          </div>
        </section>

        {/* My Events Dashboard Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              My Events Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your past and upcoming events with our partner organizations
            </p>
          </div>
          
          <EventsTable events={userEvents} />
        </section>
      </div>

      {/* Event Schedule Modal */}
      <EventScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ngoName={selectedNGO}
      />
    </div>
  );
};

export default Events;