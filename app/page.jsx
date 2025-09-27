"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "../lib/api";
import AlertCard from "../components/AlertCard";
import AlertModal from "../components/AlertModal";
import SOCAssistant from "../components/SOCAssistant";
import ThemeToggle from "../components/ThemeToggle";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  Clock, 
  Users, 
  Database, 
  Zap,
  Eye,
  BarChart3,
  Globe,
  Lock,
  Bot,
  RefreshCw
} from "lucide-react";
import { useState, useMemo } from "react";

export default function Page() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  
  const { data: alerts = [], isLoading, error, refetch } = useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
    refetchInterval: 5000
  });

  // Calculate metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const filteredAlerts = alerts.filter(alert => {
      const alertTime = new Date(alert.timestamp);
      const timeDiff = now - alertTime;
      return timeDiff <= timeRanges[selectedTimeRange];
    });

    const severityCounts = filteredAlerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {});

    const typeCounts = filteredAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});

    const criticalAlerts = filteredAlerts.filter(a => a.severity === 'critical').length;
    const highAlerts = filteredAlerts.filter(a => a.severity === 'high').length;
    const totalAlerts = filteredAlerts.length;
    const avgResponseTime = 2.3; // Mock data
    const threatsBlocked = Math.floor(totalAlerts * 0.85); // Mock data

    return {
      totalAlerts,
      criticalAlerts,
      highAlerts,
      severityCounts,
      typeCounts,
      avgResponseTime,
      threatsBlocked,
      filteredAlerts
    };
  }, [alerts, selectedTimeRange]);

  const filteredAlerts = useMemo(() => {
    let filtered = metrics.filteredAlerts;
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }
    return filtered;
  }, [metrics.filteredAlerts, selectedSeverity]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading threat intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">Error loading threat data</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Smart SOC Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-Powered Security Operations Center
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">AI Active</span>
              </div>
              <ThemeToggle />
              <button
                onClick={() => refetch()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Alerts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.totalAlerts}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+12% from last hour</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Threats</p>
                <p className="text-3xl font-bold text-red-600">{metrics.criticalAlerts}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="w-4 h-4 text-orange-600 mr-1" />
              <span className="text-orange-600">Requires immediate attention</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Threats Blocked</p>
                <p className="text-3xl font-bold text-green-600">{metrics.threatsBlocked}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Shield className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">85% success rate</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.avgResponseTime}s</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">-40% faster than manual</span>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
              </div>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity:</span>
              </div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Eye className="w-4 h-4" />
              <span>Showing {filteredAlerts.length} of {metrics.totalAlerts} alerts</span>
            </div>
          </div>
        </div>

        {/* Threat Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Threat Distribution
            </h3>
            <div className="space-y-4">
              {Object.entries(metrics.typeCounts).map(([type, count]) => {
                const percentage = metrics.totalAlerts > 0 ? (count / metrics.totalAlerts) * 100 : 0;
                const getTypeIcon = (type) => {
                  switch (type) {
                    case 'brute_force': return <Shield className="w-4 h-4 text-blue-600" />;
                    case 'insider_threat': return <Users className="w-4 h-4 text-purple-600" />;
                    case 'data_exfiltration': return <Database className="w-4 h-4 text-red-600" />;
                    case 'malware': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
                    default: return <Globe className="w-4 h-4 text-gray-600" />;
                  }
                };
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(type)}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Severity Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(metrics.severityCounts).map(([severity, count]) => {
                const getSeverityColor = (severity) => {
                  switch (severity) {
                    case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
                    case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
                    case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
                    case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
                    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
                  }
                };
                
                return (
                  <div key={severity} className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(severity)}`}>
                      {severity.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Active Security Alerts
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Real-time monitoring</span>
            </div>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No alerts found</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedSeverity === 'all' 
                  ? 'No security alerts in the selected time range.' 
                  : `No ${selectedSeverity} severity alerts in the selected time range.`
                }
              </p>
            </div>
          ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertModal />
      <SOCAssistant />
    </div>
  );
}