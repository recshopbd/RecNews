import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Supabase client for the server
// The backend needs the SERVICE_ROLE_KEY to bypass Row Level Security (RLS) when inserting automated posts.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ueyggkgbdedfjvreqkmm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'missing_anon_key_please_set_in_secrets';
const supabase = createClient(supabaseUrl, supabaseKey);

// Auto-fetch logic using a free RSS to JSON converter for Polygon's gaming news
async function fetchGamingNews() {
  console.log('Fetching latest gaming news...');
  if (supabaseKey === 'missing_anon_key_please_set_in_secrets') {
    console.log('Skipping fetch: Supabase Keys are missing.');
    return { success: false, message: 'Supabase Keys are missing in AI Studio Secrets.' };
  }

  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.polygon.com/rss/index.xml');
    const data = await response.json();

    if (data.status === 'ok' && data.items) {
      let addedCount = 0;
      for (const item of data.items) {
        // Check if post exists
        const { data: existing, error: selectError } = await supabase
          .from('posts')
          .select('id')
          .eq('title', item.title)
          .limit(1);

        if (selectError) {
          console.error('Select error:', selectError);
          return { success: false, message: `DB Read Error: ${selectError.message}. Did you run the SQL schema?` };
        }

        if (!existing || existing.length === 0) {
          // Extract image from description if thumbnail is missing
          const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
          const imageUrl = item.thumbnail || (imgMatch ? imgMatch[1] : '');

          // Clean HTML tags from description
          const cleanDesc = item.description.replace(/<[^>]*>?/gm, '').substring(0, 250) + '...';

          // Format date safely for Postgres
          let safeDate = new Date().toISOString();
          try {
            if (item.pubDate) {
              safeDate = new Date(item.pubDate).toISOString();
            }
          } catch (e) {
            console.log('Date parsing error, using current time');
          }

          const { error: insertError } = await supabase.from('posts').insert({
            title: item.title,
            description: cleanDesc,
            image_url: imageUrl,
            source_link: item.link,
            published_at: safeDate,
            is_manual: false
          });

          if (insertError) {
            console.error('Insert error details:', JSON.stringify(insertError, null, 2));
            return { 
              success: false, 
              message: `DB Write Error: ${insertError.message || 'Unknown error'}. Check server logs for details. If this is an RLS error, you MUST add SUPABASE_SERVICE_ROLE_KEY to your secrets.` 
            };
          }

          addedCount++;
        }
      }
      console.log(`Successfully added ${addedCount} new gaming articles.`);
      return { success: true, added: addedCount };
    }
    return { success: false, message: 'Failed to parse news feed from Polygon.' };
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return { success: false, message: error.message || 'Unknown server error' };
  }
}

// Run every 3 hours (1000 * 60 * 60 * 3)
setInterval(fetchGamingNews, 3 * 60 * 60 * 1000);

// API Endpoint to trigger fetch manually from the Admin Panel
app.post('/api/fetch-news', async (req, res) => {
  const result = await fetchGamingNews();
  res.json(result);
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Do an initial fetch on startup
    fetchGamingNews();
  });
}

startServer();
