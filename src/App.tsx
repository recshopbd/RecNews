/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import AdsterraAd from './components/AdsterraAd';
import AdsterraNativeAd from './components/AdsterraNativeAd';

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'admin'
  const [session, setSession] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-electric selection:text-white relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#FAFAFA]">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-display font-bold tracking-tighter cursor-pointer" 
            onClick={() => { setView('home'); setSelectedPost(null); }}
          >
            RecNews<span className="text-electric">.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-8 items-center font-mono text-xs uppercase tracking-widest"
          >
            <a href="https://www.profitablecpmratenetwork.com/ezcmnsa3nz?key=cf9a2d1507c74957cdb48f305fc2f26f" target="_blank" rel="noopener noreferrer" className="text-electric font-bold hover:text-blue-700 transition-colors flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"></path></svg>
              Hot Offer
            </a>
            <button onClick={() => { setView('home'); setSelectedPost(null); }} className={`transition-colors ${view === 'home' ? 'text-electric font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}>Home</button>
            <button onClick={() => setView('admin')} className={`transition-colors ${view === 'admin' ? 'text-electric font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}>Admin</button>
            {session && (
              <button onClick={() => supabase.auth.signOut()} className="text-red-500 hover:text-red-700 transition-colors">Sign Out</button>
            )}
          </motion.div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {view === 'home' && !selectedPost ? (
          <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <HomePage onReadPost={setSelectedPost} />
          </motion.div>
        ) : view === 'home' && selectedPost ? (
          <motion.div key="post" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <PostPage post={selectedPost} onBack={() => setSelectedPost(null)} />
          </motion.div>
        ) : (
          <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <AdminPanel session={session} />
          </motion.div>
        )}
      </AnimatePresence>
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
        <div className="border-b-2 border-zinc-900 pb-4 mb-8">
          <h2 className="text-5xl font-display font-bold tracking-tighter text-zinc-900">Latest Intel</h2>
        </div>
        
        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] bg-zinc-200 mb-6"></div>
                <div className="h-10 bg-zinc-200 w-3/4 mb-4"></div>
                <div className="h-4 bg-zinc-200 w-full mb-2"></div>
                <div className="h-4 bg-zinc-200 w-2/3"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center border border-zinc-200 border-dashed">
            <p className="text-zinc-500 font-mono text-sm">SYSTEM_OFFLINE: Awaiting Supabase Anon Key connection.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {posts.map((post, index) => (
              <React.Fragment key={post.id}>
                {/* In-feed Ad every 3 posts */}
                {index > 0 && index % 3 === 0 && (
                  <div className="mb-16 py-8 border-y border-zinc-200/50 bg-white/50 backdrop-blur-sm flex justify-center">
                    <div className="text-center w-full flex flex-col items-center">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-2 block">Advertisement</span>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group block border-b border-zinc-200 pb-16 last:border-0"
                >
                {post.image_url && (
                  <div className="overflow-hidden mb-6 bg-zinc-100 aspect-[16/9]">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
                  <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                  <span className="w-8 h-[1px] bg-zinc-300"></span>
                  <span className="text-electric">{post.is_manual ? 'Editorial' : 'Network'}</span>
                </div>
                <h3 className="text-4xl font-display font-bold tracking-tight mb-4 leading-tight group-hover:text-electric transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-lg text-zinc-600 mb-6 leading-relaxed max-w-3xl">
                  {post.description}
                </p>
                <div className="mt-auto">
                  <button 
                    onClick={() => onReadPost(post)}
                    className="inline-flex items-center font-mono text-sm font-semibold text-zinc-900 hover:text-electric transition-colors uppercase tracking-wider"
                  >
                    Read Full Report 
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </motion.article>
              </React.Fragment>
            ))}
          </div>
        )}
        
        {/* Bottom of Feed Ad */}
        {!loading && posts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-zinc-200 flex justify-center">
            <div className="text-center flex flex-col items-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-2 block">Advertisement</span>
              <AdsterraAd width={468} height={60} adKey="b61929ab325631dd0961c6f10d44d567" />
            </div>
          </div>
        )}
      </div>
      
      <aside className="lg:col-span-4 space-y-8">
        <div className="sticky top-28 space-y-8 flex flex-col items-center">
          {/* Direct Link Banner */}
          <a href="https://www.profitablecpmratenetwork.com/ezcmnsa3nz?key=cf9a2d1507c74957cdb48f305fc2f26f" target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-br from-electric to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center text-center group">
            <span className="font-mono text-xs uppercase tracking-widest opacity-80 mb-2">Sponsored Partner</span>
            <h4 className="font-display font-bold text-xl mb-2 group-hover:underline">Claim Your Exclusive Reward</h4>
            <p className="text-sm opacity-90 mb-4">Click here to view today's special offer.</p>
            <span className="inline-block bg-white text-electric font-bold px-6 py-2 rounded-full text-sm uppercase tracking-wider">Play Now</span>
          </a>

          <AdsterraAd width={160} height={300} adKey="283714653157f63c704355a2865c8c15" />
          <AdsterraAd width={160} height={600} adKey="3645f0ba679988b5553cabdb8721b40a" />
        </div>
      </aside>
    </main>
  );
}

