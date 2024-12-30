import React, { useState } from "react";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from '../services/UserPool';  // A file that exports your Cognito User Pool settings

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    const user = new CognitoUser({
      Username: formData.email,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: formData.email,
      Password: formData.password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('Login success:', result);
        // Redirect user or handle successful login
        // Example: history.push('/dashboard');
      },
      onFailure: (err) => {
        console.error('Login error:', err);
        let errorMessage = 'An error occurred. Please try again.';
        
        if (err.code === 'UserNotFoundException') {
          errorMessage = 'User not found. Please check your email or sign up.';
        } else if (err.code === 'NotAuthorizedException') {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (err.code) {
          errorMessage = err.message;
        }

        setErrors({ cognito: errorMessage });
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign in to your account</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        {errors.cognito && <p className="text-red-500 text-xs mt-4 text-center">{errors.cognito}</p>}
      </div>
    </div>
  );
};

export default Login;
