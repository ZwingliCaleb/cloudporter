import React from "react";

export default function Signup() {
  const handleSignup = (event) => {
    event.preventDefault();
    // Logic to handle signup goes here, such as calling AWS Cognito API
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create your account</h2>
        
        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              id="full-name" 
              name="full-name" 
              placeholder="John Doe" 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              required 
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="you@example.com" 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              required 
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="********" 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              required 
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input 
              type="password" 
              id="confirm-password" 
              name="confirm-password" 
              placeholder="********" 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              required 
            />
          </div>

          {/* Signup Button */}
          <div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Sign Up
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
          {/* Google */}
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50">
            <img className="h-6 w-6" src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
          </button>
          
          {/* Facebook */}
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50">
            <img className="h-6 w-6" src="https://www.svgrepo.com/show/319494/facebook.svg" alt="Facebook" />
          </button>

          {/* Amazon */}
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-50">
            <img className="h-6 w-6" src="https://www.svgrepo.com/show/354084/amazon.svg" alt="Amazon" />
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
}