function PostPage({ post, onBack }: { post: any, onBack: () => void }) {
  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Top Navigation Bar for Post */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-electric transition-colors flex items-center group">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Intel
        </button>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${post.is_manual ? 'bg-electric' : 'bg-zinc-300'}`}></span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
            {post.is_manual ? 'Editorial' : 'Network'}
          </span>
        </div>
      </div>
      
      <article className="max-w-5xl mx-auto px-6 pt-12">
        <header className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
            <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter text-zinc-900 mb-8 leading-[1.1]">
            {post.title}
          </h1>
          {post.description && post.description !== post.content && (
            <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed font-light mb-8">
              {post.description}
            </p>
          )}
          
          {/* Top Article Mobile/Small Ad */}
          <div className="flex justify-center mt-8">
            <AdsterraAd width={320} height={50} adKey="31388411e62914149bf655e47998fcca" />
          </div>
        </header>
        
        {post.image_url && (
          <div className="mb-16 w-full aspect-[21/9] md:aspect-[2.5/1] overflow-hidden bg-zinc-100 rounded-sm">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
        
        <div className="max-w-3xl mx-auto">
          {/* Ad Placeholder - Top Article */}
          <div className="mb-12 flex justify-center">
            <AdsterraAd width={728} height={90} adKey="1cb5c203f82843b157536abb5634f51f" />
          </div>

          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content || post.description }}
          />
          
          {/* Bottom of Article Ad */}
          <div className="mt-16 pt-12 border-t border-zinc-200 flex flex-col items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-4 block">Advertisement</span>
            <AdsterraAd width={300} height={250} adKey="10a6f13b696d69be3dfebfa7a1083178" />
          </div>

          {post.source_link && (
            <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">End of Report</span>
              <a href={post.source_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-zinc-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-electric transition-colors">
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
        <div className="bg-white p-10 border border-zinc-200 shadow-2xl shadow-zinc-200/50">
          <div className="mb-8 border-b-2 border-zinc-900 pb-4">
            <h2 className="text-3xl font-display font-bold tracking-tighter">System Access</h2>
          </div>
          {error && <div className="bg-red-50 text-red-600 p-4 text-sm mb-6 font-mono border border-red-100">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">Identification</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-b border-zinc-300 py-3 focus:border-electric outline-none transition-colors bg-transparent text-zinc-900" placeholder="admin@recnews.com" required />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">Passcode</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-b border-zinc-300 py-3 focus:border-electric outline-none transition-colors bg-transparent text-zinc-900" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white py-4 font-mono text-sm uppercase tracking-widest hover:bg-electric disabled:opacity-50 transition-colors mt-4">
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
      <div className="lg:col-span-4">
        <div className="bg-white p-8 border border-zinc-200 sticky top-28 shadow-xl shadow-zinc-200/30">
          <div className="border-b-2 border-zinc-900 pb-4 mb-8">
            <h3 className="text-2xl font-display font-bold tracking-tighter">Publish Entry</h3>
          </div>
          <form onSubmit={handleCreatePost} className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">Headline</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-b border-zinc-300 py-2 focus:border-electric outline-none transition-colors bg-transparent" required />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">Briefing (Short)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border-b border-zinc-300 py-2 focus:border-electric outline-none transition-colors bg-transparent h-24 resize-none" required></textarea>
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">Full Content (HTML allowed)</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border-b border-zinc-300 py-2 focus:border-electric outline-none transition-colors bg-transparent h-48 resize-none"></textarea>
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">Asset URL (Image)</label>
              <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border-b border-zinc-300 py-2 focus:border-electric outline-none transition-colors bg-transparent" />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">Source Link</label>
              <input type="url" value={sourceLink} onChange={e => setSourceLink(e.target.value)} className="w-full border-b border-zinc-300 py-2 focus:border-electric outline-none transition-colors bg-transparent" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white py-4 font-mono text-sm uppercase tracking-widest hover:bg-electric disabled:opacity-50 transition-colors mt-4">
              {loading ? 'Transmitting...' : 'Deploy Post'}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="border-b-2 border-zinc-900 pb-4 mb-8 flex justify-between items-end">
          <h3 className="text-3xl font-display font-bold tracking-tighter">Database Records</h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSyncNews} 
              disabled={syncing}
              className="text-electric hover:text-blue-700 font-mono text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Latest News'}
            </button>
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">{posts.length} Entries</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {posts.map(post => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={post.id} 
              className="bg-white p-6 border border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-400 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-2 h-2 rounded-full ${post.is_manual ? 'bg-electric' : 'bg-zinc-300'}`}></span>
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    {post.is_manual ? 'Editorial' : 'Automated'}
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-zinc-900 leading-tight">{post.title}</h4>
                <p className="text-xs text-zinc-500 mt-2 font-mono">
                  {new Date(post.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <button 
                onClick={() => handleDelete(post.id)} 
                disabled={deletingId === post.id}
                className="text-red-500 hover:text-white font-mono text-xs uppercase tracking-widest px-4 py-2 border border-red-200 hover:bg-red-500 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {deletingId === post.id ? 'Purging...' : 'Purge'}
              </button>
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="py-12 text-center border border-zinc-200 border-dashed">
              <p className="text-zinc-500 font-mono text-sm">NO_RECORDS_FOUND</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
