import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from '../services/UserPool';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Utility to validate email
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
  };

  // Utility to validate password (length >= 8)
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Frontend validation
    let formErrors = {};
    if (!validateEmail(formData.email)) {
      formErrors.email = 'Please enter a valid email address';
    }
    if (!validatePassword(formData.password)) {
      formErrors.password = 'Password must be at least 8 characters long';
    }

    // If there are validation errors, stop submission and show errors
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    const user = new CognitoUser({
      Username: formData.email,
      Pool: UserPool, // Your Cognito User Pool configuration
    });

    const authDetails = new AuthenticationDetails({
      Username: formData.email,
      Password: formData.password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('Login success:', result);

        // Store the session tokens
        localStorage.setItem('accessToken', result.getAccessToken().getJwtToken());
        localStorage.setItem('idToken', result.getIdToken().getJwtToken());
        localStorage.setItem('refreshToken', result.getRefreshToken().getToken());

        // Redirect user to the dashboard upon successful login
        window.location.href = '/dashboard';
      },
      onFailure: (err) => {
        console.error('Login error:', err);

        // Handle specific Cognito errors
        let cognitoErrors = {};
        if (err.code === 'UserNotFoundException') {
          cognitoErrors.cognito = 'User does not exist';
        } else if (err.code === 'NotAuthorizedException') {
          cognitoErrors.cognito = 'Incorrect username or password. Please try again.';
        } else if (err.code === 'UserNotConfirmedException') {
          cognitoErrors.cognito = 'User not confirmed. Please check your email.';
        } else {
          cognitoErrors.cognito = err.message || 'Authentication failed';
        }

        setErrors(cognitoErrors);
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

        {/* Cognito error - Displayed at the bottom of the form */}
        {errors.cognito && <p className="text-red-500 text-xs mt-4 text-center">{errors.cognito}</p>}

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <a href="/signuppage" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
