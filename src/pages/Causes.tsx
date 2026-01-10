import { Navigation } from "@/components/Navigation";
import SupportCauses from "@/components/SupportCauses";

export default function Causes() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation variant="dashboard" />

      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Support a Cause
        </h1>
        <p className="text-muted-foreground mb-8">
          Discover organizations making a difference
        </p>

        <SupportCauses />
      </main>
    </div>
  );
}
