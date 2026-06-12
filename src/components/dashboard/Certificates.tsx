import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Award, Download, CheckCircle, Lock, Loader2 } from "lucide-react";
import { classesData } from "@/data/classes";

interface CourseProgress {
  id: string;
  progress: number;
  completedAt?: string;
}

export function Certificates() {
  // Mock data for student's progress in different courses
  const [courses, setCourses] = useState<CourseProgress[]>([
    { id: "edadia", progress: 100, completedAt: "2025-06-15" },
    { id: "ula", progress: 100, completedAt: "2026-03-10" },
    { id: "sania", progress: 65 },
    { id: "salisa", progress: 0 },
  ]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCertificate = async (classId: string) => {
    setDownloadingId(classId);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const canvas = canvasRef.current;
    if (!canvas) {
      setDownloadingId(null);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setDownloadingId(null);
      return;
    }

    const courseInfo = classesData.find(c => c.id === classId);
    if (!courseInfo) {
      setDownloadingId(null);
      return;
    }

    const progressInfo = courses.find(c => c.id === classId);
    
    // Draw Certificate
    const width = 1200;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0b1121"); // midnight-ink
    gradient.addColorStop(1, "#1e293b"); // deep-navy
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = "#c9a84c"; // gold-primary
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, width - 80, height - 80);
    
    // Inner Border
    ctx.strokeStyle = "rgba(201, 168, 76, 0.3)";
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    // Header Text
    ctx.fillStyle = "#eedc9a"; // gold-light
    ctx.font = "bold 60px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", width / 2, 200);

    // Arabic Header
    ctx.font = "normal 48px Arial";
    ctx.fillText("شَهَادَةُ إِتْمَام", width / 2, 120);

    // Subtitle
    ctx.fillStyle = "rgba(244, 237, 219, 0.8)"; // parchment
    ctx.font = "italic 30px 'Inter', sans-serif";
    ctx.fillText("This certifies that", width / 2, 320);

    // Student Name
    ctx.fillStyle = "#eedc9a";
    ctx.font = "bold 56px 'Inter', sans-serif";
    ctx.fillText("Abdullah", width / 2, 400);

    // Description text
    ctx.fillStyle = "rgba(244, 237, 219, 0.8)";
    ctx.font = "24px 'Inter', sans-serif";
    ctx.fillText("has successfully completed the comprehensive curriculum for", width / 2, 480);

    // Course Name
    ctx.fillStyle = "#c9a84c";
    ctx.font = "bold 48px 'Playfair Display', serif";
    ctx.fillText(`Class ${courseInfo.nameEn} (${courseInfo.nameUr})`, width / 2, 550);

    // Date
    ctx.fillStyle = "rgba(244, 237, 219, 0.6)";
    ctx.font = "20px 'Inter', sans-serif";
    const dateStr = progressInfo?.completedAt ? new Date(progressInfo.completedAt).toLocaleDateString() : new Date().toLocaleDateString();
    ctx.fillText(`Awarded on ${dateStr}`, width / 2, 650);

    // Signatures
    ctx.strokeStyle = "rgba(244, 237, 219, 0.4)";
    ctx.lineWidth = 2;
    // Left signature
    ctx.beginPath();
    ctx.moveTo(200, 700);
    ctx.lineTo(400, 700);
    ctx.stroke();
    ctx.fillStyle = "rgba(244, 237, 219, 0.6)";
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText("Lead Instructor", 300, 730);

    // Right signature
    ctx.beginPath();
    ctx.moveTo(width - 400, 700);
    ctx.lineTo(width - 200, 700);
    ctx.stroke();
    ctx.fillText("Academy Director", width - 300, 730);

    // Convert to image and trigger download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Certificate_${courseInfo.nameEn}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setDownloadingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-8 rounded-xl border border-glass-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-full bg-gold-primary/20 flex items-center justify-center glow-pulse">
            <Award className="w-6 h-6 text-gold-primary" />
          </div>
          <h2 className="text-3xl font-playfair text-parchment">My Certificates</h2>
        </div>
        <p className="text-parchment/70 max-w-2xl mt-4">
          Upon successful completion of a class level curriculum, your digital certificate of completion will be available here for download.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {classesData.map((cls) => {
          const progressInfo = courses.find(c => c.id === cls.id) || { id: cls.id, progress: 0 };
          const isCompleted = progressInfo.progress === 100;

          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel p-6 rounded-xl border border-glass-border flex flex-col relative overflow-hidden transition-all ${
                isCompleted ? "hover:border-gold-primary/40 hover:shadow-[0_0_30px_rgba(201,168,76,0.1)]" : "opacity-80"
              }`}
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-accent/10 rounded-full blur-2xl pointer-events-none" />
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-playfair text-parchment flex items-center gap-2">
                    {cls.nameEn}
                    {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-light" />}
                  </h3>
                  <span className="font-arabic text-gold-primary/80 text-xl block mt-1" dir="rtl">{cls.nameUr}</span>
                </div>
                <div className="p-3 bg-midnight-ink/50 border border-glass-border rounded-lg shadow-inner">
                  <Award className={`w-6 h-6 ${isCompleted ? "text-gold-light drop-shadow-md" : "text-parchment/30"}`} />
                </div>
              </div>

              <div className="mb-6 flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-parchment/60">Curriculum Progress</span>
                  <span className={isCompleted ? "text-emerald-light font-medium" : "text-parchment/80 font-medium"}>
                    {progressInfo.progress}%
                  </span>
                </div>
                <div className="w-full bg-midnight-ink/50 rounded-full h-2 mb-1 overflow-hidden border border-glass-border shadow-inner">
                  <div 
                    className={`h-full rounded-full ${isCompleted ? "bg-emerald-accent" : "bg-gold-primary"}`} 
                    style={{ width: `${progressInfo.progress}%` }} 
                  />
                </div>
                {isCompleted && progressInfo.completedAt && (
                  <p className="text-xs text-emerald-light/80 mt-2">Completed on {new Date(progressInfo.completedAt).toLocaleDateString()}</p>
                )}
              </div>

              <div className="pt-4 border-t border-glass-border">
                {isCompleted ? (
                  <button
                    onClick={() => generateCertificate(cls.id)}
                    disabled={downloadingId === cls.id}
                    className="w-full py-3 bg-gold-primary/10 hover:bg-gold-primary text-gold-light hover:text-midnight-ink border border-gold-primary/30 hover:border-gold-primary font-medium rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none disabled:bg-transparent disabled:text-gold-primary"
                  >
                    {downloadingId === cls.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                        Download Certificate
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-midnight-ink/30 border border-glass-border text-parchment/40 font-medium rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    Complete course to unlock
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
