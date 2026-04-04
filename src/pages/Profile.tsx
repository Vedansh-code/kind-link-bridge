import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Pimpri-Chinchwad", "Patna", "Vadodara"
].sort();

const CATEGORIES = ["Food", "Shelter", "Arts", "Education"];

export default function Profile() {
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    categories: [] as string[],
    location: "",
    minDonation: "",
    maxDonation: "",
    preferredType: "both",
    donationType: "both",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUsername(userData.username || "User");
        
        // Load existing profile if it exists (simulate or fetch from local config)
        const profileData = localStorage.getItem(`profile_${userData.id}`);
        if (profileData) {
          setFormData(JSON.parse(profileData));
        }
      } catch (err) {
        console.error("Error parsing user data", err);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, categories: [...prev.categories, category] };
      } else {
        return { ...prev, categories: prev.categories.filter((c) => c !== category) };
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call to save profile
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      localStorage.setItem(`profile_${userData.id}`, JSON.stringify(formData));
      toast({
        title: "Profile saved successfully",
        description: "Your preferences have been updated.",
      });
      navigate("/dashboard");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation variant="dashboard" />
      <main className="container mx-auto p-6 max-w-3xl">
        <Card className="mt-8 border-none shadow-lg">
          <CardHeader className="bg-primary/5 rounded-t-xl pb-8">
            <CardTitle className="text-3xl">Complete Your Profile</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              Tell us more about your giving preferences so we can recommend the best options for you, {username}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            
            {/* Preferred Category */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold border-b pb-2 flex">1. Preferred Category</Label>
              <p className="text-sm text-muted-foreground">Select the causes you are most passionate about.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cat-${category}`} 
                      checked={formData.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <label htmlFor={`cat-${category}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold border-b pb-2 flex">2. Location</Label>
              <p className="text-sm text-muted-foreground">Select your primary city for local impact opportunities.</p>
              <Select value={formData.location} onValueChange={(val) => setFormData({...formData, location: val})}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Donation Range */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold border-b pb-2 flex">3. Donation Range (₹)</Label>
              <p className="text-sm text-muted-foreground">What is your typical budget for donations?</p>
              <div className="flex items-center space-x-4 max-w-sm">
                <div className="space-y-1">
                  <Label htmlFor="minDonation" className="text-xs">Minimum</Label>
                  <Input 
                    id="minDonation" 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={formData.minDonation}
                    onChange={(e) => setFormData({...formData, minDonation: e.target.value})}
                  />
                </div>
                <div className="pt-5 text-muted-foreground">-</div>
                <div className="space-y-1">
                  <Label htmlFor="maxDonation" className="text-xs">Maximum</Label>
                  <Input 
                    id="maxDonation" 
                    type="number" 
                    placeholder="e.g. 5000"
                    value={formData.maxDonation}
                    onChange={(e) => setFormData({...formData, maxDonation: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Preferred Type */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold border-b pb-2 flex">4. Preferred Type of Organisation</Label>
              <p className="text-sm text-muted-foreground">Do you prefer supporting NGOs or Orphanages?</p>
              <RadioGroup 
                value={formData.preferredType} 
                onValueChange={(val) => setFormData({...formData, preferredType: val})}
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ngo" id="type-ngo" />
                  <Label htmlFor="type-ngo" className="cursor-pointer">NGO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="orphanage" id="type-orphanage" />
                  <Label htmlFor="type-orphanage" className="cursor-pointer">Orphanage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="type-both" />
                  <Label htmlFor="type-both" className="cursor-pointer">Both</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Donation Types */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold border-b pb-2 flex">5. Types of Donation</Label>
              <p className="text-sm text-muted-foreground">How would you like to contribute?</p>
              <RadioGroup 
                value={formData.donationType} 
                onValueChange={(val) => setFormData({...formData, donationType: val})}
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="money" id="donate-money" />
                  <Label htmlFor="donate-money" className="cursor-pointer">Arranging money</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="goods" id="donate-goods" />
                  <Label htmlFor="donate-goods" className="cursor-pointer">Arranging goods</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="donate-both" />
                  <Label htmlFor="donate-both" className="cursor-pointer">Both</Label>
                </div>
              </RadioGroup>
            </div>

          </CardContent>
          <CardFooter className="bg-muted/20 py-4 flex justify-between rounded-b-xl border-t mt-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
