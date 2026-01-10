import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EventScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngoName: string;
}

export const EventScheduleModal = ({ isOpen, onClose, ngoName }: EventScheduleModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    description: "",
    attendees: "",
    provisions: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Event request sent successfully!",
      description: `Your request for ${ngoName} has been submitted. They will contact you within 2-3 business days.`,
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      description: "",
      attendees: "",
      provisions: "",
    });
    setSelectedDate(undefined);
    setTimeSlot("");
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-hero-gradient bg-clip-text text-transparent">
            Propose an Event at {ngoName}
          </DialogTitle>
          <DialogDescription>
            Fill out this form to propose your event. The organization will review your request and contact you.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="shadow-soft focus:shadow-glow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="shadow-soft focus:shadow-glow"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              className="shadow-soft focus:shadow-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eventType">What kind of event are you planning? *</Label>
            <Select value={formData.eventType} onValueChange={(value) => handleInputChange("eventType", value)} required>
              <SelectTrigger className="shadow-soft focus:shadow-glow">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Birthday Party</SelectItem>
                <SelectItem value="festival">Festival Celebration</SelectItem>
                <SelectItem value="workshop">Skill Workshop</SelectItem>
                <SelectItem value="donation">Donation Drive</SelectItem>
                <SelectItem value="educational">Educational Activity</SelectItem>
                <SelectItem value="recreational">Recreational Activity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Briefly describe your event idea *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Tell us about your event plans, activities, and goals..."
              required
              className="shadow-soft focus:shadow-glow min-h-[80px]"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Proposed Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal shadow-soft",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeSlot">Preferred Time Slot *</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot} required>
                <SelectTrigger className="shadow-soft focus:shadow-glow">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (1 PM - 5 PM)</SelectItem>
                  <SelectItem value="evening">Evening (6 PM - 8 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attendees">How many people will be attending with you? *</Label>
            <Input
              id="attendees"
              type="number"
              min="1"
              value={formData.attendees}
              onChange={(e) => handleInputChange("attendees", e.target.value)}
              placeholder="e.g., 5"
              required
              className="shadow-soft focus:shadow-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="provisions">What will you be providing? (Optional)</Label>
            <Textarea
              id="provisions"
              value={formData.provisions}
              onChange={(e) => handleInputChange("provisions", e.target.value)}
              placeholder="e.g., Gifts, food, educational materials, games..."
              className="shadow-soft focus:shadow-glow"
            />
          </div>
          
          <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground">
              <strong>Please note:</strong> This is a request, not a confirmation. The team at the organization will review your proposal and get in touch within 2-3 business days to coordinate. All events are subject to their schedule and policies.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Send Event Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};