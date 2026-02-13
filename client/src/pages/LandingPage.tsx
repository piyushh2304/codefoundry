import React from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Check, Star, Database, Lock, LayoutTemplate, Github, Triangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";

// --- Avatars for Social Proof ---
const Avatars = () => (
  <div className="flex -space-x-3 items-center">
    {[...Array(5)].map((_, i) => (
      <img
        key={i}
        className="w-10 h-10 rounded-full border-2 border-background"
        src={`https://i.pravatar.cc/100?img=${i + 10}`}
        alt="User Avatar"
      />
    ))}
  </div>
);

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { transition: { staggerChildren: 0.15 } }
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="py-6 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white group-hover:text-yellow-400 transition-colors">{question}</h3>
            <span className={`text-neutral-400 text-2xl font-light transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
        </div>
        <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        >
            <p className="text-neutral-400 leading-relaxed">{answer}</p>
        </div>
    </div>
  );
};

export default function LandingPage() {
  
  return (
    <div className="min-h-screen bg-[#050505] text-foreground overflow-x-hidden selection:bg-yellow-400/30 selection:text-yellow-600 font-sans">
      
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10 w-full pt-24 pb-20">
        
        {/* --- HERO SECTION --- */}
        <section className="w-full flex flex-col items-center justify-center min-h-[85vh] py-12 md:py-20 lg:py-0 overflow-hidden">
          
          <div className="container max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-12 items-center">
            
            {/* Left Column: Text & CTA */}
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer}
              className="flex flex-col items-start text-left gap-6 order-2 lg:order-1"
            >
                {/* Product Badge */}
                <motion.div variants={fadeInUp}>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-xs font-bold uppercase tracking-wider mb-2 hover:bg-yellow-500/10 transition-colors cursor-pointer group">
                        <span className="text-yellow-500 group-hover:scale-110 transition-transform">🏆</span> 
                        Product of the day 
                        <span className="text-white ml-1 opacity-80 backdrop-blur-sm bg-white/10 px-1.5 rounded-sm">2nd</span>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.h1 
                  variants={fadeInUp}
                  className="text-5xl md:text-7xl xl:text-[5.5rem] font-black tracking-tighter leading-[1] text-white"
                >
                  Ship your startup <br/>
                  in <span className="bg-white text-black px-2 transform -rotate-1 inline-block shadow-[4px_4px_0px_rgba(255,190,26,1)]">days</span>, <span className="text-neutral-600 line-through decoration-neutral-600/50 decoration-4">not weeks</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p 
                  variants={fadeInUp}
                  className="text-lg md:text-xl text-neutral-400 max-w-lg leading-relaxed font-medium"
                >
                  The NextJS boilerplate with all you need to build your SaaS, AI tool, or any other web app and make your first $ online fast.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={fadeInUp} className="flex flex-col gap-3 w-full sm:w-auto mt-4">
                    <Button className="h-16 px-8 rounded-xl text-lg font-bold bg-[#FFBE1A] hover:bg-[#FFBE1A]/90 text-black shadow-[0_0_30px_rgba(255,190,26,0.2)] hover:shadow-[0_0_40px_rgba(255,190,26,0.4)] hover:scale-[1.02] transition-all w-full sm:w-auto border-0" size="lg">
                        <Zap className="mr-2 h-5 w-5 fill-black" /> Get CodeFoundry
                    </Button>
                    <p className="text-green-500 text-sm font-semibold flex items-center gap-1.5 ml-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      $100 off for the first 50 customers (4 left)
                    </p>
                </motion.div>

                {/* Social Proof */}
                <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-6 ml-1">
                    <Avatars />
                    <div className="flex flex-col">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_,i) => (
                                <Star key={i} className="h-4 w-4 fill-[#FFBE1A] text-[#FFBE1A]" />
                            ))}
                        </div>
                        <span className="text-sm text-neutral-400 mt-0.5 font-medium">
                            <span className="font-bold text-white">8,136</span> makers ship faster
                        </span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Right Column: Vite Ecosystem Graphic */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-2 flex justify-center lg:justify-center h-[500px] lg:h-[600px] w-full items-center select-none pointer-events-none"
            >
               {/* Main Container */}
               <div className="relative w-full max-w-[550px] aspect-square">
                  
                  {/* Organic Shape/Glow Background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-[80px]" />
                  
                  {/* Surrounding Hand-Drawn-ish Circle (Simulated with irregular borders) */}
                  <svg className="absolute inset-[-40px] w-[calc(100%+80px)] h-[calc(100%+80px)] text-white/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                     {/* Slightly imperfect circle path */}
                     <path d="M50 4 C 76 4, 96 24, 96 50 C 96 76, 76 96, 50 96 C 24 96, 4 76, 4 50 C 4 24, 24 4, 50 4 Z" stroke="currentColor" strokeWidth="0.5" />
                     {/* Second offset path for "sketchy" look */}
                     <path d="M52 6 C 74 6, 94 26, 94 50 C 94 74, 74 94, 52 94 C 30 94, 6 74, 6 50 C 6 26, 26 6, 52 6" stroke="currentColor" strokeWidth="0.3" strokeDasharray="10 5" opacity="0.5" />
                  </svg>

                  {/* Center: VITE */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20">
                     <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-[40px] rounded-full" />
                        {/* Vite Logo Placeholder (Using specific polygon shape normally, sticking to Zap/Bolt iconography here for simplicity if SVG unavailable, but using custom SVG path if possible. Using Zap for now with distinct styling) */}
                        <svg viewBox="0 0 256 256" className="w-20 h-20 drop-shadow-[0_0_20px_rgba(100,108,255,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M228.667 36.3125L232.094 30.6562H150.969L147.542 36.3125L108.667 225.844H112.094L183.229 64.9375H144.354L228.667 36.3125Z" fill="#FFC927"/>
                            <path d="M129.25 36.3125L125.823 30.6562H44.698L48.1251 36.3125L132.438 64.9375H93.5626L164.698 225.844H168.125L129.25 36.3125Z" fill="#BD34FE"/>
                            <path d="M110.375 225.844H113.802L132.896 64.9375H94.0209L110.375 225.844Z" fill="#646CFF"/> 
                        </svg>
                     </div>
                     <span className="text-4xl font-black text-white mt-1 tracking-wide drop-shadow-md">VITE</span>
                  </div>

                  {/* Items Positioning */}
                  
                  {/* Orbit Container */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-full h-full rounded-full"
                  >
                        {/* Top: TypeScript (0 deg) */}
                        <motion.div 
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 p-2 pr-4 rounded-xl shadow-2xl backdrop-blur-md">
                                <div className="w-10 h-10 bg-[#3178C6] rounded-lg flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">TS</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-none">TypeScript</span>
                                    <span className="text-xs text-neutral-500 font-mono mt-1">static typing</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Right: Clerk (45 deg) */}
                        <motion.div 
                            className="absolute top-[14.6%] right-[14.6%] -translate-y-1/2 translate-x-1/2"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 p-2 pr-4 rounded-xl shadow-2xl backdrop-blur-md">
                                <div className="w-10 h-10 bg-[#6C47FF] rounded-lg flex items-center justify-center shadow-lg">
                                    <Lock className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-none">Clerk</span>
                                    <span className="text-xs text-neutral-500 font-mono mt-1">auth & users</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Drizzle (90 deg) */}
                        <motion.div 
                            className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 p-2 pr-4 rounded-xl shadow-2xl backdrop-blur-md">
                                <div className="w-10 h-10 bg-[#C5F74F] rounded-lg flex items-center justify-center shadow-lg">
                                    <Database className="w-5 h-5 text-green-900" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-none">Drizzle</span>
                                    <span className="text-xs text-neutral-500 font-mono mt-1 text-green-400">+ Zod Schema</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bottom Right: Vercel (135 deg) */}
                        <motion.div 
                            className="absolute bottom-[14.6%] right-[14.6%] translate-x-1/2 translate-y-1/2"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 p-2 pr-4 rounded-xl shadow-2xl backdrop-blur-md">
                                <div className="w-10 h-10 bg-black border border-white/20 rounded-lg flex items-center justify-center shadow-lg">
                                    <Triangle className="w-5 h-5 text-white fill-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-none">Vercel</span>
                                    <span className="text-xs text-neutral-500 font-mono mt-1">hosting</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Bottom: GitHub Actions (180 deg) */}
                        <motion.div 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                           <div className="flex items-center gap-2 bg-[#0A0A0A] border border-white/5 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md">
                               <Github className="w-6 h-6 text-white" />
                               <div className="flex flex-col items-start">
                                  <span className="text-sm font-bold text-white leading-none">GitHub Actions</span>
                                  <span className="text-[10px] text-neutral-500 font-mono">+ CI/CD Pipeline</span>
                               </div>
                           </div>
                        </motion.div>

                         {/* Bottom Left: Shadcn (225 deg) */}
                        <motion.div 
                            className="absolute bottom-[14.6%] left-[14.6%] -translate-x-1/2 translate-y-1/2"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 p-2 pr-4 rounded-xl shadow-2xl backdrop-blur-md">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg border border-neutral-200">
                                    <LayoutTemplate className="w-5 h-5 text-black" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-none">Shadcn UI</span>
                                    <span className="text-xs text-neutral-500 font-mono mt-1 text-green-400">+ KadenaUI</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Left: Zustand (270 deg) */}
                        <motion.div 
                            className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 p-2 pr-4 rounded-xl shadow-2xl backdrop-blur-md">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-orange-200">
                                    🐻
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-none">Zustand</span>
                                    <span className="text-xs text-neutral-500 font-mono mt-1">state mgmt</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Left: React (315 deg) */}
                        <motion.div 
                            className="absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/5 p-2 pr-4 rounded-xl shadow-2xl backdrop-blur-md">
                                <div className="w-10 h-10 bg-[#61DAFB] rounded-lg flex items-center justify-center shadow-lg">
                                    <span className="text-black font-bold text-lg">Ra</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-none">React 19</span>
                                    <span className="text-xs text-neutral-500 font-mono mt-1">library</span>
                                </div>
                            </div>
                        </motion.div>
                  </motion.div>
               </div>
            </motion.div>
            
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24" id="features">
           <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
             className="text-center mb-16 space-y-4"
           >
               <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Stop wasting time on...</h2>
               <p className="text-xl text-neutral-400 max-w-2xl mx-auto">You want to build a product, not redo the basics. We've handled the boring stuff.</p>
           </motion.div>
           
           <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={staggerContainer}
             className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
           >
               {[
                   { title: "Emails", icon: "📧", desc: "Send transactional emails without headache. Integrated with Resend." },
                   { title: "Payments", icon: "💰", desc: "Stripe subscriptions, webhooks, and checkout sessions ready to go." },
                   { title: "Login", icon: "🔐", desc: "User authentication with Google/Magic Links via Clerk/NextAuth." },
                   { title: "Database", icon: "🗄️", desc: "Drizzle ORM with PostgreSQL. Type-safe and ready." },
                   { title: "SEO", icon: "🔎", desc: "Meta tags, sitemap.xml, and OpenGraph images auto-generated." },
                   { title: "Style", icon: "🎨", desc: "TailwindCSS + Shadcn UI components for beautiful interfaces." },
               ].map((item, i) => (
                   <motion.div 
                     variants={fadeInUp}
                     key={i} 
                     className="p-8 rounded-[2rem] bg-[#111] hover:bg-[#151515] transition-colors border border-white/5 relative group overflow-hidden"
                   >
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5">{item.icon}</div>
                       <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                       <p className="text-neutral-400 leading-relaxed">{item.desc}</p>
                   </motion.div>
               ))}
           </motion.div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24" id="pricing">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 overflow-hidden relative group"
            >
                 {/* Background Grid Pattern */}
                 <div className="absolute inset-0 opacity-20" 
                      style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
                 />
                 
                 <div className="relative p-8 md:p-16 text-center space-y-10">
                     <Badge className="bg-green-500/10 text-green-400 px-4 py-1.5 uppercase tracking-wider text-xs border border-green-500/20 font-bold">
                         Launch Offer
                     </Badge>
                     
                     <div className="space-y-4">
                         <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">Pay once, own it forever</h2>
                         <p className="text-xl text-neutral-400">Get lifetime access to the code and all future updates.</p>
                     </div>
                     
                     <div className="flex items-end justify-center gap-4">
                        <span className="text-2xl text-neutral-600 line-through mb-4 font-bold decoration-2">$299</span>
                        <span className="text-7xl md:text-9xl font-black text-[#FFBE1A] tracking-tighter leading-none">$169</span>
                        <span className="text-xl text-neutral-500 font-bold mb-4">USD</span>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left pt-8">
                         {["Unlimited Projects", "Lifetime Updates", "Community Access", "Commercial License", "Priority Support", "Pay via Stripe"].map((feat, i) => (
                             <div key={i} className="flex items-center gap-3">
                                 <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                                     <Check className="h-3.5 w-3.5 text-green-500" />
                                 </div>
                                 <span className="text-base text-neutral-300 font-medium">{feat}</span>
                             </div>
                         ))}
                     </div>
                     
                     <Link to="/login" className="block w-full max-w-md mx-auto">
                        <Button className="w-full h-16 rounded-2xl text-xl font-bold bg-[#FFBE1A] hover:bg-[#FFBE1A]/90 text-black shadow-[0_0_40px_rgba(255,190,26,0.3)] mt-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(255,190,26,0.4)] border-0">
                            Get ShipFast-Clone
                        </Button>
                     </Link>
                     
                     <p className="text-sm text-neutral-500 font-medium">Secure payment with Stripe. 30-day money-back guarantee.</p>
                 </div>
            </motion.div>
        </section>

        {/* --- FAQ SECTION --- */}
         <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24" id="faq">
            <div className="grid md:grid-cols-2 gap-12">
                {/* Left Side: Sticky Title */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                    <div className="sticky top-24 text-left space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-neutral-400">
                            Have another question? Contact me on <a href="#" className="underline hover:text-white">Twitter</a> or by <a href="#" className="underline hover:text-white">email</a>.
                        </p>
                    </div>
                </motion.div>

                {/* Right Side: Accordion */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="divide-y divide-white/10"
                >
                    {[
                        { 
                            q: "What do I get exactly?", 
                            a: "You get a complete Vite + React starter kit with Authentication (Clerk), Database (Drizzle+Postgres), Payments (Stripe), and UI components (Shadcn) pre-configured. Plus a fully functional landing page, dashboard, and user settings." 
                        },
                        { 
                            q: "Javascript or Typescript?", 
                            a: "The entire codebase is written in TypeScript. We believe it's the best way to build robust, scalable applications in 2024. If you're new to TS, this is a great way to learn with real-world examples." 
                        },
                        { 
                            q: "Does CodeFoundry work with AI (Cursor, Copilot)?", 
                            a: "Absolutely! The code is clean, modular, and well-documented specifically so AI assistants can understand it easily. You can scaffold new features 10x faster using Cursor or Copilot with this boilerplate." 
                        },
                        { 
                            q: "My tech stack is different, can I still use it?", 
                            a: "The core value is the integration of Auth, Payments, and DB. If you use React, this will save you weeks. Other parts like the UI library or hosting provider can be easily swapped out if you have strong preferences." 
                        },
                        { 
                            q: "Is it a website template?", 
                            a: "It's much more. It's a full-stack web application starter. It includes the marketing site (what you see here), but also the entire backend logic, database schema, authenticated dashboard, and API routes." 
                        },
                        { 
                            q: "Can I get a refund?", 
                            a: "Due to the nature of digital products (you get the full source code immediately), we fundamentally cannot offer refunds once the repo is cloned. However, if you have issues, our support is top-notch." 
                        }
                    ].map((item, i) => (
                        <motion.div variants={fadeInUp} key={i}>
                            <FAQItem question={item.q} answer={item.a} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
         </section>

         {/* --- FOOTER --- */}
         <footer className="py-12 border-t border-white/5 bg-[#0A0A0A]">
             <div className="w-full max-w-7xl mx-auto px-6 md:px-12 text-center">
                 <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="bg-yellow-400/10 p-2 rounded-xl border border-yellow-400/20">
                        <Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" /> 
                    </div>
                    <h4 className="font-bold text-2xl text-white tracking-tight">CodeFoundry</h4>
                 </div>
                 <p className="text-neutral-500 mb-8 max-w-sm mx-auto font-medium">Built to help you ship your dream project faster than ever before.</p>
                  <div className="flex justify-center gap-8 text-sm font-bold text-neutral-400">
                     <Link to="/features" className="hover:text-white transition-colors">Features</Link>
                     <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                     <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                     <Link to="#" className="hover:text-white transition-colors">Twitter</Link>
                     <Link to="#" className="text-yellow-500/80 hover:text-yellow-500 transition-colors">Affiliates</Link>
                  </div>
                 <div className="mt-12 text-xs text-neutral-700 font-mono">
                     © 2024 CodeFoundry Inc. All rights reserved.
                 </div>
             </div>
         </footer>

      </main>
    </div>
  );
}