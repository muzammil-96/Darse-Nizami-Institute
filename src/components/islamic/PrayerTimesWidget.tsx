import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Clock, Settings, RefreshCw, ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";

interface PrayerData {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
  };
  hijriDate: string;
  hijriMonth: string;
  hijriYear: string;
  hijriDayEn: string;
}

const DAILY_DUAS = [
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    urduTranslation: "اے میرے رب! میرے علم میں اضافہ فرما۔",
    source: "Quran 20:114"
  },
  {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    transliteration: "Allahumma inni as'aluka 'ilman naafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
    urduTranslation: "اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور قبول ہونے والے عمل کا سوال کرتا ہوں۔",
    source: "Ibn Majah"
  },
  {
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    transliteration: "Ya Muqallibal-quluub, thabbit qalbi 'alaa diinik",
    urduTranslation: "اے دلوں کو پھیرنے والے! میرے دل کو اپنے دین پر ثابت رکھ۔",
    source: "Tirmidhi"
  },
  {
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ",
    transliteration: "Allahumma a'inni 'ala dhikrika, wa shukrika, wa husni 'ibadatik",
    urduTranslation: "اے اللہ! اپنی یاد، اپنے شکر اور اپنی بہترین عبادت پر میری مدد فرما۔",
    source: "Abu Dawud"
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan wa qina 'adhaban-nar",
    urduTranslation: "اے ہمارے رب! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما، اور ہمیں آگ کے عذاب سے بچا۔",
    source: "Quran 2:201"
  }
];

