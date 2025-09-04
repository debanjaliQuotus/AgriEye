import  { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-emerald-200 shadow-lg' 
        : 'bg-transparent backdrop-blur-none border-b border-transparent shadow-none'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`
              h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500
              ${isScrolled 
                ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-emerald-500/10' 
                : 'bg-white/20 backdrop-blur-md border border-white/30'
              }
            `}>
              <img src="../assets/logo.png" alt="" className='h-full w-full object-contain' />
            </div>
            <span className={`
              text-2xl font-[font2] transition-all duration-500
              ${isScrolled 
                ? 'bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent ' 
                : 'text-white drop-shadow-lg'
              }
            `}>
              agriEYE
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button
                variant="outline"
                className={`
                  transition-all duration-500 hover:scale-105 font-medium cursor-pointer
                  ${isScrolled 
                    ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-white/80' 
                    : 'border-white/40 text-white hover:bg-white/20 bg-white/10 backdrop-blur-md'
                  }
                `}
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className={`
                transition-all duration-500 hover:scale-105 font-medium shadow-lg cursor-pointer
                ${isScrolled
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-emerald-500/25'
                  : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30 shadow-white/10'
                }
              `}>
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;