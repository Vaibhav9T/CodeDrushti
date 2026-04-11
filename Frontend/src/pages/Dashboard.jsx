import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Code2, FileText, History, Puzzle, TrendingUp, Clock, CheckCircle, ArrowRight, Bug } from 'lucide-react';
import { useCodeHistory } from '../contexts/codeHistoryContext';
import GlobalSearch from '../components/GlobalSearch';
import { PageWrapper, TactileCard, SurfableCarousel } from '../components/Animations';

const StatCard = ({ title, value, trend, isPositive, icon: Icon, loading }) => (
  <div className="bg-white dark:bg-slate-900 p-5 lg:p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl"><Icon size={20} className="text-indigo-600 dark:text-indigo-400" /></div>
      {trend && (
        <div className={`flex items-center space-x-1 text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {isPositive && <TrendingUp size={14} />}<span>{trend}</span>
        </div>
      )}
    </div>
    <div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : value}</h2>
    </div>
  </div>
);

const FeatureCard = ({ title, description, icon: Icon, cta, primary, onClick }) => (
  <TactileCard 
    onClick={onClick}
    className="group relative bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] cursor-pointer h-full flex flex-col"
  >
    <div className={`inline-flex p-3 rounded-xl mb-5 w-fit ${primary ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'}`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm lg:text-base flex-1">{description}</p>
    <div className={`flex items-center space-x-2 font-medium mt-auto ${primary ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`}>
      <span>{cta}</span>
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </TactileCard>
);

const Dashboard = () => {
  const { reviews, loading } = useCodeHistory();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    let lines = 0, optimizations = 0, issues = 0, timeMs = 0, recentReviews = 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    reviews.forEach(r => {
      lines += r.linesOfCode || 0;
      timeMs += r.timeTakenMs || 0;
      const content = r.reviewContent || {};
      optimizations += content.improvements?.length || 0;
      issues += (content.bugs?.length || 0) + (content.security?.length || 0);
      const reviewTime = r.timestamp?.seconds ? new Date(r.timestamp.seconds * 1000) : new Date();
      if (reviewTime > oneWeekAgo) recentReviews++;
    });

    const formatNum = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString();
    return {
      total: reviews.length, lines: formatNum(lines), optimizations: formatNum(optimizations),
      issues: formatNum(issues), avgTime: reviews.length > 0 ? (timeMs / reviews.length / 1000).toFixed(1) + 's' : '0s', recentReviews
    };
  }, [reviews]);

  return (
    <PageWrapper className="flex flex-col flex-1 h-full min-h-0 font-sans w-full transition-colors duration-300">
      
      {/* FIXED HEADER & TITLE */}
      <div className="shrink-0 px-6 md:px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col gap-5">
       
        <div className="flex items-center justify-center">
          
          <div className='justify-center'>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 ">Welcome back! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm ">Here's what's happening with your code quality today.</p>
        </div>
          {/* <div className="flex items-center max-w-md w-full">
            <GlobalSearch />
          </div> */}
        </div>
        
      </div>

      {/* SCROLLING CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Code Reviews" value={stats.total} trend={`+${stats.recentReviews}`} isPositive={stats.recentReviews > 0} icon={Code2} loading={loading} />
            <StatCard title="Optimizations" value={stats.optimizations} icon={CheckCircle} loading={loading} />
            <StatCard title="Lines Reviewed" value={stats.lines} icon={FileText} loading={loading} />
            <StatCard title="Avg Turnaround" value={stats.avgTime} icon={Clock} loading={loading} />
            <StatCard title="Issues Detected" value={stats.issues} icon={Bug} loading={loading} />
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <SurfableCarousel>
              <div className="w-[280px] md:w-[350px]">
                <FeatureCard primary={true} icon={Code2} title="Analyze Code" description="Upload files or paste your code snippet directly to instantly detect bugs and bottlenecks." cta="Start Analysis" onClick={() => navigate('/new-review')} />
              </div>
              <div className="w-[280px] md:w-[350px]">
                <FeatureCard icon={History} title="My Reviews" description="Access your historical code reviews, track resolved issues, and revisit previous feedback." cta="Open Reviews" onClick={() => navigate('/reviews')} />
              </div>
              <div className="w-[280px] md:w-[350px]">
                <FeatureCard icon={FileText} title="Get Report" description="Generate highly detailed, exportable insights and structural optimization reports." cta="View Reports" onClick={() => navigate('/reports')} />
              </div>
              <div className="w-[280px] md:w-[350px]">
                <FeatureCard icon={Puzzle} title="Get Extension" description="Install our native browser and IDE extensions to get real-time analysis." cta="Download Plugin (Coming Soon..)" onClick={() => {}} />
              </div>
            </SurfableCarousel>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;