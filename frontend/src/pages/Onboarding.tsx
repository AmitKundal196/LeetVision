import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';
import { UserCheck, Target, Award, Calendar, AlertCircle } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { saveOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [dailyGoal, setDailyGoal] = useState(3);
  const [interviewDate, setInterviewDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validatedProfile, setValidatedProfile] = useState<any | null>(null);

  const handleValidateUsername = async () => {
    if (!username) {
      setError('Please provide a LeetCode username.');
      return;
    }
    setLoading(true);
    setError('');
    setValidatedProfile(null);

    try {
      // Trigger a sync query with force=true to validate the username and sync statistics immediately
      const { data } = await api.post('/leetcode/sync?force=true', { leetcodeUsername: username });
      if (data.success && data.profile) {
        setValidatedProfile(data.profile);
        // Step forward on success
        setTimeout(() => setStep(2), 1200);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Username verification failed. Please check spelling.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setError('');

    try {
      const onboardingData = {
        leetcodeUsername: username,
        targetCompany,
        preferredLanguage: language,
        dailyGoal,
        interviewDate: interviewDate || null,
      };

      await saveOnboarding(onboardingData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Onboarding failed. Please review values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-zinc-900/30 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-[480px]">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 px-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold border ${
                  step === num
                    ? 'bg-white text-black border-white'
                    : step > num
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    : 'border-zinc-800 text-zinc-600'
                }`}
              >
                {num}
              </div>
              <span
                className={`text-xs font-medium ${
                  step === num ? 'text-foreground' : 'text-zinc-600'
                }`}
              >
                {num === 1 ? 'LeetCode Link' : num === 2 ? 'Focus Area' : 'Milestones'}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Box */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-foreground">Sync your profile</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect your LeetCode profile to pull solved difficulty statistics, streaks, and ranking metrics.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">LeetCode Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter username (e.g. demo_user)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Try typing <code className="text-foreground font-bold">demo_user</code> for simulated data if you do not have an active profile.
                  </p>
                </div>

                {validatedProfile && (
                  <div className="flex items-center gap-3 rounded-lg border border-[#00b8a3]/20 bg-[#00b8a3]/5 p-3">
                    <UserCheck className="h-5 w-5 text-lc-easy shrink-0 animate-bounce" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Connection Successful!</h4>
                      <p className="text-[10px] text-muted-foreground">
                        Found profile: {validatedProfile.profileDetails?.realName || username} ({validatedProfile.solvedStats?.total} solved)
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleValidateUsername}
                  disabled={loading || !!validatedProfile}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying profile...' : validatedProfile ? 'Redirecting...' : 'Verify LeetCode Username'}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-foreground">Interview Focus</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Customize your dashboard experience to prioritize your target tech firms and languages.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5" /> Target Tech Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Stripe, Meta"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      Preferred Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground focus:border-ring focus:outline-none"
                    >
                      <option value="TypeScript">TypeScript / JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="Java">Java</option>
                      <option value="C++">C++</option>
                      <option value="Go">Go</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-lg border border-border bg-background py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-foreground">Set Milestones</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Commit to solving questions daily and sync target dates.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5" /> Daily Questions Goal
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground focus:border-ring focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Scheduled Interview Date
                    </label>
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-foreground focus:border-ring focus:outline-none text-zinc-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-border bg-background py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCompleteOnboarding}
                    disabled={loading}
                    className="flex-1 rounded-lg bg-white text-black py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'Initializing OS...' : 'Save & Enter LeetVision'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default Onboarding;
