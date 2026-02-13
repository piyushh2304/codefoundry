
import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { 
  Sparkles, 
  Code2, 
  Search, 
  Cpu, 
  Zap, 
  Globe, 
  Layout, 
  CheckCircle2,
  ChevronRight,
  Github,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "AI Snippet Generation",
    description: "Write code 10x faster with our built-in AI. Simply describe what you need, and get production-ready code blocks in seconds.",
    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
    color: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/30",
    delay: 0.1
  },
  {
    title: "Curated Language Hubs",
    description: "Deep-dive into specialized environments for JavaScript, Python, MERN stack, and more. Each hub features battle-tested utility functions.",
    icon: <Globe className="w-6 h-6 text-blue-400" />,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    delay: 0.2
  },
  {
    title: "Step-by-Step Guides",
    description: "Complexity broken down. High-level snippets are accompanied by logical steps, making enterprise patterns easy to follow.",
    icon: <Layout className="w-6 h-6 text-emerald-400" />,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    delay: 0.3
  },
  {
    title: "Monaco-Powered Editor",
    description: "Experience code with the same power as VS Code. Syntax highlighting, hover information, and one-click copy functionality.",
    icon: <Code2 className="w-6 h-6 text-yellow-400" />,
    color: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    delay: 0.4
  },
  {
    title: "Semantic Vector Search",
    description: "Find exactly what you're looking for by intent, not just keywords. Our Postgres-vector backend understands your coding context.",
    icon: <Search className="w-6 h-6 text-red-400" />,
    color: "from-red-500/20 to-pink-500/20",
    borderColor: "border-red-500/30",
    delay: 0.5
  },
  {
    title: "Developer First UI",
    description: "Dark-mode by design. A premium documentation interface that respects your eyes and your cognitive load.",
    icon: <Zap className="w-6 h-6 text-indigo-400" />,
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
    delay: 0.6
  }
];

const faqItems = [
  {
    q: "How does the AI snippet generation work?",
    a: "Our AI uses Gemini 2.0 with Retrieval-Augmented Generation (RAG). It doesn't just hallucinate code; it analyzes your intent and checks against a library of enterprise patterns to provide production-ready solutions."
  },
  {
    q: "Is my code secure and private?",
    a: "Absolutely. Snippets are stored in your private library. We don't use your custom snippets to train global models, and you have full control over visibility through your personal dashboard."
  },
  {
    q: "Which frameworks and languages are supported?",
    a: "Currently, we have optimized hubs for JavaScript, TypeScript, Python, and the MERN stack. However, our AI generator can create and document snippets for any modern language or framework upon request."
  },
  {
    q: "Can I use CodeFoundry for team collaboration?",
    a: "The current version is optimized for individual power-users. However, a 'Foundry for Teams' feature is in the roadmap, which will include shared libraries and collaborative organization."
  },
  {
    q: "Is there a limit to how many snippets I can generate?",
    a: "There are no hard limits for our premium members. We use standard rate-limiting to ensure stability, but you're free to build as massive a library as your projects require."
  }
];

