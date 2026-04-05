/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import AdsterraAd from './components/AdsterraAd';
import AdsterraNativeAd from './components/AdsterraNativeAd';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Inject Adsterra Global Scripts dynamically for React SPA compatibility
    // Delay injection to prioritize main content rendering (improves LCP/FCP on mobile)
    const timer = setTimeout(() => {
      const globalScripts = [
        'https://pl29071490.profitablecpmratenetwork.com/dd/ae/78/ddae78d7b325db03dc8df004d486c6b1.js',
        'https://pl29071802.profitablecpmratenetwork.com/90/6b/40/906b403c5741e514a48da7d6ce4bbf4d.js'
      ];
      
      globalScripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      });
    }, 2500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyber-cyan selection:text-cyber-bg relative text-gray-100">
      <Helmet>
        <title>RecNews - Latest Gaming Intel</title>
        <meta name="description" content="RecNews delivers the latest gaming intel, esports news, and cyberpunk luxury gaming lifestyle content." />
      </Helmet>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-cyber-bg">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyber-cyan/5 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-cyber-purple/10 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-cyber-cyan/5 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="sticky top-0 z-50 bg-cyber-bg/80 backdrop-blur-xl border-b border-cyber-purple/30 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link 
            to="/"
            className="text-3xl font-display font-bold tracking-wider cursor-pointer text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" 
            onClick={() => setSelectedPost(null)}
          >
            REC<span className="text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">NEWS</span>
          </Link>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-8 items-center font-mono text-xs uppercase tracking-widest"
          >
            <a href="https://www.profitablecpmratenetwork.com/ezcmnsa3nz?key=cf9a2d1507c74957cdb48f305fc2f26f" target="_blank" rel="noopener noreferrer" className="text-cyber-bg font-bold hover:bg-white transition-all flex items-center gap-1 bg-cyber-cyan px-4 py-2 rounded-sm shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"></path></svg>
              Hot Offer
            </a>
            <Link to="/" onClick={() => setSelectedPost(null)} className={`transition-all duration-300 ${location.pathname === '/' ? 'text-cyber-cyan font-bold drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]' : 'text-gray-400 hover:text-white'}`}>Home</Link>
            {session && (
              <button aria-label="Sign Out" onClick={() => supabase.auth.signOut()} className="text-red-400 hover:text-red-300 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)] transition-all">Sign Out</button>
            )}
          </motion.div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {/* @ts-ignore - key is needed for AnimatePresence but not in RoutesProps */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            !selectedPost ? (
              <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <HomePage onReadPost={setSelectedPost} />
              </motion.div>
            ) : (
              <motion.div key="post" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <PostPage post={selectedPost} onBack={() => setSelectedPost(null)} />
              </motion.div>
            )
          } />
          <Route path="/admin" element={
            <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <AdminPanel session={session} />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>

      {/* Global Footer */}
      <footer className="mt-auto border-t border-cyber-purple/30 bg-cyber-bg/90 backdrop-blur-md relative z-40">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand & About */}
            <div className="space-y-4">
              <Link to="/" className="text-2xl font-display font-bold tracking-wider cursor-pointer text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" onClick={() => setSelectedPost(null)}>
                REC<span className="text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">NEWS</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Delivering the latest gaming intel, esports news, and cyberpunk luxury gaming lifestyle content.
              </p>
              <div className="pt-2">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500">A Product of </span>
                <span className="font-display font-bold text-cyber-purple tracking-wider text-lg drop-shadow-[0_0_5px_rgba(126,34,206,0.5)]">RecNest</span>
              </div>
            </div>

            {/* Ecosystem Links */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-gray-300 font-bold">Ecosystem</h4>
              <ul className="space-y-3 font-mono text-sm">
                <li>
                  <a href="https://recshopbd.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyber-cyan transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    RecShopBD.com
                  </a>
                </li>
                <li>
                  <Link to="/" onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-cyber-cyan transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 8H20"></path></svg>
                    Latest Intel
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Contact */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-gray-300 font-bold">Legal & Info</h4>
              <ul className="space-y-3 font-mono text-sm">
                <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors">Terms of Service</a></li>
                <li><a href="mailto:contact@recshopbd.com" className="text-gray-400 hover:text-cyber-cyan transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-cyber-purple/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest text-center md:text-left">
              &copy; {new Date().getFullYear()} RecNews. All rights reserved.
            </p>
            <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest text-center md:text-right max-w-md">
              Not affiliated with game developers or publishers unless explicitly stated. Trademarks belong to their respective owners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ onReadPost }: { onReadPost: (post: any) => void }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Header Ad */}
      <div className="lg:col-span-12 mb-4">
        <AdsterraAd width={728} height={90} adKey="1cb5c203f82843b157536abb5634f51f" />
      </div>

      <div className="lg:col-span-8 space-y-12">
        <div className="border-b border-cyber-purple/50 pb-4 mb-8 flex items-center gap-4">
          <div className="w-2 h-8 bg-cyber-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>
          <h2 className="text-5xl font-display font-bold tracking-wider text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] uppercase">Latest Intel</h2>
        </div>
        
        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-cyber-pulse border border-cyber-purple/20 bg-gray-900/40 p-6 rounded-lg">
                <div className="aspect-[16/9] bg-gray-800 mb-6 rounded border border-cyber-purple/30"></div>
                <div className="h-10 bg-gray-800 w-3/4 mb-4 rounded"></div>
                <div className="h-4 bg-gray-800 w-full mb-2 rounded"></div>
                <div className="h-4 bg-gray-800 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center border border-cyber-purple/30 border-dashed bg-gray-900/20 rounded-lg">
            <p className="text-cyber-cyan font-mono text-sm drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">SYSTEM_OFFLINE: Awaiting Supabase Anon Key connection.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                {/* In-feed Ad every 3 posts */}
                {index > 0 && index % 3 === 0 && (
                  <div className="mb-12 py-8 border-y border-cyber-purple/30 bg-gray-900/30 backdrop-blur-sm flex justify-center rounded-lg">
                    <div className="text-center w-full flex flex-col items-center">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Advertisement</span>
                      {index % 2 === 0 ? (
                        <AdsterraAd width={728} height={90} adKey="1cb5c203f82843b157536abb5634f51f" />
                      ) : (
                        <AdsterraAd width={300} height={250} adKey="10a6f13b696d69be3dfebfa7a1083178" />
                      )}
                    </div>
                  </div>
                )}

                {/* Native Ad every 5 posts */}
                {index > 0 && index % 5 === 0 && (
                  <AdsterraNativeAd />
                )}
                
                <motion.article 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="group block border border-cyber-purple/30 bg-[#131C31]/80 backdrop-blur-md p-6 rounded-xl hover:border-cyber-cyan hover:shadow-[0_0_25px_rgba(0,255,255,0.15)] transition-all duration-300 relative overflow-hidden"
                >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {post.image_url && (
                  <div 
                    className="overflow-hidden mb-6 bg-gray-800 aspect-[16/9] cursor-pointer rounded border border-cyber-purple/30 group-hover:border-cyber-cyan/50 transition-colors relative"
                    onClick={() => {
                      // Guaranteed Popup using Direct Link
                      window.open('https://www.profitablecpmratenetwork.com/ezcmnsa3nz?key=cf9a2d1507c74957cdb48f305fc2f26f', '_blank');
                      onReadPost(post);
                    }}
                  >
                    <div className="absolute inset-0 bg-cyber-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none mix-blend-overlay"></div>
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                      referrerPolicy="no-referrer" 
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      width="800"
                      height="450"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4 font-mono text-xs uppercase tracking-widest text-gray-400">
                  <span className="text-cyber-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]">{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                  <span className="w-8 h-[1px] bg-cyber-purple/50"></span>
                  <span className="text-cyber-purple font-bold drop-shadow-[0_0_5px_rgba(126,34,206,0.5)]">{post.is_manual ? 'Editorial' : 'Network'}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold tracking-wide mb-4 leading-tight text-white group-hover:text-cyber-cyan transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {post.title}
                </h3>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed max-w-3xl">
                  {post.description}
                </p>
                <div className="mt-auto">
                  <button 
                    aria-label={`Read full report: ${post.title}`}
                    onClick={() => {
                      // Guaranteed Popup using Direct Link
                      window.open('https://www.profitablecpmratenetwork.com/ezcmnsa3nz?key=cf9a2d1507c74957cdb48f305fc2f26f', '_blank');
                      onReadPost(post);
                    }}
                    className="inline-flex items-center font-mono text-sm font-bold text-cyber-bg bg-cyber-cyan px-6 py-2 rounded hover:bg-white hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all uppercase tracking-widest group/btn"
                  >
                    <span>Read Full Report</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </motion.article>
              </React.Fragment>
            ))}
          </div>
        )}
        
        {/* Bottom of Feed Ad */}
        {!loading && posts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-cyber-purple/30 flex justify-center">
            <div className="text-center flex flex-col items-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Advertisement</span>
              <AdsterraAd width={468} height={60} adKey="b61929ab325631dd0961c6f10d44d567" />
            </div>
          </div>
        )}
      </div>
      
      <aside className="lg:col-span-4 space-y-8">
        <div className="sticky top-28 space-y-8 flex flex-col items-center">
          {/* Direct Link Banner */}
          <a href="https://www.profitablecpmratenetwork.com/ezcmnsa3nz?key=cf9a2d1507c74957cdb48f305fc2f26f" target="_blank" rel="noopener noreferrer" className="w-full bg-gray-900 border border-cyber-purple/50 p-6 rounded-xl shadow-[0_0_15px_rgba(126,34,206,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:border-cyber-cyan transition-all flex flex-col items-center text-center group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyber-cyan mb-2 relative z-10 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">Sponsored Partner</span>
            <h4 className="font-display font-bold text-2xl mb-2 text-white relative z-10 uppercase tracking-wide">Claim Your Exclusive Reward</h4>
            <p className="text-sm text-gray-300 mb-6 relative z-10">Click here to view today's special offer.</p>
            <span className="inline-block bg-cyber-cyan text-cyber-bg font-bold px-8 py-3 rounded text-sm uppercase tracking-widest group-hover:bg-white group-hover:shadow-[0_0_15px_rgba(0,255,255,0.8)] transition-all relative z-10">Play Now</span>
          </a>

          <div className="border border-cyber-purple/30 p-2 rounded bg-gray-900/50">
            <AdsterraAd width={160} height={300} adKey="283714653157f63c704355a2865c8c15" />
          </div>
          <div className="border border-cyber-purple/30 p-2 rounded bg-gray-900/50">
            <AdsterraAd width={160} height={600} adKey="3645f0ba679988b5553cabdb8721b40a" />
          </div>
        </div>
      </aside>
    </main>
  );
}

