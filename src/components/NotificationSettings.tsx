import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Clock, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Volume2,
  CalendarCheck
} from 'lucide-react';
import { ReminderSetting } from '../types/nutrition';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: ReminderSetting[];
  onToggleReminder: (id: string) => void;
  onTestNotification: (message: string) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isOpen,
  onClose,
  reminders,
  onToggleReminder,
  onTestNotification,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [testSent, setTestSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionStatus(perm);
      } catch (err) {
        console.warn('Notification permission error', err);
      }
    }
  };

  const handleTestNotification = () => {
    const active = reminders.find((r) => r.enabled) || reminders[0];
    onTestNotification(active.message);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Daily Tracking Habits & Push Reminders</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Permission notice */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">System Push Notifications</span>
              <p className="text-xs text-slate-400 mt-0.5">
                Status: <strong className="text-emerald-400 capitalize">{permissionStatus}</strong>. Receive gentle pings at snack times.
              </p>
            </div>
            {permissionStatus !== 'granted' && (
              <button
                onClick={requestBrowserPermission}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shrink-0"
              >
                Enable
              </button>
            )}
          </div>

          {/* Schedule list */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Scheduled Daily Check-ins
            </span>

            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{rem.label}</span>
                      <span className="text-xs text-slate-400 font-mono">({rem.time})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{rem.message}</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={rem.enabled}
                    onChange={() => onToggleReminder(rem.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Test reminder action */}
          <div className="pt-2">
            <button
              onClick={handleTestNotification}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{testSent ? 'Reminder Ping Triggered!' : 'Test Daily Reminder Ping Now'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
