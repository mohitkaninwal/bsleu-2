
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DocumentUpload } from "@/components/DocumentUpload";
import { authAPI, documentAPI, type RegistrationData } from "@/services/api";
import { useFormPersistence } from "@/hooks/use-form-persistence";

interface RegistrationFormProps {
  onBack: () => void;
  onNext: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export const RegistrationForm = ({ onBack, onNext }: RegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Ref to manage validation timeouts
  const validationTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);
  
  // Use form persistence hook to auto-save and restore form data
  const initialFormData = {
    familyName: "",
    firstName: "",
    email: "",
    telephone: "",
    dateOfBirth: undefined as Date | undefined,
    birthPlace: "",
    countryOfBirth: "",
    nativeLanguage: "",
    gender: "",
    placeOfResidence: "",
    countryOfResidence: "",
    currentCity: "",
    currentCountry: "",
    idType: "",
    idNumber: "",
    examType: "",
    examLevel: "",
    partialComponent: "", // For partial exams: "written" or "oral"
    // Document uploads - files are not persisted for security reasons
    passportFront: null as File | null,
    passportBack: null as File | null,
    passportPhoto: null as File | null,
    telcCertificate: null as File | null, // Required for partial exams
  };

  const {
    formData,
    updateField,
    clearFormData,
    isDataLoaded
  } = useFormPersistence({
    key: 'registration',
    initialData: initialFormData,
    clearOnSubmit: true
  });

  // Country selection simplified to text inputs

  const languages = [
    "English", "Others"
  ];

  const genderOptions = [
    "Male", "Female", "Diverse"
  ];

