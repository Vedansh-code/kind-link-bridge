import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://kind-link-bridge-backend-1.onrender.com";

interface NgoData {
  _id: string;
  name: string;
  description: string;
  city: string;
  category: string;
}

const getIconForCategory = (category: string) => {
  const lowercaseCat = category?.toLowerCase() || '';
  if (lowercaseCat.includes("education")) return "🎓";
  if (lowercaseCat.includes("environment")) return "🌱";
  if (lowercaseCat.includes("health")) return "🏥";
  if (lowercaseCat.includes("child")) return "🧸";
  return "🏢";
};

export default function SupportCauses() {
  const [ngos, setNgos] = useState<NgoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ngos`);
        if (!res.ok) throw new Error("Failed to fetch NGOs");
        const data = await res.json();
        setNgos(data);
      } catch (err) {
        toast.error("Failed to load NGOs from server");
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading NGOs...</div>;
  }

  if (ngos.length === 0) {
    return <div className="text-center py-10">No registered NGOs found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ngos.map((cause) => (
        <Card key={cause._id} className="card-hover border-0 bg-accent/50">
          <CardContent className="p-6">
            <div className="text-4xl mb-4 text-center">{getIconForCategory(cause.category)}</div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">{cause.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">{cause.description}</p>
            <p className="text-xs text-muted-foreground mb-4">📍 {cause.city}</p>
            <Button asChild variant="default" className="w-full">
              <Link to={`/ngo/${cause._id}`}>Learn More</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
