import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Input, Button, Card } from '../components/common';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      toast.success(response.data.message);
      setSent(true);
    } catch (error) {
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-4">
        <Card className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <Mail className="text-primary-500" size={64} />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Check Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            If an account exists for {email}, you will receive a password reset link shortly.
          </p>
          <Link to="/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-accent-purple bg-clip-text text-transparent mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-400">
            Enter your email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <Link to="/login" className="text-brand-400 hover:text-brand-300 transition">
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
};
