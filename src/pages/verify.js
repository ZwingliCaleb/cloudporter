import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../services/UserPool';

const Verify = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = new CognitoUser({
      Username: email,
      Pool: UserPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        setErrors({ cognito: err.message });
        setIsSubmitting(false);
        return;
      }
      console.log('Verification success:', result);
      setIsSuccess(true);
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify your account</h2>
        {isSuccess ? (
          <div>
            <h3 className="text-lg font-medium text-center">Verification successful!</h3>
            <p className="text-sm text-gray-500 text-center">You can now log in to your account.</p>
            <p className="mt-4 text-center">
              <button 
                className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => window.location.href = '/loginpage'}
              >
                Go to Login
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className={`mt-1 block w-full px-4 py-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>
        )}
        {errors.cognito && <p className="text-red-500 text-xs mt-4 text-center">{errors.cognito}</p>}
      </div>
    </div>
  );
};

export default Verify;
