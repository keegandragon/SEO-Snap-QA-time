import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { isSupabaseConfigured } from './lib/supabase';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Premium from './pages/Premium';
import Plans from './pages/Plans';
import Subscription from './pages/Subscription';
import About from './pages/About';
import Pricing from './pages/Pricing';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimer from './pages/Disclaimer';
import Roadmap from './pages/Roadmap';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import TestStripe from './pages/TestStripe';
import StripeDebugger from './pages/StripeDebugger';
import AdminDashboard from './pages/AdminDashboard';
import SubscriptionDiagnostic from './pages/SubscriptionDiagnostic';

function App() {
  const { user } = useAuth();

  // Check if Supabase is properly configured
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Configuration Required</h1>
            <p className="text-gray-600 mb-4">
              This application requires Supabase environment variables to function properly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Required variables:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• VITE_SUPABASE_URL</li>
                <li>• VITE_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-blue-800 mb-2">For Netlify deployment:</p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Go to your Netlify site dashboard</li>
                <li>Navigate to Site settings → Environment variables</li>
                <li>Add both variables with your Supabase values</li>
                <li>Redeploy your site</li>
              </ol>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Environment variables must be prefixed with VITE_ to be accessible in the browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="plans" element={<Plans />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="cookies" element={<CookiePolicy />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
        <Route path="dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="premium" element={<Premium />} />
        <Route path="subscription" element={user ? <Subscription /> : <Navigate to="/login" />} />
        <Route path="subscription-diagnostic" element={user ? <SubscriptionDiagnostic /> : <Navigate to="/login" />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="test-stripe" element={<TestStripe />} />
        <Route path="stripe-debug" element={<StripeDebugger />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;