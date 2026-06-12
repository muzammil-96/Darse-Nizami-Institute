import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 23 23">
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "register";
  initialRole: string;
}

export function AuthModal({ isOpen, onClose, initialMode, initialRole }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep("phone");
      setPhone("");
      setOtp(["", "", "", ""]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialMode]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast({ title: "OTP Sent", message: `Verification code sent to ${phone}`, type: "success" });
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(d => !d)) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Authentication Successful", message: "Welcome to Dars-E-Nizami Institute.", type: "success" });
      onClose();
      navigate("/dashboard");
    }, 1500);
  };

  const handleSocialAuth = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Authentication Successful", message: `Signed in via ${provider}`, type: "success" });
      onClose();
      navigate("/dashboard");
    }, 1200);
  };

  const OtpInput = () => {
    const handleChange = (i: number, val: string) => {
      if (val.length > 1) val = val[0];
      if (!/^\d*$/.test(val)) return;
      const newOtp = [...otp];
      newOtp[i] = val;
      setOtp(newOtp);
      if (val && i < 3) {
        document.getElementById(`otp-input-${i + 1}`)?.focus();
      }
    };
    
    const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otp[i] && i > 0) {
        document.getElementById(`otp-input-${i - 1}`)?.focus();
      }
    };

    return (
      <div className="flex justify-between gap-4 mb-8">
        {otp.map((d, i) => (
          <input
            key={i}
            id={`otp-input-${i}`}
            type="text"
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="w-14 h-14 bg-midnight-ink/50 border border-glass-border rounded-lg text-center text-2xl text-gold-light focus:outline-none focus:border-gold-primary transition-colors"
          />
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-midnight-ink/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-midnight-ink border border-gold-primary/30 rounded-2xl shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Top Pattern */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold-primary/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
            
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-parchment/60 hover:text-parchment rounded-full hover:bg-glass-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 relative z-10">
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gold-primary text-3xl leading-none">🕌</span>
                </div>
              </div>

              <h2 className="text-3xl font-playfair text-parchment text-center mb-2">
                {step === "phone" ? (mode === "login" ? "Welcome Back" : "Create Account") : "Verify Identity"}
              </h2>
              <p className="text-sm text-parchment/60 text-center mb-8">
                {step === "phone" 
                  ? "Enter your mobile number or use a social provider to continue."
                  : `Enter the 4-digit code sent to ${phone}`}
              </p>

              {step === "phone" ? (
                <div className="space-y-6">
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-parchment/60 pr-3 border-r border-glass-border">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-sm font-medium">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Mobile Number"
                        maxLength={10}
                        className="w-full bg-midnight-ink/50 border border-glass-border rounded-xl py-3 pl-[5.5rem] pr-4 text-parchment focus:outline-none focus:border-gold-primary transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={phone.length < 10 || loading}
                      className="w-full py-3 bg-gold-primary hover:bg-gold-light disabled:opacity-50 disabled:hover:bg-gold-primary text-midnight-ink font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors group"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          <span className="text-sm tracking-wide">Continue with Mobile</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-glass-border" />
                    <span className="text-xs text-parchment/40 uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-glass-border" />
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => handleSocialAuth("Google")}
                      className="w-full py-3 bg-glass-white hover:bg-gold-primary/10 border border-glass-border hover:border-gold-primary/30 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-parchment transition-all"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>
                    <button 
                      onClick={() => handleSocialAuth("Microsoft")}
                      className="w-full py-3 bg-glass-white hover:bg-gold-primary/10 border border-glass-border hover:border-gold-primary/30 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-parchment transition-all"
                    >
                      <MicrosoftIcon />
                      Continue with Microsoft
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button 
                      onClick={() => setMode(mode === "login" ? "register" : "login")}
                      className="text-sm text-gold-primary hover:text-gold-light transition-colors"
                    >
                      {mode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <OtpInput />
                  
                  <button
                    type="submit"
                    disabled={otp.some(d => !d) || loading}
                    className="w-full py-3 bg-gold-primary hover:bg-gold-light disabled:opacity-50 disabled:hover:bg-gold-primary text-midnight-ink font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors group"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                  </button>
                  
                  <div className="text-center pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setStep("phone");
                        setOtp(["", "", "", ""]);
                      }}
                      className="text-sm text-parchment/60 hover:text-parchment transition-colors"
                    >
                      Use a different number
                    </button>
                  </div>
                </form>
              )}
              
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
