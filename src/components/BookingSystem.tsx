
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, Clock, CreditCard, FileText, Mic, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DocumentUpload } from "@/components/DocumentUpload";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import { bookingAPI, scheduleAPI, type BookingData } from "@/services/api";
import { useFormPersistence } from "@/hooks/use-form-persistence";

interface BookingSystemProps {
  onBack: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  initialStep?: number;
  onStepChange?: (step: number) => void;
}

export const BookingSystem = ({ onBack, onOpenTerms, onOpenPrivacy, initialStep = 1, onStepChange }: BookingSystemProps) => {
  const [step, setStep] = useState(initialStep);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [testCenter] = useState("BSLEU Main Center, New Delhi");
  const [bookingReference, setBookingReference] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const { toast } = useToast();

  // Notify parent component when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  // Use form persistence for booking data
  const initialBookingData = {
    selectedLevel: "",
    examType: "",
    selectedDate: undefined as Date | undefined,
    selectedTime: "",
    selectedScheduleId: null as number | null,
    uploadedPrerequisite: null as File | null,
    termsAccepted: false
  };

  const {
    formData: bookingData,
    updateField,
    clearFormData
  } = useFormPersistence({
    key: 'booking',
    initialData: initialBookingData,
    clearOnSubmit: false // Keep data until booking is complete
  });

  // Destructure for easier access
  const {
    selectedLevel,
    examType,
    selectedDate,
    selectedTime,
    selectedScheduleId,
    uploadedPrerequisite,
    termsAccepted
  } = bookingData;

  const examLevels = [
    { value: "A1", label: "A1", fee: 20060, description: "Beginner", type: "full", note: "Including GST" },
    { value: "A2", label: "A2", fee: 20060, description: "Elementary", type: "full", note: "Including GST" },
    { value: "B1", label: "B1", fee: 21240, description: "Intermediate", type: "full", note: "Including GST" },
    { value: "B2", label: "B2", fee: 21240, description: "Upper Intermediate", type: "full", note: "Including GST" },
    { value: "B1-P", label: "B1-Partial", fee: 20650, description: "Written or Oral", type: "partial", note: "Written/Oral only" },
    { value: "B2-P", label: "B2-Partial", fee: 20650, description: "Written or Oral", type: "partial", note: "Written/Oral only" },
    { value: "C1", label: "C1", fee: 23600, description: "University", type: "full", note: "Including GST" },
    { value: "C1-P", label: "C1-Partial", fee: 23010, description: "Written or Oral", type: "partial", note: "Written/Oral only" },
  ];

  const examTypes = [
    { 
      value: "both", 
      label: "Written + Oral", 
      description: "Complete examination", 
      multiplier: 1,
      requiresPrerequisite: false,
      prerequisiteType: null
    },
    { 
      value: "written", 
      label: "Written Only", 
      description: "Written exam only", 
      multiplier: 0.6,
      requiresPrerequisite: true,
      prerequisiteType: "oral"
    },
    { 
      value: "oral", 
      label: "Oral Only", 
      description: "Oral exam only", 
      multiplier: 0.6,
      requiresPrerequisite: true,
      prerequisiteType: "written"
    },
  ];

  const isPartialLevel = useMemo(() => selectedLevel.includes('-P'), [selectedLevel]);

  // Ensure examType matches level selection: full levels force "both"; partial levels require user to choose written/oral
  useEffect(() => {
    if (!selectedLevel) {
      updateField('examType', "");
      updateField('uploadedPrerequisite', null);
      return;
    }
    if (isPartialLevel) {
      if (examType === 'both') updateField('examType', "");
    } else {
      updateField('examType', 'both');
      updateField('uploadedPrerequisite', null);
    }
  }, [selectedLevel, isPartialLevel, examType, updateField]);

  // Fetch schedules provided by admin for the selected level/type
  useEffect(() => {
    const fetch = async () => {
      if (!selectedLevel) return;
      setIsLoadingSchedules(true);
      const backendType = examType ? (examType === 'both' ? 'full' : 'partial') : undefined;
      const params: any = { level: selectedLevel };
      if (backendType) params.type = backendType;
      const res = await scheduleAPI.getAvailableSchedules(params);
      if (res.success && res.data) setSchedules(res.data as any[]);
      setIsLoadingSchedules(false);
    };
    fetch();
  }, [selectedLevel, examType]);

  // Build available time slots for the chosen date from schedules
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [] as Array<{ label: string; value: string; available: boolean; scheduleId: number }>; 
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const forDate = schedules.filter((s) => s.examDate === dateStr);
    const items: Array<{ label: string; value: string; available: boolean; scheduleId: number }>= [];
    forDate.forEach((s) => {
      const available = (s.totalSlots || 0) > (s.bookedSlots || 0);
      items.push({
        label: s.examTime === 'morning' ? 'Morning' : 'Evening',
        value: s.examTime,
        available,
        scheduleId: s.id,
      });
    });
    return items;
  }, [schedules, selectedDate]);

  // test centers removed from selection per single center model

  const getSelectedLevelFee = () => {
    const level = examLevels.find(l => l.value === selectedLevel);
    const type = examTypes.find(t => t.value === examType);
    if (level && type) {
      return Math.round(level.fee * type.multiplier);
    }
    return 0;
  };

  const getSelectedExamType = () => {
    return examTypes.find(t => t.value === examType);
  };

  const generateBookingReference = () => {
    const ref = `BSLEU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setBookingReference(ref);
    return ref;
  };

  const handleExamTypeSelection = (type: string) => {
    updateField('examType', type);
    updateField('uploadedPrerequisite', null); // Reset prerequisite upload when changing exam type
  };

  // Pure predicate for enabling Next button in step 1
  const canProceedStep1 = () => {
    if (!selectedLevel) return false;
    const partial = isPartialLevel;
    if (partial) {
      if (!examType || examType === 'both') return false;
      const examTypeData = getSelectedExamType();
      if (examTypeData?.requiresPrerequisite && !uploadedPrerequisite) return false;
      return true;
    }
    // Full exams auto-select 'both' and require no prerequisite
    return true;
  };

  const handleNextFromStep1 = () => {
    if (canProceedStep1()) {
      setStep(2);
      return;
    }
    const examTypeData = getSelectedExamType();
    if (!selectedLevel) {
      toast({ title: "Incomplete Selection", description: "Please select exam level and type to continue.", variant: "destructive" });
      return;
    }
    if (isPartialLevel && (!examType || examType === 'both')) {
      toast({ title: "Select exam type", description: "For partial exams, choose Written or Oral.", variant: "destructive" });
      return;
    }
    if (isPartialLevel && examTypeData?.requiresPrerequisite && !uploadedPrerequisite) {
      toast({
        title: "Missing Prerequisite",
        description: `Please upload your ${examTypeData.prerequisiteType} exam certificate to proceed.`,
        variant: "destructive"
      });
    }
  };

  const handlePayment = async () => {
    if (!selectedScheduleId) {
      toast({ title: 'Select a time', description: 'Please choose an available time slot.', variant: 'destructive' });
      return;
    }
    // Create booking on backend
    const payload: BookingData = {
      scheduleId: selectedScheduleId,
      examLevel: selectedLevel,
      examType: examType === 'both' ? 'full' : 'partial',
      partialComponent: examType === 'written' ? 'written' : examType === 'oral' ? 'oral' : undefined,
    };
    const res = await bookingAPI.createBooking(payload);
    if (!res.success) {
      toast({ title: 'Booking failed', description: res.message || 'Unable to create booking.', variant: 'destructive' });
      return;
    }
    const ref = res.booking?.bookingReference || generateBookingReference();
    setBookingReference(ref); // Ensure booking reference is set in state
    if (res.booking?.id) setBookingId(res.booking.id);
    toast({ title: 'Booking Created', description: `Reference: ${ref}` });
    setStep(4);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Select Examination Level *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {examLevels.map((level) => (
            <Card
              key={level.value}
              className={`cursor-pointer transition-all ${
                selectedLevel === level.value
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:shadow-md"
              }`}
              onClick={() => updateField('selectedLevel', level.value)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Badge className="mb-2">{level.label}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{level.fee.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedLevel && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Select Examination Type *
          </label>
          <div className="space-y-3">
            {examTypes
              .filter((t) => (isPartialLevel ? t.value !== 'both' : t.value === 'both'))
              .map((type) => (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all ${
                  examType === type.value
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:shadow-md"
                }`}
                onClick={() => handleExamTypeSelection(type.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {type.value === "both" && (
                        <>
                          <FileText className="h-5 w-5 text-blue-600" />
                          <Mic className="h-5 w-5 text-green-600" />
                        </>
                      )}
                      {type.value === "written" && <FileText className="h-5 w-5 text-blue-600" />}
                      {type.value === "oral" && <Mic className="h-5 w-5 text-green-600" />}
                      <div>
                        <p className="font-medium">{type.label}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                        {type.requiresPrerequisite && (
                          <p className="text-xs text-orange-600 flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Requires {type.prerequisiteType} exam certificate
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ₹{Math.round(examLevels.find(l => l.value === selectedLevel)!.fee * type.multiplier).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isPartialLevel && examType && getSelectedExamType()?.requiresPrerequisite && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-800 mb-2 flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Upload Prerequisite Certificate *
          </h4>
          <p className="text-sm text-orange-700 mb-3">
            You must upload your {getSelectedExamType()?.prerequisiteType} exam certificate to book this exam type.
          </p>
          <DocumentUpload
            onUpload={(file) => updateField('uploadedPrerequisite', file)}
            acceptedTypes=".pdf,.jpg,.jpeg,.png"
            maxSize={10 * 1024 * 1024} // 10MB
            description="Upload your previous exam certificate"
          />
          {uploadedPrerequisite && (
            <div className="mt-2 flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Certificate uploaded successfully
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Test center selection removed per single-center model */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Select Date *
          </label>
          <div className="space-y-2">
            {/* Mobile-first approach: Show native date input on mobile, custom picker on desktop */}
            <div className="block sm:hidden">
              <input
                type="date"
                id="examDate-mobile"
                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const dateValue = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
                  updateField('selectedDate', dateValue);
                }}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Select exam date"
              />
            </div>
            <div className="hidden sm:block">
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white hover:bg-gray-50 border-2",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd MMMM yyyy")
                    ) : (
                      <span>Select exam date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-lg border" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      updateField('selectedDate', date);
                      // Auto-close the popover after selection
                      if (date) {
                        setIsDatePickerOpen(false);
                      }
                    }}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    captionLayout="dropdown-buttons"
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 2}
                    defaultMonth={selectedDate || new Date()}
                    showOutsideDays={false}
                    fixedWeeks
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Available Time Slots for {format(selectedDate, "PPP")} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {isLoadingSchedules && <span className="text-sm text-gray-500">Loading schedules...</span>}
              {!isLoadingSchedules && availableTimeSlots.length === 0 && (
                <span className="text-sm text-gray-500">No schedules available for this date.</span>
              )}
              {!isLoadingSchedules && availableTimeSlots.map((slot) => (
                <Button
                  key={`${slot.value}-${slot.scheduleId}`}
                  variant={selectedTime === slot.value && selectedScheduleId === slot.scheduleId ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (!slot.available) return;
                    updateField('selectedTime', slot.value);
                    updateField('selectedScheduleId', slot.scheduleId);
                  }}
                  disabled={!slot.available}
                  className={`flex items-center justify-center ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {slot.label}
                  {!slot.available && <span className="ml-1 text-xs">(Full)</span>}
                </Button>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded mr-1"></span>
              Available
              <span className="inline-block w-2 h-2 bg-gray-400 rounded mr-1 ml-3"></span>
              Full
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Exam Level:</span>
            <span className="font-medium">{selectedLevel}</span>
          </div>
          <div className="flex justify-between">
            <span>Exam Type:</span>
            <span className="font-medium">{examTypes.find(t => t.value === examType)?.label}</span>
          </div>
          <div className="flex justify-between">
            <span>Test Center:</span>
            <span className="font-medium">Will be disclosed upon payment confirmation</span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time:</span>
            <span className="font-medium">
              {selectedDate && format(selectedDate, "PPP")} ({selectedTime === 'morning' ? 'Morning' : 'Evening'})
            </span>
          </div>
          {uploadedPrerequisite && (
            <div className="flex justify-between">
              <span>Prerequisite Certificate:</span>
              <span className="font-medium text-green-600">✓ Uploaded</span>
            </div>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>₹{getSelectedLevelFee().toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => updateField('termsAccepted', e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I accept the{" "}
              <button 
                type="button"
                onClick={onOpenTerms}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Terms and Conditions
              </button>{" "}
              and{" "}
              <button 
                type="button"
                onClick={onOpenPrivacy}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              . I understand that my booking will be held for 15 minutes during payment processing.
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Information
          </CardTitle>
          <CardDescription>
            You will be redirected to Razorpay for secure payment processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your booking will be held for 15 minutes while you complete the payment. 
              After successful payment, you will receive a confirmation email with your booking details.
            </p>
          </div>
          <Button 
            size="lg" 
            className="w-full" 
            onClick={handlePayment}
            disabled={!termsAccepted}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Pay ₹{getSelectedLevelFee().toLocaleString()} & Confirm Booking
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <BookingConfirmation
      bookingReference={bookingReference}
      bookingId={bookingId || undefined}
      examLevel={selectedLevel}
      examType={examTypes.find(t => t.value === examType)?.label || ""}
      testCenter={testCenter}
      examDate={selectedDate}
      examTime={selectedTime}
      totalAmount={getSelectedLevelFee()}
          onNewBooking={() => {
        setStep(1);
        clearFormData(); // Clear all persisted data when starting fresh
        setBookingReference("");
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <Button variant="ghost" onClick={onBack} className="mb-4 text-sm sm:text-base">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Registration</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Book Your Examination</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Select your exam details and complete the booking</p>
          </div>

          {step < 4 && (
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center">
                <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-base ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                    1
                  </div>
                  <span className="ml-2 font-medium text-sm sm:text-base">
                    <span className="hidden sm:inline">Exam Details</span>
                    <span className="sm:hidden">Details</span>
                  </span>
                </div>
                <div className={`flex-1 h-1 mx-2 sm:mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-base ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                    2
                  </div>
                  <span className="ml-2 font-medium text-sm sm:text-base">Schedule</span>
                </div>
                <div className={`flex-1 h-1 mx-2 sm:mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-base ${step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                    3
                  </div>
                  <span className="ml-2 font-medium text-sm sm:text-base">Payment</span>
                </div>
              </div>
            </div>
          )}

          {step < 4 && (
            <Card className="shadow-lg">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  {step === 1 && "Select Examination Details"}
                  {step === 2 && "Choose Date & Time"}
                  {step === 3 && "Review & Payment"}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {step === 1 && "Choose your exam level and type"}
                  {step === 2 && "Select your preferred test center, date and time"}
                  {step === 3 && "Review your booking and complete payment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
                  {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="order-2 sm:order-1">
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Back</span>
                    </Button>
                  )}
                  {step < 3 && (
                    <Button 
                      onClick={() => {
                        if (step === 1) {
                          handleNextFromStep1();
                        } else if (step === 2 && testCenter && selectedDate && selectedTime) {
                          setStep(step + 1);
                        }
                      }} 
                      className="ml-auto order-1 sm:order-2"
                      disabled={
                        (step === 1 && !canProceedStep1()) ||
                        (step === 2 && (!selectedDate || !selectedTime || !selectedScheduleId))
                      }
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Continue</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};
