import React from 'react';
import Navbar from './Navbar';
import { Database, Award, Info, ExternalLink } from 'lucide-react';

export const DashboardLayout = ({
  children,
  viewMode = 'farmer',
  onToggleViewMode,
  onSelectQuickScenario,
  currentScenario
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors">
      <Navbar
        viewMode={viewMode}
        onToggleViewMode={onToggleViewMode}
        onSelectQuickScenario={onSelectQuickScenario}
        currentScenario={currentScenario}
      />

      {/* Main App Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer & Transparency Disclaimer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Government Data Transparency</h4>
                <p>Prices synced with AGMARKNET 2.0 and e-NAM APMC terminals across 4,300+ connected mandis.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Net Realisation Guarantee</h4>
                <p>Every recommendation calculates actual take-home money after transport, cess, and transit losses.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Farmer & Mandi Decision Aid</h4>
                <p>Designed as an explainable decision tool for smallholders, FPOs, and APMC traders.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Fasal Mitra • Built for Indian Agriculture & Farmer Prosperity</p>
            <div className="flex items-center gap-4">
              <a
                href="https://agmarknet.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                AGMARKNET Portal <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://enam.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                e-NAM Platform <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;