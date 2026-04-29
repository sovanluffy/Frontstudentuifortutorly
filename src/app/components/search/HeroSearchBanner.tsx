"use client";

import * as React from "react";
import {
  GraduationCap,
  BookOpen,
  MapPin,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Eye,
  EyeOff,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Data for Slides ---
const SLIDES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920",
];

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";
const getToken = () =>
  typeof document !== "undefined"
    ? document.cookie.match(/token=([^;]+)/)?.[1] || ""
    : "";

function FilterTab({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: any;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3 cursor-pointer transition-all duration-300 rounded-t-2xl relative",
        isActive
          ? "bg-white text-blue-600 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
          : "text-white/70 hover:text-white hover:bg-white/10"
      )}
    >
      <Icon
        size={18}
        className={cn(
          "transition-colors",
          isActive ? "text-blue-600" : "text-white/40"
        )}
      />
      <span className="text-sm font-bold whitespace-nowrap tracking-tight">
        {label}
      </span>
      {isActive && (
        <div className="absolute -right-4 bottom-0 w-4 h-4 bg-white rounded-bl-full shadow-[-2px_2px_0_white]" />
      )}
    </li>
  );
}

// ── Private Profile Banner ────────────────────────────────────────────────────
function PrivateProfileBanner({
  onDismiss,
  onGoToSettings,
}: {
  onDismiss: () => void;
  onGoToSettings: () => void;
}) {
  return (
    <div className="max-w-[1000px] mx-auto px-6 mt-4 relative z-40 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
          <EyeOff size={18} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-black text-amber-900 uppercase tracking-wide">
              Your Profile is Private
            </h4>
            <span className="text-[10px] font-black bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-widest">
              Hidden
            </span>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed mb-3">
            Your tutor profile and classes are not visible to students. Enable
            your public profile so students can discover and book your classes.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onGoToSettings}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              <Settings size={12} />
              Go to Profile Settings
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1.5 hover:bg-amber-200 rounded-lg transition-colors flex-shrink-0"
        >
          <X size={14} className="text-amber-600" />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function HeroSearchBanner({
  onResultsFound,
}: {
  onResultsFound?: (data: any) => void;
}) {
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<any[]>([]);

  const [activeTab, setActiveTab] = React.useState("All Subjects");
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  // Tutor profile privacy state
  const [tutorProfile, setTutorProfile] = React.useState<any>(null);
  const [showPrivateBanner, setShowPrivateBanner] = React.useState(false);

  // ── Fetch subjects, locations, and tutor profile on mount ─────────────
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, locRes] = await Promise.all([
          fetch(`${API_BASE}/subjects`),
          fetch(`${API_BASE}/locations`),
        ]);
        setSubjects(await subRes.json());
        setLocations(await locRes.json());
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchData();

    // Check tutor profile privacy if logged in as tutor
    const token = getToken();
    if (token) {
      fetch(`${API_BASE}/tutors/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((profile) => {
          if (profile) {
            setTutorProfile(profile);
            // Show banner if profile is private (public === false)
            if (profile.public === false) {
              setShowPrivateBanner(true);
            }
          }
        })
        .catch(() => {});
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // ── Auto-search whenever location or subject changes ──────────────────
  React.useEffect(() => {
    const runSearch = async () => {
      setLoading(true);
      try {
        const subjectQuery = activeTab === "All Subjects" ? "" : activeTab;
        const response = await fetch(
          `${API_BASE}/open-classes/filter?location=${encodeURIComponent(
            selectedLocation
          )}&subject=${encodeURIComponent(subjectQuery)}`
        );
        const data = await response.json();
        if (onResultsFound) onResultsFound(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce slightly so rapid tab clicks don't fire multiple requests
    const debounce = setTimeout(runSearch, 300);
    return () => clearTimeout(debounce);
  }, [activeTab, selectedLocation]);

  const handleGoToSettings = () => {
    // Navigate to tutor profile settings — adjust path to your routing
    window.location.href = "/tutor/settings/profile";
  };

  return (
    <section className="relative w-full overflow-hidden pb-16">
      {/* Background Slider */}
      <div className="h-[420px] relative flex items-center justify-center text-white bg-slate-950">
        {SLIDES.map((img, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              index === currentSlide
                ? "opacity-40 scale-100"
                : "opacity-0 scale-110"
            )}
          >
            <img
              src={img}
              className="w-full h-full object-cover"
              alt="slide"
            />
          </div>
        ))}

        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-50" />

        <div className="relative z-20 text-center px-4 -mt-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} />
            <span>Discover Your Future • ស្វែងរកអនាគតរបស់អ្នក</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter drop-shadow-2xl">
            Find Your Perfect{" "}
            <span className="text-blue-500">Tutor</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-8 font-medium font-khmer">
            ថ្នាក់រៀនដឹកនាំដោយអ្នកជំនាញនៅក្នុងតំបន់របស់អ្នក
            <span className="block text-sm mt-1 text-white/50 font-sans tracking-wide">
              Expert-led classes in your neighborhood
            </span>
          </p>

          <div className="flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-widest justify-center opacity-80">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <CheckCircle2 size={14} className="text-emerald-400" /> Verified
              Tutors
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <CheckCircle2 size={14} className="text-emerald-400" /> Flexible
              Schedule
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="max-w-[1000px] mx-auto -mt-16 px-6 relative z-40">
        {/* Dynamic Subject Tabs */}
        <ul className="flex bg-[#0F172A] w-fit rounded-t-2xl overflow-hidden ml-1 p-1 pb-0">
          <FilterTab
            label="All Subjects"
            icon={GraduationCap}
            isActive={activeTab === "All Subjects"}
            onClick={() => setActiveTab("All Subjects")}
          />
          {subjects.slice(0, 3).map((sub) => (
            <FilterTab
              key={sub.id}
              label={sub.name}
              icon={BookOpen}
              isActive={activeTab === sub.name}
              onClick={() => setActiveTab(sub.name)}
            />
          ))}
        </ul>

        {/* Search Main Box */}
        <div className="bg-white rounded-[2rem] rounded-tl-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 flex flex-col md:flex-row items-stretch gap-3 border border-slate-100">

          {/* Location Selection */}
          <div className="group flex-1 flex items-center px-6 py-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 hover:border-blue-200 transition-all duration-300">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mr-4">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 font-black block uppercase tracking-wider mb-0.5">
                Location{" "}
                <span className="font-khmer font-normal opacity-70 ml-1">
                  ទីតាំង
                </span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-base font-bold text-slate-900 outline-none bg-transparent cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc.locationId} value={loc.district}>
                    {loc.district}, {loc.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="group flex-1 flex items-center px-6 py-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 hover:border-blue-200 transition-all duration-300">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mr-4">
              <BookOpen size={20} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 font-black block uppercase tracking-wider mb-0.5">
                Subject{" "}
                <span className="font-khmer font-normal opacity-70 ml-1">
                  មុខវិជ្ជា
                </span>
              </label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full text-base font-bold text-slate-900 outline-none bg-transparent cursor-pointer"
              >
                <option value="All Subjects">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading indicator — replaces the search button */}
          {loading && (
            <div className="flex items-center justify-center px-8">
              <div className="flex items-center gap-2 text-blue-500">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 hidden md:block">
                  Searching...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Private Profile Banner (shown below search if tutor profile is private) ── */}
      {showPrivateBanner && (
        <PrivateProfileBanner
          onDismiss={() => setShowPrivateBanner(false)}
          onGoToSettings={handleGoToSettings}
        />
      )}
    </section>
  );
}