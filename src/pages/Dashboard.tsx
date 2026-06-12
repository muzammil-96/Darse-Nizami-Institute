import { useState } from "react";
import { Book, FileText, LayoutDashboard, LogOut, MessageSquare, PlayCircle, Settings, Award, Bell, Video, ClipboardList, GraduationCap, CalendarCheck, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useToast } from "@/components/ui/Toast";
import { Certificates } from "@/components/dashboard/Certificates";

const sidebarLinks = [
  { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Live Classes", icon: <Video className="w-5 h-5" /> },
  { name: "My Classes", icon: <Book className="w-5 h-5" /> },
  { name: "Video Lectures", icon: <PlayCircle className="w-5 h-5" /> },
  { name: "Books PDF", icon: <FileText className="w-5 h-5" /> },
  { name: "Assignments", icon: <ClipboardList className="w-5 h-5" /> },
  { name: "Exam Results", icon: <GraduationCap className="w-5 h-5" /> },
  { name: "Attendance", icon: <CalendarCheck className="w-5 h-5" /> },
  { name: "Certificates", icon: <Award className="w-5 h-5" /> },
  { name: "Fee Status", icon: <CreditCard className="w-5 h-5" /> },
  { name: "AI Assistant", icon: <MessageSquare className="w-5 h-5" /> },
  { name: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { toast } = useToast();

  const handleNotificationClick = () => {
    const types = ["class", "warning", "info"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    if (type === "class") {
      toast({
        title: "Live Class Starting Soon",
        message: "Ustad's lecture on 'Nahw Meer' begins in 10 minutes. Click to join.",
        type: "class"
      });
    } else if (type === "warning") {
      toast({
        title: "Assignment Due Today",
        message: "Submit your Fiqh assignment before 11:59 PM.",
        type: "warning"
      });
    } else {
      toast({
        title: "Announcement from Admin",
        message: "The new term's schedule has been published in the Notice Board.",
        type: "info"
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 flex bg-midnight-ink relative overflow-hidden">
      {/* Sidebar background gradient */}
      <div className="absolute top-0 bottom-0 left-0 w-64 bg-deep-navy/30 border-r border-glass-border hidden md:block" />

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-6 relative z-10 h-[calc(100vh-80px)] sticky top-20 border-r border-glass-border bg-midnight-ink/50 backdrop-blur-md">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-glass-border">
          <div className="w-12 h-12 rounded-full border-2 border-gold-primary p-0.5 relative">
            <div className="absolute -inset-1 border border-gold-primary/30 rounded-full animate-pulse" />
            <div className="w-full h-full bg-deep-navy rounded-full flex items-center justify-center text-gold-light font-playfair font-bold text-xl">
              A
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-parchment leading-tight">Abdullah</h3>
            <span className="text-xs text-gold-primary">Class: Ula</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 flex flex-col">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all group relative",
                activeTab === link.name
                  ? "text-gold-light bg-gold-primary/10"
                  : "text-parchment/60 hover:text-parchment hover:bg-glass-white"
              )}
            >
              {activeTab === link.name && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gold-primary rounded-r"
                />
              )}
              <span className={cn("transition-colors", activeTab === link.name ? "text-gold-primary" : "")}>
                {link.icon}
              </span>
              {link.name}
            </button>
          ))}
          
          <button className="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors mt-auto">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto z-10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-playfair text-parchment flex items-center gap-2">
              <span dir="rtl" className="font-arabic text-gold-primary text-4xl font-normal leading-none pr-3">السلام عليكم</span>
              <span className="opacity-80 pb-1">Abdullah!</span>
            </h1>
            <p className="text-parchment/60 mt-2">Welcome back to your portal. Continue your journey of Ilm.</p>
          </div>
          <button 
            onClick={handleNotificationClick}
            className="relative p-2 rounded-full glass-panel border border-glass-border hover:border-gold-primary/50 text-parchment/80 transition-colors"
            title="Click to simulate notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-midnight-ink" />
          </button>
        </header>

        {activeTab === "Dashboard" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Videos Watched", value: "32", icon: <PlayCircle className="text-gold-primary" /> },
                { label: "PDFs Read", value: "12", icon: <FileText className="text-gold-primary" /> },
                { label: "Exams Taken", value: "4", icon: <Award className="text-gold-primary" /> },
                { label: "Attendance %", value: "92%", icon: <Book className="text-emerald-light" /> },
              ].map((stat) => (
                <div key={stat.label} className="glass-panel p-6 rounded-xl border border-glass-border flex items-center justify-between group hover:border-gold-primary/30 transition-colors">
                  <div>
                    <p className="text-sm text-parchment/60 mb-1">{stat.label}</p>
                    <p className="text-2xl font-playfair text-gold-light">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-midnight-ink/50 rounded-lg group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Content Row: Continue Watching & AI Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-glass-border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-playfair text-xl text-parchment">Continue Watching</h3>
                  <button className="text-sm text-gold-primary hover:text-gold-light flex items-center gap-1">View All</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Nahw Meer - Lesson 4", progress: 65, book: "نحو میر" },
                    { title: "Bustan e Saadi - Intro", progress: 12, book: "بوستانِ سعدی" },
                  ].map((video, idx) => (
                    <div key={idx} className="bg-midnight-ink/50 border border-glass-border rounded-lg p-4 group cursor-pointer hover:border-gold-primary/40 transition-colors">
                      <div className="relative w-full aspect-video bg-deep-navy/50 rounded flex items-center justify-center mb-4 overflow-hidden">
                        <PlayCircle className="w-10 h-10 text-gold-primary/50 group-hover:text-gold-primary group-hover:scale-110 transition-all z-10 relative" />
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-glass-white">
                          <div className="h-full bg-gold-primary" style={{ width: `${video.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-parchment group-hover:text-gold-light transition-colors">{video.title}</h4>
                        <span className="font-arabic text-gold-primary/80" dir="rtl">{video.book}</span>
                      </div>
                      <p className="text-xs text-parchment/50">{video.progress}% Completed</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl border border-emerald-accent/30 bg-gradient-to-b from-transparent to-emerald-accent/5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-accent flex items-center justify-center glow-pulse">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-playfair text-xl text-parchment">AI Assistant Insights</h3>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-parchment/80 leading-relaxed bg-midnight-ink/50 border border-glass-border p-4 rounded-lg">
                    Abdullah, you have been studying <strong>Nahw Meer</strong> consistently. 
                    Based on your progress, I recommend reviewing the "Types of Murakkab" lecture before tomorrow's quiz.
                  </p>
                  
                  <button className="w-full py-3 bg-glass-white hover:bg-gold-primary/10 border border-gold-primary/30 rounded text-sm font-medium text-gold-primary transition-colors flex items-center justify-center gap-2">
                    Start AI Review Session <PlayCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "Certificates" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <Certificates />
          </motion.div>
        )}

        {activeTab !== "Dashboard" && activeTab !== "Certificates" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-12 text-center rounded-xl border border-glass-border">
            <h2 className="text-3xl font-playfair text-gold-light mb-4">{activeTab}</h2>
            <p className="text-parchment/60 max-w-md mx-auto">
              This module is currently under development. The {activeTab} section will be available soon with full features.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
