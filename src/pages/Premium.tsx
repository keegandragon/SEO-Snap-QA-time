import { Link } from 'react-router-dom';
import { Check, Zap, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Premium = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: 'Starter',
      price: 9.99,
      description: 'Perfect for small businesses',
      features: [
        '50 generations per month',
        'Advanced SEO optimization',
        '10 SEO tags per product',
        'Long-form descriptions',
        'Priority processing',
        'Email support'
      ],
      popular: true
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
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Upgrade to Premium
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Unlock more features and boost your productivity with our premium plans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-xl shadow-lg p-8 flex flex-col transition-all duration-300 ${
                plan.popular ? 'border-4 border-indigo-500 scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Popular
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h2>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
              
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price.toFixed(2)}
                  </span>
                  <span className="text-gray-600 text-lg font-medium ml-1">
                    /month
                  </span>
                </div>
              </div>
              
              <ul className="space-y-4 flex-grow mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors inline-flex justify-center items-center"
                >
                  <Zap className="h-5 w-5 inline mr-2" />
                  Choose {plan.name}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include a 30-day money-back guarantee
          </p>
          <Link to="/plans" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Compare all plans →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Premium;