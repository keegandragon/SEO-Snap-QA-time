import { Link } from 'react-router-dom';
import { Check, Zap, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Plans = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for trying out our service',
      features: [
        '5 generations per month',
        'Basic SEO optimization',
        '5 SEO tags per product',
        'Copy to clipboard',
        'Email sharing',
        'Community support'
      ],
      cta: 'Get Started Free',
      popular: false,
      current: user && !user.isPremium && user.usageLimit === 5
    },
    {
      name: 'Starter',
      price: 9.99,
      description: 'Great for small businesses',
      features: [
        '50 generations per month',
        'Advanced SEO optimization',
        '10 SEO tags per product',
        'Long-form descriptions',
        'Priority processing',
        'Email support'
      ],
      cta: 'Start Free Trial',
      popular: true,
      current: user && user.isPremium && user.usageLimit === 50
    },
    {
      name: 'Pro',
      price: 19.99,
      description: 'For power users and agencies',
      features: [
        '200 generations per month',
        'Premium SEO optimization',
        '15 SEO tags per product',
        'Long-form descriptions',
        'Priority processing',
        'Premium support',
        'Export to CSV',
        'Advanced analytics'
      ],
      cta: 'Start Free Trial',
      popular: false,
      current: user && user.isPremium && user.usageLimit === 200
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate SEO-optimized product descriptions with AI. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Current Plan Indicator */}
        {user && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">
              <Crown className="h-4 w-4 mr-2" />
              Currently on {plans.find(p => p.current)?.name || 'Free'} Plan
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative card hover:border-blue-500 transition-all duration-300 ${
                plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''
              } ${plan.current ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  {plan.name !== 'Free' && (
                    <Crown className="h-6 w-6 text-blue-800" />
                  )}
                </div>

                <div className="flex items-baseline mb-4">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{plan.description}</p>

                {plan.current ? (
                  <button className="btn w-full cursor-default bg-green-600 text-white hover:bg-green-600 border-green-600 mb-8">
                    <Crown className="w-5 h-5 mr-2" />
                    Current Plan
                  </button>
                ) : (
                  <Link
                    to={plan.price === 0 ? "/register" : "/premium"}
                    className={`btn w-full mb-8 ${
                      plan.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' 
                        : 'bg-teal-600 text-white hover:bg-teal-700 border-teal-600'
                    }`}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    {plan.cta}
                  </Link>
                )}

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan at any time?</h3>
              <p className="text-gray-600 text-sm">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my monthly limit?</h3>
              <p className="text-gray-600 text-sm">If you reach your monthly generation limit, you can either upgrade your plan or wait until the next billing cycle.</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">We offer a 30-day money-back guarantee for all paid plans. No questions asked.</p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">How does the Free plan work?</h3>
              <p className="text-gray-600 text-sm">The Free plan gives you 5 AI-generated product descriptions per month with basic SEO optimization. Perfect for testing our service.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="btn btn-outline">
                Return to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;