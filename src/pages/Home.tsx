import { motion } from "motion/react";
import { MandalaBackground } from "@/components/islamic/MandalaBackground";
import { ParticleSystem } from "@/components/ui/ParticleSystem";
import { PrayerTimesWidget } from "@/components/islamic/PrayerTimesWidget";
import { ArrowRight, BookOpen, GraduationCap, Users, Video, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@/components/auth/AuthContext";

const stats = [
  { label: "Students", value: 1240, suffix: "+", icon: <Users className="w-6 h-6 text-gold-primary" /> },
  { label: "Teachers", value: 38, suffix: "+", icon: <GraduationCap className="w-6 h-6 text-gold-primary" /> },
  { label: "Courses", value: 10, suffix: "+", icon: <BookOpen className="w-6 h-6 text-gold-primary" /> },
  { label: "PDFs", value: 500, suffix: "+", icon: <FileText className="w-6 h-6 text-gold-primary" /> },
  { label: "Videos", value: 1200, suffix: "+", icon: <Video className="w-6 h-6 text-gold-primary" /> },
  { label: "Graduates", value: 680, suffix: "+", icon: <GraduationCap className="w-6 h-6 text-gold-primary" /> },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}{suffix}</span>;
}

export function Home() {
  const { openAuth } = useAuthModal();

  return (
    <div className="relative min-h-screen pt-24 pb-12 flex flex-col">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-ink via-deep-navy to-midnight-ink -z-20" />
      <MandalaBackground />
      <ParticleSystem />

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 md:px-8 max-w-7xl mx-auto w-full pt-12 md:pt-20 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto gap-12 lg:gap-20">
          
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8 w-full"
            >
              <h2 className="font-amiri text-3xl md:text-5xl text-gold-primary mb-6 drop-shadow-lg text-glow" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </h2>
              <h3 className="font-amiri text-2xl md:text-4xl text-parchment/90 mb-6" dir="rtl">
                السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
              </h3>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-playfair text-5xl md:text-7xl font-bold text-parchment mb-6 tracking-tight"
            >
              Welcome to <span className="text-gold-light text-glow block mt-2">Dars-E-Nizami Institute</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg md:text-xl text-parchment/70 max-w-xl leading-relaxed mb-12"
            >
              A sanctuary of sacred knowledge — classical Islamic education elevated
              for the digital age. Rooted in tradition. Built for tomorrow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto"
            >
              <button
                onClick={() => openAuth("register")}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold-primary hover:bg-gold-light text-midnight-ink font-semibold rounded overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                <span className="text-lg tracking-wide">Enrol Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => openAuth("login")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 glass-panel text-parchment font-medium rounded hover:bg-glass-white transition-all duration-300 border border-gold-primary/30 hover:border-gold-primary/60"
              >
                <span>Sign In / Enter Portal</span>
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 100 }}
            className="w-full lg:w-96 shrink-0 mt-8 lg:mt-0"
          >
            <PrayerTimesWidget />
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto px-4 lg:px-8 mt-12 pb-24 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-panel p-6 rounded-lg flex flex-col items-center justify-center group hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] transition-all duration-500 border border-gold-primary/10 hover:border-gold-primary/40 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
              <div className="mb-4 p-3 bg-midnight-ink/50 rounded-full border border-gold-primary/20 group-hover:border-gold-primary/50 transition-colors">
                {stat.icon}
              </div>
              <div className="font-playfair text-4xl md:text-5xl font-bold text-parchment mb-2 tracking-tight group-hover:text-gold-light transition-colors">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm uppercase tracking-widest text-parchment/60 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
