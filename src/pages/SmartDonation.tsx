import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Package, Link2, Sparkles, Loader2, MapPin, ShieldAlert, Activity, Heart, ArrowRight, ExternalLink } from "lucide-react";

type DonationType = "money" | "goods" | "link" | null;

export default function SmartDonation() {
  const [donationType, setDonationType] = useState<DonationType>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [amount, setAmount] = useState("");

  const handleRecommendationClick = () => {
    setIsAnalyzing(true);
    setShowRecommendation(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowRecommendation(true);
    }, 2000);
  };

  const handleQuickSuggestion = (type: DonationType, suggestedAmount: string = "") => {
    setDonationType(type);
    if (type === "money" && suggestedAmount) {
      setAmount(suggestedAmount);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation variant="dashboard" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-primary" />
              Smart Donation Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us what you want to donate, and we’ll guide you to make the most impact.
            </p>
          </div>

          {/* Step 1: Tell us what you want to donate */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
              <h2 className="text-2xl font-semibold">What do you want to donate?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${donationType === 'money' ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'hover:border-primary/50'}`}
                onClick={() => setDonationType('money')}
              >
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${donationType === 'money' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Coins className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Money</h3>
                    <p className="text-sm text-muted-foreground">Fund urgent causes instantly</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${donationType === 'goods' ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'hover:border-primary/50'}`}
                onClick={() => setDonationType('goods')}
              >
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${donationType === 'goods' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Package className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Goods</h3>
                    <p className="text-sm text-muted-foreground">Clothes, food, blankets, etc.</p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${donationType === 'link' ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'hover:border-primary/50'}`}
                onClick={() => setDonationType('link')}
              >
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${donationType === 'link' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Link2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Analyze a Link</h3>
                    <p className="text-sm text-muted-foreground">Check NGO or campaign links</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 2: Quick Suggestions */}
          {!donationType && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" /> 
                Popular Right Now
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="rounded-full shadow-sm hover:border-red-500 hover:text-red-600 transition-colors" onClick={() => handleQuickSuggestion('money', '1000')}>
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                  Flood Relief (Urgent)
                </Button>
                <Button variant="outline" className="rounded-full shadow-sm" onClick={() => handleQuickSuggestion('money', '500')}>
                  📚 Child Education
                </Button>
                <Button variant="outline" className="rounded-full shadow-sm" onClick={() => handleQuickSuggestion('money', '800')}>
                  🐾 Animal Rescue
                </Button>
                <Button variant="outline" className="rounded-full shadow-sm" onClick={() => handleQuickSuggestion('money', '1500')}>
                  🏥 Medical Aid
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Specific Inputs */}
          {donationType && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <h2 className="text-2xl font-semibold">Details</h2>
              </div>
              
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  {donationType === 'money' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="amount" className="text-base">Amount (₹)</Label>
                        <Input 
                          id="amount" 
                          type="number" 
                          placeholder="e.g. 1000" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="text-lg py-6"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="cause" className="text-base">Cause Preference (Optional)</Label>
                        <Select>
                          <SelectTrigger className="py-6">
                            <SelectValue placeholder="Any Cause" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any Cause</SelectItem>
                            <SelectItem value="disaster">Disaster Relief</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="health">Healthcare</SelectItem>
                            <SelectItem value="environment">Environment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {donationType === 'goods' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="goods-type" className="text-base">Type of Goods</Label>
                        <Select>
                          <SelectTrigger className="py-6">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clothes">Clothes</SelectItem>
                            <SelectItem value="food">Non-perishable Food</SelectItem>
                            <SelectItem value="books">Books & Stationery</SelectItem>
                            <SelectItem value="medicines">Medicines</SelectItem>
                            <SelectItem value="toys">Toys</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="quantity" className="text-base">Quantity (Optional)</Label>
                        <Input id="quantity" placeholder="e.g. 2 boxes, 10 shirts" className="py-6" />
                      </div>
                    </div>
                  )}

                  {donationType === 'link' && (
                    <div className="space-y-3">
                      <Label htmlFor="link" className="text-base">Paste NGO / Campaign / Social Media Link</Label>
                      <Input id="link" placeholder="https://..." className="py-6 text-lg" />
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto h-12 text-lg px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg transition-all"
                      onClick={handleRecommendationClick}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing needs using AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Get Smart Recommendation
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Recommendation Result */}
          {showRecommendation && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <h2 className="text-2xl font-semibold">Your AI Recommendation</h2>
              </div>

              <Card className="border-2 border-primary/20 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="destructive" className="flex items-center gap-1 shadow-sm px-3 py-1 text-sm bg-red-500 hover:bg-red-600">
                    <ShieldAlert className="h-4 w-4" />
                    High Urgency
                  </Badge>
                </div>
                
                <CardHeader className="bg-primary/5 pb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">Smart Plan Generated</span>
                  </div>
                  <CardTitle className="text-3xl">Maximum Impact Distribution</CardTitle>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                    
                    {/* Left Column: The Plan */}
                    <div className="p-8 space-y-6">
                      <h4 className="font-semibold text-lg border-b pb-2">Proposed Structure:</h4>
                      
                      {donationType === 'money' ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="bg-background p-2 rounded shadow-sm">
                                <Heart className="h-5 w-5 text-red-500" />
                              </div>
                              <div>
                                <p className="font-semibold">Flood Relief NGO</p>
                                <p className="text-sm text-muted-foreground">Assam, India</p>
                              </div>
                            </div>
                            <span className="font-bold text-lg">₹{(Number(amount) * 0.7) || 700}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="bg-background p-2 rounded shadow-sm">
                                <Heart className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-semibold">Medical Aid NGO</p>
                                <p className="text-sm text-muted-foreground">Delhi NCR</p>
                              </div>
                            </div>
                            <span className="font-bold text-lg">₹{(Number(amount) * 0.3) || 300}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="bg-background p-2 rounded shadow-sm mt-1">
                                <Package className="h-5 w-5 text-orange-500" />
                              </div>
                              <div>
                                <p className="font-semibold">Donate clothes to winter drive</p>
                                <p className="text-sm text-muted-foreground mt-1">Goonj Foundation Drop-off Center</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                  <MapPin className="h-3 w-3" />
                                  Near Netaji Subhash Place, Delhi
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Impact metrics */}
                    <div className="p-8 space-y-8 bg-muted/10">
                      
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Impact Score</h4>
                          <span className="text-3xl font-extrabold text-green-600">9.1 <span className="text-lg text-muted-foreground font-normal">/ 10</span></span>
                        </div>
                        <Progress value={91} className="h-3 bg-muted [&>div]:bg-green-500" />
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Location Context</h4>
                        <div className="flex items-start gap-2 bg-background p-3 rounded-md border shadow-sm">
                          <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-sm text-foreground">
                            <span className="font-semibold block mb-1">High-need areas near you: Delhi NCR</span>
                            We matched your donation type with urgent campaigns within a 50km radius for fastest impact.
                          </p>
                        </div>
                      </div>

                      {/* Expandable "Why this recommendation" */}
                      <details className="group [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-background p-4 border shadow-sm text-sm font-medium text-gray-900 list-none hover:bg-muted/50 transition-colors">
                          <span className="flex items-center gap-2 text-primary">
                            <Activity className="h-4 w-4" /> Why this recommendation?
                          </span>
                          <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </summary>
                        <div className="p-4 border-x border-b rounded-b-lg bg-background text-sm text-muted-foreground leading-relaxed space-y-2 mt-[-4px]">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Based on current emergency campaigns.</li>
                            <li>High engagement and verified need by local authorities.</li>
                            <li>These NGOs are currently facing severe funding shortages.</li>
                            <li>Perfectly matches your selected donation type and budget.</li>
                          </ul>
                        </div>
                      </details>

                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-muted p-6 flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 border-t">
                  <Button variant="outline" className="w-full sm:w-auto h-12 px-6 bg-background">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Contact NGO
                  </Button>
                  <Button variant="secondary" className="w-full sm:w-auto h-12 px-6">
                    Donate Now
                  </Button>
                  <Button className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/25 border-0">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Auto Donate Smartly
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
