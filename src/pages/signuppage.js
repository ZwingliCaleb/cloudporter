import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { FaGoogle, FaFacebook, FaAmazon } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.fullName) errors.fullName = "Full name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.password) errors.password = "Password is required.";
    if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password.";
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const { user } = await Auth.signUp({
        username: formData.email,
        password: formData.password,
        attributes: {
          email: formData.email,
          name: formData.fullName,
        },
      });
      console.log('Sign up success:', user);
      // Redirect or show confirmation
    } catch (error) {
      console.error('Error signing up:', error);
      setErrors({ ...errors, cognito: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create your account</h2>
        
        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              placeholder="John Doe" 
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              required 
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              required 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              required 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              required 
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Signup Button */}
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

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50">
            <FaGoogle className="h-6 w-6" />
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50">
            <FaFacebook className="h-6 w-6" />
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50">
            <FaAmazon className="h-6 w-6" />
          </button>
        </div>

        {/* Sign in Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? 
          <a href="/loginpage" className="text-indigo-600 font-medium hover:text-indigo-500"> Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
