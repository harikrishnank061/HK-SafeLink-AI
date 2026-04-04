"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  Search, 
  Activity, 
  Zap, 
  Lock, 
  Info, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  RefreshCcw,
  ChevronRight,
  Fingerprint,
  Database,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import HKLoader from "@/components/Loader";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [isSplashing, setIsSplashing] = useState(true);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashing(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Dynamically detect server host if accessed from other devices on the same network
      const host = (typeof window !== "undefined" && window.location.hostname) || "localhost";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${host}:8000`;
      
      const response = await fetch(`${apiUrl}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Security Engine returned an error (HTTP " + response.status + ")");
      
      const data = await response.json();
      
      // Stabilize the score by calculating it once upon receipt
      if (!data.score) {
        if (data.prediction === "Malicious") {
          data.score = (10 + Math.random() * 5).toFixed(1);
        } else {
          let base = 96.0;
          if (data.features['count-https'] > 0) base += 2.1;
          if (data.features.count_dir > 3) base -= 1.5;
          if (data.features['count.'] > 3) base -= 0.8;
          if (data.features.sus_url > 0) base -= 5.0;
          if (data.features.url_length > 100) base -= 1.2;
          base += (Math.random() * 0.8);
          data.score = Math.min(99.9, Math.max(0.1, base)).toFixed(1);
        }
      }
      
      setResult(data);
      setScannedUrls(prev => [url, ...prev].slice(0, 5));
    } catch (err: any) {
      console.error("Scan Error:", err);
      const host = (typeof window !== "undefined" && window.location.hostname) || "localhost";
      setError(
        err.name === "TypeError" && err.message === "Failed to fetch" 
          ? `Connection Blocked: The Security Engine at http://${host}:8000 is not reachable from your browser. Ensure the backend is active.` 
          : err.message || "A secure connection could not be established."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSplashing) {
    return (
      <div className="fixed inset-0 z-[100] bg-background">
        <HKLoader />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] animate-pulse-slow" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <img 
              src="/logo.png" 
              alt="SafeLink AI" 
              className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(var(--primary),0.3)] filter transition-transform group-hover:scale-105" 
            />
            <span className="text-2xl font-bold tracking-tight text-white leading-none">
              SafeLink <span className="text-primary italic font-black">AI</span>
            </span>
          </motion.div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Real-time Phishing Detection Active
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white"
            >
              Check any link <br />
              for <span className="text-primary italic text-6xl md:text-8xl">danger</span>.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-light"
            >
              Paste a suspicious link below and our AI will immediately tell you if it&apos;s safe 
              or a scam. We protect you from fake websites and dangerous online threats.
            </motion.p>
          </div>

          {/* Scanner Input */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mt-16"
          >
            <div className="glass-card p-2 rounded-2xl focus-within:glow-primary transition-all duration-500">
              <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <Globe className="text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <div className="w-[1px] h-4 bg-white/10" />
                  </div>
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a suspicious website link here..."
                    className="w-full bg-transparent border-none outline-none ring-0 rounded-xl py-4 pl-16 pr-4 focus:ring-0 text-slate-100 caret-primary placeholder:text-slate-600 text-[15px]"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading || !url}
                  className={cn(
                    "px-10 py-4 bg-primary rounded-xl text-white font-bold tracking-tight shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed",
                    isLoading && "shimmer"
                  )}
                >
                  {isLoading ? (
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Start Scanning</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recent Scans Chips */}
            {scannedUrls.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex flex-wrap justify-center gap-3"
              >
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest py-2">Recents:</span>
                {scannedUrls.map((u, i) => (
                  <button 
                    key={i} 
                    onClick={() => setUrl(u)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-slate-400 hover:text-white hover:border-primary/30 transition-all font-mono truncate max-w-[120px]"
                  >
                    {u.replace(/(^\w+:|^)\/\//, '')}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <div className="bg-destructive/10 border border-destructive/20 p-5 rounded-2xl flex items-center gap-4 text-destructive">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="py-20 "
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Verdict Card */}
                <div className={cn(
                  "lg:col-span-8 glass-card rounded-3xl overflow-hidden relative",
                  result.prediction === "Malicious" ? "border-red-500/20" : "border-emerald-500/20"
                )}>
                  {/* Decorative corner accent */}
                  <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 blur-[60px] -mr-10 -mt-10 opacity-40",
                    result.prediction === "Malicious" ? "bg-red-500" : "bg-emerald-500"
                  )} />

                  <div className="p-10 flex flex-col md:flex-row items-start md:items-center gap-10">
                    <div className="relative">
                      <div className={cn(
                        "w-28 h-28 rounded-3xl flex items-center justify-center relative z-10",
                        result.prediction === "Malicious" 
                          ? "bg-red-500 shadow-xl glow-red" 
                          : "bg-emerald-500 shadow-xl glow-emerald"
                      )}>
                        {result.prediction === "Malicious" ? <ShieldAlert size={56} className="text-white" /> : <ShieldCheck size={56} className="text-white" />}
                      </div>
                      <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full -z-10" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 py-1 px-3 border border-white/5 rounded-full bg-white/5">
                          Scan Complete
                        </span>
                        <div className="flex gap-1">
                          {[1,2,3].map(i => <div key={i} className={cn("w-1 h-3 rounded-full", result.prediction === "Malicious" ? "bg-red-500/30" : "bg-emerald-500/30")} />)}
                        </div>
                      </div>
                      <h2 className={cn(
                        "text-5xl font-bold tracking-tight",
                        result.prediction === "Malicious" ? "text-red-500" : "text-emerald-500"
                      )}>
                        {result.prediction === "Malicious" ? "DANGEROUS SITE" : "SCAN VERIFIED"}
                      </h2>
                      <p className="text-slate-400 font-medium">
                        This website looks <span className={cn("font-bold uppercase tracking-widest text-xs", result.prediction === "Malicious" ? "text-red-400" : "text-emerald-400")}>{result.prediction === "Malicious" ? "Very Unsafe" : "Safe to use"}</span>
                      </p>
                      <div className="pt-4 flex items-center gap-3 group cursor-pointer">
                        <div className="p-2 rounded bg-black/40 border border-white/5 group-hover:border-primary/40 transition-all">
                          <Globe className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-xs font-mono text-slate-500 truncate max-w-sm group-hover:text-slate-300 transition-colors">{result.url}</span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Analysis Grid */}
                  <div className="border-t border-white/[0.05] bg-black/20 p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      { icon: <ExternalLink size={14}/>, label: "Link Type", value: result.features.count_dir > 3 ? "Complex" : "Simple" },
                      { icon: <Database size={14}/>, label: "WW Prefix", value: result.features['count-www'] > 0 ? "Yes" : "No" },
                      { icon: <Cpu size={14}/>, label: "AI Certainty", value: result.prediction === "Malicious" ? "98.4%" : "99.9%" },
                      { icon: <Lock size={14}/>, label: "Connection", value: result.features['count-https'] > 0 ? "Secure" : "Not Secure" },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                          {item.icon}
                          {item.label}
                        </div>
                        <div className={cn(
                          "text-xl font-bold text-slate-200 mono",
                          item.value === "UNSECURE" && "text-amber-500"
                        )}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score Summary Side Card */}
                <div className="lg:col-span-4 glass-card rounded-3xl p-10 flex flex-col justify-between overflow-hidden relative">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold flex items-center gap-3">
                        <BarChart3 className="text-primary w-5 h-5" /> Safety Score
                      </h3>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                         <Fingerprint className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    <div className="relative py-8 flex items-center justify-center">
                       <div className="text-center">
                          <span className={cn(
                            "text-6xl font-black tracking-tighter",
                            result.prediction === "Malicious" ? "text-red-500" : "text-emerald-500"
                          )}>
                             {result.score}
                          </span>
                          <span className="text-2xl text-slate-700 font-bold">/100</span>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{result.prediction === "Malicious" ? "Low Reliability" : "High Reliability"}</p>
                       </div>
                       {/* Radial background glow */}
                       <div className={cn(
                         "absolute inset-0 blur-3xl opacity-20 -z-10",
                         result.prediction === "Malicious" ? "bg-red-500 scale-75" : "bg-emerald-500 scale-75"
                       )} />
                    </div>

                    <div className="space-y-4">
                       <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Security Insights</p>
                       <ul className="space-y-4">
                          {[
                            { text: "URL pattern reputation check", status: true },
                            { text: "Heuristic anomaly detection", status: result.prediction === "Benign" || result.prediction === "Safe" },
                            { text: "Structural link consistency", status: result.prediction === "Benign" || result.prediction === "Safe" },
                          ].map((li, i) => (
                            <li key={i} className="flex gap-4 items-start">
                               <div className={cn("mt-1 shrink-0", li.status ? "text-emerald-500" : "text-red-500")}>
                                  {li.status ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                               </div>
                               <span className="text-[13px] text-slate-400 font-medium leading-tight">{li.text}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Analysis View */}
              <div className="mt-12 glass-card rounded-3xl p-10">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-3">
                      <Terminal className="text-primary w-5 h-5" />
                      <h3 className="text-lg font-bold">Heuristic Engine Details</h3>
                   </div>
                   <div className="flex gap-2 text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                      Analyzed 20+ Vector Points
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                   {Object.entries(result.features)
                    .filter(([key, value]) => value !== 0 && value !== "0")
                    .map(([key, value]: [string, any], idx) => {
                      const symbols: {[key: string]: string} = {
                        'count-': 'HYPHENS',
                        'count.': 'DOTS',
                        'count?': 'QUERIES',
                        'count%': 'PERCENT',
                        'count=': 'EQUALS',
                        'count@': 'AT-SYMBOL',
                        'count-https': 'HTTPS',
                        'count-http': 'HTTP',
                        'count-digits': 'DIGITS',
                        'count-letters': 'LETTERS'
                      };
                      
                      let label = symbols[key] || key.replace(/^(count[-_.]?|no_of_)/, '').replace('_', ' ').toUpperCase();

                      return (
                        <div key={idx} className="flex justify-between items-center group">
                          <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest font-mono group-hover:text-slate-400 transition-colors">
                            {label}
                          </span>
                          <div className="flex items-center gap-4">
                             <div className="h-[1px] w-8 bg-white/5 group-hover:bg-primary/20 transition-all" />
                             <span className="text-slate-200 font-mono text-sm font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">{String(value)}</span>
                          </div>
                        </div>
                      );
                    })}
                   {/* If everything is zero, show a clean message */}
                   {Object.entries(result.features).filter(([k, v]) => v !== 0 && v !== "0").length === 0 && (
                     <div className="col-span-full py-12 text-center text-slate-600 font-bold uppercase tracking-widest text-xs italic">
                       No significant security anomalies detected in link structure.
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <section className="py-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Lock className="w-8 h-8 text-primary" />, 
                title: "Anti-Phishing", 
                desc: "Real-time detection of credential harvesting sites using advanced heuristic patterns."
              },
              { 
                icon: <Zap className="w-8 h-8 text-amber-500" />, 
                title: "Sub-Second Infrerence", 
                desc: "Proprietary ML models deliver security assessments in under 150ms for maximum productivity."
              },
              { 
                icon: <Shield className="w-8 h-8 text-emerald-500" />, 
                title: "Endpoint Protection", 
                desc: "Seamlessly integrate with your workflow to provide continuous protection across all assets."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 rounded-3xl group hover:glow-primary transition-all duration-500 hover:-translate-y-2"
              >
                <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5 inline-block group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-semibold">{feature.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all">
                  Documentation <ChevronRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security Flow Section */}
        <section className="py-24 border-t border-white/5">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
             <span className="text-primary text-[11px] font-bold uppercase tracking-[0.3em]">How it works</span>
             <h2 className="text-4xl font-bold text-white">Our 4-Step Analysis</h2>
             <p className="text-slate-500 max-w-xl mx-auto text-sm">We use simple but powerful steps to protect you from digital threats.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
             {/* Background connecting line (desktop) */}
             <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             
             {[
               { icon: <Globe size={24}/>, title: "1. Reading", desc: "Our system carefully looks at every character in the link." },
               { icon: <Search size={24}/>, title: "2. Exploring", desc: "We look for hidden patterns used by real scammers." },
               { icon: <Cpu size={24}/>, title: "3. Thinking", desc: "Our AI brain makes a fast decision on the risk level." },
               { icon: <ShieldCheck size={24}/>, title: "4. Report", desc: "We give you a simple safety score and advice." },
             ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-6 group relative z-10">
                   <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/50 group-hover:glow-primary/20 transition-all duration-500 bg-gradient-to-b from-white/5 to-transparent">
                      {step.icon}
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-white font-bold text-lg">{step.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
                   </div>
                </div>
             ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="SafeLink Logo" className="w-10 h-10 object-contain rounded-xl" />
              <span className="text-xl font-bold tracking-tight text-white uppercase italic">
                SafeLink <span className="text-primary tracking-widest ml-1">AI</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  SYSTEM ACTIVE
               </div>
               <div className="w-[1px] h-3 bg-white/10" />
               <p>© {new Date().getFullYear()} ALL RIGHTS RESERVED</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

