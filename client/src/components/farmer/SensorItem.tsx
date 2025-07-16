import React from 'react';
import { MoreVertical, AlertCircle, CheckCircle, Battery, InfoIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SensorItemProps {
  id: string;
  location: string;
  status: 'active' | 'warning' | 'error';
  battery: number;
  lastUpdated: string;
}

const SensorItem: React.FC<SensorItemProps> = ({ id, location, status, battery, lastUpdated }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      case 'warning':
        return 'text-amber-600 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30';
      case 'error':
        return 'text-red-600 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30';
      default:
        return 'text-gray-600 bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle size={14} />;
      case 'warning':
        return <AlertCircle size={14} />;
      case 'error':
        return <InfoIcon size={14} />;
      default:
        return <CheckCircle size={14} />;
    }
  };

  const getBatteryColor = () => {
    if (battery > 70) return 'text-emerald-600';
    if (battery > 30) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBatteryBg = () => {
    if (battery > 70) return 'bg-emerald-500/10';
    if (battery > 30) return 'bg-amber-500/10';
    return 'bg-red-500/10';
  };

  return (
    <motion.tr
      className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/30 transition-all duration-300 border-b border-gray-200/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            {id}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-700 font-medium">{location}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-xl border backdrop-blur-sm ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-1.5 capitalize">{status}</span>
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`p-1.5 rounded-lg ${getBatteryBg()} mr-3`}>
            <Battery className={getBatteryColor()} size={16} />
          </div>
          <div className={`text-sm font-semibold ${getBatteryColor()}`}>{battery}%</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
        {lastUpdated}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <motion.button
          className="text-blue-600 hover:text-blue-700 mr-3 px-3 py-1 rounded-lg hover:bg-blue-500/10 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Details
        </motion.button>
        <motion.button
          className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MoreVertical size={16} />
        </motion.button>
      </td>
    </motion.tr>
  );
};

export default SensorItem;