import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful</h1>
        <p className="text-gray-700 mb-4">
          Thank you for your payment! Your transaction has been completed successfully.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
