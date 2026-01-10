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
  Heart,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ... [Schemas and Categories remain identical to your original code] ...
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
  if (data.isVerified && !data.verificationDoc) return false;
  return true;
}, {
  message: "Verification document is required for verified organizations",
  path: ["verificationDoc"],
});

type FormData = z.infer<typeof formSchema>;

const categories = ["Education", "Healthcare", "Environment", "Child Welfare", "Women Empowerment", "Elderly Care", "Disaster Relief", "Animal Welfare", "Rural Development", "Other"];

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

  const handleCancel = () => navigate("/");

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header - White & Green Focus */}
        <div className="text-center mb-12 animate-fade-in">
          
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            NGO Registration
          </h1>
          <p className="text-slate-500 max-w-md mx-auto text-lg">
            Join our mission-driven network and empower the next generation.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Basic Info Section - Isolated Card */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-slate-50/50 border-b border-slate-200 px-6 py-4">
              <h2 className="flex items-center gap-2 font-bold text-slate-800">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Basic Information
              </h2>
            </div>
            <div className="p-6 grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Name of Organization *</label>
                <Input
                  {...register("orgName")}
                  placeholder="e.g. Hope Foundation"
                  className={cn("focus-visible:ring-emerald-500", errors.orgName && "border-red-500")}
                />
                {errors.orgName && <p className="text-xs text-red-500 font-medium">{errors.orgName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tagline (Optional)</label>
                <Input
                  {...register("tagline")}
                  placeholder="Empowering through action"
                  className="focus-visible:ring-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* Verification Section */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <div className="p-6">
              <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Verification Status
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 rounded-xl border border-emerald-100 bg-emerald-50/30">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      Verified Organization {isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </p>
                    <p className="text-sm text-slate-600">
                      Does your NGO have official government-recognized status?
                    </p>
                  </div>
                  <Controller
                    name="isVerified"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    )}
                  />
                </div>

                {isVerified && (
                  <div className="animate-in slide-in-from-top-4 duration-300 space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      Official Document Upload <span className="text-red-500">*</span>
                    </label>
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
            </div>
          </section>

          {/* About & Location Combined Grid */}
          <div className="grid gap-8 sm:grid-cols-2">
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Main Location
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Office Address / City *</label>
                <Input
                  {...register("officeAddress")}
                  placeholder="Enter full address"
                  className={cn("focus-visible:ring-emerald-500", errors.officeAddress && "border-red-500")}
                />
                {errors.officeAddress && <p className="text-xs text-red-500">{errors.officeAddress.message}</p>}
              </div>
            </section>

            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: "0.25s" }}>
              <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                <Info className="w-5 h-5 text-emerald-600" />
                Mission
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description *</label>
                <Textarea
                  {...register("about")}
                  placeholder="Explain your NGO's primary goals..."
                  rows={2}
                  className={cn("focus-visible:ring-emerald-500", errors.about && "border-red-500")}
                />
              </div>
            </section>
          </div>

          {/* Children Section - Cleaner List Style */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-slate-800">
                <Users className="w-5 h-5 text-emerald-600" />
                Children in Care
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", age: 0, interests: "", currentNeeds: "" })}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Child
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {errors.children?.root && (
                <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{errors.children.root.message}</p>
                </div>
              )}

              {fields.map((field, index) => (
                <div key={field.id} className="group relative p-5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-emerald-200 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-1 rounded">
                      Profile #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input {...register(`children.${index}.name`)} placeholder="Child's Name" className="bg-white" />
                    <Input type="number" {...register(`children.${index}.age`)} placeholder="Age" className="bg-white" />
                    <Input {...register(`children.${index}.interests`)} placeholder="Interests" className="bg-white" />
                    <Input {...register(`children.${index}.currentNeeds`)} placeholder="Primary Needs" className="bg-white" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Info & Impact Grid */}
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
                <Grid3X3 className="w-5 h-5 text-emerald-600" />
                Organizational Details
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category *</label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="focus:ring-emerald-500">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Operating Locations *</label>
                  <Input {...register("locations")} placeholder="e.g. Mumbai, Pune" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Founded Date *</label>
                  <Controller
                    name="foundedDate"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 shadow-2xl border-emerald-100">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            className="rounded-md border border-slate-100"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Impact Metrics - White with Emerald Icons */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Impact Metrics
              </h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { label: "Children Connected", name: "childrenConnected" as const },
                  { label: "Schools Connected", name: "schoolsConnected" as const },
                  { label: "Hours Provided", name: "hoursProvided" as const }
                ].map((item) => (
                  <div key={item.name} className="space-y-2 p-4 rounded-lg bg-slate-50/50 border border-slate-100">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</label>
                    <Input
                      type="number"
                      {...register(item.name, { valueAsNumber: true })}
                      className="bg-white border-slate-200 focus-visible:ring-emerald-500 font-mono font-bold text-emerald-700"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end py-10 border-t border-slate-200">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="px-10 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all active:scale-95 font-bold"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NGORegister;