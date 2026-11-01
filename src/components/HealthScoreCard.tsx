import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Share2, 
  LineChart, 
  BookmarkCheck, 
  Dna, 
  Wheat, 
  Zap, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { FoodItem, HealthEvaluation, TrafficColor } from '../types/nutrition';

interface HealthScoreCardProps {
  food: FoodItem;
  evaluation: HealthEvaluation;
  onOpenMathModel: (food: FoodItem) => void;
  onOpenShareModal: (food: FoodItem, evaluation: HealthEvaluation) => void;
  onLogScan: (food: FoodItem, portionGrams: number) => void;
  onScanNew: () => void;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  food,
  evaluation,
  onOpenMathModel,
  onOpenShareModal,
  onLogScan,
  onScanNew,
}) => {
  const [portion, setPortion] = useState<number>(food.servingSizeGrams || 50);
  const [logged, setLogged] = useState<boolean>(false);

  const handleLog = () => {
    onLogScan(food, portion);
    setLogged(true);
    setTimeout(() => setLogged(false), 2500);
  };

  const getStatusBadge = (color: TrafficColor) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          indicator: 'bg-emerald-400 shadow-emerald-400/50 shadow-sm',
          text: 'FSSAI Healthy Choice',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        };
      case 'yellow':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          indicator: 'bg-amber-400 shadow-amber-400/50 shadow-sm',
          text: 'Moderately Healthy – Eat in Limit',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        };
      case 'red':
      default:
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          indicator: 'bg-rose-400 shadow-rose-400/50 shadow-sm',
          text: 'High / Limit Intake',
          icon: <XCircle className="w-5 h-5 text-rose-400" />,
        };
    }
  };

  const badge = getStatusBadge(evaluation.overallColor);

  // Score circular gauge math
  const scoreRadius = 38;
  const circumference = 2 * Math.PI * scoreRadius;
  const strokeDashoffset = circumference - (evaluation.score / 100) * circumference;

  const scoreStrokeColor = 
    evaluation.overallColor === 'green'
      ? '#10b981'
      : evaluation.overallColor === 'yellow'
      ? '#f59e0b'
      : '#f43f5e';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      
      {/* Background glow tint based on health color */}
      <div 
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          evaluation.overallColor === 'green'
            ? 'bg-emerald-500'
            : evaluation.overallColor === 'yellow'
            ? 'bg-amber-500'
            : 'bg-rose-600'
        }`}
      />

      {/* Top Header: Food Name, Category, MRP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {food.category || 'Packaged Grocery'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">
              Exp: {food.expiry || '01/11/2026'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            {food.name}
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
              ₹{food.mrp}
            </span>
          </h2>
        </div>

        {/* Action buttons on header */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onOpenShareModal(food, evaluation)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share</span>
          </button>
          <button
            onClick={onScanNew}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-md shadow-emerald-500/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </button>
        </div>
      </div>

      {/* Hero Health Verdict Banner */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Score & Gauge Column */}
        <div className="md:col-span-4 flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 90 90">
              {/* Background circle */}
              <circle
                cx="45"
                cy="45"
                r={scoreRadius}
                stroke="#1e293b"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="45"
                cy="45"
                r={scoreRadius}
                stroke={scoreStrokeColor}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{evaluation.score}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Health Score</span>
              <span className={`px-2 py-0.2 rounded text-[11px] font-extrabold uppercase ${
                evaluation.grade === 'A' ? 'bg-emerald-500 text-slate-950' :
                evaluation.grade === 'B' ? 'bg-teal-400 text-slate-950' :
                evaluation.grade === 'C' ? 'bg-amber-400 text-slate-950' :
                'bg-rose-500 text-white'
              }`}>
                Grade {evaluation.grade}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Composite score calculated via FSSAI thresholds and macro density.
            </p>
          </div>
        </div>

        {/* Overall Tag & Traffic Light Status */}
        <div className="md:col-span-8 flex flex-col justify-between h-full bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              {badge.icon}
              <span className="font-extrabold text-base text-white">{badge.text}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800">
              <span className={`w-2.5 h-2.5 rounded-full ${badge.indicator}`}></span>
              <span className="text-slate-300">FSSAI Status</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">Verdict: </span>
            {evaluation.tag}. {evaluation.summary}
          </div>

          {evaluation.flags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {evaluation.flags.map((flag, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                    flag.startsWith('High')
                      ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                      : 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  {flag}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* KEY METRICS HIGHLIGHTED: FIBER & PROTEIN (Requested in brief) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Key Metrics: Protein & Dietary Fiber Highlights
            </h3>
          </div>
          <span className="text-xs text-slate-400">Nutritional value boosters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Protein Highlight Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-4 rounded-xl border border-indigo-500/30 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <Dna className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-indigo-300">Protein per 100g</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  (food.proteinPer100g || 0) >= 10
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : (food.proteinPer100g || 0) >= 5
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {evaluation.proteinBonus.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{food.proteinPer100g || 0}g</span>
                <span className="text-xs text-slate-400">
                  (~{Math.round(((food.proteinPer100g || 0) / 55) * 100)}% of adult RDA)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {(food.proteinPer100g || 0) >= 7
                  ? 'Great source for muscle repair and prolonged satiety.'
                  : 'Modest protein content. Pair with pulses or nuts.'}
              </p>
            </div>
          </div>

          {/* Fiber Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 p-4 rounded-xl border border-emerald-500/30 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Wheat className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-300">Dietary Fiber per 100g</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  (food.fiberPer100g || 0) >= 6
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : (food.fiberPer100g || 0) >= 3
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {evaluation.fiberBonus.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{food.fiberPer100g || 0}g</span>
                <span className="text-xs text-slate-400">
                  (~{Math.round(((food.fiberPer100g || 0) / 30) * 100)}% of adult RDA)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {(food.fiberPer100g || 0) >= 5
                  ? 'High fiber slows sugar absorption and aids digestive gut flora.'
                  : 'Low fiber means faster glycemic spike from carbohydrates.'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4 PRIMARY FSSAI NUTRIENTS CARDS */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            FSSAI Nutritional Traffic Lights (Per 100g Standard)
          </h3>
          <span className="text-xs text-slate-400">Green = Healthy | Red = Limit</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Sugar Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            evaluation.sugarRating.color === 'green'
              ? 'bg-emerald-950/30 border-emerald-500/40'
              : evaluation.sugarRating.color === 'yellow'
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-rose-950/30 border-rose-500/40'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-300">Sugar</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                evaluation.sugarRating.color === 'green' ? 'bg-emerald-500/20 text-emerald-300' :
                evaluation.sugarRating.color === 'yellow' ? 'bg-amber-500/20 text-amber-300' :
                'bg-rose-500/20 text-rose-300'
              }`}>
                {evaluation.sugarRating.label}
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {food.sugarPer100g} <span className="text-xs font-normal text-slate-400">g</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex flex-col gap-0.5">
              <span>Rule: &lt;5g Green / &gt;22.5g Red</span>
              <span className="text-indigo-400 font-mono font-medium">
                Math: S(x) = {evaluation.linearModels.sugar.slope.toFixed(2)}x
              </span>
            </div>
          </div>

          {/* Fat Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            evaluation.fatRating.color === 'green'
              ? 'bg-emerald-950/30 border-emerald-500/40'
              : evaluation.fatRating.color === 'yellow'
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-rose-950/30 border-rose-500/40'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-300">Total Fat</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                evaluation.fatRating.color === 'green' ? 'bg-emerald-500/20 text-emerald-300' :
                evaluation.fatRating.color === 'yellow' ? 'bg-amber-500/20 text-amber-300' :
                'bg-rose-500/20 text-rose-300'
              }`}>
                {evaluation.fatRating.label}
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {food.fatPer100g} <span className="text-xs font-normal text-slate-400">g</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex flex-col gap-0.5">
              <span>Rule: &lt;3g Green / &gt;17.5g Red</span>
              <span className="text-indigo-400 font-mono font-medium">
                Math: F(x) = {evaluation.linearModels.fat.slope.toFixed(2)}x
              </span>
            </div>
          </div>

          {/* Salt Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            evaluation.saltRating.color === 'green'
              ? 'bg-emerald-950/30 border-emerald-500/40'
              : evaluation.saltRating.color === 'yellow'
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-rose-950/30 border-rose-500/40'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-300">Salt</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                evaluation.saltRating.color === 'green' ? 'bg-emerald-500/20 text-emerald-300' :
                evaluation.saltRating.color === 'yellow' ? 'bg-amber-500/20 text-amber-300' :
                'bg-rose-500/20 text-rose-300'
              }`}>
                {evaluation.saltRating.label}
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {food.saltPer100g} <span className="text-xs font-normal text-slate-400">g</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex flex-col gap-0.5">
              <span>Rule: &lt;0.3g Green / &gt;1.5g Red</span>
              <span className="text-indigo-400 font-mono font-medium">
                Math: Na(x) = {evaluation.linearModels.salt.slope.toFixed(3)}x
              </span>
            </div>
          </div>

          {/* Calories Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            evaluation.caloriesRating.color === 'green'
              ? 'bg-emerald-950/30 border-emerald-500/40'
              : evaluation.caloriesRating.color === 'yellow'
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-rose-950/30 border-rose-500/40'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-300">Calories</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                evaluation.caloriesRating.color === 'green' ? 'bg-emerald-500/20 text-emerald-300' :
                evaluation.caloriesRating.color === 'yellow' ? 'bg-amber-500/20 text-amber-300' :
                'bg-rose-500/20 text-rose-300'
              }`}>
                {evaluation.caloriesRating.label}
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {food.caloriesPer100g} <span className="text-xs font-normal text-slate-400">kcal</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex flex-col gap-0.5">
              <span>Rule: &lt;200 Green / &gt;400 Red</span>
              <span className="text-indigo-400 font-mono font-medium">
                Math: C(x) = {evaluation.linearModels.calories.slope.toFixed(1)}x
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* PORTION TRACKER & INTERACTION BAR */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-300 shrink-0">Portion eaten:</span>
          <div className="flex items-center gap-2">
            {[30, 50, 100, 250].map((preset) => (
              <button
                key={preset}
                onClick={() => setPortion(preset)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  portion === preset
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset}g
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleLog}
            disabled={logged}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              logged
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            {logged ? 'Logged to History (+50 XP)!' : `Log ${portion}g Intake`}
          </button>

          <button
            onClick={() => onOpenMathModel(food)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            <LineChart className="w-4 h-4" />
            <span>CBSE Linear Math</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
