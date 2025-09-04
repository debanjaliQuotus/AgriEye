import { Button } from "../ui/button";
import { ArrowRight, Shield, Zap, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "gridMove 20s linear infinite",
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl animate-float-delayed"></div>

        {/* Particle effects */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              top: `${15 + i * 7}%`,
              left: `${10 + i * 8}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Main heading */}
            <h1 className="text-[12vw] sm:text-6xl lg:text-7xl  mb-8 leading-tight font-[font2] uppercase">
              <span className="text-white block mb-2 drop-shadow-lg">
                Advanced Animal
              </span>
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 text-transparent bg-clip-text block drop-shadow-sm">
                Detection System
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-emerald-100 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-sm font-[font1]">
              Advanced IoT sensors and AI-powered detection to protect your
              property and livestock from wildlife threats. Monitor, detect, and
              respond in real-time with cutting-edge technology.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16 justify-center lg:justify-start">
              <Button
              onClick={()=>navigate('/register')}
                size="lg"
                className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white text-lg px-4 py-2 h-auto shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-white/20 group cursor-pointer"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 text-lg px-4 py-2 h-auto backdrop-blur-md transition-all duration-300 transform hover:scale-105 border-2 cursor-pointer"
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 text-emerald-200">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Real-time Detection</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <Camera className="h-5 w-5" />
                <span className="text-sm font-medium">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-200">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">24/7 Protection</span>
              </div>
            </div>
          </div>

          {/* Right content - 3D camera/sensor */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Main device container */}
              <div className="relative transform perspective-1000 hover:rotate-y-[5deg] transition-transform duration-700">
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-white/10 transition-all duration-700">
                  {/* Camera sensor placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border-4 border-white/10 shadow-inner relative overflow-hidden">
                    <img
                      src="../assets/sensor_vdo.gif"
                      alt=""
                      className="h-full w-full object-contain"
                    />

                    {/* Camera lens effect */}
                    <div className="relative w-32 h-32 bg-gradient-to-br from-slate-700 to-black rounded-full flex items-center justify-center border-4 border-emerald-400/30 shadow-lg">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-80 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"></div>
                    </div>

                    {/* Tech details */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-1">
                      <div className="w-8 h-1 bg-emerald-400 rounded-full opacity-60"></div>
                      <div className="w-6 h-1 bg-blue-400 rounded-full opacity-60"></div>
                      <div className="w-4 h-1 bg-teal-400 rounded-full opacity-60"></div>
                    </div>

                    {/* Status indicator */}
                    <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-300 font-medium">
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-3xl opacity-60"></div>
                </div>

                {/* Glow effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-3xl blur-xl -z-10 animate-pulse"></div>
              </div>

              {/* Floating tech elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-emerald-400/20 rounded-full blur-xl animate-float"></div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-float-delayed"></div>

              {/* Data visualization elements */}
              <div className="absolute top-1/4 -right-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 animate-float">
                <div className="flex flex-col space-y-1">
                  <div className="w-8 h-1 bg-emerald-400 rounded-full"></div>
                  <div className="w-6 h-1 bg-blue-400 rounded-full opacity-70"></div>
                  <div className="w-7 h-1 bg-teal-400 rounded-full opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
