import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Heart } from "lucide-react";

interface OrganizationCardProps {
  name: string;
  location: string;
  focus: string;
  residents: string;
  onScheduleEvent: () => void;
}

export const OrganizationCard = ({ 
  name, 
  location, 
  focus, 
  residents, 
  onScheduleEvent 
}: OrganizationCardProps) => {
  return (
    <Card className="h-full transition-smooth hover:shadow-medium hover:scale-[1.02] group cursor-pointer bg-soft-gradient border-0 shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <Heart className="h-5 w-5 text-secondary group-hover:text-secondary-hover transition-colors" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          {location}
        </div>
        
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary border-primary/20">
            {focus}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2 text-accent" />
          {residents}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onScheduleEvent}
          variant="secondary"
          className="w-full font-medium"
        >
          Schedule an Event
        </Button>
      </CardFooter>
    </Card>
  );
};