import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { MailIcon, ArrowLeftIcon, LoaderIcon } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      // Make API call to the backend
      const response = await axios.post(
        "http://localhost:8080/auth/forgot-password",
        null,
        {
          params: { email },
        }
      );

      if (response.status === 200) {
        setStatus("success");
        // Redirect to ResetPassword page with email as a query parameter
        navigate(`/resetPassword?email=${encodeURIComponent(email)}`);
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login Link */}
        <Link
          to="/login"
          className="inline-flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              Enter your email address and we&apos;ll send you instructions to reset
              your password.
            </p>
          </div>

          {status === "success" ? (
            <div className="text-center p-4 bg-green-50 rounded-lg mb-6">
              <p className="text-green-800">
                If an account exists with this email, you&apos;ll receive password
                reset instructions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {status === "error" && (
                <div className="text-red-600 text-sm">{errorMessage}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;