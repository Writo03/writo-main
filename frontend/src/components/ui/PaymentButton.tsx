import React, { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { AlertCircle, Loader2 } from 'lucide-react';
import { 
  Alert,
  AlertDescription,
  AlertTitle 
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/utils/axiosInstance';
import { useSelector } from 'react-redux';
import { RootState } from '@/types/state';

// Types
interface PaymentButtonProps {
  price: number;
  serviceName: string;
  serviceId: string;
  onSuccess?: (paymentDetails: PaymentSuccessDetails) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
  currencySymbol?: string;
  companyName?: string;
  customThemeColor?: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface PaymentSuccessDetails {
  paymentId: string;
  orderId: string;
  signature: string;
  serviceName: string;
  serviceId: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  price,
  serviceName,
  serviceId,
  onSuccess,
  onError,
  disabled = false,
  className = '',
  currencySymbol = '₹',
  companyName = 'Writo Education',
  customThemeColor = '#937DC2'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth);
  const clearError = useCallback(() => setError(null), []);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (price <= 0) throw new Error('Invalid price amount');
      if (!serviceName.trim()) throw new Error('Service name is required');
      if (!serviceId.trim()) throw new Error('Service ID is required');

      // Step 1: Create order
      const orderResponse = await axiosInstance.post<{ data: { order: RazorpayOrder } }>(
        '/subscription/order',
        { amount: price }
      );
      const  order  = orderResponse.data.data;
     

      // Step 2: Initialize Razorpay
      const options: RazorpayOptions = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: companyName,
        description: `Payment for ${serviceName}`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await axiosInstance.post('/subscription/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
              serviceId,
              serviceName,
            });

            const paymentDetails: PaymentSuccessDetails = {
              paymentId: response.razorpay_payment_id,
              orderId: order.id,
              signature: response.razorpay_signature,
              serviceName,
              serviceId,
            };

            onSuccess?.(paymentDetails);
          } catch (verifyError) {
            const errorMessage = verifyError instanceof AxiosError 
              ? verifyError.response?.data?.message || 'Payment verification failed'
              : 'Payment verification failed';
            
            setError(errorMessage);
            onError?.(new Error(errorMessage));
          }
        },
        theme: {
          color: customThemeColor,
        },
      };
      const loadScript = (src) => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
          document.body.appendChild(script);
        });
      };
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (user) {
        options.prefill = {
          email: user.email || undefined,
          name: user.fullName || undefined,
          contact: user.phone || undefined,
        };
      }

      const rzp = new window.Razorpay(options);

      // Add event handlers
      rzp.on('payment.failed', function () {
        setError('Payment failed. Please try again.');
      });

      rzp.open();
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.message || 'Payment initialization failed'
        : error instanceof Error 
          ? error.message 
          : 'Something went wrong with the payment process';
      
      setError(errorMessage);
      onError?.(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className={`relative ${className}`}
        variant="default"
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Pay {currencySymbol}{price} for {serviceName}
      </Button>
    </div>
  );
};

export default PaymentButton;