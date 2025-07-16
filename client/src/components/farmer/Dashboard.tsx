import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Activity,
  Shield,
  Wifi,
  MapPin,
  AlertOctagon,
  Filter,
  Settings,
  TrendingUp,
  Eye
} from 'lucide-react';
import StatusCard from './StatusCard';
import SensorItem from './SensorItem';
import AlertItem from './AlertItem';
import SensorMap from './SensorMap';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-transparent bg-clip-text">
                Animal Attack Prevention System
              </h1>
              <p className="text-gray-600 mt-2 flex items-center space-x-2">
                <Eye size={16} className="text-emerald-500" />
                <span>Real-time monitoring and alerts • Last updated: Just now</span>
              </p>
            </div>
            <motion.div
              className="flex items-center space-x-3 mt-4 lg:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrendingUp size={16} />
                <span>Analytics</span>
              </motion.button>
              <motion.button
                className="p-2 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 rounded-xl transition-all duration-200 border border-gray-200/50 backdrop-blur-sm shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={16} />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <Link to="/motion-event" className="hover:scale-105 transition-transform duration-200">
              <StatusCard
                title="Active Sensors"
                value="24/28"
                icon={<Wifi className="text-emerald-500" />}
                status="normal"
                detail="All critical sensors online"
              />
            </Link>
            <StatusCard
              title="Threat Level"
              value="Low"
              icon={<Shield className="text-emerald-500" />}
              status="normal"
              detail="No immediate threats detected"
            />
            <StatusCard
              title="Recent Alerts"
              value="3"
              icon={<AlertTriangle className="text-amber-500" />}
              status="warning"
              detail="2 new alerts in the last hour"
            />
            <StatusCard
              title="System Status"
              value="Optimal"
              icon={<Activity className="text-emerald-500" />}
              status="normal"
              detail="All systems functioning normally"
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sensor Map */}
            <motion.div
              className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mr-3 border border-blue-500/30">
                      <MapPin size={18} className="text-blue-600" />
                    </div>
                    Sensor Network Map
                  </h2>
                  <motion.button
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-gray-200/50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Filter size={14} />
                    <span className="text-sm">Filter</span>
                  </motion.button>
                </div>
              </div>
              <div className="p-4 h-80">
                <SensorMap />
              </div>
            </motion.div>

            {/* Recent Alerts */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl mr-3 border border-red-500/30">
                      <AlertOctagon size={18} className="text-red-600" />
                    </div>
                    Recent Alerts
                  </h2>
                  <motion.button
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    View All
                  </motion.button>
                </div>
              </div>
              <div className="p-3 max-h-80 overflow-y-auto custom-scrollbar">
                <AlertItem
                  title="Motion Detected"
                  location="Perimeter Sector B"
                  time="2 min ago"
                  level="warning"
                  details="Large animal detected near fence line. Automated deterrent activated."
                />
                <AlertItem
                  title="Sensor Offline"
                  location="Northeast Corner"
                  time="45 min ago"
                  level="danger"
                  details="Sensor #142 unresponsive. Maintenance team dispatched."
                />
                <AlertItem
                  title="Low Battery"
                  location="Multiple Sensors"
                  time="2 hours ago"
                  level="warning"
                  details="3 sensors require maintenance within 48 hours."
                />
                <AlertItem
                  title="Fence Disturbance"
                  location="West Gate"
                  time="Yesterday"
                  level="info"
                  details="Minor activity detected. No further action required."
                />
              </div>
            </motion.div>
          </div>

          {/* Sensor Status */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl mr-3 border border-emerald-500/30">
                    <Wifi size={18} className="text-emerald-600" />
                  </div>
                  Active Sensors
                </h2>
                <motion.button
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-blue-500/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Settings size={14} />
                  <span>Configure Sensors</span>
                </motion.button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-100/80 to-gray-50/60 backdrop-blur-sm">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sensor ID</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Battery</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Updated</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  <SensorItem id="SN-001" location="North Gate" status="active" battery={92} lastUpdated="Just now" />
                  <SensorItem id="SN-002" location="East Fence" status="active" battery={87} lastUpdated="1 min ago" />
                  <SensorItem id="SN-003" location="South Gate" status="warning" battery={31} lastUpdated="5 min ago" />
                  <SensorItem id="SN-004" location="West Fence" status="error" battery={12} lastUpdated="1 hour ago" />
                  <SensorItem id="SN-005" location="Central Hub" status="active" battery={98} lastUpdated="Just now" />
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;