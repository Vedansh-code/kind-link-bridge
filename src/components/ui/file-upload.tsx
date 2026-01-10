import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  accept?: string;
  error?: string;
  className?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ onChange, value, accept = ".pdf,.doc,.docx,.jpg,.png", error, className }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = React.useState(false);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onChange(e.dataTransfer.files[0]);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onChange(e.target.files[0]);
      }
    };

    const handleRemove = () => {
      onChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    return (
      <div className={cn("w-full", className)}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          id="file-upload"
        />
        
        {!value ? (
          <label
            htmlFor="file-upload"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50",
              error && "border-destructive"
            )}
          >
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG, PNG</p>
          </label>
        ) : (
          <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
            <FileText className="w-8 h-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };