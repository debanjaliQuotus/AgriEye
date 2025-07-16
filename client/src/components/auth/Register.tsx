import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  LucideEye,
  LucideEyeOff,
  LucideMail,
  LucideLock,
  LucideLoader2,
  LucideUser,
  LucidePhone,
  LucideMapPin,
  LucideRuler,
  LucideCrop,
  LucideShieldCheck,
  LucideSprout,
} from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  aadhaarNumber: string;
  phoneNumber: string;
  address: string;
  farmSize: string;
  cropTypes: string;
  latitude: string;
  longitude: string;
}

type InputFieldProps = {
  id?: string;
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  onToggle?: () => void;
  toggleIcon?: React.ReactNode;
  type?: string;
  placeholder?: string;
};

const InputField = React.memo(
  ({ id, label, icon, onToggle, toggleIcon, ...props }: InputFieldProps) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-gray-700 text-sm font-semibold"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="h-5 w-5 text-blue-500">{icon}</span>
          </div>
          <input
            id={inputId}
            {...props}
            className="pl-12 w-full bg-white border-2 border-gray-200 rounded-xl py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
          />
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              aria-label={
                props.type === "password"
                  ? "Toggle password visibility"
                  : "Toggle input"
              }
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              {toggleIcon}
            </button>
          )}
        </div>
      </div>
    );
  }
);

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "farmer",
    aadhaarNumber: "",
    phoneNumber: "",
    address: "",
    farmSize: "",
    cropTypes: "",
    latitude: "",
    longitude: "",
  });

  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Back button
  const goToPreviousStep = () => {
    setError("");
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Step 1: Basic Info and Send OTP
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate Step 1 fields
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!formData.password.trim()) {
      setError("Please enter a password.");
      return;
    }
    if (!formData.aadhaarNumber.trim()) {
      setError("Please enter your Aadhaar number.");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    // If all validations pass, move to step 2
    setStep(2);
  };

  // Step 2: Final submit
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate Step 2 fields
    if (!formData.address.trim()) {
      setError("Please enter your address.");
      return;
    }
    if (!formData.farmSize || Number(formData.farmSize) <= 0) {
      setError("Please enter a valid farm size.");
      return;
    }
    if (!formData.cropTypes.trim()) {
      setError("Please enter crop types.");
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      farmSize: formData.farmSize ? Number(formData.farmSize) : 0,
      cropTypes: formData.cropTypes
        ? formData.cropTypes.split(",").map((c) => c.trim())
        : [],
      location: {
        latitude: formData.latitude ? Number(formData.latitude) : 0,
        longitude: formData.longitude ? Number(formData.longitude) : 0,
      },
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        payload
      );
      setSuccess("Registration successful! You can now login.");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "farmer",
        aadhaarNumber: "",
        phoneNumber: "",
        address: "",
        farmSize: "",
        cropTypes: "",
        latitude: "",
        longitude: "",
      });
      setStep(1);
      console.log(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
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
            ease: "linear",
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
            ease: "linear",
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
            ease: "linear",
          }}
        />
      </div>

      {/* Left side - IoT Themed Content - CONSTANT */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 via-purple-600/90 to-cyan-500/90" />

        {/* Circuit pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-center items-center p-8 lg:p-12 text-center h-full">
          <motion.div
            className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-white/100 backdrop-blur-sm flex items-center justify-center mb-6 lg:mb-8 border border-white/30"
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
            className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 lg:mb-4 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-200 via-white to-purple-200 text-transparent bg-clip-text">
              Join agriEYE
            </span>
          </motion.h1>

          <motion.p
            className="text-white/90 max-w-sm lg:max-w-md text-sm lg:text-base xl:text-lg leading-relaxed mb-8 lg:mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create your account and unlock the power of connected farming with
            advanced IoT solutions.
          </motion.p>

          <motion.div
            className="space-y-3 lg:space-y-4 xl:space-y-6 text-xs lg:text-sm xl:text-base"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-cyan-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <p className="text-white/90">Smart sensor integration</p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-purple-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <p className="text-white/90">Automated data collection</p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-emerald-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <p className="text-white/90">Real-time monitoring</p>
            </div>
          </motion.div>

          {/* Floating tech elements */}
          <motion.div
            className="absolute top-16 lg:top-20 right-16 lg:right-20 w-4 h-4 lg:w-6 lg:h-6 bg-cyan-400 rounded-sm opacity-60"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-24 lg:bottom-32 left-12 lg:left-16 w-3 h-3 lg:w-4 lg:h-4 bg-purple-400 rounded-full opacity-60"
            animate={{
              x: [0, 20, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Right side - Registration form */}
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
                Create Account
              </span>
            </h2>
            <p className="text-gray-600 text-sm lg:text-base">
              Join the IoT revolution - Step {step} of 2
            </p>
          </div>

          {/* Status Messages */}
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

          {success && (
            <motion.div
              role="status"
              aria-live="polite"
              className="border border-green-300 text-green-700 bg-green-50 px-4 py-3 rounded-xl text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {success}
            </motion.div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <form
              onSubmit={handleStep1Submit}
              className="space-y-4 lg:space-y-6"
            >
              <InputField
                icon={<LucideUser className="h-5 w-5" />}
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                label="Full Name"
              />
              <InputField
                icon={<LucideMail className="h-5 w-5" />}
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                label="Email Address"
              />
              <InputField
                icon={<LucideLock className="h-5 w-5" />}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleChange}
                label="Password"
                toggleIcon={
                  showPassword ? (
                    <LucideEyeOff className="h-5 w-5" />
                  ) : (
                    <LucideEye className="h-5 w-5" />
                  )
                }
                onToggle={() => setShowPassword((prev) => !prev)}
              />
              <InputField
                icon={<LucideShieldCheck className="h-5 w-5" />}
                name="aadhaarNumber"
                type="text"
                placeholder="Enter 12-digit Aadhaar number"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                label="Aadhaar Number"
              />
              <InputField
                icon={<LucidePhone className="h-5 w-5" />}
                name="phoneNumber"
                type="tel"
                placeholder="+91 9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                label="Phone Number"
              />

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
                    Processing...
                  </>
                ) : (
                  "Continue to Next Step"
                )}
              </motion.button>
            </form>
          )}

          {/* Step 2: Farm Details */}
          {step === 2 && (
            <form
              onSubmit={handleStep2Submit}
              className="space-y-4 lg:space-y-6"
            >
              <InputField
                icon={<LucideMapPin className="h-5 w-5" />}
                name="address"
                type="text"
                placeholder="Enter your farm address"
                value={formData.address}
                onChange={handleChange}
                label="Farm Address"
              />
              <InputField
                icon={<LucideRuler className="h-5 w-5" />}
                name="farmSize"
                type="number"
                placeholder="Farm size in acres"
                value={formData.farmSize}
                onChange={handleChange}
                label="Farm Size (acres)"
              />
              <InputField
                icon={<LucideCrop className="h-5 w-5" />}
                name="cropTypes"
                type="text"
                placeholder="e.g., Wheat, Rice, Corn"
                value={formData.cropTypes}
                onChange={handleChange}
                label="Crop Types (comma separated)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  icon={<LucideMapPin className="h-5 w-5" />}
                  name="latitude"
                  type="text"
                  placeholder="Latitude coordinate"
                  value={formData.latitude}
                  onChange={handleChange}
                  label="Latitude (optional)"
                />
                <InputField
                  icon={<LucideMapPin className="h-5 w-5" />}
                  name="longitude"
                  type="text"
                  placeholder="Longitude coordinate"
                  value={formData.longitude}
                  onChange={handleChange}
                  label="Longitude (optional)"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl transition-all duration-300 font-semibold hover:border-gray-400 hover:bg-gray-50 text-sm lg:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Step 1
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center shadow-lg shadow-blue-500/25 text-sm lg:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <LucideLoader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </motion.button>
              </div>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-white px-4 text-gray-500 font-medium">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="text-center">
            <motion.a
              href="/login"
              className="text-sm lg:text-base text-blue-600 hover:text-blue-700 transition-colors duration-200 font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Sign in to your account →
            </motion.a>
          </div>

          <div className="pt-6 text-center text-xs text-gray-500 border-t border-gray-200">
            By creating an account, you agree to our{" "}
            <a
              href="#terms"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#privacy"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;