import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useStarsStore } from '@/store/starsStore';
import type { Repository } from '@/store/starsStore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, Star, ExternalLink, Calendar, GitCommitHorizontal, Loader2, Search, Trash2, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { getDaysSince } from '@/utils/date';

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { userProfile, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { stars, pageInfo, isLoading, isFetchingMore, totalFetched, totalStars, error, fetchInitialStars, fetchMoreStars, pendingUnstars, unstarRepo, unstarProgress, batchUnstar } = useStarsStore();

  const [sortField, setSortField] = useState<'pushedAt' | 'updatedAt'>('pushedAt');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [thresholdDays, setThresholdDays] = useState<number>(365);

  const [repoToUnstar, setRepoToUnstar] = useState<Repository | null>(null);
  const [batchUnstarConfirm, setBatchUnstarConfirm] = useState<Repository[] | null>(null);

  useEffect(() => {
    fetchInitialStars();
  }, [fetchInitialStars]);

  const filteredAndSortedStars = [...stars]
    .filter(star => star.name.toLowerCase().includes(searchQuery.toLowerCase()) || star.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate matching targets for Batch Unstar
  const targetReposForBatch = filteredAndSortedStars.filter(star => getDaysSince(star[sortField]) >= thresholdDays);

  const handleBatchUnstar = () => {
    if (targetReposForBatch.length === 0) return;
    setBatchUnstarConfirm(targetReposForBatch);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 space-y-6 relative">
      {/* Batch Processing Overlay */}
      {unstarProgress && createPortal(
        <div className="fixed inset-0 z-[999] bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-2 animate-pulse">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('progress.title')}</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">{t('progress.removing')} <span className="text-slate-800 dark:text-zinc-200 font-mono">{unstarProgress.currentRepo}</span></p>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-zinc-500">
                <span>{t('progress.done', { count: unstarProgress.completed })}</span>
                <span>{t('progress.remaining', { count: unstarProgress.total - unstarProgress.completed })}</span>
              </div>
              <Progress value={(unstarProgress.completed / unstarProgress.total) * 100} className="h-3" />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Single Unstar Confirmation Overlay */}
      {repoToUnstar && createPortal(
        <div className="fixed inset-0 z-[999] bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shrink-0 mb-2">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="text-center w-full">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('modal.single.title')}</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">{t('modal.single.desc')}</p>

              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl text-left w-full max-h-40 overflow-y-auto">
                <p className="text-indigo-400 font-semibold text-sm mb-1">{repoToUnstar.owner.login} / {repoToUnstar.name}</p>
                <p className="text-xs text-slate-500 dark:text-zinc-500 line-clamp-3 leading-relaxed">{repoToUnstar.description || t('modal.single.noDesc')}</p>
              </div>
            </div>

            <div className="w-full flex gap-3 pt-2">
              <Button onClick={() => setRepoToUnstar(null)} variant="outline" className="flex-1 bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700">
                {t('modal.single.cancel')}
              </Button>
              <Button
                onClick={() => {
                  unstarRepo(repoToUnstar.id);
                  setRepoToUnstar(null);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white shadow-lg shadow-red-500/20"
              >
                {t('modal.single.confirm')}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Batch Unstar Confirmation Overlay */}
      {batchUnstarConfirm && createPortal(
        <div className="fixed inset-0 z-[999] bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 md:p-8 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col items-center space-y-6 max-h-[85vh]">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shrink-0">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="text-center w-full flex-1 min-h-0 flex flex-col">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 shrink-0">{t('modal.batch.title')}</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4 shrink-0">{t('modal.batch.desc', { count: batchUnstarConfirm.length })}</p>

              <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-left w-full overflow-y-auto flex-1 min-h-0 shadow-inner">
                <ul className="divide-y divide-slate-200/50 dark:divide-zinc-800/50 p-2">
                  {batchUnstarConfirm.map(repo => (
                    <li key={repo.id} className="p-3 hover:bg-white/50 dark:bg-zinc-900/50 rounded-lg transition-colors">
                      <p className="text-indigo-400 font-semibold text-sm mb-1">{repo.owner.login} / {repo.name}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500 line-clamp-2 leading-relaxed">{repo.description || t('modal.single.noDesc')}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full flex gap-3 pt-2 shrink-0">
              <Button onClick={() => setBatchUnstarConfirm(null)} variant="outline" className="flex-1 bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700">
                {t('modal.single.cancel')}
              </Button>
              <Button
                onClick={() => {
                  batchUnstar(batchUnstarConfirm.map(r => ({ id: r.id, name: r.name })));
                  setBatchUnstarConfirm(null);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white shadow-lg shadow-red-500/20"
              >
                {t('modal.batch.execute', { count: batchUnstarConfirm.length })}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center ring-1 ring-white/10 shadow-inner">
            <Star className="w-5 h-5 text-indigo-400 fill-indigo-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t('app.title')}<span className="text-indigo-400">{t('app.titleSuffix')}</span></h1>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium tracking-wide">{t('app.subtitle')}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium tracking-wide">{t('app.intro1')}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium tracking-wide">{t('app.intro2')}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium tracking-wide">{t('app.intro3')}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium tracking-wide">{t('app.intro4')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/50 dark:bg-zinc-900/50 p-2 pr-4 rounded-full border border-slate-200/50 dark:border-zinc-800/50">
          {userProfile?.avatarUrl && (
            <img src={userProfile.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-300 dark:border-zinc-700 pointer-events-none" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-100 leading-tight">{userProfile?.name || userProfile?.login}</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 leading-tight">@{userProfile?.login}</span>
          </div>
          <div className="w-px h-8 bg-slate-100 dark:bg-zinc-800 mx-2"></div>
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}
            className="text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors p-2 px-3 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 font-bold text-sm"
            title={t('app.toggleLanguage')}
          >
            {i18n.language === 'en' ? '中' : 'En'}
          </button>
          <button
            onClick={toggleTheme}
            className="text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800"
            title={t('app.toggleTheme')}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={logout}
            className="text-slate-500 dark:text-zinc-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
            title={t('app.logout')}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        {/* Controls Bar */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between bg-white/40 dark:bg-zinc-900/40 p-4 border border-slate-200/50 dark:border-zinc-800/50 rounded-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-zinc-500" />
              <Input
                placeholder={t('dashboard.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 focus-visible:ring-indigo-500 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-zinc-400 font-medium whitespace-nowrap hidden md:block">{t('dashboard.computeBy')}</span>
              <div className="flex bg-slate-50 dark:bg-zinc-950 rounded-xl p-1 border border-slate-200 dark:border-zinc-800">
                <button
                  onClick={() => setSortField('pushedAt')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${sortField === 'pushedAt' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:text-zinc-300'}`}
                >
                  {t('dashboard.filters.pushedAt')}
                </button>
                <button
                  onClick={() => setSortField('updatedAt')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${sortField === 'updatedAt' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:text-zinc-300'}`}
                >
                  {t('dashboard.filters.updatedAt')}
                </button>
              </div>

              <button
                onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="bg-slate-50 dark:bg-zinc-950 px-3 py-1 h-8 text-xs font-semibold text-slate-500 dark:text-zinc-400 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:bg-zinc-800 hover:text-slate-800 dark:text-zinc-200 flex items-center transition-all shadow-sm"
                title="Toggle Sort Order"
              >
                {sortDirection === 'desc' ? '▼ Newest' : '▲ Oldest'}
              </button>
            </div>
          </div>

          <div className="w-px hidden xl:block bg-slate-100 dark:bg-zinc-800 mx-2"></div>

          {/* Batch Unstar Engine Section */}
          <div className="flex items-center gap-3 w-full xl:w-auto p-2 xl:p-0 bg-red-950/10 xl:bg-transparent rounded-xl border border-red-900/20 xl:border-transparent">
            <span className="text-sm text-slate-500 dark:text-zinc-400 font-medium whitespace-nowrap pl-2">{t('dashboard.massUnstarDesc')} {'>='}</span>
            <Input
              type="number"
              min="1"
              value={thresholdDays}
              onChange={(e) => setThresholdDays(parseInt(e.target.value) || 0)}
              className="w-20 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-center font-mono text-slate-800 dark:text-zinc-200 h-9 rounded-lg focus-visible:ring-red-500"
            />
            <span className="text-sm text-slate-500 dark:text-zinc-400 font-medium whitespace-nowrap pr-2">{t('dashboard.daysOld')}</span>

            <Button
              onClick={handleBatchUnstar}
              disabled={targetReposForBatch.length === 0 || unstarProgress !== null}
              className={`h-9 px-6 font-semibold tracking-wide rounded-lg transition-all ${targetReposForBatch.length > 0 ? 'bg-red-500 hover:bg-red-400 text-slate-900 dark:text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500'}`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('dashboard.executeMassUnstar')} ({targetReposForBatch.length})
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/30 dark:bg-zinc-900/30 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          {isLoading && stars.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 dark:text-zinc-400 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="animate-pulse">{t('dashboard.pulling')}</p>
            </div>
          ) : error && stars.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-12 text-red-400 text-center">
              <p>{t('dashboard.error')}<br /><span className="text-sm opacity-70">{error}</span></p>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              {/* Top Pagination / Status Bar */}
              <div className="p-3 px-4 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 flex items-center justify-between z-10 shrink-0">
                <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium tracking-wide">
                  {t('dashboard.status.showing')} <span className="text-slate-700 dark:text-zinc-300">{filteredAndSortedStars.length}</span> / {totalFetched} {t('dashboard.status.loaded')}
                  {totalStars !== null && <span className="ml-1 opacity-75">({t('dashboard.status.totalStars')} <span className="text-slate-700 dark:text-zinc-300 font-bold">{totalStars}</span>)</span>}
                </p>
                {pageInfo.hasNextPage && (
                  <Button
                    onClick={fetchMoreStars}
                    disabled={isFetchingMore || unstarProgress !== null}
                    variant="outline"
                    size="sm"
                    className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 shadow-sm h-8 px-4"
                  >
                    {isFetchingMore ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : null}
                    {isFetchingMore ? t('dashboard.pulling') : t('dashboard.loadMore')}
                  </Button>
                )}
              </div>

              <div className="overflow-x-auto flex-1 min-h-[400px]">
                <Table>
                  <TableHeader className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md sticky top-0 z-10 shadow-sm border-b border-slate-200 dark:border-zinc-800">
                    <TableRow className="border-0 hover:bg-transparent">
                      <TableHead className="w-1/3 text-slate-500 dark:text-zinc-400 font-semibold py-4">{t('dashboard.table.repo')}</TableHead>
                      <TableHead className="text-slate-500 dark:text-zinc-400 font-semibold"><div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> {t('dashboard.table.stars')}</div></TableHead>
                      <TableHead className="text-slate-500 dark:text-zinc-400 font-semibold"><div className="flex items-center gap-1.5"><GitCommitHorizontal className="w-4 h-4" /> {t('dashboard.table.lastPush')}</div></TableHead>
                      <TableHead className="text-slate-500 dark:text-zinc-400 font-semibold"><div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {t('dashboard.table.lastUpdate')}</div></TableHead>
                      <TableHead className="text-right text-slate-500 dark:text-zinc-400 font-semibold pr-6">{t('dashboard.table.action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedStars.length === 0 ? (
                      <TableRow className="border-0 hover:bg-transparent">
                        <TableCell colSpan={5} className="text-center py-24 text-slate-500 dark:text-zinc-500 border-0">
                          <p className="text-lg font-medium mb-1">No repositories found.</p>
                          <p className="text-sm">Try adjusting your search terms or pulling more data.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedStars.map((repo) => {
                        const isPending = pendingUnstars.includes(repo.id);
                        const isTarget = getDaysSince(repo[sortField]) >= thresholdDays;

                        return (
                          <TableRow key={repo.id} className={`border-slate-200/50 dark:border-zinc-800/50 hover:bg-slate-100/30 dark:bg-zinc-800/30 transition-all group ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                            <TableCell className="py-4 relative">
                              {/* Indicator for batch unstar target */}
                              {isTarget && !isPending && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50 rounded-r shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                              )}
                              <div className="flex flex-col pl-2">
                                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-semibold hover:underline flex items-center gap-1.5 w-fit">
                                  {repo.owner.login} / {repo.name} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 line-clamp-1 pr-4" title={repo.description}>{repo.description || 'No description provided.'}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-700 dark:text-zinc-300 font-medium">{repo.stargazerCount.toLocaleString()}</TableCell>
                            <TableCell className={`font-mono text-xs ${sortField === 'pushedAt' ? 'text-slate-700 dark:text-zinc-300 font-semibold' : 'text-slate-500 dark:text-zinc-500'}`}>
                              {formatDate(repo.pushedAt)}
                              {sortField === 'pushedAt' && <span className="ml-2 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-slate-500 dark:text-zinc-400">{t('dashboard.format.daysAgo', { days: getDaysSince(repo.pushedAt) })}</span>}
                            </TableCell>
                            <TableCell className={`font-mono text-xs ${sortField === 'updatedAt' ? 'text-slate-700 dark:text-zinc-300 font-semibold' : 'text-slate-500 dark:text-zinc-500'}`}>
                              {formatDate(repo.updatedAt)}
                              {sortField === 'updatedAt' && <span className="ml-2 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-slate-500 dark:text-zinc-400">{t('dashboard.format.daysAgo', { days: getDaysSince(repo.updatedAt) })}</span>}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isPending}
                                onClick={() => setRepoToUnstar(repo)}
                                className="bg-slate-50 dark:bg-zinc-950 border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all font-medium text-xs h-8"
                              >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : t('dashboard.table.unstar')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination / Load More Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 flex items-center justify-between z-10">
                <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium tracking-wide">
                  {t('dashboard.status.showing')} <span className="text-slate-700 dark:text-zinc-300">{filteredAndSortedStars.length}</span> / {totalFetched} {t('dashboard.status.loaded')}
                  {totalStars !== null && <span className="ml-1 opacity-75">({t('dashboard.status.totalStars')} <span className="text-slate-700 dark:text-zinc-300 font-bold">{totalStars}</span>)</span>}
                </p>
                {pageInfo.hasNextPage && (
                  <Button
                    onClick={fetchMoreStars}
                    disabled={isFetchingMore || unstarProgress !== null}
                    variant="outline"
                    size="sm"
                    className="bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 pointer-events-auto shadow-sm"
                  >
                    {isFetchingMore ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {isFetchingMore ? t('dashboard.pulling') : t('dashboard.loadMore')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
