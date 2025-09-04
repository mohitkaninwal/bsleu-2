
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Calendar, MapPin, Clock, CreditCard } from "lucide-react";
import { format } from "date-fns";

function generateReceiptBlob(data: {
  reference: string;
  level: string;
  type: string;
  center: string;
  date: string;
  time: string;
  amount: number;
}) {
  const lines = [
    `BSLEU Booking Receipt`,
    `Reference: ${data.reference}`,
    `Level: ${data.level}`,
    `Type: ${data.type}`,
    `Center: ${data.center}`,
    `Date: ${data.date}`,
    `Time: ${data.time}`,
    `Amount: ₹${data.amount.toLocaleString()}`,
  ];
  const content = lines.join("\n");
  return new Blob([content], { type: 'text/plain;charset=utf-8' });
}

interface BookingConfirmationProps {
  bookingReference: string;
  bookingId?: number;
  examLevel: string;
  examType: string;
  testCenter: string;
  examDate?: Date;
  examTime: string; // 'morning' | 'evening'
  totalAmount: number;
  onNewBooking: () => void;
}

export const BookingConfirmation = ({
  bookingReference,
  bookingId,
  examLevel,
  examType,
  testCenter,
  examDate,
  examTime,
  totalAmount,
  onNewBooking
}: BookingConfirmationProps) => {
  const handleDownloadReceipt = async () => {
    try {
      // Use booking ID if available, otherwise use booking reference
      const identifier = bookingId || bookingReference;
      
      if (!identifier) {
        throw new Error('Missing booking identifier');
      }
      
      // Try to download PDF from API
      const blob = await (await import("@/services/api")).bookingAPI.downloadReceipt(identifier);
      
      // Verify it's a PDF blob
      if (blob.type !== 'application/pdf') {
        throw new Error('Invalid PDF response');
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookingReference}_receipt.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to download PDF receipt:', error);
      
      // Only fallback to text if PDF download completely fails
      try {
        const receiptData = {
          reference: bookingReference,
          level: examLevel,
          type: examType,
          center: testCenter,
          date: examDate ? format(examDate, "PPP") : "TBD",
          time: examTime,
          amount: totalAmount,
        };
        const blob = generateReceiptBlob(receiptData);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${bookingReference}_receipt.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        
      } catch (fallbackError) {
        console.error('Failed to generate fallback receipt:', fallbackError);
        alert('Failed to download receipt. Please try again later.');
      }
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your examination has been successfully booked.</p>
      </div>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-blue-600">
            {bookingReference || "Loading..."}
          </CardTitle>
          <p className="text-center text-sm text-gray-600">Booking Reference Number</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Exam Level</p>
                <p className="font-semibold text-gray-900 text-lg">{examLevel}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Exam Type</p>
                <p className="font-semibold text-gray-900 text-lg">{examType}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Test Center</p>
                <p className="font-semibold text-gray-900 text-lg">BSLEU Main Center, Noida</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {examDate ? format(examDate, "MMM dd, yyyy") : "TBD"} ({examTime === 'morning' ? 'Morning' : 'Evening'})
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Amount Paid:</span>
              <span className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-blue-600 mt-1" />
          <div className="text-left">
            <h4 className="font-medium text-blue-900">What's Next?</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• A confirmation email has been sent to your registered email address</li>
              <li>• Please arrive at the test center 30 minutes before your scheduled time</li>
              <li>• Bring a valid photo ID that matches your registration details</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownloadReceipt} variant="outline" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        <Button onClick={onNewBooking} className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Book Another Exam
        </Button>
      </div>
    </div>
  );
};
