import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Book, ChevronDown, FileText, PlayCircle, MessageCircle, X, Minimize2 } from "lucide-react";
import { classesData } from "@/data/classes";
import { cn } from "@/lib/utils";
import { QABoard } from "@/components/ui/QABoard";

export function Classes() {
  const [activeClass, setActiveClass] = useState<string>(classesData[0].id);
  const [viewMode, setViewMode] = useState<"pdfs" | "videos" | "qa">("pdfs");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [readingMode, setReadingMode] = useState(false);

  const currentClassData = classesData.find(c => c.id === activeClass) || classesData[0];

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-midnight-ink -z-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      {/* Reading Mode Overlay */}
      <AnimatePresence>
        {readingMode && selectedModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[100] bg-midnight-ink flex flex-col"
          >
            {/* Minimalist Top Bar */}
            <div className="h-16 border-b border-glass-border bg-midnight-ink/80 backdrop-blur shadow-sm flex items-center justify-between px-6 shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setReadingMode(false)}
                  className="p-2 -ml-2 text-parchment/60 hover:text-gold-primary hover:bg-gold-primary/10 rounded-full transition-colors"
                  title="Exit Reading Mode"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gold-primary/10 flex items-center justify-center text-gold-primary">
                    {viewMode === "pdfs" ? <FileText className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-playfair text-parchment font-medium leading-none mb-1">{selectedModule}</h3>
                    <p className="text-xs text-parchment/50 uppercase tracking-widest">{currentClassData.nameEn} Module</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-glass-border bg-glass-white text-xs text-parchment/60 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_8px_rgba(46,204,113,0.6)] animate-pulse" />
                Reading Mode
              </div>
            </div>

            {/* Distraction-Free Content Area */}
            <div className="flex-1 overflow-auto bg-black/40 flex justify-center p-4 md:p-8">
              <div className="w-full max-w-5xl bg-midnight-ink border border-glass-border rounded-xl shadow-2xl relative overflow-hidden flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center text-parchment/30 p-12 text-center">
                  {viewMode === "pdfs" ? (
                    <>
                      <FileText className="w-16 h-16 mb-6 opacity-20" />
                      <h2 className="text-2xl font-playfair text-parchment/80 mb-2">PDF Document Viewer</h2>
                      <p className="max-w-md">The document "{selectedModule}" would be rendered here using a smooth, distraction-free PDF viewer.</p>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-16 h-16 mb-6 opacity-20" />
                      <h2 className="text-2xl font-playfair text-parchment/80 mb-2">Video Player</h2>
                      <p className="max-w-md">The video lecture for "{selectedModule}" would play here in a clean, cinematic layout.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl text-gold-light mb-4 text-glow">Course Catalog</h1>
          <p className="text-parchment/60 max-w-2xl mx-auto">
            Explore the comprehensive Dars-e-Nizami curriculum. Choose a class below to view its syllabus, books, and video lectures.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Class Sidebar Selector */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
            {classesData.map((cls) => (
              <button
                key={cls.id}
                onClick={() => {
                  setActiveClass(cls.id);
                  if (viewMode === "qa") setViewMode("pdfs");
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all relative overflow-hidden group",
                  activeClass === cls.id 
                    ? "bg-gold-primary/10 border border-gold-primary/30" 
                    : "glass-panel hover:bg-glass-white border border-transparent"
                )}
              >
                {activeClass === cls.id && (
                  <motion.div
                    layoutId="activeClassHighlight"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gold-primary"
                  />
                )}
                <div>
                  <span className={cn(
                    "block font-medium",
                    activeClass === cls.id ? "text-gold-light" : "text-parchment/80 group-hover:text-parchment"
                  )}>
                    {cls.nameEn}
                  </span>
                  <span className="block text-xs uppercase tracking-wider text-parchment/50">
                    {cls.books.length} Books
                  </span>
                </div>
                <span className="font-arabic text-lg text-gold-primary/70" dir="rtl">{cls.nameUr}</span>
              </button>
            ))}
          </div>

          {/* Class Content Area */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="glass-panel rounded-xl border border-glass-border flex flex-col flex-1">
              <div className="p-6 md:p-8 border-b border-glass-border pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-playfair text-parchment flex items-center gap-3">
                    {currentClassData.nameEn}
                    <span className="font-arabic text-gold-primary text-2xl font-normal pt-1" dir="rtl">
                      ({currentClassData.nameUr})
                    </span>
                  </h2>
                  <p className="text-sm text-parchment/60 mt-1">Select a module below to begin studying.</p>
                </div>

                <div className="flex rounded-md overflow-hidden border border-gold-primary/30 shrink-0">
                  <button
                    onClick={() => setViewMode("pdfs")}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors",
                      viewMode === "pdfs" 
                        ? "bg-gold-primary text-midnight-ink" 
                        : "bg-midnight-ink/50 text-parchment hover:bg-glass-white"
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    Books (PDF)
                  </button>
                  <button
                    onClick={() => setViewMode("videos")}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors",
                      viewMode === "videos" 
                        ? "bg-gold-primary text-midnight-ink" 
                        : "bg-midnight-ink/50 text-parchment hover:bg-glass-white"
                    )}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Video Classes
                  </button>
                  <button
                    onClick={() => setViewMode("qa")}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors",
                      viewMode === "qa" 
                        ? "bg-gold-primary text-midnight-ink" 
                        : "bg-midnight-ink/50 text-parchment hover:bg-glass-white"
                    )}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Q&A Board
                  </button>
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="p-6 md:p-8 flex-1 min-h-[500px]">
                <AnimatePresence mode="wait">
                  {viewMode === "qa" ? (
                    <motion.div
                      key="qa-board"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-[600px]"
                    >
                      <QABoard classId={currentClassData.id} books={currentClassData.books} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${currentClassData.id}-${viewMode}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                      {currentClassData.books.map((book, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setSelectedModule(book);
                            setReadingMode(true);
                          }}
                          className="group p-5 rounded-lg border border-glass-border bg-midnight-ink/30 hover:bg-midnight-ink/80 hover:border-gold-primary/40 transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div className="w-10 h-10 rounded bg-gold-primary/10 flex items-center justify-center text-gold-primary group-hover:scale-110 transition-transform">
                                {viewMode === "pdfs" ? <Book className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                              </div>
                              <span className="text-xs font-medium px-2 py-1 bg-glass-white rounded text-parchment/60">
                                {viewMode === "pdfs" ? "2 PDFs" : "5 Videos"}
                              </span>
                            </div>
                            <h3 className="font-arabic text-xl text-parchment group-hover:text-gold-light transition-colors text-right leading-relaxed" dir="rtl">
                              {book}
                            </h3>
                          </div>
                          <div className="mt-4 pt-3 border-t border-glass-border flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-gold-primary uppercase tracking-wider font-medium">Open Module</span>
                            <ChevronDown className="w-4 h-4 text-gold-primary -rotate-90" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
