import React from 'react';
import { AlertTriangle, Info, AlertOctagon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertItemProps {
  title: string;
  location: string;
  time: string;
  level: 'info' | 'warning' | 'danger';
  details: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ title, location, time, level, details }) => {
  const getIcon = () => {
    switch (level) {
      case 'info':
        return <Info className="text-blue-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-amber-600" size={20} />;
      case 'danger':
        return <AlertOctagon className="text-red-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getGradientBg = () => {
    switch (level) {
      case 'info':
        return 'bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-blue-500/10';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10';
      case 'danger':
        return 'bg-gradient-to-r from-red-500/10 via-pink-500/5 to-red-500/10';
      default:
        return 'bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-blue-500/10';
    }
  };

  const getBorderColor = () => {
    switch (level) {
      case 'info':
        return 'border-l-blue-600 border-blue-600/30';
      case 'warning':
        return 'border-l-amber-600 border-amber-600/30';
      case 'danger':
        return 'border-l-red-600 border-red-600/30';
      default:
        return 'border-l-blue-600 border-blue-600/30';
    }
  };

  const getIconBg = () => {
    switch (level) {
      case 'info':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-600/30';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-600/30';
      case 'danger':
        return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-600/30';
      default:
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-600/30';
    }
  };

  return (
    <motion.div
      className={`mb-3 p-4 ${getGradientBg()} rounded-xl border-l-4 ${getBorderColor()} hover:shadow-lg transition-all duration-300 backdrop-blur-sm border border-gray-200/50`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start space-x-4">
        <motion.div
          className={`flex-shrink-0 p-2 rounded-xl ${getIconBg()} border backdrop-blur-sm`}
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {getIcon()}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">{title}</h3>
            <div className="flex items-center text-xs text-gray-600 bg-gray-100/50 px-2 py-1 rounded-lg backdrop-blur-sm">
              <Clock size={12} className="mr-1" />
              {time}
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600 font-medium bg-gray-100/30 px-2 py-1 rounded-md backdrop-blur-sm">
              📍 {location}
            </p>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{details}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertItem;