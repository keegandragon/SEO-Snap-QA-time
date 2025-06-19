import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    if (password.length === 0) {
      setPasswordError(null);
      return;
    }
    
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else if (password.length < 12) {
      setPasswordError('Consider using a longer password for better security');
    } else {
      setPasswordError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    await register(name, email, password);
  };

  const isPasswordValid = password.length >= 8;
  const getPasswordStrength = () => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">
            Start generating SEO product descriptions today
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`input pr-10 ${
                    passwordError && password.length > 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
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
              
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    <div className={`h-1 w-1/3 rounded ${
                      passwordStrength === 'weak' ? 'bg-red-400' : 
                      passwordStrength === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <div className={`h-1 w-1/3 rounded ${
                      passwordStrength === 'medium' ? 'bg-yellow-400' : 
                      passwordStrength === 'strong' ? 'bg-green-400' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-1 w-1/3 rounded ${
                      passwordStrength === 'strong' ? 'bg-green-400' : 'bg-gray-200'
                    }`}></div>
                  </div>
                </div>
              )}

              {/* Password requirements and errors */}
              <div className="mt-1 space-y-1">
                {passwordError ? (
                  <p className="text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {passwordError}
                  </p>
                ) : password.length > 0 ? (
                  <p className="text-xs text-green-600">
                    ✓ Password meets requirements
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                )}
                
                {password.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <p>Password strength: <span className={`font-medium ${
                      passwordStrength === 'weak' ? 'text-red-600' :
                      passwordStrength === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength === 'weak' ? 'Weak' :
                       passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                    </span></p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-800 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the{' '}
                <Link to="#" className="text-blue-800 hover:text-blue-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-blue-800 hover:text-blue-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="btn btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </span>
                ) : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>
            <Link to="/login" className="ml-1 font-medium text-blue-800 hover:text-blue-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;