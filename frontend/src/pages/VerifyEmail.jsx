import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Card, Button } from '../components/common';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        toast.success(response.data.message);
        setStatus('success');
      } catch (error) {
        const message = error.response?.data?.message || 'Verification failed';
        toast.error(message);
        setStatus('error');
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-4">
              <svg className="animate-spin h-16 w-16 text-brand-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-100">
              Verifying Email...
            </h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500" size={64} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Email Verified!
            </h2>
            <p className="text-gray-400 mb-6">
              Your email has been successfully verified. You can now log in to your account.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="text-red-500" size={64} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Verification Failed
            </h2>
            <p className="text-gray-400 mb-6">
              The verification link is invalid or has expired.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};
