import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Zap, Eye, Bell, MapPin } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-gray-900">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-200 px-2 sm:px-6 lg:px-8 shadow-sm">
  <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="h-20 w-20 bg-emerald-100 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center">
        <img
          src="/assets/logo.png"
          alt="Agri Eye Logo"
          className="h-20 w-20 object-contain"
        />
      </div>
      <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
        agriEYE
      </span>
    </div>

    <div className="flex items-center space-x-4">
      <Link to="/login">
      <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-700 transition-all duration-300">
        Login
      </Button>
      </Link>
      <Link to="/register">
      <Button className="bg-gradient-to-r from-blue-400 to-pink-600 hover:from-blue-600 hover:to-pink-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300">
        Register
      </Button>
      </Link>
    </div>
  </div>
</nav>


     {/* Hero Section */}
<div className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-gradient-to-br from-cyan-300 via-blue-300 via-purple-600 via-pink-300 to-yellow-300 overflow-hidden">
  {/* IoT Background Watermarks */}
  <div className="absolute inset-0 opacity-10">
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/11579194/pexels-photo-11579194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: '400px 400px',
        backgroundRepeat: 'repeat',
        backgroundPosition: '0 0'
      }}
    ></div>
    <div 
      className="absolute top-20 left-10 w-48 h-48 opacity-20"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/11579194/pexels-photo-11579194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    ></div>
    <div 
      className="absolute top-32 right-16 w-56 h-56 opacity-15"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/11579194/pexels-photo-11579194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    ></div>
    <div 
      className="absolute bottom-20 left-20 w-44 h-44 opacity-20"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/11579194/pexels-photo-11579194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    ></div>
    <div 
      className="absolute bottom-32 right-12 w-52 h-52 opacity-15"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/11579194/pexels-photo-11579194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    ></div>
    <div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/11579194/pexels-photo-11579194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    ></div>
  </div>

  {/* Floating IoT Elements */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
    <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    <div className="absolute bottom-1/4 right-1/3 w-7 h-7 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
  </div>

  <div className="max-w-7xl mx-auto text-center relative z-10">
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white/60 backdrop-blur-sm p-8 rounded-full shadow-2xl">
            <img
          src="/assets/logo.png"
          alt="Agri Eye Logo"
          className="h-26 w-26 object-contain"
        />
        </div>
      </div>
    </div>
    
    <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg leading-tight">
      Animal Attack Prevention System
    </h1>
    
    <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
      Advanced IoT sensors and AI-powered detection to protect your property and livestock from wildlife threats. 
      Monitor, detect, and respond in real-time with cutting-edge technology.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
      <Button 
        size="lg" 
        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 text-lg px-8 py-4 h-auto shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Get Started
      </Button>
      <Button 
        variant="outline" 
        size="lg"
        className="border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60 text-lg px-8 py-4 h-auto transition-all duration-300 transform hover:scale-105"
      >
        Learn More
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg">
        <div className="text-4xl font-bold text-white mb-2 drop-shadow-md">24/7</div>
        <div className="text-white/90">Continuous Monitoring</div>
      </div>
      <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg">
        <div className="text-4xl font-bold text-white mb-2 drop-shadow-md">99.8%</div>
        <div className="text-white/90">Detection Accuracy</div>
      </div>
      <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30 shadow-lg">
        <div className="text-4xl font-bold text-white mb-2 drop-shadow-md">15+</div>
        <div className="text-white/90">Sensor Types</div>
      </div>
    </div>
  </div>
</div>


      {/* Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-emerald-100/50 to-green-200/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-pink-600 bg-clip-text text-transparent">
            Advanced Protection Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-white">
              <div className="bg-gradient-to-r from-blue-400 to-pink-600 p-4 rounded-lg w-fit mb-6 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Vision Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced computer vision algorithms identify and classify different animal species with 99.8% accuracy in real-time.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-white">
              <div className="bg-gradient-to-r from-blue-400 to-pink-600 p-4 rounded-lg w-fit mb-6 shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Alerts</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive immediate notifications via SMS, email, or mobile app when potential threats are detected on your property.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-white">
              <div className="bg-gradient-to-r from-blue-400 to-pink-600 p-4 rounded-lg w-fit mb-6 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Zone Mapping</h3>
              <p className="text-gray-600 leading-relaxed">
                Create custom protection zones and set different alert levels for various areas of your property.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-white">
              <div className="bg-gradient-to-r from-yellow-500 to-emerald-500 p-4 rounded-lg w-fit mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Deterrents</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated response systems including lights, sounds, and safe deterrent mechanisms to protect without harm.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-white">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-lg w-fit mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">IoT Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive sensor network including motion, thermal, acoustic, and environmental monitoring devices.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-white">
              <div className="bg-gradient-to-r from-red-500 to-emerald-500 p-4 rounded-lg w-fit mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">24/7 Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock monitoring with cloud backup, ensuring your property is always protected and data is secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-pink-600 bg-clip-text text-transparent">
            Ready to Protect Your Property?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of property owners who trust our advanced animal detection system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-400 to-pink-600 hover:from-blue-600 hover:to-pink-700 text-white text-lg px-12 py-4 h-auto shadow-lg shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Create Account
            </Button>
            </Link>
            <Link to="/login">
            <Button 
              variant="outline" 
              size="lg"
              className="border-blue-400 text-blue-700 hover:bg-blue-50 hover:border-blue-700 text-lg px-12 py-4 h-auto transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;