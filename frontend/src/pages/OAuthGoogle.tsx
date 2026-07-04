import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const OAuthGoogle: React.FC = () => {
  const { oauthLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign in - Google Accounts";
    return () => {
      document.title = "LeetVision";
    };
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (email.includes('@')) {
      setStep(2);
    }
  };

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Pass both email and name to the mock provider
      await oauthLogin('google', email);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f9] px-4 font-sans text-[#1f1f1f]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[1040px] bg-white rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[500px]"
      >
        {/* Left Side (Branding) */}
        <div className="w-full md:w-[45%] p-10 md:p-14 flex flex-col justify-between">
          <div>
            <svg viewBox="0 0 48 48" className="w-[48px] h-[48px] mb-8">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <h1 className="text-[36px] font-normal leading-[1.2] tracking-tight text-[#1f1f1f] mb-4">
              Sign in
            </h1>
            <p className="text-[16px] text-[#1f1f1f] font-normal">
              Use your Google Account
            </p>
          </div>
          
          <div className="hidden md:block">
            <a href="#" className="text-[#0b57d0] font-medium text-sm hover:underline">
              Read more about security
            </a>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleNext} 
                className="w-full max-w-[400px] mx-auto flex flex-col h-full justify-center"
              >
                <div className="space-y-6 flex-grow flex flex-col justify-center">
                  <div className="relative">
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer w-full px-4 pt-6 pb-2 rounded border border-[#747775] focus:border-2 focus:border-[#0b57d0] outline-none text-[16px] placeholder-transparent transition-all"
                      placeholder="Email or phone"
                      id="identifierId"
                      autoFocus
                    />
                    <label 
                      htmlFor="identifierId" 
                      className={`absolute left-4 transition-all duration-200 pointer-events-none text-[#444746] ${email ? 'top-1.5 text-[12px]' : 'top-4 text-[16px] peer-focus:top-1.5 peer-focus:text-[12px] peer-focus:text-[#0b57d0]'}`}
                    >
                      Email or phone
                    </label>
                  </div>
                  
                  <div className="flex flex-col items-start gap-4">
                    <button type="button" className="text-[#0b57d0] font-medium text-sm hover:underline">
                      Forgot email?
                    </button>
                    <p className="text-[14px] text-[#444746] leading-relaxed">
                      Not your computer? Use Guest mode to sign in privately.{' '}
                      <button type="button" className="text-[#0b57d0] font-medium hover:underline">
                        Learn more
                      </button>
                    </p>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between mt-12">
                  <button
                    type="button"
                    className="text-[#0b57d0] font-medium text-sm hover:bg-[#0b57d0]/10 px-4 py-2.5 rounded-full transition-colors"
                    onClick={() => navigate('/login')}
                  >
                    Create account
                  </button>
                  <button
                    type="submit"
                    disabled={!email}
                    className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#0b57d0]/90 transition-colors disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleContinue} 
                className="w-full max-w-[400px] mx-auto flex flex-col h-full justify-center"
              >
                <div className="flex items-center gap-2 mb-8 mx-auto w-fit px-4 py-1.5 rounded-full border border-[#747775]/30 cursor-pointer hover:bg-black/5" onClick={() => setStep(1)}>
                  <svg className="w-4 h-4 text-[#444746]" focusable="false" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" opacity=".3"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>
                  <span className="text-sm font-medium text-[#1f1f1f]">{email}</span>
                  <svg className="w-4 h-4 text-[#444746]" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/></svg>
                </div>

                <div className="space-y-6 flex-grow flex flex-col justify-center">
                  <h2 className="text-[24px] font-normal text-[#1f1f1f] text-center mb-4">Welcome</h2>
                  <div className="relative">
                    <input 
                      type="password" 
                      autoFocus
                      required 
                      className="peer w-full px-4 pt-6 pb-2 rounded border border-[#747775] focus:border-2 focus:border-[#0b57d0] outline-none text-[16px] placeholder-transparent transition-all"
                      placeholder="Enter your password"
                      id="passwordId"
                    />
                    <label 
                      htmlFor="passwordId" 
                      className="absolute left-4 top-1.5 text-[12px] text-[#0b57d0] transition-all duration-200 pointer-events-none"
                    >
                      Enter your password
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="showPwd" className="w-4 h-4 accent-[#0b57d0]" />
                    <label htmlFor="showPwd" className="text-sm text-[#1f1f1f] cursor-pointer">Show password</label>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between mt-12">
                  <button
                    type="button"
                    className="text-[#0b57d0] font-medium text-sm hover:bg-[#0b57d0]/10 px-4 py-2.5 rounded-full transition-colors"
                    onClick={() => {}}
                  >
                    Forgot password?
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0b57d0] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#0b57d0]/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Next'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-[#444746] max-w-[1040px] mx-auto">
        <div className="flex items-center gap-1 cursor-pointer hover:bg-black/5 px-2 py-1 rounded">
          <span>English (United States)</span>
          <svg className="w-3 h-3" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/></svg>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:bg-black/5 px-2 py-1 rounded">Help</a>
          <a href="#" className="hover:bg-black/5 px-2 py-1 rounded">Privacy</a>
          <a href="#" className="hover:bg-black/5 px-2 py-1 rounded">Terms</a>
        </div>
      </div>
    </div>
  );
};

export default OAuthGoogle;
