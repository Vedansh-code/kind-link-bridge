import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Payment() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "₹1,000",
    fullName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset form
    setFormData({
      amount: "₹1,000",
      fullName: "",
      email: "",
      cardNumber: "",
      expiryDate: "",
      cvc: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Information */}
        <div className="bg-primary text-primary-foreground p-8 lg:p-12 flex items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Support Children's Education</h1>
            <p className="text-lg opacity-90 leading-relaxed">
              Your generous donation will directly impact children's lives by providing them with 
              the educational resources they need to build a brighter future. Every contribution 
              makes a meaningful difference in their journey toward success.
            </p>
          </div>
        </div>

        {/* Right Panel - Payment Form */}
        <div className="bg-muted/50 p-8 lg:p-12 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Make a Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="amount">Donation Amount</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    className="text-lg font-semibold"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Payment Credentials</h3>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        placeholder="MM / YY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVV</Label>
                      <Input
                        id="cvc"
                        value={formData.cvc}
                        onChange={(e) => handleInputChange("cvc", e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" variant="success">
                  Donate Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-2xl font-bold">Thank You!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your generous donation is greatly appreciated. A confirmation has been sent to your email.
            </p>
            <div className="pt-4">
              <Button asChild onClick={handleCloseModal} className="w-full">
                <Link to="/thank-you">Continue</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}