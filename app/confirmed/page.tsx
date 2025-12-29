import { CheckCircle } from "lucide-react";

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">
          Booking confirmed!
        </h1>
        <p className="text-gray-600">
          Your meeting has been scheduled successfully.
        </p>
      </div>
    </div>
  );
}
