'use client';

import { useState, useEffect } from 'react';

type UserItem = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

export default function GuestbookSection() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed fetching users:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Silakan isi email!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Berhasil disimpan ke database Supabase via Prisma!' });
        setName('');
        setEmail('');
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: `❌ Gagal: ${data.error}` });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: '❌ Terjadi kesalahan jaringan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-3xl border border-purple-500/20 shadow-2xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Database Playground</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Supabase Guestbook Demo</h2>
          <p className="text-xs text-slate-400 mt-1">
            Uji coba langsung simpan dan baca data dari PostgreSQL Supabase melalui Prisma ORM.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={fetching}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700 flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <span className={fetching ? 'animate-spin' : ''}>🔄</span> Refresh Data
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Form Add User */}
        <div className="md:col-span-5 space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-purple-300">Tambah Data Baru ke Supabase</h3>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Brimas Pradika"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email <span className="text-purple-400">*</span></label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan ke Supabase...
                </>
              ) : (
                '🚀 Simpan ke Database'
              )}
            </button>
          </form>
        </div>

        {/* Live List from Supabase */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">
              Data Tersimpan di Supabase ({users.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">table: public.User</span>
          </div>

          {fetching ? (
            <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <span className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
              Mengambil data dari Supabase...
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 px-4 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-2">
              <span className="text-2xl block">📦</span>
              <p className="text-xs text-slate-400 font-medium">Belum ada data tersimpan</p>
              <p className="text-[11px] text-slate-500">Coba isi form di samping untuk menguji simpan data ke Supabase!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white">
                      {user.name || 'Anonymous Guest'}
                    </p>
                    <p className="text-[11px] text-purple-300/80 font-mono">{user.email}</p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono text-right">
                    {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
