import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Shield, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { paymentAPI } from "@/services/api";

interface PaymentGatewayProps {
  bookingId: number;
  amount: number;
  currency: string;
  examDetails: {
    level: string;
    type: string;
    component?: string;
    fee: number;
  };
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentFailure: (error: string) => void;
}

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  bookingId,
  amount,
  currency,
  examDetails,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    try {
      setIsProcessing(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // Create order on backend
      const orderResponse = await paymentAPI.createOrder(bookingId);
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create payment order');
      }

      const { order } = orderResponse.data;

      // Razorpay payment options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || '', // Razorpay key from environment
        amount: order.amount,
        currency: order.currency,
        name: 'BSLEU Exam Booking',
        description: `${examDetails.level} ${examDetails.type === 'partial' ? 'Partial' : 'Full'} Exam`,
        image: '/logo.png', // Add your logo
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId,
            });

            if (verificationResponse.success) {
              toast({
                title: "Payment Successful!",
                description: "Your exam booking has been confirmed.",
              });
              onPaymentSuccess(verificationResponse.data);
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support for assistance.",
              variant: "destructive"
            });
            onPaymentFailure(error instanceof Error ? error.message : 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Student Name', // You can get this from user context
          email: 'student@example.com', // You can get this from user context
          contact: '+91 9999999999', // You can get this from user context
        },
        notes: {
          exam_level: examDetails.level,
          exam_type: examDetails.type,
          booking_id: bookingId.toString(),
        },
        theme: {
          color: '#2563eb', // Your brand color
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You can try again when ready.",
              variant: "destructive"
            });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : 'Failed to initiate payment',
        variant: "destructive"
      });
      onPaymentFailure(error instanceof Error ? error.message : 'Payment initiation failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
          <CreditCard className="mr-2 h-6 w-6" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Complete your exam booking payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Summary */}
        <div className="space-y-3">
          <h3 className="font-semibold">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Exam Level:</span>
              <Badge variant="secondary">{examDetails.level}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Exam Type:</span>
              <span className="capitalize">{examDetails.type}</span>
            </div>
            {examDetails.component && (
              <div className="flex justify-between">
                <span>Component:</span>
                <span className="capitalize">{examDetails.component}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Amount Details */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Exam Fee:</span>
            <span>₹{examDetails.fee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount:</span>
            <span>₹{amount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-500">*Including all applicable taxes</p>
        </div>

        <Separator />

        {/* Security Features */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-green-600">
            <Shield className="mr-2 h-4 w-4" />
            Secured by Razorpay
          </div>
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            256-bit SSL Encryption
          </div>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={initiatePayment}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ₹{amount.toLocaleString()}
            </>
          )}
        </Button>

        {/* Supported Payment Methods */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Supported Payment Methods:</p>
          <div className="flex justify-center space-x-2 text-xs text-gray-400">
            <span>Cards</span>
            <span>•</span>
            <span>UPI</span>
            <span>•</span>
            <span>Net Banking</span>
            <span>•</span>
            <span>Wallets</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentGateway;
