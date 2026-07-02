import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Key, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginView() {
  const { login, authProviderDisabled } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (authProviderDisabled) {
      setError('ATTENZIONE: Il metodo di accesso "Email/Password" è disabilitato in Firebase Console. Abilitalo in Authentication > Sign-in method per accedere.');
    }
  }, [authProviderDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        setError('ATTENZIONE: Il metodo di accesso "Email/Password" è disabilitato in Firebase Console. Abilitalo in Authentication > Sign-in method.');
      } else {
        setError('Credenziali non valide. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = () => {
    setUsername('admin');
    setPassword('boscatello');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl p-8 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="bg-zinc-100 dark:bg-white/5 text-emerald-600 dark:text-brand-green p-3 rounded-xl inline-block border border-zinc-200 dark:border-white/10">
            <Lock size={26} />
          </div>
          <h2 className="font-sans font-black text-xl uppercase text-zinc-900 dark:text-white tracking-tight">
            Accedi come Amministratore
          </h2>
          <p className="font-sans text-xs text-zinc-500 dark:text-white/40">
            Inserisci le credenziali per gestire il torneo e i risultati
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold p-3.5 rounded-xl space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
            {error.includes("Firebase Console") && (
              <div className="text-[11px] text-zinc-500 dark:text-white/60 font-sans border-t border-red-500/10 dark:border-white/5 pt-2 mt-1 leading-relaxed">
                Clicca qui per accedere direttamente al pannello di controllo Firebase ed abilitare il provider di posta elettronica:
                <a 
                  href="https://console.firebase.google.com/project/gen-lang-client-0917903987/authentication/providers" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block mt-1.5 font-black text-emerald-600 dark:text-brand-green underline hover:text-emerald-700 dark:hover:text-brand-green/80"
                >
                  Abilita Email/Password in Firebase Console ↗
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-white/40">
              Username o Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white/30" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 font-sans text-xs uppercase font-bold tracking-wider outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-white transition-all placeholder-zinc-400 dark:placeholder-white/20"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-white/40">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white/30" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 font-sans text-xs uppercase font-bold tracking-wider outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-white transition-all placeholder-zinc-400 dark:placeholder-white/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 dark:bg-brand-green hover:bg-emerald-700 dark:hover:bg-brand-green/80 text-white dark:text-black font-sans font-black uppercase tracking-widest py-3.5 rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="border-t border-zinc-100 dark:border-white/5 pt-5 text-center space-y-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-white/40">
            Credenziali demo per test
          </p>
          <div className="bg-zinc-50 dark:bg-black/40 p-3 rounded border border-zinc-150 dark:border-white/5 flex justify-between items-center text-[10px]">
            <div className="text-left font-mono space-y-0.5 text-zinc-500 dark:text-white/60">
              <div>User: <span className="font-black text-zinc-700 dark:text-white">admin</span></div>
              <div>Pass: <span className="font-black text-zinc-700 dark:text-white">boscatello</span></div>
            </div>
            <button
              onClick={handleFillCredentials}
              className="bg-emerald-50 dark:bg-brand-green/10 text-emerald-600 dark:text-brand-green border border-emerald-500/10 dark:border-brand-green/20 px-3 py-1.5 rounded uppercase font-black tracking-wide text-[10px] hover:bg-emerald-100 dark:hover:bg-brand-green/20 transition-colors"
            >
              Compila
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
