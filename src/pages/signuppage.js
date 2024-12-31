import React, { useState } from "react";
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import UserPool from '../services/UserPool';  // Import your User Pool settings

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = "Full name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.password) errors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    const attributeList = [
      new CognitoUserAttribute({ Name: 'name', Value: formData.fullName }),
      new CognitoUserAttribute({ Name: 'email', Value: formData.email }),
    ];

    console.log('Starting signup with:', formData.email);
    
    UserPool.signUp(formData.email, formData.password, attributeList, null, (err, result) => {
      if (err) {
        console.error('Signup error:', err);
        setErrors({ cognito: err.message });
        setIsSubmitting(false);
        return;
      }
      console.log('Signup success:', result);
      setIsSuccess(true);  // Set success to true after signup
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create your account</h2>

        {isSuccess ? (
          <div>
            <h3 className="text-lg font-medium text-center">Signup successful!</h3>
            <p className="text-sm text-gray-500 text-center">Please check your email for a verification code.</p>
            <p className="mt-4 text-center">
              <button 
                className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => window.location.href = '/verify'}  // Redirect to a verification page
              >
                Verify Email
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`mt-1 block w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className={`mt-1 block w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>
        )}

        <div className="my-6 text-center text-gray-500">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative bg-white px-4 text-sm">or</div>
          </div>
          <div className="mt-6 flex justify-center">
            <button 
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700"
              onClick={() => alert('Google login not implemented yet')}
            >
              Sign Up with Google
            </button>
          </div>
        </div>

        {errors.cognito && <p className="text-red-500 text-xs mt-4 text-center">{errors.cognito}</p>}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/loginpage" className="text-indigo-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
