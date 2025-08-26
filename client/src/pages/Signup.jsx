import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Left Image Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-black hidden md:block relative">
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-12">
            <div className="text-white text-center grid justify-center">
              <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
              <p className="text-xl mb-8">
                Sign up to explore news, articles, and insights powered by AI.
              </p>
              <button className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-600 px-8 py-3 rounded-full transition-all duration-300">
                <span>Explore Features</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-500">
                Already have an account?
                <Link to={"/login"} className="text-blue-600 hover:text-blue-700 ml-1">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-4 mb-8">
              <button className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FcGoogle className="h-5 w-5 mr-2" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaGithub className="h-5 w-5 mr-2" />
                <span>GitHub</span>
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-gray-500 text-sm">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
