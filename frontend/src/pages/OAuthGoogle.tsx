import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Server } from 'lucide-react';

export const OAuthGoogle: React.FC = () => {
  const { oauthLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Developer Mock Auth - LeetVision";
    return () => {
      document.title = "LeetVision";
    };
  }, []);

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (email && email.includes('@')) {
      setStep(2);
    }
  };

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await oauthLogin('google', email);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4 font-sans text-zinc-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Server className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">LeetVision Auth Tool</h1>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>
                <strong>Developer Simulation Mode.</strong> This is a mock OAuth gateway. It is NOT associated with Google. Entering an email will simulate a successful OAuth response to the backend.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNext}
              >
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Simulated Provider: Google</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter test email address"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    autoFocus
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Next Step
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleContinue}
              >
                <div className="mb-6 flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-sm font-medium text-zinc-300 truncate">{email}</span>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-xs text-blue-500 font-semibold hover:underline"
                  >
                    Change
                  </button>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Simulated Authorization</label>
                  <p className="text-sm text-zinc-500 mb-4">Clicking "Authorize" will instantly issue a mock JWT token for the email above.</p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center px-5 py-2.5 min-w-[100px] text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Authorize'
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OAuthGoogle;
