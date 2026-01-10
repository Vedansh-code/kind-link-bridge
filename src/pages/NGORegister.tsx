import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileUpload } from "@/components/ui/file-upload";
import { format } from "date-fns";
import { 
  Building2, 
  MapPin, 
  Info, 
  Users, 
  Grid3X3, 
  BarChart3, 
  Plus, 
  Trash2, 
  CalendarIcon,
  ShieldCheck,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const childSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age must be at least 1").max(18, "Age must be 18 or less"),
  interests: z.string().min(1, "Interests are required"),
  currentNeeds: z.string().min(1, "Current needs are required"),
});

const formSchema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
  tagline: z.string().optional(),
  isVerified: z.boolean(),
  verificationDoc: z.any().optional(),
  officeAddress: z.string().min(1, "Office address is required"),
  about: z.string().min(10, "Please provide at least 10 characters"),
  children: z.array(childSchema).min(1, "At least one child entry is required"),
  category: z.string().min(1, "Category is required"),
  locations: z.string().min(1, "Locations are required"),
  foundedDate: z.date({ required_error: "Founded date is required" }),
  childrenConnected: z.number().min(0),
  schoolsConnected: z.number().min(0),
  hoursProvided: z.number().min(0),
}).refine((data) => {
  if (data.isVerified && !data.verificationDoc) {
    return false;
  }
  return true;
}, {
  message: "Verification document is required for verified organizations",
  path: ["verificationDoc"],
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  "Education",
  "Healthcare",
  "Environment",
  "Child Welfare",
  "Women Empowerment",
  "Elderly Care",
  "Disaster Relief",
  "Animal Welfare",
  "Rural Development",
  "Other",
];

const NGORegister = () => {
  const navigate = useNavigate();
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: "",
      tagline: "",
      isVerified: false,
      officeAddress: "",
      about: "",
      children: [{ name: "", age: 0, interests: "", currentNeeds: "" }],
      category: "",
      locations: "",
      childrenConnected: 0,
      schoolsConnected: 0,
      hoursProvided: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const isVerified = watch("isVerified");

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    toast.success("NGO Registration submitted successfully!", {
      description: "We'll review your application and get back to you soon.",
    });
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen gradient-hero py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
            NGO Registration
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join our network and help make a difference in children's lives
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <section className="form-section animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h2 className="form-section-title">
              <Building2 className="w-5 h-5 text-primary" />
              Basic Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="input-label">Name of Organization *</label>
                <Input
                  {...register("orgName")}
                  placeholder="Enter organization name"
                  className={cn(errors.orgName && "border-destructive")}
                />
                {errors.orgName && (
                  <p className="input-error">{errors.orgName.message}</p>
                )}
              </div>
              <div>
                <label className="input-label">Tagline (Optional)</label>
                <Input
                  {...register("tagline")}
                  placeholder="A short tagline for your NGO"
                />
              </div>
            </div>
          </section>

          {/* Verification Section */}
          <section className="form-section animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <h2 className="form-section-title">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Verification Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Verified Organization</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle if your NGO has official verification
                  </p>
                </div>
                <Controller
                  name="isVerified"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {isVerified && (
                <div className="animate-slide-in">
                  <label className="input-label">Verification Document *</label>
                  <Controller
                    name="verificationDoc"
                    control={control}
                    render={({ field }) => (
                      <FileUpload
                        onChange={field.onChange}
                        value={field.value}
                        error={errors.verificationDoc?.message as string}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Location Section */}
          <section className="form-section animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="form-section-title">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </h2>
            <div>
              <label className="input-label">Office Address / City *</label>
              <Input
                {...register("officeAddress")}
                placeholder="Enter your office address or city"
                className={cn(errors.officeAddress && "border-destructive")}
              />
              {errors.officeAddress && (
                <p className="input-error">{errors.officeAddress.message}</p>
              )}
            </div>
          </section>

          {/* About Section */}
          <section className="form-section animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <h2 className="form-section-title">
              <Info className="w-5 h-5 text-primary" />
              About Your Organization
            </h2>
            <div>
              <label className="input-label">Description *</label>
              <Textarea
                {...register("about")}
                placeholder="Tell us about your NGO, its mission, and the work you do..."
                rows={4}
                className={cn(errors.about && "border-destructive")}
              />
              {errors.about && (
                <p className="input-error">{errors.about.message}</p>
              )}
            </div>
          </section>

          {/* Children Section */}
          <section className="form-section animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="form-section-title mb-0">
                <Users className="w-5 h-5 text-primary" />
                Children in Your Care
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", age: 0, interests: "", currentNeeds: "" })}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Child
              </Button>
            </div>

            {errors.children?.root && (
              <p className="input-error mb-4">{errors.children.root.message}</p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50 animate-slide-in"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary">
                      Child #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="input-label">Name *</label>
                      <Input
                        {...register(`children.${index}.name`)}
                        placeholder="Child's name"
                        className={cn(errors.children?.[index]?.name && "border-destructive")}
                      />
                      {errors.children?.[index]?.name && (
                        <p className="input-error">{errors.children[index].name?.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="input-label">Age *</label>
                      <Input
                        type="number"
                        {...register(`children.${index}.age`, { valueAsNumber: true })}
                        placeholder="Age"
                        min={1}
                        max={18}
                        className={cn(errors.children?.[index]?.age && "border-destructive")}
                      />
                      {errors.children?.[index]?.age && (
                        <p className="input-error">{errors.children[index].age?.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="input-label">Interests *</label>
                      <Input
                        {...register(`children.${index}.interests`)}
                        placeholder="e.g., Reading, Sports, Art"
                        className={cn(errors.children?.[index]?.interests && "border-destructive")}
                      />
                      {errors.children?.[index]?.interests && (
                        <p className="input-error">{errors.children[index].interests?.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="input-label">Current Needs *</label>
                      <Input
                        {...register(`children.${index}.currentNeeds`)}
                        placeholder="e.g., School supplies, Mentorship"
                        className={cn(errors.children?.[index]?.currentNeeds && "border-destructive")}
                      />
                      {errors.children?.[index]?.currentNeeds && (
                        <p className="input-error">{errors.children[index].currentNeeds?.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Info Grid */}
          <section className="form-section animate-fade-in" style={{ animationDelay: "0.35s" }}>
            <h2 className="form-section-title">
              <Grid3X3 className="w-5 h-5 text-primary" />
              Key Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="input-label">Category *</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={cn(errors.category && "border-destructive")}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="input-error">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="input-label">Locations *</label>
                <Input
                  {...register("locations")}
                  placeholder="Operating cities"
                  className={cn(errors.locations && "border-destructive")}
                />
                {errors.locations && (
                  <p className="input-error">{errors.locations.message}</p>
                )}
              </div>

              <div>
                <label className="input-label">Founded Date *</label>
                <Controller
                  name="foundedDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            errors.foundedDate && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.foundedDate && (
                  <p className="input-error">{errors.foundedDate.message}</p>
                )}
              </div>

              <div>
                <label className="input-label">Status</label>
                <div className={cn(
                  "h-10 px-3 flex items-center rounded-md border text-sm font-medium",
                  isVerified 
                    ? "bg-primary/10 border-primary/30 text-primary" 
                    : "bg-muted border-border text-muted-foreground"
                )}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  {isVerified ? "Verified" : "Non-Verified"}
                </div>
              </div>
            </div>
          </section>

          {/* Impact Metrics */}
          <section className="form-section animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="form-section-title">
              <BarChart3 className="w-5 h-5 text-primary" />
              Impact Metrics
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="input-label">Children Connected</label>
                <Input
                  type="number"
                  {...register("childrenConnected", { valueAsNumber: true })}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div>
                <label className="input-label">Schools Connected</label>
                <Input
                  type="number"
                  {...register("schoolsConnected", { valueAsNumber: true })}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div>
                <label className="input-label">Hours Provided</label>
                <Input
                  type="number"
                  {...register("hoursProvided", { valueAsNumber: true })}
                  placeholder="0"
                  min={0}
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 animate-fade-in" style={{ animationDelay: "0.45s" }}>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="sm:w-32"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary sm:w-32"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NGORegister;