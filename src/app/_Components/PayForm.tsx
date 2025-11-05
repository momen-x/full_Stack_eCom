"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CreditCard, Shield } from "lucide-react";

// Stripe Elements
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";
import {
  insertCustomerSchema,
  InsertCustomerSchemaType,
} from "../validation/customer";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../store/hook";

// Inner component that uses Stripe hooks
const CheckoutForm = ({
  customerData,
  amount,
  onSuccess,
}: {
  customerData: InsertCustomerSchemaType;
  amount: number;
  onSuccess: (paymentIntent: any) => void;
}) => {
  const stripe = useStripe();

  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
        payment_method_data: {
          billing_details: {
            name: `${customerData.firstName} ${customerData.lastName}`,
            email: customerData.email,
            phone: customerData.phone,
            address: {
              line1: customerData.address1,
              city: customerData.city,
              state: customerData.state,
              postal_code: customerData.zip_code,
            },
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }
    setIsProcessing(false);
    router.push("payment/success");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {message && (
        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg">
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ${amount}
          </>
        )}
      </Button>
    </form>
  );
};

const PayForm = () => {
  const { totalPrice } = useAppSelector((state) => state.carts);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<"customer-info" | "payment">(
    "customer-info"
  );
  //   const [amount] = useState<number>(100); // Default amount, you can make this dynamic

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<InsertCustomerSchemaType>({
    resolver: zodResolver(insertCustomerSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      email: "",
      phone: "",
      state: "",
      zip_code: "",
      saveCard: false,
      amount: totalPrice,
    },
  });

  // Create payment intent when moving to payment step
  const onCreatePaymentIntent = async (data: InsertCustomerSchemaType) => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amount ||0,
          currency: "usd",
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setPaymentStep("payment");
    } catch (error) {
      console.error("Error creating payment intent:", error);
      alert("Error setting up payment. Please try again.");
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log("Payment succeeded:", paymentIntent);
    alert("Payment completed successfully!");
    // Here you can redirect to success page or clear the form
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(
      6,
      10
    )}`;
  };

  if (paymentStep === "payment" && clientSecret) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <p>Amount: ${getValues("amount") || 0}</p>
              <p>
                Customer: {getValues("firstName")} {getValues("lastName")}
              </p>
            </div>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#2563eb",
                  },
                },
              }}
            >
              <CheckoutForm
                customerData={getValues()}
                amount={getValues("amount") || 0}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setPaymentStep("customer-info")}
              >
                Back to Customer Information
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onCreatePaymentIntent)}
            className="space-y-6"
          >
            {/* Amount Field */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
                readOnly
                placeholder="100.00"
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="John"
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Doe"
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john.doe@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="123-456-7890"
                className={errors.phone ? "border-destructive" : ""}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  e.target.value = formatted;
                }}
                maxLength={12}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address1">Street Address *</Label>
              <Input
                id="address1"
                {...register("address1")}
                placeholder="123 Main St"
                className={errors.address1 ? "border-destructive" : ""}
              />
              {errors.address1 && (
                <p className="text-sm text-destructive">
                  {errors.address1.message}
                </p>
              )}
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="New York"
                  className={errors.city ? "border-destructive" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  {...register("state")}
                  placeholder="NY"
                  className={errors.state ? "border-destructive" : ""}
                  maxLength={2}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                {errors.state && (
                  <p className="text-sm text-destructive">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code">ZIP Code *</Label>
                <Input
                  id="zip_code"
                  {...register("zip_code")}
                  placeholder="12345 or 12345-6789"
                  className={errors.zip_code ? "border-destructive" : ""}
                />
                {errors.zip_code && (
                  <p className="text-sm text-destructive">
                    {errors.zip_code.message}
                  </p>
                )}
              </div>
            </div>

            {/* Save Card Option */}
            <div className="flex items-center space-x-2">
              <Checkbox id="saveCard" {...register("saveCard")} />
              <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                Save card for future payments
              </Label>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">
                  Your payment information is secure
                </p>
                <p className="mt-1">
                  We use Stripe for secure payment processing. Your card details
                  are never stored on our servers.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayForm;
