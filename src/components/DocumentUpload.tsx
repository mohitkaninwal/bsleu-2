
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onUpload: (file: File | null) => void;
  acceptedTypes?: string;
  maxSize?: number; // in bytes
  description?: string;
}

export const DocumentUpload = ({ 
  onUpload, 
  acceptedTypes = ".jpg,.jpeg,.png,.pdf", 
  maxSize = 10 * 1024 * 1024, // 10MB
  description = "Upload your document"
}: DocumentUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`,
        variant: "destructive"
      });
      return false;
    }

    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeTypeMap: { [key: string]: string[] } = {
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.png': ['image/png'],
      '.pdf': ['application/pdf']
    };

    const isValidExtension = allowedTypes.includes(fileExtension);
    const expectedMimeTypes = mimeTypeMap[fileExtension] || [];
    const isValidMimeType = expectedMimeTypes.includes(file.type);

    if (!isValidExtension || !isValidMimeType) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file with one of these extensions: ${acceptedTypes}`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUploadedFile(file);
    onUpload(file);
    setUploading(false);
    
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded.`,
    });
  };

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "File removed",
      description: "Document has been removed.",
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <div className="space-y-2">
            <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <div className="text-sm">
              <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                Click to upload
              </span>
              <span className="text-gray-600"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              {acceptedTypes.toUpperCase().replace(/\./g, '').replace(/,/g, ', ')} up to {(maxSize / (1024 * 1024)).toFixed(1)}MB
            </p>
            <p className="text-xs text-gray-600">{description}</p>
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-sm text-blue-600">Uploading...</div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            {getFileIcon(uploadedFile.name)}
            <div>
              <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
              <p className="text-xs text-green-600">
                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-green-700 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
