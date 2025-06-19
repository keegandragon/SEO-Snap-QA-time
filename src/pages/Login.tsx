import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { resendConfirmationEmail } from '../services/authService';

const Login = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleResendConfirmation = async () => {
    try {
      setResendLoading(true);
      await resendConfirmationEmail(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // Reset success message after 5 seconds
    } catch (err) {
      console.error('Failed to resend confirmation email:', err);
    } finally {
      setResendLoading(false);
    }
  };

  const isEmailConfirmationError = error?.toLowerCase().includes('email not confirmed');

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm">{error}</span>
                    {isEmailConfirmationError && (
                      <button
                        type="button"
                        onClick={handleResendConfirmation}
                        disabled={resendLoading || resendSuccess}
                        className="block mt-2 text-sm font-medium text-blue-800 hover:text-blue-700 disabled:opacity-50"
                      >
                        {resendLoading ? 'Sending...' : resendSuccess ? 'Confirmation email sent!' : 'Resend confirmation email'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your email"
                />
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-800 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-2.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>
            <Link to="/register" className="ml-1 font-medium text-blue-800 hover:text-blue-700">
              Create one now
            </Link>
          </div>
        </div>

        {/* Demo account info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>For demo purposes, any email and password combination will work</p>
        </div>
      </div>
    </div>
  );
};

export default Login;