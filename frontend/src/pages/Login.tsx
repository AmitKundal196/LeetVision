import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { Mail, Lock, User, Github, AlertCircle, ArrowRight, CheckCircle2, Flame, Trophy } from 'lucide-react';
import { AnimatedNumber } from '../components/AnimatedNumber';
export const Login: React.FC = () => {
  const { login, register, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get('expired') === 'true';

  const [view, setView] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOAuth = (provider: 'google' | 'github') => {
    if (provider === 'google') {
      navigate('/oauth/google');
    } else {
      navigate('/oauth/github'); // Can be implemented similarly
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (view === 'forgot') {
        await forgotPassword(email);
        setSuccess('If an account exists, a password reset link has been sent. (Mock: Proceeding to reset...)');
        setTimeout(() => {
          setView('reset');
          setSuccess('');
          setPassword('');
        }, 2000);
      } else if (view === 'reset') {
        await resetPassword(email, password);
        setSuccess('Password updated successfully! You can now log in.');
        setTimeout(() => {
          setView('login');
          setSuccess('');
          setPassword('');
        }, 2000);
      } else if (view === 'register') {
        await register(email, password, name);
        navigate('/onboarding');
      } else {
        await login(email, password, rememberMe);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google SVG Icon
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
      
      {/* Left side: branding/showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden text-white">
        {/* Abstract background shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3 w-fit">
          {/* Soft cyan glow */}
          <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
          <div className="relative h-10 w-10 bg-white rounded-xl flex items-center justify-center font-extrabold text-black text-xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">L</div>
          <span className="relative font-bold text-xl tracking-tight drop-shadow-md">LeetVision</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg mt-20">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Master the algorithmic interview.</h1>
          <p className="text-zinc-400 text-lg">
            Connect your LeetCode profile to unlock deep analytics, pattern progression, and AI-driven insights that guide your prep.
          </p>
          {/* Mock Dashboard Preview */}
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="mt-8 relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 overflow-hidden animate-fade-in animate-delay-100 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <div className="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Stat 1 */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <span className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest block mb-1">Solved</span>
                <div className="flex items-end gap-2">
                  <AnimatedNumber value={482} className="text-2xl font-bold text-white" />
                  <span className="text-[10px] font-semibold text-[#10b981] mb-1">+12 this week</span>
                </div>
                <div className="mt-3 flex gap-0.5 h-1.5">
                  <div className="bg-lc-easy rounded-l-sm w-[45%]"></div>
                  <div className="bg-lc-medium w-[35%]"></div>
                  <div className="bg-lc-hard rounded-r-sm w-[20%]"></div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest block mb-1">Contest Rating</span>
                <div className="flex items-center justify-between">
                  <AnimatedNumber value={1842} className="text-2xl font-bold text-[#ffc01e]" />
                  <Trophy className="h-5 w-5 text-[#ffc01e]" />
                </div>
                <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1 mt-1">
                  Top 4.2% Globally
                </div>
              </div>
            </div>

            {/* Heatmap Mock */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">Activity Profile</span>
                <span className="text-[10px] text-[#ef4444] font-bold flex items-center gap-1">
                  <Flame className="h-3 w-3" /> 14 Day Streak
                </span>
              </div>
              <div className="flex gap-1 overflow-hidden opacity-90 justify-between">
                {Array.from({ length: 14 }).map((_, col) => (
                  <div key={col} className="flex flex-col gap-1">
                    {Array.from({ length: 5 }).map((_, row) => {
                      const isActive = Math.random() > 0.4;
                      const intensity = Math.floor(Math.random() * 3);
                      return (
                        <motion.div 
                          key={row} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (col * 5 + row) * 0.02, duration: 0.3 }}
                          className={`h-2.5 w-2.5 rounded-sm ${isActive ? ['bg-[#065f46]', 'bg-[#059669]', 'bg-[#10b981]'][intensity] : 'bg-white/5'}`} 
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} LeetVision Designed & Developed by Amit Kundal
        </div>
      </div>

      {/* Right side: form container */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-[420px] space-y-8">
          
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              {view === 'login' && 'Welcome back'}
              {view === 'register' && 'Create your account'}
              {view === 'forgot' && 'Reset password'}
              {view === 'reset' && 'Set new password'}
            </h2>
            <p className="text-zinc-500 text-sm">
              {view === 'login' && 'Enter your details to access your dashboard.'}
              {view === 'register' && 'Start optimizing your interview prep today.'}
              {view === 'forgot' && 'We will send you a secure link to reset it.'}
              {view === 'reset' && 'Enter your new password below.'}
            </p>
          </div>

          {expired && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>Your session expired. Please sign in again.</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {view === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute top-3 left-3 h-5 w-5 text-zinc-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute top-3 left-3 h-5 w-5 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>

                {(view !== 'forgot') && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-zinc-700">
                        {view === 'reset' ? 'New Password' : 'Password'}
                      </label>
                      {view === 'login' && (
                        <button type="button" onClick={() => { setView('forgot'); setError(''); setSuccess(''); }} className="text-sm text-blue-600 font-semibold hover:underline">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute top-3 left-3 h-5 w-5 text-zinc-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {view === 'login' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label htmlFor="remember" className="text-sm font-medium text-zinc-600 cursor-pointer select-none">
                      Remember me for 30 days
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white shadow hover:bg-zinc-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'Please wait...' : view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : view === 'reset' ? 'Update Password' : 'Reset Password'}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              {(view === 'login' || view === 'register') && (
                <>
                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-[#FAFAFA] px-2 text-zinc-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleOAuth('google')}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-all"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuth('github')}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-all"
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </button>
                  </div>
                </>
              )}

              {view !== 'reset' && (
              <div className="mt-8 text-center text-sm">
                {view === 'login' ? (
                  <p className="text-zinc-600">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => { setView('register'); setError(''); setSuccess(''); }} className="font-semibold text-blue-600 hover:underline">
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p className="text-zinc-600">
                    {view === 'register' ? 'Already have an account?' : 'Remember your password?'} {' '}
                    <button type="button" onClick={() => { setView('login'); setError(''); setSuccess(''); }} className="font-semibold text-blue-600 hover:underline">
                      Log in
                    </button>
                  </p>
                )}
              </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
