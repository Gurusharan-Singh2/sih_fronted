"use client";

import { useAlertStore } from "../store/useAlertStore";
import { 
  Shield, 
  AlertTriangle, 
  User, 
  Database, 
  Globe, 
  Clock, 
  TrendingUp,
  Activity,
  Zap,
  Eye
} from "lucide-react";

export default function AlertCard({ alert }) {
  const openModal = useAlertStore((state) => state.openModal);

  const getSeverityConfig = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: <AlertTriangle className="w-4 h-4" />,
          pulse: 'animate-pulse'
        };
      case 'high':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          icon: <TrendingUp className="w-4 h-4" />,
          pulse: ''
        };
      case 'medium':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: <Activity className="w-4 h-4" />,
          pulse: ''
        };
      case 'low':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: <Shield className="w-4 h-4" />,
          pulse: ''
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: <Globe className="w-4 h-4" />,
          pulse: ''
        };
    }
  };

  const getThreatTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'brute_force': return <Shield className="w-5 h-5 text-blue-600" />;
      case 'insider_threat': return <User className="w-5 h-5 text-purple-600" />;
      case 'data_exfiltration': return <Database className="w-5 h-5 text-red-600" />;
      case 'malware': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <Globe className="w-5 h-5 text-gray-600" />;
    }
  };

  const getThreatTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'brute_force': return 'Brute Force Attack';
      case 'insider_threat': return 'Insider Threat';
      case 'data_exfiltration': return 'Data Exfiltration';
      case 'malware': return 'Malware Detection';
      default: return type?.replace('_', ' ').toUpperCase() || 'Unknown';
    }
  };

  const severityConfig = getSeverityConfig(alert.severity);
  const timeAgo = new Date(alert.timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - timeAgo) / (1000 * 60));
  
  const getTimeAgo = () => {
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 border-l-4 ${severityConfig.borderColor} ${severityConfig.bgColor} dark:bg-gray-700/50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${severityConfig.pulse}`}
      onClick={() => openModal(alert)}
    >
      {/* Gradient overlay for critical alerts */}
      {alert.severity?.toLowerCase() === 'critical' && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
      )}
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getThreatTypeIcon(alert.type)}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {alert.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getThreatTypeLabel(alert.type)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityConfig.color} ${severityConfig.bgColor} ${severityConfig.borderColor} border`}>
              {severityConfig.icon}
              <span className="ml-1">{alert.severity?.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {/* Evidence Preview */}
        {alert.evidence && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Eye className="w-3 h-3" />
              <span>Evidence Preview</span>
            </div>
            <div className="space-y-1">
              {Object.entries(alert.evidence).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace('_', ' ')}:
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                    {typeof value === 'object' ? JSON.stringify(value).substring(0, 20) + '...' : String(value).substring(0, 20)}
                  </span>
                </div>
              ))}
              {Object.keys(alert.evidence).length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{Object.keys(alert.evidence).length - 2} more indicators
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{getTimeAgo()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>Active</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <span>View Details</span>
            <Zap className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
}