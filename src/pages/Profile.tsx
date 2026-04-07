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
import { MapPin } from "lucide-react";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow",
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Pimpri-Chinchwad", "Patna", "Vadodara"
].sort();
const CATEGORIES = ["Food", "Shelter", "Health", "Arts", "Education"];

export default function Profile() {
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    categories: [] as string[],
    location: "",
    houseNumber: "",
    street: "",
    landmark: "",
    pincode: "",
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
          const parsedProfile = JSON.parse(profileData);
          setFormData((prev) => ({
            ...prev,
            ...parsedProfile,
            username: parsedProfile.username !== undefined ? parsedProfile.username : userData.username || "",
            email: parsedProfile.email !== undefined ? parsedProfile.email : userData.email || "",
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            username: userData.username || "",
            email: userData.email || "",
          }));
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation is not supported by your browser.", variant: "destructive" });
      return;
    }
    
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode using OpenStreetMap
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data && data.address) {
            // Try to match with our subset of Indian cities, else keep empty / current
            const foundCity = INDIAN_CITIES.find(c => 
              data.address.city?.includes(c) || 
              data.address.state_district?.includes(c) ||
              c.includes(data.address.city)
            );
            
            setFormData(prev => ({
              ...prev,
              location: foundCity || prev.location, // auto selects city dropdown if matched
              pincode: data.address.postcode || prev.pincode,
              street: data.address.road || data.address.suburb || data.address.neighbourhood || prev.street,
            }));
            
            toast({ title: "Location fetched", description: "We've auto-filled your location details as best as possible." });
          }
        } catch (error) {
          toast({ title: "Error", description: "Could not fetch address details.", variant: "destructive" });
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        toast({ title: "Error", description: "Permission denied or could not get location.", variant: "destructive" });
      }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call to save profile
    await new Promise((resolve) => setTimeout(resolve, 800));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      
      // Update global user object
      userData.username = formData.username;
      userData.email = formData.email;
      localStorage.setItem("user", JSON.stringify(userData));
      setUsername(formData.username);

      localStorage.setItem(`profile_${userData.id}`, JSON.stringify(formData));
      toast({
        title: "Profile saved successfully",
        description: "Your preferences and personal details have been updated.",
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

            {/* Personal Information */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold border-b pb-2 flex">1. Personal Information</Label>
              <p className="text-sm text-muted-foreground">Tell us a bit more about yourself.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g. 25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(val) => setFormData({ ...formData, gender: val })}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label htmlFor="gender-male" className="cursor-pointer font-normal">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label htmlFor="gender-female" className="cursor-pointer font-normal">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="gender-other" />
                    <Label htmlFor="gender-other" className="cursor-pointer font-normal">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>


            {/* Preferred Category */}
            <div className="space-y-3 mt-8">
              <Label className="text-lg font-semibold border-b pb-2 flex">2. Preferred Category</Label>
              {/* <p className="text-sm text-muted-foreground">Select the causes you are most passionate about.</p> */}
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
            <div className="space-y-3 mt-8">
              <div className="flex justify-between items-center border-b pb-2">
                <Label className="text-lg font-semibold flex">3. Address & Location</Label>
                <Button variant="outline" size="sm" onClick={handleGetLocation} disabled={gettingLocation}>
                  <MapPin className="w-4 h-4 mr-2" />
                  {gettingLocation ? "Locating..." : "Use Current Location"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Select your primary city and enter your address details.</p>
              
              <div className="space-y-5 mt-2">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={formData.location} onValueChange={(val) => setFormData({ ...formData, location: val })}>
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

                {formData.location && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="houseNumber">House / Flat Number</Label>
                      <Input
                        id="houseNumber"
                        placeholder="e.g. Flat 101, A Wing"
                        value={formData.houseNumber}
                        onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="street">Street / Road Name</Label>
                      <Input
                        id="street"
                        placeholder="e.g. M.G. Road"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        placeholder="e.g. Near City Hospital"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        placeholder="e.g. 400001"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Donation Range */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold border-b pb-2 flex">4. Donation Range (₹)</Label>
              <p className="text-sm text-muted-foreground">What is your typical budget for donations?</p>
              <div className="flex items-center space-x-4 max-w-sm">
                <div className="space-y-1">
                  <Label htmlFor="minDonation" className="text-xs">Minimum</Label>
                  <Input
                    id="minDonation"
                    type="number"
                    placeholder="e.g. 500"
                    value={formData.minDonation}
                    onChange={(e) => setFormData({ ...formData, minDonation: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, maxDonation: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Preferred Type */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold border-b pb-2 flex">5. Preferred Type of Organisation</Label>
              <p className="text-sm text-muted-foreground">Do you prefer supporting NGOs or Orphanages?</p>
              <RadioGroup
                value={formData.preferredType}
                onValueChange={(val) => setFormData({ ...formData, preferredType: val })}
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
              <Label className="text-lg font-semibold border-b pb-2 flex">6. Types of Donation</Label>
              <p className="text-sm text-muted-foreground">How would you like to contribute?</p>
              <RadioGroup
                value={formData.donationType}
                onValueChange={(val) => setFormData({ ...formData, donationType: val })}
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
