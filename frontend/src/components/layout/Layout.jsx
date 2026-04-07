import Sidebar from './Sidebar';
import LetterGlitch from '../ui/LetterGlitch';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-6 md:p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-background to-background relative">
         <div className="fixed inset-0 top-0 left-64 right-0 bottom-0 z-0 opacity-100 pointer-events-none">
            <LetterGlitch
              glitchSpeed={50}
              centerVignette={true}
              outerVignette={false}
              smooth={true}
            />
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
         
         <div className="relative z-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
           {children}
         </div>
      </main>
    </div>
  );
}
