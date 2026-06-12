import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Book, FileText, ArrowRight, LayoutDashboard, GraduationCap } from "lucide-react";
import { classesData } from "@/data/classes";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const normalizedQuery = query.toLowerCase().trim();
  
  let classResults = [];
  let bookResults: { className: string; book: string; classId: string }[] = [];
  let otherResults = [];

  if (normalizedQuery) {
    classResults = classesData.filter(
      (c) => c.nameEn.toLowerCase().includes(normalizedQuery) || c.nameUr.includes(normalizedQuery)
    );

    classesData.forEach((c) => {
      c.books.forEach((book) => {
        if (book.toLowerCase().includes(normalizedQuery)) {
          bookResults.push({ className: c.nameEn, book, classId: c.id });
        }
      });
    });

    const pages = [
      { title: "Admission Portal", path: "/admission", type: "page", icon: <GraduationCap className="w-4 h-4" /> },
      { title: "Student Dashboard", path: "/dashboard", type: "page", icon: <LayoutDashboard className="w-4 h-4" /> },
      { title: "Course Catalog", path: "/classes", type: "page", icon: <Book className="w-4 h-4" /> },
    ];
    otherResults = pages.filter(p => p.title.toLowerCase().includes(normalizedQuery));
  }

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-midnight-ink/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-midnight-ink border border-glass-border rounded-xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="relative border-b border-glass-border">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-primary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, books, lectures..."
                className="w-full bg-transparent border-none outline-none py-4 pl-12 pr-12 text-parchment placeholder-parchment/40 text-lg"
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-parchment/40 hover:text-parchment rounded-md hover:bg-glass-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {!normalizedQuery ? (
                <div className="py-12 text-center text-parchment/40 flex flex-col items-center">
                  <Search className="w-8 h-8 mb-3 opacity-20" />
                  <p>Type to search the academy</p>
                  <div className="flex gap-2 mt-4 text-xs">
                    <span className="px-2 py-1 bg-glass-white rounded border border-glass-border">Nahw</span>
                    <span className="px-2 py-1 bg-glass-white rounded border border-glass-border">Fiqh</span>
                    <span className="px-2 py-1 bg-glass-white rounded border border-glass-border">Hadith</span>
                  </div>
                </div>
              ) : classResults.length === 0 && bookResults.length === 0 && otherResults.length === 0 ? (
                <div className="py-12 text-center text-parchment/40">
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-6 p-2">
                  {classResults.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-parchment/50 font-medium mb-2 px-2">Classes</h3>
                      <div className="space-y-1">
                        {classResults.map((cls) => (
                          <button
                            key={cls.id}
                            onClick={() => handleSelect('/classes')}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-glass-white group transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-gold-primary/10 flex items-center justify-center text-gold-primary">
                                <Book className="w-4 h-4" />
                              </div>
                              <span className="text-parchment font-medium group-hover:text-gold-light transition-colors">{cls.nameEn}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-arabic text-gold-primary/70" dir="rtl">{cls.nameUr}</span>
                              <ArrowRight className="w-4 h-4 text-parchment/30 group-hover:text-gold-primary transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {bookResults.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-parchment/50 font-medium mb-2 px-2">Books & PDFs</h3>
                      <div className="space-y-1">
                        {bookResults.slice(0, 10).map((b, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelect('/classes')}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-glass-white group transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-emerald-accent/10 flex items-center justify-center text-emerald-light">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-arabic text-parchment text-lg group-hover:text-gold-light transition-colors leading-none" dir="rtl">{b.book}</span>
                                <span className="text-xs text-parchment/50 mt-1">Class: {b.className}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-parchment/30 group-hover:text-emerald-light transition-colors" />
                          </button>
                        ))}
                        {bookResults.length > 10 && (
                          <div className="text-xs text-parchment/40 text-center py-2">
                            + {bookResults.length - 10} more books found
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {otherResults.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-parchment/50 font-medium mb-2 px-2">Pages</h3>
                      <div className="space-y-1">
                        {otherResults.map((page, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelect(page.path)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-glass-white group transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-glass-white flex items-center justify-center text-parchment/70">
                                {page.icon}
                              </div>
                              <span className="text-parchment font-medium group-hover:text-gold-light transition-colors">{page.title}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-parchment/30 group-hover:text-gold-primary transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="border-t border-glass-border px-4 py-3 bg-midnight-ink/50 flex justify-between items-center text-xs text-parchment/40">
              <span>Press <kbd className="bg-glass-white border border-glass-border rounded px-1.5 py-0.5 mx-1 font-mono">ESC</kbd> to close</span>
              <span>Global Search API</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
