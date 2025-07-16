import React, { useState } from 'react';
import {
  LucideEye,
  LucideEyeOff,
  LucideMail,
  LucideLock,
  LucideLoader2,
  LucideSprout,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createApiClient, ENDPOINTS, handleApiError } from '../../config/api';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

      // Create API client without token for login
      const apiClient = createApiClient();
      const response = await apiClient.post(ENDPOINTS.LOGIN, {
        email,
        password
      });


      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

    

      // Login using context
      login(user, token);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('Login error:', {
        message: errorMessage,
        error
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 lg:top-20 left-10 lg:left-20 w-16 lg:w-32 h-16 lg:h-32 rounded-full bg-gradient-to-r from-cyan-200 to-blue-300 opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-20 lg:top-40 right-20 lg:right-40 w-12 lg:w-24 h-12 lg:h-24 rounded-full bg-gradient-to-r from-purple-200 to-pink-300 opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 lg:bottom-40 left-20 lg:left-40 w-10 lg:w-20 h-10 lg:h-20 rounded-full bg-gradient-to-r from-emerald-200 to-teal-300 opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Left side - IoT Themed Content */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 via-purple-600/90 to-cyan-500/90" />
        
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            className="w-28 h-28 rounded-full bg-white/100 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/30"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
             <img
          src="/assets/logo.png"
          alt="Agri Eye Logo"
          className="h-20 w-20 object-contain"
        />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          <motion.h1
            className="text-4xl lg:text-5xl font-bold mb-4 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-200 via-white to-purple-200 text-transparent bg-clip-text">
              Welcome Back to agriEYE
            </span>
          </motion.h1>
          
          <motion.p
            className="text-white/90 max-w-md text-base lg:text-lg leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to access your smart farming dashboard and continue managing your connected farm operations.
          </motion.p>
          
          <motion.div
            className="mt-12 space-y-4 lg:space-y-6 text-sm lg:text-base"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.div 
                className="w-3 h-3 rounded-full bg-cyan-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <p className="text-white/90">Real-time farm monitoring</p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <motion.div 
                className="w-3 h-3 rounded-full bg-purple-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <p className="text-white/90">Advanced crop management</p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <motion.div 
                className="w-3 h-3 rounded-full bg-emerald-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <p className="text-white/90">24/7 expert support</p>
            </div>
          </motion.div>

          {/* Floating tech elements */}
          <motion.div
            className="absolute top-20 right-20 w-6 h-6 bg-cyan-400 rounded-sm opacity-60"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-32 left-16 w-4 h-4 bg-purple-400 rounded-full opacity-60"
            animate={{
              x: [0, 20, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        <motion.div
          className="w-full max-w-lg space-y-6 lg:space-y-8 bg-white/80 backdrop-blur-lg p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl border border-gray-200/50 shadow-2xl shadow-blue-500/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="w-14 h-14 lg:w-16 lg:h-16 mx-auto mb-4 lg:mb-6 rounded-xl lg:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <LucideSprout className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
            </motion.div>
            
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-transparent bg-clip-text">
                Welcome Back
              </span>
            </h2>
            <p className="text-gray-600 text-sm lg:text-base">
              Sign in to your IoT Connect account
            </p>
          </div>

          {error && (
            <motion.div
              role="alert"
              aria-live="assertive"
              className="border border-red-300 text-red-700 bg-red-50 px-4 py-3 rounded-xl text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 lg:space-y-6">
            <div className="space-y-4 lg:space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-gray-700 text-sm font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <LucideMail className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-12 w-full bg-white border-2 border-gray-200 rounded-xl py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-gray-700 text-sm font-semibold">
                    Password
                  </label>
                  <a
                    href="#forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <LucideLock className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    className="pl-12 w-full bg-white border-2 border-gray-200 rounded-xl py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-500 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <LucideEyeOff className="h-5 w-5" />
                    ) : (
                      <LucideEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center text-sm lg:text-base shadow-lg shadow-blue-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <LucideLoader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  New to the platform?
                </span>
              </div>
            </div>

            <div className="text-center">
              <motion.a
                href="/register"
                className="text-sm lg:text-base text-blue-600 hover:text-blue-700 transition-colors duration-200 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Create your account →
              </motion.a>
            </div>
          </form>

          <div className="pt-6 text-center text-xs text-gray-500 border-t border-gray-200">
            By signing in, you agree to our{' '}
            <a href="#terms" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;