import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyIcon, Lock, Unlock } from 'lucide-react';

export function Login() {
  const { t, i18n } = useTranslation();
  const { hasEncryptedToken, loginNew, loginWithPassword, isLoading, error, isAuthenticated, checkExistingToken } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [pat, setPat] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    checkExistingToken();
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, checkExistingToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (hasEncryptedToken) {
      success = await loginWithPassword(password);
    } else {
      success = await loginNew(pat, password);
    }

    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}
          className="text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors p-2 px-3 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 font-bold text-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur"
          title={t('app.toggleLanguage')}
        >
          {i18n.language === 'en' ? '中' : 'En'}
        </button>
      </div>

      <div className="z-10 w-full max-w-md bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10 text-3xl">
            ⭐
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">{t('app.title')}<span className="text-indigo-400">{t('app.titleSuffix')}</span></h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            {t('login.desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!hasEncryptedToken && (
            <div className="space-y-2 group">
              <div className="flex justify-between items-end pl-1 pr-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-sans">
                  {t('login.tokenLabel')}
                </label>
                <a 
                  href="https://github.com/settings/tokens?type=beta" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                  tabIndex={-1}
                >
                  Get Token ↗
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-4 w-4 text-slate-500 dark:text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <Input
                  type="password"
                  value={pat}
                  onChange={(e) => setPat(e.target.value)}
                  placeholder={t('login.tokenPlaceholder')}
                  className="pl-10 bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-indigo-500 h-12"
                  required
                />
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-zinc-500 pl-1 leading-snug">
                <span className="font-semibold text-slate-500 dark:text-zinc-400">{t('login.createPatDesc')}</span> <code className="text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded mx-0.5">repo</code> {t('login.createPatDesc1')} <code className="text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded mx-0.5">read:user</code> {t('login.createPatDesc2')}
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2 mt-2">
                <p className="text-[10px] text-red-400 leading-snug font-medium">
                  {t('login.warningText1')}<br/>
                  {t('login.warningText2')}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2 group">
            <div className="flex justify-between items-end pl-1 pr-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-sans">
                {t('login.passkeyLabel')}
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {hasEncryptedToken ? (
                  <Unlock className="h-4 w-4 text-slate-500 dark:text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-500 dark:text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                )}
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={hasEncryptedToken ? "Enter your passkey to decrypt" : "Used to encrypt PAT locally"}
                className="pl-10 bg-slate-50/50 dark:bg-zinc-950/50 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-indigo-500 h-12"
                required
              />
            </div>
            {!hasEncryptedToken && (
              <p className="text-[10.5px] text-slate-500 dark:text-zinc-500 pl-1 leading-snug">
                {t('login.passkeyDesc')}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 bg-indigo-500 hover:bg-indigo-400 text-slate-900 dark:text-white font-semibold tracking-wide rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
            disabled={isLoading}
          >
            {isLoading 
              ? t('login.verifying')
              : (hasEncryptedToken ? t('login.unlockVault') : t('login.encryptPat'))}
          </Button>

          {!hasEncryptedToken && (
            <p className="text-xs text-center text-slate-500 dark:text-zinc-500 mt-4 px-4 leading-relaxed">
              {i18n.language === 'en' 
                ? <>Your PAT is stored securely via <span className="text-slate-700 dark:text-zinc-300">AES-GCM encryption</span> in your browser's local storage. Not a single string is sent to our own backend.</>
                : <>您的 PAT 通过 <span className="text-slate-700 dark:text-zinc-300">AES-GCM</span> 加密安全地存储在浏览器的本地缓存中。我们不会向任何后端发出哪怕一个字符的代码。</>}
            </p>
          )}

          {hasEncryptedToken && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Resetting will delete your local encrypted token. Proceed?")) {
                    localStorage.removeItem('abandon_old_love_secure_token');
                    window.location.reload();
                  }
                }}
                className="text-xs font-semibold text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:text-zinc-300 underline underline-offset-4"
              >
                {t('login.resetVault')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
