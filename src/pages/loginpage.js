import React from "react";
import { Auth } from 'aws-amplify';

const Login = () => {
  const [ formData, setFormData] = useState ({
    email: '',
    password: '',
  })
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
    if (!formData.password) errors.password = "password is required.";
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validatte();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const user = await Auth.signIn(formData.email, formData.password);
      console.log('Logged in successfully:', user);
      //redirect after succesful login
    } catch (error) {
      console.error('Error logging in:', error);
      setErrors({ ...errors, cognito: error.messsage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign in to your account</h2>

        {/* Login Form */}
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

          {/* Login Button */}
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

        {/* Forgot Password Link */}
        <div className="text-right mt-2">
          <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or sign in with</span>
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

        {/* Sign up Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <a href="/signuppage" className="text-indigo-600 font-medium hover:text-indigo-500"> Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;