const FAQItem = ({ item, index }: { item: typeof faqItems[0], index: number }) => {
  const [isOpen, setIsOpen] = React.useState(index === 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-white/5"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-center justify-between text-left group"
      >
        <span className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors">
          {item.q}
        </span>
        <div className={`p-2 rounded-full border border-white/10 transition-all ${isOpen ? 'bg-primary/10 border-primary/20 text-primary rotate-180' : 'text-slate-500'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-8 text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
          {item.a}
        </p>
      </motion.div>
    </motion.div>
  );
};

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full">
              Why CodeFoundry?
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-[1.1]">
              The Operating System <br className="hidden md:block" />
              for Your <span className="text-primary italic">Developer Library</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              CodeFoundry isn't just a snippet manager. It's an intelligent workspace where you can generate, 
              catalog, and master the world's most efficient code patterns.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl gap-2 group shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                  Explore Hubs <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/ask-ai">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Try Ask AI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
                className={`group p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br ${feature.color} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 pointer-events-auto cursor-default`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-[#0a0a0a] flex items-center justify-center border ${feature.borderColor} mb-6 shadow-xl group-hover:rotate-12 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Feature Showcase - AI */}
      <section className="py-32 px-6 bg-[#080808]/50 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-black uppercase mb-6 tracking-widest">
              <Sparkles className="w-3 h-3" /> Advanced AI
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              A Private AI <br />
              Tailored for Developers
            </h2>
            <div className="space-y-6">
              {[
                "Context-aware snippet generation for any language.",
                "Automatic documentation generation for your custom code.",
                "Semantic search across all your snippets.",
                "One-click refactoring and optimization suggestions."
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 p-1 bg-purple-500/20 rounded-full text-purple-400 border border-purple-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-lg text-slate-300 font-medium">{text}</p>
                </div>
              ))}
            </div>
            <Link to="/ask-ai" className="mt-12 block">
              <Button className="h-14 px-8 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg shadow-purple-500/20">
                Experience the magic
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-purple-600/10 blur-[100px] rounded-full" />
            <div className="relative rounded-3xl border border-white/10 bg-[#0a0a0a] p-2 shadow-2xl">
               <div className="bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5">
                 <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                   <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                     <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                   </div>
                   <div className="text-xs font-mono text-slate-500">ai-generator.ts</div>
                 </div>
                 <div className="p-8 font-mono text-sm leading-relaxed">
                   <div className="flex gap-4 mb-4">
                     <span className="text-slate-600">01</span>
                     <span className="text-purple-400">async function</span> <span className="text-blue-400">generateAuth()</span> {'{'}
                   </div>
                   <div className="flex gap-4 mb-2">
                     <span className="text-slate-600">02</span>
                     <span className="text-slate-400 ml-4">const snippet = await ai.create({' {'}</span>
                   </div>
                   <div className="flex gap-4 mb-2">
                     <span className="text-slate-600">03</span>
                     <span className="text-slate-400 ml-8 text-yellow-200/70">prompt: "MERN Auth with JWT",</span>
                   </div>
                   <div className="flex gap-4 mb-2">
                     <span className="text-slate-600">04</span>
                     <span className="text-slate-400 ml-8 text-yellow-200/70">complexity: "enterprise"</span>
                   </div>
                   <div className="flex gap-4 mb-2">
                     <span className="text-slate-600">05</span>
                     <span className="text-slate-400 ml-4">{' });'}</span>
                   </div>
                   <div className="flex gap-4">
                     <span className="text-slate-600">06</span>
                     <span className="text-slate-400 ml-4">return snippet;</span>
                   </div>
                   <div className="flex gap-4">
                     <span className="text-slate-600">07</span>
                     <span>{'}'}</span>
                   </div>
                   <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center animate-pulse">
                     <div className="flex items-center gap-2 text-primary font-bold">
                       <Cpu className="w-5 h-5" /> Processing Intent...
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Proof Section */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Active Users", val: "10k+" },
            { label: "Snippets Generated", val: "250k+" },
            { label: "Language Hubs", val: "15+" },
            { label: "API Uptime", val: "99.9%" },
          ].map((stat, i) => (
            <div key={i}>
              <h4 className="text-4xl font-black text-white mb-2">{stat.val}</h4>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-3xl" />
          <div className="relative z-10 p-12 md:p-24 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Stop re-writing. <br />
              Start <span className="text-primary italic">building.</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
              Join thousands of developers who have revolutionized their workflow with CodeFoundry's 
              intelligent library.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register">
                <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-2xl bg-white text-black hover:bg-slate-200">
                  Join CodeFoundry
                </Button>
              </Link>
              <a href="https://github.com/piyushh2304/codefoundry" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white font-bold hover:text-primary transition-colors">
                <Github size={24} /> Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20">
            <div className="md:w-1/3">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full">
                Help Center
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Frequently Asked <br />
                <span className="text-primary italic">Questions</span>
              </h2>
              <p className="text-lg text-slate-400 font-medium">
                Can't find what you're looking for? Reach out to our 
                <a href="#" className="text-primary hover:underline ml-1">support team</a>.
              </p>
            </div>
            
            <div className="md:w-2/3 border-t border-white/5">
              {faqItems.map((item, idx) => (
                <FAQItem key={idx} item={item} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <div className="bg-primary/20 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-primary fill-primary" /> 
            </div>
            <span>CodeFoundry</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            © 2024 CodeFoundry. Built with ❤️ for the developer community.
          </p>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/ask-ai" className="hover:text-white transition-colors">AI</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
