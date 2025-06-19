import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface EmailFormProps {
  onSubmit: (email: string) => Promise<boolean>;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(email);
      setEmail('');
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="input flex-grow rounded-r-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary rounded-l-none"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </form>
  );
};

export default EmailForm;