export function PrayerTimesWidget() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 1 = Hanafi, 0 = Shafi'i
  const [school, setSchool] = useState<number>(1);
  const [locationName, setLocationName] = useState<string>("Detecting location...");
  const [showSettings, setShowSettings] = useState(false);
  const [duaIndex, setDuaIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastNotifiedEvent, setLastNotifiedEvent] = useState<string | null>(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Current time interval
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cycle dua every 15 seconds
    const duaInterval = setInterval(() => {
      setDuaIndex((prev) => (prev + 1) % DAILY_DUAS.length);
    }, 15000);
    return () => {
      clearInterval(timeInterval);
      clearInterval(duaInterval);
    };
  }, []);

  useEffect(() => {
    if (!data || !("Notification" in window) || Notification.permission !== "granted") return;
    
    // Ensure we don't trigger multiple notifications within a minute
    if (currentTime.getSeconds() !== 0) return;

    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const getMins = (time24: string) => {
      const [h, m] = time24.split(":").map(Number);
      return h * 60 + m;
    };

    const prayerMins = [
      { name: "Fajr", mins: getMins(data.timings.Fajr) },
      { name: "Sunrise", mins: getMins(data.timings.Sunrise) },
      { name: "Dhuhr", mins: getMins(data.timings.Dhuhr) },
      { name: "Asr", mins: getMins(data.timings.Asr) },
      { name: "Maghrib", mins: getMins(data.timings.Maghrib) },
      { name: "Isha", mins: getMins(data.timings.Isha) }
    ];

    for (const p of prayerMins) {
      if (currentMins === p.mins) {
        const eventKey = `${new Date().toDateString()}-${p.name}`;
        if (lastNotifiedEvent !== eventKey) {
          new Notification(p.name === "Sunrise" ? "Time for Sunrise" : `Prayer Time: ${p.name}`, {
            body: p.name === "Sunrise" ? "Sunrise time has started." : `It is time for ${p.name} prayer.`,
          });
          setLastNotifiedEvent(eventKey);
        }
      }
    }
  }, [currentTime, data, lastNotifiedEvent]);

  const fetchTimes = async (lat: number, lng: number, madhab: number) => {
    setLoading(true);
    try {
      const date = new Date();
      const coordinates = new Coordinates(lat, lng);
      const params = CalculationMethod.Karachi();
      params.madhab = madhab === 1 ? Madhab.Hanafi : Madhab.Shafi;
      
      const pt = new PrayerTimes(coordinates, date, params);

      const fmt = (d: Date) => d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      // Build Hijri date via Intl API
      const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-civil', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'short'
      });
      // "Fri, Safar 14, 1445 AH" -> Parse out
      const formattedParts = hijriFormatter.formatToParts(date);
      let hDay = "1", hMonth = "Muharram", hYear = "1445", hWeekday = "Fri";
      formattedParts.forEach(p => {
        if (p.type === 'day') hDay = p.value;
        if (p.type === 'month') hMonth = p.value;
        if (p.type === 'year') hYear = p.value; // might contain "AH"
        if (p.type === 'weekday') hWeekday = p.value;
      });

      setData({
        timings: {
          Fajr: fmt(pt.fajr),
          Sunrise: fmt(pt.sunrise),
          Dhuhr: fmt(pt.dhuhr),
          Asr: fmt(pt.asr),
          Sunset: fmt(pt.maghrib), // Using Maghrib approx for Sunset
          Maghrib: fmt(pt.maghrib),
          Isha: fmt(pt.isha),
        },
        hijriDate: hDay,
        hijriMonth: hMonth,
        hijriYear: hYear.replace(/\sAH/i, ''),
        hijriDayEn: hWeekday,
      });
      setError(null);
    } catch (err) {
      setError("Unable to calculate prayer times.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLocationAndFetch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem("prayer_lat", latitude.toString());
        localStorage.setItem("prayer_lng", longitude.toString());
        
        try {
          // Attempt to get city name via simple reverse geocoding
          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const geoJson = await geoRes.json();
          const name = geoJson.city || geoJson.locality || "Your Location";
          setLocationName(name);
          localStorage.setItem("prayer_loc_name", name);
        } catch {
          setLocationName(localStorage.getItem("prayer_loc_name") || "Your Location");
        }
        fetchTimes(latitude, longitude, school);
      },
      (err) => {
        // Fallback to cached location or New Delhi if permission denied/offline
        const cachedLat = localStorage.getItem("prayer_lat");
        const cachedLng = localStorage.getItem("prayer_lng");
        const cachedName = localStorage.getItem("prayer_loc_name");
        
        if (cachedLat && cachedLng) {
          setLocationName(cachedName || "Cached Location");
          fetchTimes(parseFloat(cachedLat), parseFloat(cachedLng), school);
        } else {
          setLocationName("New Delhi (Mock)");
          fetchTimes(28.6139, 77.2090, school);
        }
      }
    );
  };

  useEffect(() => {
    getLocationAndFetch();
  }, [school]);

  // Convert 24h to 12h format
  const formatTime = (time24: string) => {
    if (!time24) return "";
    const [h, m] = time24.split(":");
    const hours = parseInt(h, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${m} ${suffix}`;
  };

  const addMinutes = (time24: string, mins: number) => {
    if (!time24) return "";
    let [h, m] = time24.split(":").map(Number);
    m += mins;
    while (m >= 60) {
      h = (h + 1) % 24;
      m -= 60;
    }
    while (m < 0) {
      h = (h - 1 + 24) % 24;
      m += 60;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const prayers = data ? [
    { name: "Fajr", time: data.timings.Fajr },
    { name: "Sunrise", time: data.timings.Sunrise },
    { name: "Dhuhr", time: data.timings.Dhuhr },
    { name: "Asr", time: data.timings.Asr },
    { name: "Maghrib", time: data.timings.Maghrib },
    { name: "Isha", time: data.timings.Isha },
  ] : [];

  const makroohTimes = data ? [
    { name: "Sunrise", range: `${formatTime(data.timings.Sunrise)} - ${formatTime(addMinutes(data.timings.Sunrise, 15))}`},
    { name: "Zawaal", range: `${formatTime(addMinutes(data.timings.Dhuhr, -10))} - ${formatTime(data.timings.Dhuhr)}`},
    { name: "Sunset", range: `${formatTime(addMinutes(data.timings.Sunset, -15))} - ${formatTime(data.timings.Sunset)}`},
  ] : [];

  // Calculate active prayer and makrooh time
  let activePrayer: string | null = null;
  let activeMakrooh: string | null = null;

  if (data) {
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    // Parse times
    const getMins = (time24: string) => {
      const [h, m] = time24.split(":").map(Number);
      return h * 60 + m;
    };

    const sunriseMins = getMins(data.timings.Sunrise);
    const zawaalMins = getMins(data.timings.Dhuhr); // Assuming Zawaal is right before Dhuhr
    const sunsetMins = getMins(data.timings.Sunset); // Maghrib/Sunset

    // Makrooh intervals
    const makroohIntervals = [
      { name: "Sunrise", start: sunriseMins, end: sunriseMins + 15 },
      { name: "Zawaal", start: zawaalMins - 10, end: zawaalMins },
      { name: "Sunset", start: sunsetMins - 15, end: sunsetMins }
    ];

    for (const m of makroohIntervals) {
      if (currentMins >= m.start && currentMins < m.end) {
        activeMakrooh = m.name;
        break;
      }
    }

    // Current active prayer
    const prayerMins = [
      { name: "Fajr", mins: getMins(data.timings.Fajr) },
      { name: "Sunrise", mins: sunriseMins },
      { name: "Dhuhr", mins: getMins(data.timings.Dhuhr) },
      { name: "Asr", mins: getMins(data.timings.Asr) },
      { name: "Maghrib", mins: getMins(data.timings.Maghrib) },
      { name: "Isha", mins: getMins(data.timings.Isha) }
    ];

    activePrayer = "Isha"; // Default to Isha (for time after midnight before Fajr)
    let maxMins = -1;
    for (const p of prayerMins) {
      if (currentMins >= p.mins && p.mins > maxMins) {
        activePrayer = p.name;
        maxMins = p.mins;
      }
    }
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-gold-primary/20 relative group max-w-sm w-full mx-auto shadow-2xl">
      {/* Decorative background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-accent/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none" />

      {/* Header section with Hijri date and location */}
      <div className="p-5 border-b border-glass-border relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-parchment/60 text-xs font-medium uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5 text-gold-primary" />
            <span>{locationName}</span>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-parchment/40 hover:text-gold-light transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        {loading && !data ? (
          <div className="h-16 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-gold-primary animate-spin" />
          </div>
        ) : data ? (
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col items-start gap-0.5 relative z-10">
              <span className={cn(
                "text-2xl font-mono tracking-tighter tabular-nums px-2 py-0.5 rounded-md border backdrop-blur-md",
                activeMakrooh 
                  ? "text-rose-500 border-rose-500/30 bg-rose-500/10 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]" 
                  : "text-gold-primary border-glass-border bg-midnight-ink/50 drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]"
              )}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5 pl-1",
                activeMakrooh ? "text-rose-400" : "text-emerald-400"
              )}>
                <AnimatePresence mode="wait">
                  {activeMakrooh ? (
                    <motion.div key="makrooh" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite]" />
                      Makrooh Running
                    </motion.div>
                  ) : activePrayer ? (
                    <motion.div key={activePrayer} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
                      {activePrayer} Running
                    </motion.div>
                  ) : (
                    <motion.div key="current" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-1.5">
                      Current Time
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
            </div>
            <div className="text-right">
              <h3 className="font-playfair text-2xl text-gold-light tracking-tight flex items-baseline justify-end gap-2">
                <span className="text-3xl drop-shadow-md">{data.hijriDate}</span>
                <span>{data.hijriMonth}</span>
              </h3>
              <p className="text-sm text-parchment/60 font-medium">
                {data.hijriYear} AH • {data.hijriDayEn}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-red-400 text-sm py-4">{error}</div>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-midnight-ink/80 border-b border-glass-border px-5 py-4 overflow-hidden z-10 relative backdrop-blur-md"
          >
            <label className="block text-xs uppercase tracking-wider text-parchment/60 mb-2">Asr Calculation Method (Madhab)</label>
            <div className="flex rounded-md overflow-hidden border border-glass-border w-full">
              <button
                onClick={() => setSchool(1)}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium transition-colors",
                  school === 1 ? "bg-gold-primary text-midnight-ink" : "bg-transparent text-parchment hover:bg-glass-white"
                )}
              >
                Hanafi
              </button>
              <button
                onClick={() => setSchool(0)}
                className={cn(
                  "flex-1 py-1.5 text-sm font-medium transition-colors",
                  school === 0 ? "bg-gold-primary text-midnight-ink" : "bg-transparent text-parchment hover:bg-glass-white"
                )}
              >
                Shafi'i/Other
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prayer Times Grid */}
      <div className="p-5 relative z-10">
        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
          {prayers.map((prayer, i) => {
            const isActive = activePrayer === prayer.name && !activeMakrooh;
            return (
              <div key={prayer.name} className={cn(
                "flex flex-col px-3 py-2 rounded-lg transition-all duration-700 border",
                isActive
                  ? "bg-emerald-500/10 border-emerald-500/20 shadow-[inset_0_0_15px_rgba(16,185,129,0.05)]"
                  : "border-transparent"
              )}>
                <span className={cn(
                  "text-[11px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1.5",
                  isActive ? "text-emerald-400" : "text-parchment/50"
                )}>
                  {prayer.name === "Sunrise" ? <Clock className={cn("w-3 h-3", isActive ? "text-emerald-400" : "text-gold-primary/70")} /> : null}
                  {prayer.name}
                </span>
                <span className={cn(
                  "font-mono text-base font-medium",
                  isActive ? "text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" :
                  prayer.name === "Sunrise" ? "text-parchment/70" : "text-parchment"
                )}>
                  {loading ? "..." : formatTime(prayer.time)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Makrooh Times */}
      {data && !loading && (
        <div className="mx-5 mb-5 p-4 rounded-xl flex flex-col gap-3 relative z-10 overflow-hidden border border-rose-500/30 bg-gradient-to-b from-rose-500/10 to-transparent backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group/makrooh">
          {/* Decorative glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl pointer-events-none group-hover/makrooh:bg-rose-500/30 transition-colors duration-500" />

          <div className="flex items-center gap-2 text-rose-500 font-bold text-[10px] uppercase tracking-widest pl-1 relative">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_12px_rgba(244,63,94,1)]" />
            Makrooh (Prohibited)
          </div>
          <div className="grid grid-cols-1 gap-2 relative">
            {makroohTimes.map((m) => {
              const isActiveMakrooh = activeMakrooh === m.name;
              return (
                <div key={m.name} className={cn(
                  "flex justify-between items-center rounded-lg py-2 px-3 transition-all duration-300 border",
                  isActiveMakrooh 
                    ? "bg-rose-500/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    : "bg-rose-500/5 border-rose-500/10 hover:bg-rose-500/15 hover:border-rose-500/30"
                )}>
                  <span className={cn(
                     "text-[11px] font-bold uppercase tracking-widest",
                     isActiveMakrooh ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-rose-500/90"
                  )}>{m.name}</span>
                  <span className={cn(
                     "text-[11px] font-mono font-bold tracking-tight px-2 py-0.5 rounded-md",
                     isActiveMakrooh ? "text-white bg-rose-500/40" : "text-rose-500 bg-rose-500/10"
                  )}>{m.range}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Dua */}
      <div className="mx-5 mb-5 p-4 rounded-xl bg-midnight-ink/50 border border-glass-border relative z-10 overflow-hidden group/dua">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gold-primary text-[10px] uppercase tracking-widest font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            Daily Dua
          </div>
          <button 
            onClick={() => setDuaIndex((prev) => (prev + 1) % DAILY_DUAS.length)}
            className="opacity-0 group-hover/dua:opacity-100 transition-opacity text-parchment/40 hover:text-gold-light"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={duaIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <p className="text-gold-light font-quran text-2xl leading-[1.8] text-center" dir="rtl" style={{ fontFamily: 'var(--font-quran)' }}>
              {DAILY_DUAS[duaIndex].arabic}
            </p>
            <div className="space-y-3">
              <p className="text-[11px] text-parchment/50 italic text-center">
                "{DAILY_DUAS[duaIndex].transliteration}"
              </p>
              <p className="text-parchment font-nastaleeque text-xl leading-[1.8] text-center px-2" dir="rtl" style={{ fontFamily: 'var(--font-nastaleeque)' }}>
                {DAILY_DUAS[duaIndex].urduTranslation}
              </p>
              <p className="text-[10px] text-parchment/40 text-center mt-2 font-mono">
                — {DAILY_DUAS[duaIndex].source}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
