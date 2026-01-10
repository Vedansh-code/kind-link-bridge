import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-scale-in">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-success rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-foreground">Thank You!</h1>
          
          <p className="text-lg text-foreground mb-4 leading-relaxed">
            Your submission has been received. We are incredibly grateful for your generosity.
          </p>
          
          <p className="text-muted-foreground mb-8">
            A confirmation receipt will be sent to your email shortly.
          </p>
          
          <Button asChild className="w-full" size="lg">
            <Link to="/dashboard">Back to Home Page</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}