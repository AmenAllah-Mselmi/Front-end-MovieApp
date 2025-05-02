import React from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Silver',
      price: 9.99,
      icon: Star,
      color: 'text-gray-400',
      features: [
        'Access to all movies',
        'Basic movie recommendations',
        'Standard video quality',
        'Ad-supported experience',
        '1 device at a time'
      ]
    },
    {
      name: 'Gold',
      price: 14.99,
      icon: Crown,
      color: 'text-yellow-500',
      popular: true,
      features: [
        'Everything in Silver',
        'Ad-free experience',
        'HD video quality',
        'Offline downloads',
        '2 devices at a time',
        'Priority support'
      ]
    },
    {
      name: 'Premium',
      price: 19.99,
      icon: Zap,
      color: 'text-blue-500',
      features: [
        'Everything in Gold',
        '4K Ultra HD',
        'Early access to new features',
        'Unlimited devices',
        'Exclusive content',
        'Personal watchlist curator',
        'VIP support'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          Choose Your Plan
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-700 dark:text-gray-300">
          Select the perfect plan for your movie-watching needs. All plans include access to our extensive movie catalog and community features.
        </p>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800 ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6 flex items-center justify-center">
                <Icon className={`h-12 w-12 ${plan.color}`} />
              </div>

              <h3 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h3>

              <div className="mb-6 text-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700 dark:text-gray-300">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                fullWidth
              >
                Choose {plan.name}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-lg bg-blue-50 p-8 text-center dark:bg-blue-900/20">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          100% Satisfaction Guaranteed
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Try any plan risk-free for 30 days. If you're not completely satisfied, we'll give you a full refund.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;