import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useLeetCodeProfile } from '../hooks/useLeetCode';
import { AlertCircle, Download, Trash2, Settings as ConfigIcon, Info } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { profile } = useLeetCodeProfile();

  const [notificationDays, setNotificationDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ user, profile, exportTimestamp: new Date().toISOString() }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `leetvision_export_${user?.name || 'user'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ DANGER: Are you absolutely sure you want to permanently delete your LeetVision account? This action is irreversible and all statistics will be lost.")) {
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      // Simulate account deletion
      alert("Account deletion successful. Cleaning up session.");
      await logout();
    } catch (err: any) {
      setErrorMsg("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('System preferences synchronized successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Platform Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Configure study trackers, manage sessions, and export developer data.</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-xs text-green-500">
          <Info className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Preferences form */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <ConfigIcon className="h-4 w-4" /> Goal Preferences
        </h3>

        <form onSubmit={handleUpdatePreferences} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Practice Frequency Notifications</label>
            <div className="grid grid-cols-7 gap-2">
              {Object.entries(notificationDays).map(([day, val]) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => setNotificationDays(prev => ({ ...prev, [day]: !val }))}
                  className={`rounded-lg border p-2 text-center text-xs font-semibold uppercase transition-colors ${
                    val 
                      ? 'bg-accent text-foreground border-ring' 
                      : 'bg-background text-muted-foreground border-border hover:bg-accent/20'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">Select days you want to receive study prompts.</p>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Save Preferences
          </button>
        </form>
      </div>

      {/* Export Data */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Download className="h-4 w-4" /> Export Analytics Profile
        </h3>
        <p className="text-xs text-muted-foreground">
          Download a complete backup of your profile details, synced problem stats, and historical ratings in a JSON structured file.
        </p>
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent/40 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Profile Data (JSON)</span>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-card p-6 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-red-500 flex items-center gap-2">
          <Trash2 className="h-4 w-4 animate-pulse" /> Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground">
          Permanently delete your LeetVision account and remove all cached profile details, synced histories, and onboarding options.
        </p>
        
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Account</span>
        </button>
      </div>

    </div>
  );
};
export default Settings;