  // Identification types and validators
  const idTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID / Aadhaar' },
  ];

  const idValidationPatterns: { [key: string]: RegExp } = {
    passport: /^[A-Z0-9]{6,15}$/i,
    national_id: /^\d{12}$|^[A-Z0-9]{6,18}$/i,
  };

  const validateIdNumber = useCallback((idType: string, value: string | Date | undefined): boolean => {
    if (!value || typeof value !== 'string') return false;
    const pattern = idValidationPatterns[idType];
    if (!pattern) return true;
    return pattern.test(value.trim());
  }, []);

  const examLevels = [
    { value: "A1", label: "A1 - Beginner (₹20,060)", type: "full" },
    { value: "A2", label: "A2 - Elementary (₹20,060)", type: "full" },
    { value: "B1", label: "B1 - Intermediate (₹21,240)", type: "full" },
    { value: "B2", label: "B2 - Upper Intermediate (₹21,240)", type: "full" },
    { value: "B1-P", label: "B1 Partial (₹20,650)", type: "partial" },
    { value: "B2-P", label: "B2 Partial (₹20,650)", type: "partial" },
    { value: "C1", label: "C1 - University (₹23,600)", type: "full" },
    { value: "C1-P", label: "C1 Partial (₹23,010)", type: "partial" },
  ];

  // Helper function to check if exam is partial
  const isPartialExam = useCallback((examLevel: string) => {
    return examLevel.includes('-P');
  }, []);

  // Memoized validation functions to prevent re-creation on every render
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateName = useCallback((name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s'.-]{2,50}$/;
    return nameRegex.test(name);
  }, []);

  const validateTelephone = useCallback((telephone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(telephone.replace(/\s/g, ''));
  }, []);

  const validateField = useCallback((fieldName: string, value: string | Date | undefined): string => {
    switch (fieldName) {
      case 'familyName':
        if (!value) return 'Surname/Family name is required (use "..." if none)';
        if (value !== '...' && !validateName(value as string)) return 'Family name contains invalid characters';
        return '';
      
      case 'firstName':
        if (!value) return 'First name is required';
        if (!validateName(value as string)) return 'First name contains invalid characters';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value as string)) return 'Please enter a valid email address';
        return '';
      
      case 'telephone':
        if (!value) return 'Telephone number is required';
        if (!validateTelephone(value as string)) return 'Please enter a valid telephone number';
        return '';
      
      case 'dateOfBirth': {
        if (!value) return 'Date of birth is required';
        // Remove age restriction as per requirements
        return '';
      }
      
      case 'idNumber':
        if (!value) return 'Document number is required';
        if (formData.idType && !validateIdNumber(formData.idType, value)) {
          const selectedType = idTypes.find(type => type.value === formData.idType);
          return `Invalid ${selectedType?.label} format`;
        }
        return '';
      
      default:
        if (!value) return `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
        return '';
    }
  }, [validateName, validateEmail, validateTelephone, validateIdNumber, formData.idType, idTypes]);

  // Removed manual date parsing and input change; only calendar selection is supported now

  const handleFieldChange = useCallback((fieldName: string, value: string | Date | File | null | undefined) => {
    updateField(fieldName, value);
    
    // Date is selected only via calendar now; no manual input syncing needed
    
    // Clear any existing validation timeout for this field
    if (validationTimeoutRef.current[fieldName]) {
      clearTimeout(validationTimeoutRef.current[fieldName]);
    }
    
    // Debounced validation to prevent excessive re-renders
    const fileFields = ['passportFront', 'passportBack', 'passportPhoto', 'telcCertificate'];
    if (fileFields.includes(fieldName)) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
      return;
    }

    // Use setTimeout to debounce validation for text inputs
    validationTimeoutRef.current[fieldName] = setTimeout(() => {
      const error = validateField(fieldName, (value as unknown) as string | Date | undefined);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      delete validationTimeoutRef.current[fieldName];
    }, 150); // 150ms debounce for validation
  }, [updateField, validateField]);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (stepNumber === 1) {
      const requiredFields = ['familyName', 'firstName', 'email', 'telephone', 'dateOfBirth', 'gender', 'countryOfBirth', 'birthPlace'];
      
      requiredFields.forEach(field => {
        const error = validateField(field, (formData as any)[field] as string | Date | undefined);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    }

    if (stepNumber === 2) {
      const requiredFields = ['nativeLanguage', 'currentCity', 'currentCountry', 'idType', 'idNumber'];
      
      requiredFields.forEach(field => {
        const error = validateField(field, (formData as any)[field] as string | Date | undefined);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });

      // Make document uploads optional but recommended
      // Files are not persisted in localStorage for security, so we can't require them after refresh
      if (!formData.passportFront && !formData.passportBack) {
        // Show warning but don't block submission - this is just informational
        console.log('No documents uploaded - proceeding with registration');
      }
    }

    setErrors(newErrors);
    
    if (!isValid) {
      toast({
        title: "Please fix the errors",
        description: "Some fields contain invalid information. Please review and correct them.",
        variant: "destructive"
      });
    }

    return isValid;
  };

  const getIdNumberPlaceholder = (idType: string): string => {
    const placeholders: { [key: string]: string } = {
      passport: "A1234567",
      national_id: "123456789012",
    };
    return placeholders[idType] || "Enter document number";
  };

  const handleRegistrationSubmit = async () => {
    try {
      if (!validateStep(2)) {
        return;
      }

      setIsSubmitting(true);

      // Show initial progress
      toast({
        title: "Submitting Registration...",
        description: "Please wait while we process your information.",
      });

      // Prepare registration data
      const registrationData: RegistrationData = {
        familyName: formData.familyName,
        firstName: formData.firstName,
        email: formData.email,
        password: 'temp_password_123', // You might want to add a password field
        telephone: formData.telephone,
        dateOfBirth: formData.dateOfBirth ? format(formData.dateOfBirth, 'yyyy-MM-dd') : '',
        birthPlace: formData.birthPlace,
        countryOfBirth: formData.countryOfBirth,
        nativeLanguage: formData.nativeLanguage,
        gender: formData.gender,
        placeOfResidence: formData.currentCity || formData.placeOfResidence,
        countryOfResidence: formData.currentCountry || formData.countryOfResidence,
        // Extra fields required by backend validator
        // Casting to any for fields not defined on RegistrationData type
        ...( { currentCity: formData.currentCity } as any),
        ...( { currentCountry: formData.currentCountry } as any),
        ...( { idType: formData.idType } as any),
        ...( { idNumber: formData.idNumber } as any),
      };

      // Register user
      const result = await authAPI.register(registrationData);

      if (result.success) {
        // Show document upload progress
        const documentsToUpload = [
          { file: formData.passportFront, type: 'passport_front' as const, name: 'ID Front' },
          { file: formData.passportBack, type: 'passport_back' as const, name: 'ID Back' },
          { file: formData.passportPhoto, type: 'passport_photo' as const, name: 'Photo' },
          { file: formData.telcCertificate, type: 'telc_certificate' as const, name: 'Certificate' }
        ].filter(doc => doc.file);

        if (documentsToUpload.length > 0) {
          toast({
            title: "Uploading Documents...",
            description: `Uploading ${documentsToUpload.length} document(s). Please wait...`,
          });

          // Upload documents in parallel for better performance
          const uploadPromises = documentsToUpload.map(async (doc) => {
            try {
              await documentAPI.uploadDocument(doc.file!, doc.type);
              return { success: true, name: doc.name };
            } catch (error) {
              console.error(`Failed to upload ${doc.name}:`, error);
              return { success: false, name: doc.name, error };
            }
          });

          const uploadResults = await Promise.allSettled(uploadPromises);
          const failedUploads = uploadResults
            .map((result, index) => ({ result, doc: documentsToUpload[index] }))
            .filter(({ result }) => result.status === 'rejected' || 
              (result.status === 'fulfilled' && !result.value.success))
            .map(({ doc }) => doc.name);

          if (failedUploads.length > 0) {
            toast({
              title: "Some Documents Failed to Upload",
              description: `Failed: ${failedUploads.join(', ')}. You can upload them later.`,
              variant: "destructive"
            });
          }
        }

        toast({
          title: "Registration Successful!",
          description: "Your account has been created. Proceeding to booking system...",
        });

        // Clear form data after successful registration
        clearFormData();
        
        // Small delay to ensure user sees success message
        setTimeout(() => {
          onNext();
        }, 1000);

      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Please check your information and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName || ""}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            className={cn("mt-1", errors.firstName && "border-red-500")}
          />
          {errors.firstName && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.firstName}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="familyName">Family Name *</Label>
          <Input
            id="familyName"
            value={formData.familyName || ""}
            onChange={(e) => handleFieldChange('familyName', e.target.value)}
            placeholder="Enter your family name"
            className={cn("mt-1", errors.familyName && "border-red-500")}
          />
          {errors.familyName && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.familyName}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          placeholder="Enter your email address"
          className={cn("mt-1", errors.email && "border-red-500")}
        />
        {errors.email && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="telephone">Telephone *</Label>
        <Input
          id="telephone"
          type="tel"
          value={formData.telephone || ""}
          onChange={(e) => handleFieldChange('telephone', e.target.value)}
          placeholder="Enter your phone number"
          className={cn("mt-1", errors.telephone && "border-red-500")}
        />
        {errors.telephone && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.telephone}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label>Date of Birth *</Label>
          <div className="space-y-2">
            {/* Mobile-first approach: Show native date input on mobile, custom picker on desktop */}
            <div className="block sm:hidden">
              <Input
                type="date"
                id="dateOfBirth-mobile"
                value={formData.dateOfBirth ? format(formData.dateOfBirth, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const dateValue = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                  handleFieldChange('dateOfBirth', dateValue);
                }}
                max={format(new Date(), 'yyyy-MM-dd')}
                min="1900-01-01"
                className={cn("w-full", errors.dateOfBirth && "border-red-500")}
                placeholder="Select date of birth"
              />
            </div>
            <div className="hidden sm:block">
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white hover:bg-gray-50 border-2",
                      !formData.dateOfBirth && "text-muted-foreground",
                      errors.dateOfBirth && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? (
                      format(formData.dateOfBirth, "dd MMMM yyyy")
                    ) : (
                      <span>Select date of birth</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-lg border" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={(date) => {
                      handleFieldChange('dateOfBirth', date);
                      // Auto-close the popover after selection
                      if (date) {
                        setIsDatePickerOpen(false);
                      }
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    defaultMonth={formData.dateOfBirth || new Date(1990, 0)}
                    showOutsideDays={false}
                    fixedWeeks
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {errors.dateOfBirth && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.dateOfBirth}
            </div>
          )}
        </div>
        <div>
          <Label>Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleFieldChange('gender', value)}>
            <SelectTrigger className={cn("mt-1", errors.gender && "border-red-500")}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="Diverse">Diverse</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.gender}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label htmlFor="countryOfBirth">Country of Birth *</Label>
          <Input
            id="countryOfBirth"
            value={formData.countryOfBirth || ""}
            onChange={(e) => handleFieldChange('countryOfBirth', e.target.value)}
            placeholder="Enter country of birth"
            className={cn("mt-1", errors.countryOfBirth && "border-red-500")}
          />
          {errors.countryOfBirth && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.countryOfBirth}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="birthPlace">Birth Place *</Label>
          <Input
            id="birthPlace"
            value={formData.birthPlace || ""}
            onChange={(e) => handleFieldChange('birthPlace', e.target.value)}
            placeholder="Enter birth place"
            className={cn("mt-1", errors.birthPlace && "border-red-500")}
          />
          {errors.birthPlace && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.birthPlace}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label>Native Language *</Label>
          <Select value={formData.nativeLanguage} onValueChange={(value) => handleFieldChange('nativeLanguage', value)}>
            <SelectTrigger className={cn("mt-1", errors.nativeLanguage && "border-red-500")}>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>{language}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nativeLanguage && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.nativeLanguage}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="currentCity">Current City of Residence *</Label>
          <Input
            id="currentCity"
            value={formData.currentCity || ""}
            onChange={(e) => handleFieldChange('currentCity', e.target.value)}
            placeholder="Enter current city"
            className={cn("mt-1", errors.currentCity && "border-red-500")}
          />
          {errors.currentCity && (
            <div className="flex items-center text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.currentCity}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="currentCountry">Current Country of Residence *</Label>
        <Input
          id="currentCountry"
          value={formData.currentCountry || ""}
          onChange={(e) => handleFieldChange('currentCountry', e.target.value)}
          placeholder="Enter current country of residence"
          className={cn("mt-1", errors.currentCountry && "border-red-500")}
        />
        {errors.currentCountry && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.currentCountry}
          </div>
        )}
      </div>

      {/* Passport size photo upload placed just above Document Verification */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold mb-4">Passport Size Photo</h4>
        <p className="text-sm text-gray-600 mb-2">Upload a recent passport size photograph (JPG/PNG). Not older than 6 months.</p>
        <DocumentUpload
          onUpload={(file) => handleFieldChange('passportPhoto', file)}
          acceptedTypes=".jpg,.jpeg,.png"
          maxSize={5 * 1024 * 1024}
          description="Upload a clear, well-lit passport size photo"
        />
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold mb-4">Document Verification</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Identification Type *</Label>
            <Select value={formData.idType} onValueChange={(value) => handleFieldChange('idType', value)}>
              <SelectTrigger className={cn("mt-1", errors.idType && "border-red-500")}>
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {idTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.idType && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.idType}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="idNumber">Document Number *</Label>
            <Input
              id="idNumber"
              value={formData.idNumber || ""}
              onChange={(e) => handleFieldChange('idNumber', e.target.value.toUpperCase())}
              placeholder={getIdNumberPlaceholder(formData.idType)}
              className={cn("mt-1", errors.idNumber && "border-red-500")}
            />
            {errors.idNumber && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.idNumber}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label>ID Document - Front (Recommended)</Label>
            <div className="mt-1">
              <DocumentUpload
                onUpload={(file) => handleFieldChange('passportFront', file)}
                acceptedTypes=".jpg,.jpeg,.png"
                maxSize={10 * 1024 * 1024}
                description="Upload the front side of your ID document"
              />
            </div>
            {errors.passportFront && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.passportFront}
              </div>
            )}
          </div>
          <div>
            <Label>ID Document - Back (Recommended)</Label>
            <div className="mt-1">
              <DocumentUpload
                onUpload={(file) => handleFieldChange('passportBack', file)}
                acceptedTypes=".jpg,.jpeg,.png"
                maxSize={10 * 1024 * 1024}
                description="Upload the back side of your ID document"
              />
            </div>
            {errors.passportBack && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.passportBack}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <Button variant="ghost" onClick={onBack} className="mb-4 text-sm sm:text-base">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Registration</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Complete your registration to book an examination</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-base ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 font-medium text-sm sm:text-base">
                  <span className="hidden sm:inline">Personal Info</span>
                  <span className="sm:hidden">Personal</span>
                </span>
              </div>
              <div className={`flex-1 h-1 mx-2 sm:mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-base ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 font-medium text-sm sm:text-base">Documents</span>
              </div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                {step === 1 ? "Personal Information" : "Additional Details & Verification"}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {step === 1 
                  ? "Please provide your personal details accurately as they will appear on your certificate"
                  : "Complete your profile and upload required identification documents"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {step === 1 ? renderStep1() : renderStep2()}
              
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)} className="order-2 sm:order-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                )}
                {step < 2 ? (
                  <Button 
                    onClick={() => {
                      if (validateStep(1)) {
                        setStep(step + 1);
                      }
                    }} 
                    className="ml-auto order-1 sm:order-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRegistrationSubmit}
                    className="ml-auto order-1 sm:order-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span className="hidden sm:inline">Processing...</span>
                        <span className="sm:hidden">Wait...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Complete Registration</span>
                        <span className="sm:hidden">Complete</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
