import { useState } from 'react';

export function BackendGenerateButton() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    'https://son1kverse-backend.railway.app';

  async function generate() {
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      // ✅ Usar endpoint correcto del backend
      const res = await fetch(`${BACKEND_URL}/api/generation/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_SECRET || 'dev-token'}`
        },
        body: JSON.stringify({ 
          prompt,
          style: 'pop',
          duration: 120,
          quality: 'standard'
        })
      });
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Create failed: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      
      if (!data.success || !data.data?.generationId) {
        throw new Error(data.error?.message || 'Failed to create generation');
      }
      
      const { generationId, sunoId } = data.data;
      const started = Date.now();
      const timeout = 300000; // 5 minutos
      
      while (Date.now() - started < timeout) {
        const s = await fetch(`${BACKEND_URL}/api/generation/${generationId}/status`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_SECRET || 'dev-token'}`
          }
        });
        if (!s.ok) throw new Error(`Status failed: ${s.status}`);
        const j = await s.json();
        
        if (j.success && j.data) {
          if (j.data.status === 'completed' && j.data.audioUrl) {
            setAudioUrl(j.data.audioUrl);
            return;
          }
          if (j.data.status === 'failed') {
            throw new Error(j.data.error || 'Generation failed');
          }
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
      throw new Error('Timeout - generation took too long');
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <textarea
        placeholder="Prompt para backend"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', height: 80, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 8 }}
      />
      <button onClick={generate} disabled={loading || !prompt} style={{ marginTop: 8, backgroundColor: '#00FFE7', color: '#0A0C10', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
        {loading ? 'Generando...' : 'Generar (Backend)'}
      </button>
      {error && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{error}</div>}
      {audioUrl && (
        <div style={{ marginTop: 12 }}>
          <audio controls src={audioUrl} style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}
