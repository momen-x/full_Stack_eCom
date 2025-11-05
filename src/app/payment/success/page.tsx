// app/payment/success/page.tsx
export default function PaymentSuccess() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p>
        Thank you for your payment. You will receive a confirmation email
        shortly.
      </p>
    </div>
  );
}
