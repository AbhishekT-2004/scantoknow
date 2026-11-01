import React, { useState } from 'react';
import { 
  History, 
  FileDown, 
  Search, 
  Trash2, 
  Filter, 
  TrendingUp, 
  Sparkles, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { FoodItem, ScanRecord } from '../types/nutrition';
import { generateHealthReportPdf } from '../utils/pdfExport';

interface HistoryTrendsProps {
  scans: ScanRecord[];
  onSelectFood: (food: FoodItem) => void;
  onClearHistory: () => void;
  onDeleteScan: (id: string) => void;
}

export const HistoryTrends: React.FC<HistoryTrendsProps> = ({
  scans,
  onSelectFood,
  onClearHistory,
  onDeleteScan,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterColor, setFilterColor] = useState<string>('all');
  const [studentName, setStudentName] = useState<string>('Pawan K.');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const filteredScans = scans.filter((s) => {
    const matchesSearch = s.food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.food.category && s.food.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterColor === 'all' || s.evaluation.overallColor === filterColor;
    return matchesSearch && matchesFilter;
  });

  const totalScans = scans.length;
  const greenScans = scans.filter((s) => s.evaluation.overallColor === 'green').length;
  const yellowScans = scans.filter((s) => s.evaluation.overallColor === 'yellow').length;
  const redScans = scans.filter((s) => s.evaluation.overallColor === 'red').length;

  const greenPct = totalScans > 0 ? Math.round((greenScans / totalScans) * 100) : 0;
  const yellowPct = totalScans > 0 ? Math.round((yellowScans / totalScans) * 100) : 0;
  const redPct = totalScans > 0 ? Math.round((redScans / totalScans) * 100) : 0;

  const avgScore = totalScans > 0 
    ? Math.round(scans.reduce((acc, s) => acc + s.evaluation.score, 0) / totalScans) 
    : 0;

  const avgProtein = totalScans > 0 
    ? (scans.reduce((acc, s) => acc + (s.food.proteinPer100g || 0), 0) / totalScans).toFixed(1) 
    : '0';

  const avgFiber = totalScans > 0 
    ? (scans.reduce((acc, s) => acc + (s.food.fiberPer100g || 0), 0) / totalScans).toFixed(1) 
    : '0';

  const handleExportPdf = () => {
    setIsExporting(true);
    try {
      generateHealthReportPdf(scans, studentName);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header & PDF Export action */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
              Long-Term Health Monitoring
            </span>
            <span className="text-xs text-slate-400">Database & Compliance Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Historical Scan Trends & Reports
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Monitor nutritional habits over time, verify weekly progress, and generate official PDF reports for your CBSE teacher or doctor.
          </p>
        </div>

        {/* PDF Export Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Student Name for Report"
            className="bg-slate-900 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={handleExportPdf}
            disabled={isExporting || scans.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Export to PDF'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Scans */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs font-bold uppercase text-slate-400">Total Scans Audited</span>
          <div className="text-3xl font-black text-white mt-1">{totalScans}</div>
          <span className="text-xs text-slate-400 mt-1 block">Logged across sessions</span>
        </div>

        {/* Avg Health Score */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs font-bold uppercase text-slate-400">Average Health Score</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">{avgScore} <span className="text-sm text-slate-500">/ 100</span></div>
          <span className="text-xs text-slate-400 mt-1 block">
            {avgScore >= 70 ? 'Optimal nutritious diet' : 'Moderate nutritional balance'}
          </span>
        </div>

        {/* Avg Protein */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs font-bold uppercase text-indigo-400">Avg Protein per 100g</span>
          <div className="text-3xl font-black text-white mt-1">{avgProtein}g</div>
          <span className="text-xs text-slate-400 mt-1 block">Key metric for satiety & muscle</span>
        </div>

        {/* Avg Fiber */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <span className="text-xs font-bold uppercase text-emerald-400">Avg Dietary Fiber</span>
          <div className="text-3xl font-black text-white mt-1">{avgFiber}g</div>
          <span className="text-xs text-slate-400 mt-1 block">Gut health & glycemic control</span>
        </div>

      </div>

      {/* Traffic Light Distribution Ratio Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            Nutritional Quality Ratio (FSSAI Traffic Lights)
          </h3>
          <span className="text-xs text-slate-400">Goal: &gt;70% Green</span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden flex mb-4">
          <div 
            style={{ width: `${greenPct}%` }} 
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`Green: ${greenPct}%`}
          />
          <div 
            style={{ width: `${yellowPct}%` }} 
            className="bg-amber-500 h-full transition-all duration-500"
            title={`Yellow: ${yellowPct}%`}
          />
          <div 
            style={{ width: `${redPct}%` }} 
            className="bg-rose-500 h-full transition-all duration-500"
            title={`Red: ${redPct}%`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Green (Healthy Choice)</span>
            </div>
            <span className="font-bold text-white">{greenScans} items ({greenPct}%)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-semibold">Yellow (Eat in Limit)</span>
            </div>
            <span className="font-bold text-white">{yellowScans} items ({yellowPct}%)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span className="text-rose-300 font-semibold">Red (Limit Intake)</span>
            </div>
            <span className="font-bold text-white">{redScans} items ({redPct}%)</span>
          </div>
        </div>
      </div>

      {/* Historical Logs List & Filter */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search past scans by product name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="bg-slate-950 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All Traffic Tags</option>
              <option value="green">Green Only (Healthy)</option>
              <option value="yellow">Yellow Only (Moderate)</option>
              <option value="red">Red Only (Limit)</option>
            </select>

            {scans.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-900/50 transition-colors"
                title="Clear Historical Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scan List */}
        {filteredScans.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No scans match your criteria. Try scanning a barcode or QR code!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredScans.map((scan) => {
              const dateStr = new Date(scan.timestamp).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={scan.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div 
                      className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 ${
                        scan.evaluation.overallColor === 'green'
                          ? 'bg-emerald-400 shadow-emerald-500/50 shadow-sm'
                          : scan.evaluation.overallColor === 'yellow'
                          ? 'bg-amber-400 shadow-amber-500/50 shadow-sm'
                          : 'bg-rose-400 shadow-rose-500/50 shadow-sm'
                      }`}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{scan.food.name}</span>
                        <span className="text-xs text-slate-400">₹{scan.food.mrp}</span>
                        <span className="text-xs text-slate-500 font-mono">• {dateStr}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                        <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Sugar: {scan.food.sugarPer100g}g
                        </span>
                        <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Fat: {scan.food.fatPer100g}g
                        </span>
                        <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-indigo-300">
                          Protein: {scan.food.proteinPer100g || 0}g
                        </span>
                        <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-300">
                          Fiber: {scan.food.fiberPer100g || 0}g
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-sm font-black text-white">{scan.evaluation.score}/100</div>
                      <div className={`text-[10px] font-bold uppercase ${
                        scan.evaluation.overallColor === 'green' ? 'text-emerald-400' :
                        scan.evaluation.overallColor === 'yellow' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {scan.evaluation.overallColor} tag
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectFood(scan.food)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Inspect Health Card & Math Model"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
