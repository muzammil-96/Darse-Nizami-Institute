import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronRight, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  "Personal Info",
  "Address",
  "Academic Background",
  "Document Uploads",
  "Verification"
];

export function Admission() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 relative">
      <div className="absolute inset-0 bg-midnight-ink -z-20" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-4xl md:text-5xl text-parchment text-center mb-4">Admissions Portal</h1>
        <p className="text-center text-parchment/60 mb-12">Submit your application to join the Dars-E-Nizami Institute</p>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="flex justify-between relative z-10">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <div key={idx} className="flex flex-col items-center gap-3 w-32 relative">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 text-sm font-bold border-2",
                      isActive
                        ? "bg-gold-primary text-midnight-ink border-gold-primary shadow-[0_0_15px_rgba(201,168,76,0.5)] scale-110"
                        : isCompleted
                        ? "bg-emerald-accent border-emerald-accent text-white"
                        : "bg-glass-white border-glass-border text-parchment/40"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      "text-xs uppercase tracking-wider text-center font-medium transition-colors",
                      isActive || isCompleted ? "text-gold-light" : "text-parchment/40"
                    )}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Connecting Line */}
          <div className="absolute top-5 left-16 right-16 h-0.5 bg-glass-border -z-0">
            <motion.div
              className="h-full bg-gold-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Form Area */}
        <div className="glass-panel rounded-xl p-6 md:p-10 border border-gold-primary/20 relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-playfair text-gold-light mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">Full Name (English)</label>
                      <input type="text" className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors" placeholder="e.g. Abdullah Khan" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2 font-arabic text-right">Full Name (Urdu)</label>
                      <input type="text" className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment font-arabic text-right focus:outline-none focus:border-gold-primary transition-colors" placeholder="عبداللہ خان" dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">Father's Name</label>
                      <input type="text" className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">Date of Birth</label>
                      <input type="date" className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">Mobile Number</label>
                      <input type="tel" className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors" placeholder="+91..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">Email Address</label>
                      <input type="email" className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-playfair text-gold-light mb-6">Address Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">Country</label>
                      <select className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors appearance-none">
                        <option>India</option>
                        <option>Pakistan</option>
                        <option>Bangladesh</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">State / Province</label>
                      <input type="text" className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-parchment/80 mb-2">Full Address</label>
                       <textarea rows={4} className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-playfair text-gold-light mb-6">Academic Background</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">Desired Class to Join</label>
                      <select className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors appearance-none">
                        <option>Edadia</option>
                        <option>Ula</option>
                        <option>Sania</option>
                        <option>Salisa</option>
                        <option>Rabia</option>
                        <option>Khamisa</option>
                        <option>Sadisa</option>
                        <option>Sabia</option>
                        <option>Samina</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment/80 mb-2">Previous Madrasa (If any)</label>
                      <input type="text" className="w-full bg-midnight-ink/50 border border-glass-border rounded px-4 py-3 text-parchment focus:outline-none focus:border-gold-primary transition-colors" />
                    </div>
                  </div>
                </div>
              )}

               {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-playfair text-gold-light mb-6">Document Uploads</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-dashed border-glass-border rounded-lg p-8 flex flex-col items-center justify-center bg-midnight-ink/30 hover:border-gold-primary/50 transition-colors cursor-pointer group">
                       <Upload className="w-8 h-8 text-gold-primary/50 group-hover:text-gold-primary mb-4" />
                       <span className="text-sm text-parchment/80 group-hover:text-gold-light">Upload Passport Photo</span>
                       <span className="text-xs text-parchment/50 mt-2">Max 2MB. JPG/PNG</span>
                    </div>
                    <div className="border border-dashed border-glass-border rounded-lg p-8 flex flex-col items-center justify-center bg-midnight-ink/30 hover:border-gold-primary/50 transition-colors cursor-pointer group">
                       <Upload className="w-8 h-8 text-gold-primary/50 group-hover:text-gold-primary mb-4" />
                       <span className="text-sm text-parchment/80 group-hover:text-gold-light">Upload Aadhaar / National ID</span>
                       <span className="text-xs text-parchment/50 mt-2">Max 5MB. PDF/JPG/PNG</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-20 h-20 bg-emerald-accent/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-accent" />
                  </div>
                  <h2 className="text-3xl font-playfair text-gold-light mb-4">Ready to Submit</h2>
                  <p className="text-parchment/70 max-w-md mx-auto mb-8">
                    By submitting this application, you agree to the Institute's terms 
                    and confirm that all provided information is accurate.
                  </p>
                  <label className="flex items-center gap-3 mb-8 cursor-pointer group">
                    <div className="w-5 h-5 border border-glass-border rounded flex items-center justify-center group-hover:border-gold-primary">
                      {/* Fake checkbox state could go here */}
                    </div>
                    <span className="text-sm text-parchment/80">I agree to the Terms & Conditions</span>
                  </label>
                </div>
              )}

              {/* Navigation Buttons inside the tab content at the bottom */}
              <div className="mt-auto pt-10 flex justify-between items-center border-t border-glass-border">
                <button
                  onClick={prevStep}
                  className={cn(
                    "px-6 py-2 rounded text-sm font-medium transition-colors hover:text-gold-light",
                    currentStep === 0 ? "opacity-0 pointer-events-none" : "text-parchment/70"
                  )}
                >
                  Back
                </button>
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-3 bg-gold-primary hover:bg-gold-light text-midnight-ink font-semibold rounded transition-colors"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-accent hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded transition-colors shadow-[0_0_20px_rgba(27,94,59,0.5)]"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
