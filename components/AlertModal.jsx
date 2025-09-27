"use client";

import { useAlertStore } from "../store/useAlertStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExplain, remediateAlert } from "../lib/api";
import { useState } from "react";
import { 
  X, 
  Shield, 
  AlertTriangle, 
  Clock, 
  User, 
  Globe, 
  Database, 
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  Bot,
  Eye,
  Lock
} from "lucide-react";

export default function AlertModal() {
  const { selectedAlert, isModalOpen, closeModal } = useAlertStore();
  const [remediationReason, setRemediationReason] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["explanation", selectedAlert?.id],
    queryFn: () => fetchExplain(selectedAlert.id),
    enabled: !!selectedAlert
  });

  const mutation = useMutation({
    mutationFn: ({ alertId, action, reason }) => remediateAlert(alertId, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      setShowConfirmation(false);
      setRemediationReason("");
      setSelectedAction("");
      closeModal();
    },
  });

  if (!isModalOpen || !selectedAlert) return null;

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200';
      case 'high': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getThreatTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'brute_force': return <Shield className="w-5 h-5" />;
      case 'insider_threat': return <User className="w-5 h-5" />;
      case 'data_exfiltration': return <Database className="w-5 h-5" />;
      case 'malware': return <AlertTriangle className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const remediationActions = [
    { id: 'block_ip', label: 'Block Source IP', icon: <Lock className="w-4 h-4" />, color: 'bg-red-600 hover:bg-red-700' },
    { id: 'disable_account', label: 'Disable Account', icon: <User className="w-4 h-4" />, color: 'bg-orange-600 hover:bg-orange-700' },
    { id: 'quarantine_file', label: 'Quarantine File', icon: <Shield className="w-4 h-4" />, color: 'bg-yellow-600 hover:bg-yellow-700' },
    { id: 'reset_password', label: 'Reset Password', icon: <Zap className="w-4 h-4" />, color: 'bg-blue-600 hover:bg-blue-700' }
  ];

  const handleRemediation = () => {
    if (selectedAction && remediationReason.trim()) {
      mutation.mutate({ 
        alertId: selectedAlert.id, 
        action: selectedAction, 
        reason: remediationReason 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {getThreatTypeIcon(selectedAlert.type)}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedAlert.title}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                  {selectedAlert.severity?.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedAlert.type?.replace('_', ' ').toUpperCase()}
                </span>
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(selectedAlert.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Threat Details */}
          <div className="p-6 space-y-6">
            {/* Evidence Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Threat Evidence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedAlert.evidence || {}).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace('_', ' ')}:
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-700 p-2 rounded border">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Threat Analysis
              </h3>
              {isLoading ? (
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing threat patterns...</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {data?.explanation || "AI analysis is being processed. This will provide detailed insights into the threat behavior, attack vectors, and recommended response strategies."}
                  </p>
                </div>
              )}
            </div>

            {/* Remediation Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Automated Remediation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {remediationActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => setSelectedAction(action.id)}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                      selectedAction === action.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {action.icon}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>

              {selectedAction && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remediation Reason
                  </label>
                  <textarea
                    value={remediationReason}
                    onChange={(e) => setRemediationReason(e.target.value)}
                    placeholder="Provide justification for this remediation action..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Shield className="w-4 h-4" />
            <span>Automated by Smart SOC AI</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            {selectedAction && remediationReason.trim() && (
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={mutation.isPending}
                className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 ${
                  mutation.isPending 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Execute Remediation</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirm Remediation
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to execute this remediation action? This action cannot be undone.
              </p>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemediation}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm & Execute</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}