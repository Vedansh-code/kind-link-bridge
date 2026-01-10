import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const featuredCauses = [
  {
    id: 1,
    name: "Hope Foundation",
    mission: "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Delhi",
  },
  {
    id: 2,
    name: "Sunshine Home",
    mission: "Building sustainable communities through environmental initiatives",
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
    mission: "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Mumbai",
  },
  {
    id: 5,
    name: "Green Future Initiative",
    mission: "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Delhi",
  },
  {
    id: 6,
    name: "Health for All",
    mission: "Empowering children through quality education in underserved communities",
    image: "🎓",
    location: "Kolkata",
  },
];

export default function SupportCauses() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredCauses.map((cause) => (
        <Card key={cause.id} className="card-hover border-0 bg-accent/50">
          <CardContent className="p-6">
            <div className="text-4xl mb-4 text-center">{cause.image}</div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">{cause.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{cause.mission}</p>
            <p className="text-xs text-muted-foreground mb-4">📍 {cause.location}</p>
            <Button asChild variant="default" className="w-full">
              <Link to={`/ngo/${cause.id}`}>Learn More</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