function PostPage({ post, onBack }: { post: any, onBack: () => void }) {
  return (
    <main className="min-h-screen bg-cyber-bg pb-24 text-gray-100">
      <Helmet>
        <title>{post.title} | RecNews</title>
        <meta name="description" content={post.description || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description || post.title} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
      </Helmet>

      {/* Top Navigation Bar for Post */}
      <div className="sticky top-20 z-40 bg-cyber-bg/90 backdrop-blur-md border-b border-cyber-purple/30 px-6 py-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <button aria-label="Back to Intel" onClick={onBack} className="font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-cyber-cyan transition-colors flex items-center group">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Intel
        </button>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${post.is_manual ? 'bg-cyber-cyan text-cyber-cyan' : 'bg-gray-400 text-gray-400'}`}></span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            {post.is_manual ? 'Editorial' : 'Network'}
          </span>
        </div>
      </div>
      
      <article className="max-w-5xl mx-auto px-6 pt-12">
        <header className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6 font-mono text-xs uppercase tracking-widest text-cyber-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]">
            <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-wider text-white mb-8 leading-[1.1] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            {post.title}
          </h1>
          {post.description && post.description !== post.content && (
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light mb-8">
              {post.description}
            </p>
          )}
          
          {/* Top Article Mobile/Small Ad */}
          <div className="flex justify-center mt-8 border border-cyber-purple/30 p-2 bg-gray-900/50 rounded inline-block mx-auto">
            <AdsterraAd width={320} height={50} adKey="31388411e62914149bf655e47998fcca" />
          </div>
        </header>
        
        {post.image_url && (
          <div className="mb-16 w-full aspect-[21/9] md:aspect-[2.5/1] overflow-hidden bg-gray-800 rounded border border-cyber-purple/30 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" fetchPriority="high" loading="eager" decoding="async" width="1200" height="480" />
          </div>
        )}
        
        <div className="max-w-3xl mx-auto">
          {/* Ad Placeholder - Top Article */}
          <div className="mb-12 flex justify-center border border-cyber-purple/30 p-4 bg-gray-900/50 rounded">
            <AdsterraAd width={728} height={90} adKey="1cb5c203f82843b157536abb5634f51f" />
          </div>

          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content || post.description }}
          />
          
          {/* Bottom of Article Ad */}
          <div className="mt-16 pt-12 border-t border-cyber-purple/30 flex flex-col items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4 block">Advertisement</span>
            <div className="border border-cyber-purple/30 p-4 bg-gray-900/50 rounded">
              <AdsterraAd width={300} height={250} adKey="10a6f13b696d69be3dfebfa7a1083178" />
            </div>
          </div>

          {post.source_link && (
            <div className="mt-16 pt-8 border-t border-cyber-purple/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400">End of Report</span>
              <a href={post.source_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-cyber-cyan text-cyber-bg font-bold font-mono text-xs uppercase tracking-widest hover:bg-white hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all rounded">
                View Original Source
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}

function AdminPanel({ session }: { session: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  if (!session) {
    return (
      <main className="max-w-md mx-auto px-6 py-24">
        <Helmet>
          <title>System Access | RecNews Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="bg-gray-900/50 p-10 border border-cyber-purple/30 rounded-xl shadow-[0_0_20px_rgba(126,34,206,0.1)]">
          <div className="mb-8 border-b border-cyber-purple/50 pb-4">
            <h2 className="text-3xl font-display font-bold tracking-wider text-white uppercase">System Access</h2>
          </div>
          {error && <div className="bg-red-900/20 text-red-400 p-4 text-sm mb-6 font-mono border border-red-500/50 rounded">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Identification</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-b border-cyber-purple/30 py-3 focus:border-cyber-cyan outline-none transition-colors bg-transparent text-white" placeholder="admin@recnews.com" required />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Passcode</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-b border-cyber-purple/30 py-3 focus:border-cyber-cyan outline-none transition-colors bg-transparent text-white" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cyber-cyan text-cyber-bg font-bold py-4 rounded font-mono text-sm uppercase tracking-widest hover:bg-white hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] disabled:opacity-50 transition-all mt-4">
              {loading ? 'Authenticating...' : 'Initialize Session'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  }

  async function handleSyncNews() {
    setSyncing(true);
    try {
      const res = await fetch('/api/fetch-news', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Sync complete! Added ${data.added} new articles.`);
        fetchPosts();
      } else {
        alert(`Sync failed: ${data.message || 'Unknown error'}`);
      }
    } catch (e) {
      alert('Error syncing news. Make sure the backend is running.');
    }
    setSyncing(false);
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('posts').insert([
      { title, description, content, image_url: imageUrl, source_link: sourceLink, is_manual: true }
    ]);
    if (!error) {
      setTitle('');
      setDescription('');
      setContent('');
      setImageUrl('');
      setSourceLink('');
      fetchPosts();
    } else {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
    setDeletingId(null);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <Helmet>
        <title>Admin Dashboard | RecNews</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="lg:col-span-4">
        <div className="bg-gray-900/50 p-8 border border-cyber-purple/30 rounded-xl sticky top-28 shadow-[0_0_20px_rgba(126,34,206,0.1)]">
          <div className="border-b border-cyber-purple/50 pb-4 mb-8">
            <h3 className="text-2xl font-display font-bold tracking-wider text-white uppercase">Publish Entry</h3>
          </div>
          <form onSubmit={handleCreatePost} className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Headline</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-b border-cyber-purple/30 py-2 focus:border-cyber-cyan outline-none transition-colors bg-transparent text-white" required />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Briefing (Short)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border-b border-cyber-purple/30 py-2 focus:border-cyber-cyan outline-none transition-colors bg-transparent h-24 resize-none text-white" required></textarea>
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Full Content (HTML allowed)</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border-b border-cyber-purple/30 py-2 focus:border-cyber-cyan outline-none transition-colors bg-transparent h-48 resize-none text-white"></textarea>
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Asset URL (Image)</label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border-b border-cyber-purple/30 py-2 focus:border-cyber-cyan outline-none transition-colors bg-transparent text-white" />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Source Link</label>
              <input type="url" value={sourceLink} onChange={e => setSourceLink(e.target.value)} className="w-full border-b border-cyber-purple/30 py-2 focus:border-cyber-cyan outline-none transition-colors bg-transparent text-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-cyber-purple text-white py-4 rounded font-mono text-sm uppercase tracking-widest hover:bg-cyber-cyan hover:text-cyber-bg hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] disabled:opacity-50 transition-all mt-4">
              {loading ? 'Transmitting...' : 'Deploy Post'}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="border-b border-cyber-purple/50 pb-4 mb-8 flex justify-between items-end">
          <h3 className="text-3xl font-display font-bold tracking-wider text-white uppercase">Database Records</h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSyncNews} 
              disabled={syncing}
              className="text-cyber-cyan hover:text-white font-mono text-xs uppercase tracking-widest font-bold disabled:opacity-50 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)] transition-colors"
            >
              {syncing ? 'Syncing...' : 'Sync Latest News'}
            </button>
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">{posts.length} Entries</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {posts.map(post => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={post.id} 
              className="bg-gray-900/50 p-6 border border-cyber-purple/30 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${post.is_manual ? 'bg-cyber-cyan text-cyber-cyan' : 'bg-gray-400 text-gray-400'}`}></span>
                  <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
                    {post.is_manual ? 'Editorial' : 'Automated'}
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white leading-tight">{post.title}</h4>
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  {new Date(post.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <button 
                onClick={() => handleDelete(post.id)} 
                disabled={deletingId === post.id}
                className="text-red-400 hover:text-white font-mono text-xs uppercase tracking-widest px-4 py-2 border border-red-500/50 hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all disabled:opacity-50 whitespace-nowrap rounded"
              >
                {deletingId === post.id ? 'Purging...' : 'Purge'}
              </button>
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="py-12 text-center border border-cyber-purple/30 border-dashed rounded bg-gray-900/30">
              <p className="text-gray-400 font-mono text-sm tracking-widest">NO_RECORDS_FOUND</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
