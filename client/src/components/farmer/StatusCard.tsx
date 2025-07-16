import React from 'react';
import { motion } from 'framer-motion';

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  status: 'normal' | 'warning' | 'danger';
  detail: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon, status, detail }) => {
  const getGradientBg = () => {
    switch (status) {
      case 'normal':
        return 'bg-white/80 backdrop-blur-sm';
      case 'warning':
        return 'bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-sm';
      case 'danger':
        return 'bg-gradient-to-br from-white/80 via-red-50/50 to-white/80 backdrop-blur-sm';
      default:
        return 'bg-white/80 backdrop-blur-sm';
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'normal':
        return 'border-emerald-500/30 shadow-emerald-500/10';
      case 'warning':
        return 'border-amber-500/30 shadow-amber-500/10';
      case 'danger':
        return 'border-red-500/30 shadow-red-500/10';
      default:
        return 'border-gray-200/50 shadow-gray-500/10';
    }
  };

  const getIconBg = () => {
    switch (status) {
      case 'normal':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30';
      case 'danger':
        return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30';
      default:
        return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30';
    }
  };

  return (
    <motion.div
      className={`${getGradientBg()} ${getBorderColor()} rounded-2xl shadow-xl overflow-hidden border hover:shadow-2xl transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 text-sm font-semibold tracking-wide uppercase">{title}</p>
          <motion.div
            className={`rounded-xl p-3 ${getIconBg()} border backdrop-blur-sm`}
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
        </div>
        
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 ${
          status === 'normal' ? 'bg-gradient-to-br from-emerald-500/5 to-teal-500/5' :
          status === 'warning' ? 'bg-gradient-to-br from-amber-500/5 to-orange-500/5' :
          'bg-gradient-to-br from-red-500/5 to-pink-500/5'
        }`} />
      </div>
    </motion.div>
  );
};

export default StatusCard;