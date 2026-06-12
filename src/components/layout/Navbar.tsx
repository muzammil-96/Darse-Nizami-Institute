import { Globe, Menu, Search, User, ChevronDown, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { classesData } from "@/data/classes";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { useAuthModal } from "@/components/auth/AuthContext";
import { useTheme } from "@/components/ThemeContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { openAuth } = useAuthModal();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Courses", path: "/classes", hasDropdown: true },
    { name: "Admission", path: "/admission" },
    { name: "Faculty", path: "/faculty" },
    { name: "Library", path: "/library" },
    { name: "Contact", path: "/contact" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-midnight-ink/80 backdrop-blur-xl border-glass-border py-4"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start gap-1 group">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 text-gold-primary shrink-0 transition-all duration-700 group-hover:rotate-90 group-hover:drop-shadow-[0_0_15px_rgba(201,168,76,0.8)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute inset-0 w-full h-full">
                <rect x="4" y="4" width="16" height="16" rx="1" />
                <rect x="4" y="4" width="16" height="16" rx="1" transform="rotate(45 12 12)" />
              </svg>
              <div className="w-1.5 h-1.5 bg-gold-primary rounded-full" />
            </div>
            <span className="font-playfair text-xl md:text-2xl font-bold tracking-wider text-parchment group-hover:text-gold-primary transition-colors">
              Dars-E-Nizami Institute
            </span>
          </div>
          <span className="font-amiri text-gold-light/80 text-sm md:text-base hidden sm:block">
            دارُ العلم والمعرفة
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 h-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            
            if (link.hasDropdown) {
              return (
                <div 
                  key={link.name}
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => setCoursesDropdownOpen(true)}
                  onMouseLeave={() => setCoursesDropdownOpen(false)}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      "relative flex items-center gap-1 text-sm uppercase tracking-widest font-medium transition-colors hover:text-gold-primary py-2",
                      isActive ? "text-gold-primary" : "text-parchment/80"
                    )}
                  >
                    {link.name}
                    <ChevronDown className="w-3.5 h-3.5" />
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gold-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>

                  <AnimatePresence>
                    {coursesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[600px] pointer-events-auto"
                      >
                        <div className="glass-panel rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-primary/20 p-6 bg-midnight-ink/95 backdrop-blur-2xl">
                          <h4 className="font-playfair text-gold-light mb-4 text-lg">Class Modules</h4>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {classesData.slice(0, 8).map((cls) => (
                              <Link
                                key={cls.id}
                                to={`/classes`}
                                onClick={() => setCoursesDropdownOpen(false)}
                                className="flex justify-between items-center group/item hover:bg-glass-white px-3 py-2 rounded transition-colors"
                              >
                                <span className="text-parchment/80 group-hover/item:text-gold-light font-medium">{cls.nameEn}</span>
                                <span className="font-arabic text-gold-primary/60 group-hover/item:text-gold-primary ml-4" dir="rtl">{cls.nameUr}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-6 pt-4 border-t border-glass-border flex justify-between items-center">
                            <span className="text-xs text-parchment/50">Comprehensive Dars-e-Nizami Curriculum</span>
                            <Link 
                              onClick={() => setCoursesDropdownOpen(false)}
                              to="/classes" 
                              className="text-sm text-gold-primary hover:text-gold-light flex items-center gap-1"
                            >
                              View All Catalog <ChevronDown className="w-4 h-4 -rotate-90" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "relative flex items-center gap-1 text-sm uppercase tracking-widest font-medium transition-colors hover:text-gold-primary py-2",
                  isActive ? "text-gold-primary" : "text-parchment/80"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gold-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 text-parchment/80 hover:text-gold-primary transition-colors group"
            title="Search"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <kbd className="hidden xl:inline-block text-[10px] font-mono bg-glass-white border border-glass-border rounded px-1.5 py-0.5 text-parchment/50">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={toggleTheme}
            className="text-parchment/80 hover:text-gold-primary transition-colors flex items-center justify-center group"
            title={theme === "dark" ? "Switch to Daytime mode" : "Switch to Dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
          
          <div className="flex items-center gap-2 text-parchment/80 hover:text-gold-primary cursor-pointer transition-colors">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">EN</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
              className="flex items-center gap-2 bg-glass-white border border-glass-border px-4 py-2 rounded border-gold-primary/30 hover:bg-gold-primary/10 transition-colors"
            >
              <User className="w-4 h-4 text-gold-primary" />
              <span className="text-sm font-medium tracking-wide">ENTER</span>
            </button>
            <AnimatePresence>
              {loginDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 glass-panel rounded-md overflow-hidden flex flex-col py-2"
                >
                  <button
                    onClick={() => { setLoginDropdownOpen(false); openAuth("login", "student"); }}
                    className="px-4 py-2 text-sm hover:bg-gold-primary/20 transition-colors text-left"
                  >
                    👤 Student Login
                  </button>
                  <button
                    onClick={() => { setLoginDropdownOpen(false); openAuth("login", "teacher"); }}
                    className="px-4 py-2 text-sm hover:bg-gold-primary/20 transition-colors text-left"
                  >
                    🎓 Teacher Login
                  </button>
                  <button
                    onClick={() => { setLoginDropdownOpen(false); openAuth("login", "admin"); }}
                    className="px-4 py-2 text-sm hover:bg-gold-primary/20 transition-colors text-left"
                  >
                    🔐 Admin Login
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-parchment hover:text-gold-primary transition-colors"
            title={theme === "dark" ? "Switch to Daytime mode" : "Switch to Dark mode"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            className="text-parchment"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-midnight-ink border-b border-glass-border overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="flex items-center gap-3 text-lg font-medium text-parchment hover:text-gold-primary"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-medium",
                    location.pathname === link.path
                      ? "text-gold-primary"
                      : "text-parchment"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
