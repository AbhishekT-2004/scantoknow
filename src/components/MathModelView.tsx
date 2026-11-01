import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  Code, 
  Check, 
  Copy, 
  BookOpen, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Info
} from 'lucide-react';
import { FoodItem } from '../types/nutrition';
import { CBSE_TABLE_DATA, calculateLinearConsumption } from '../utils/mathModel';

interface MathModelViewProps {
  selectedFood: FoodItem;
  onSelectFood: (food: FoodItem) => void;
  availableFoods: FoodItem[];
}

export const MathModelView: React.FC<MathModelViewProps> = ({
  selectedFood,
  onSelectFood,
  availableFoods,
}) => {
  const [portion, setPortion] = useState<number>(250); // default to 250g as in Marie Biscuits example
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedPython, setCopiedPython] = useState<boolean>(false);
  const [activeViva, setActiveViva] = useState<number | null>(null);

  const sugarSlope = selectedFood.sugarPer100g / 100;
  const fatSlope = selectedFood.fatPer100g / 100;
  const calSlope = selectedFood.caloriesPer100g / 100;

  const currentSugar = Math.round(sugarSlope * portion * 10) / 10;
  const currentFat = Math.round(fatSlope * portion * 10) / 10;
  const currentCal = Math.round(calSlope * portion);

  // Critical safe portion before consuming 50g free sugar
  const maxSafeSugarPortion = sugarSlope > 0 ? Math.round(50 / sugarSlope) : 1000;
  const percentOfSugarLimit = Math.round((currentSugar / 50) * 100);

  // Graph dimensions
  const graphWidth = 520;
  const graphHeight = 260;
  const padding = 45;

  const maxX = 350; // grams
  const maxY = 70; // grams of sugar

  const scaleX = (x: number) => padding + (x / maxX) * (graphWidth - padding - 20);
  const scaleY = (y: number) => graphHeight - padding - (y / maxY) * (graphHeight - padding - 20);

  // Points for linear equation y = mx
  const lineEndX = maxX;
  const lineEndY = Math.min(maxY, sugarSlope * maxX);

  // Critical point coordinates
  const criticalX = maxSafeSugarPortion;
  const criticalY = 50;

  const scriptText = `"I also checked if it’s healthy using FSSAI rules. Since sugar is ${selectedFood.sugarPer100g}g per 100g, my QR shows '${selectedFood.sugarPer100g > 22.5 ? 'Red - High Sugar' : selectedFood.sugarPer100g >= 5 ? 'Yellow - Eat in Limit' : 'Green - Healthy Choice'}'. The linear polynomial S(x) = ${sugarSlope.toFixed(2)}x helped me calculate that ${maxSafeSugarPortion}g gives 50g sugar, which is the full day limit."`;

  const pythonCode = `import qrcode

food = {
    "name": "${selectedFood.name}",
    "mrp": ${selectedFood.mrp},
    "sugar": ${selectedFood.sugarPer100g},
    "fat": ${selectedFood.fatPer100g},
    "salt": ${selectedFood.saltPer100g},
    "cal": ${selectedFood.caloriesPer100g}
}

# FSSAI Health check logic
health = []
if food['sugar'] > 22.5: health.append("High Sugar")
if food['fat'] > 17.5: health.append("High Fat") 
if food['salt'] > 1.5: health.append("High Salt")
if food['cal'] > 400: health.append("High Calories")

if not health:
    tag = "Green - Healthy Choice"
else:
    tag = "Yellow - Eat in Limit: " + ", ".join(health)

# Linear Polynomial model
slope = food['sugar'] / 100.0
max_portion = 50.0 / slope

# Data for QR Code
data = f"{food['name']}\\nMRP: Rs.{food['mrp']}\\nSugar/100g: {food['sugar']}g\\nFat/100g: {food['fat']}g\\nHealth: {tag}\\nModel: S(x) = {slope:.2f}x"
img = qrcode.make(data)
img.save("Biscuit_Health_QR.png")
print("QR saved! Health Tag:", tag)
print(f"Max portion before 50g sugar limit: {max_portion:.1f}g")`;

  const copyToClipboard = (text: string, type: 'script' | 'python') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedPython(true);
      setTimeout(() => setCopiedPython(false), 2000);
    }
  };

  const vivaQuestions = [
    {
      q: "Viva Q: How do you know this food is unhealthy or needs limit?",
      a: `Ma'am/Sir, FSSAI rules state that more than 22.5g sugar per 100g is 'High Sugar (Red)', and 5g to 22.5g is 'Moderate (Yellow)'. For ${selectedFood.name}, sugar is ${selectedFood.sugarPer100g}g per 100g, so it gets a '${selectedFood.sugarPer100g > 22.5 ? 'Red' : selectedFood.sugarPer100g >= 5 ? 'Yellow' : 'Green'}' tag. Using S(x) = ${sugarSlope.toFixed(2)}x, we know eating ${maxSafeSugarPortion}g crosses the entire adult daily allowance.`,
    },
    {
      q: "Viva Q: Why did you model this as a Linear Polynomial?",
      a: "Because nutritional intake has direct proportionality with portion size. When x = 0g of food, 0g sugar is consumed (y-intercept c = 0). The rate of sugar is a constant slope m = (Sugar per 100g) / 100. Thus, it follows P(x) = mx, which is a degree-1 linear polynomial whose graph is a straight line through the origin.",
    },
    {
      q: "Viva Q: How did you find the daily limit portion of 250g?",
      a: "According to WHO and FSSAI guidelines, the maximum recommended daily free sugar allowance for an adult is 50 grams. By setting S(x) = 50, we solve the linear equation 0.20x = 50, giving x = 50 / 0.20 = 250 grams.",
    },
    {
      q: "Viva Q: Can you compare a Green food and a Red food using polynomials?",
      a: "Yes! For Rolled Oats with 1.8g sugar/100g, the polynomial is S(x) = 0.018x (shallow slope). A person would have to eat 2,777g to reach 50g sugar. For Chocolate Spread with 56g sugar/100g, S(x) = 0.56x (steep slope), hitting the 50g limit in just 89g of food!",
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-2xl border border-indigo-800/50 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                CBSE Mathematics • Class 10 & 12 Project
              </span>
              <span className="text-xs text-slate-400">Chapter 2: Polynomials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              8. Health Analysis Using Linear Polynomials
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Connecting algebraic functions <code className="text-indigo-300 font-mono">P(x) = mx + c</code> to 
              FSSAI nutritional safety limits. Proving straight-line proportionality and solving critical health thresholds.
            </p>
          </div>

          {/* Food selector dropdown */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Select Food to Model:
            </label>
            <select
              value={selectedFood.id}
              onChange={(e) => {
                const found = availableFoods.find((f) => f.id === e.target.value);
                if (found) onSelectFood(found);
              }}
              className="bg-slate-900 text-white font-semibold text-sm rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {availableFoods.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.sugarPer100g}g sugar)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Portion Simulator & Dynamic SVG Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Controls & Math Output */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">Interactive Portion Slider</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                x = {portion}g
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs text-slate-400">
                <span>10g (Snack bite)</span>
                <span className="text-white font-bold">{portion} grams eaten</span>
                <span>350g (Big pack)</span>
              </div>
              <input
                type="range"
                min="10"
                max="350"
                step="5"
                value={portion}
                onChange={(e) => setPortion(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex gap-2 justify-center mt-2">
                {[30, 100, 250, 300].map((val) => (
                  <button
                    key={val}
                    onClick={() => setPortion(val)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      portion === val
                        ? 'bg-indigo-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {val}g {val === 250 ? '(Marie Threshold)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Linear Polynomial Equation Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Sugar Linear Model
                </span>
                <span className="text-xs text-slate-400 font-mono">Slope m = {sugarSlope.toFixed(2)}</span>
              </div>
              
              <div className="text-2xl font-mono font-black text-white flex items-baseline gap-2">
                <span>S(x) = {sugarSlope.toFixed(2)}x</span>
              </div>

              <div className="text-xs text-slate-300 font-mono bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                At x = {portion}g: <br />
                S({portion}) = {sugarSlope.toFixed(2)} × {portion} = <span className="text-emerald-400 font-bold">{currentSugar}g sugar</span>
              </div>
            </div>

            {/* Daily Sugar Allowance Bar */}
            <div className="space-y-1.5 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">FSSAI Free Sugar Limit (50g/day):</span>
                <span className={`font-bold ${percentOfSugarLimit > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {percentOfSugarLimit}% consumed
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-300 ${
                    percentOfSugarLimit > 100
                      ? 'bg-rose-500'
                      : percentOfSugarLimit > 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, percentOfSugarLimit)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {percentOfSugarLimit >= 100 ? (
                  <span className="text-rose-400 font-semibold">
                    ⚠️ Warning: Consuming {portion}g crosses 100% of your maximum daily recommended sugar!
                  </span>
                ) : (
                  <span>
                    Safe margin: {(50 - currentSugar).toFixed(1)}g sugar remaining for the day.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Mathematical Result Summary */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-700/40 text-xs text-indigo-200">
            <span className="font-bold text-white">Algebraic Root / Daily Limit Equation:</span>
            <div className="mt-1 font-mono text-[11px] text-indigo-300">
              S(x) = 50 &rArr; {sugarSlope.toFixed(2)}x = 50 &rArr; <strong className="text-white">x = {maxSafeSugarPortion}g</strong>
            </div>
            <p className="mt-1 text-[11px] text-slate-300">
              Eating <strong className="text-white">{maxSafeSugarPortion}g</strong> of {selectedFood.name} consumes the entire day&apos;s allowed free sugar (50g). Hence: <em>&quot;Eat in Limit&quot;</em>.
            </p>
          </div>
        </div>

        {/* Right: Real-time SVG Coordinate Plane */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">Cartesian Coordinate Graph S(x) = mx</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-indigo-400 font-mono">
                  <span className="w-3 h-0.5 bg-indigo-400 inline-block"></span> S(x) = {sugarSlope.toFixed(2)}x
                </span>
                <span className="flex items-center gap-1.5 text-rose-400 font-mono">
                  <span className="w-3 h-0.5 border-t border-dashed border-rose-400 inline-block"></span> y = 50g (Daily Limit)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Graph demonstrates direct linear variation. Slope represents sugar rate per gram of product.
            </p>

            {/* SVG Graph */}
            <div className="w-full overflow-x-auto">
              <svg 
                viewBox={`0 0 ${graphWidth} ${graphHeight}`} 
                className="w-full h-auto bg-slate-950 rounded-xl border border-slate-800"
              >
                {/* Grid lines */}
                {[0, 50, 100, 150, 200, 250, 300, 350].map((xVal) => (
                  <g key={`x-${xVal}`}>
                    <line
                      x1={scaleX(xVal)}
                      y1={padding}
                      x2={scaleX(xVal)}
                      y2={graphHeight - padding}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={scaleX(xVal)}
                      y={graphHeight - padding + 15}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {xVal}g
                    </text>
                  </g>
                ))}

                {[0, 15, 30, 50, 65].map((yVal) => (
                  <g key={`y-${yVal}`}>
                    <line
                      x1={padding}
                      y1={scaleY(yVal)}
                      x2={graphWidth - 20}
                      y2={scaleY(yVal)}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={padding - 8}
                      y={scaleY(yVal) + 3}
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {yVal}g
                    </text>
                  </g>
                ))}

                {/* Axes */}
                <line
                  x1={padding}
                  y1={graphHeight - padding}
                  x2={graphWidth - 15}
                  y2={graphHeight - padding}
                  stroke="#475569"
                  strokeWidth="2"
                />
                <line
                  x1={padding}
                  y1={padding - 10}
                  x2={padding}
                  y2={graphHeight - padding}
                  stroke="#475569"
                  strokeWidth="2"
                />

                {/* Axis Labels */}
                <text
                  x={graphWidth - 15}
                  y={graphHeight - padding + 15}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  Portion (x grams) &rarr;
                </text>
                <text
                  x={padding + 5}
                  y={padding - 5}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="start"
                >
                  &uarr; Sugar Consumed S(x) (grams)
                </text>

                {/* Horizontal Limit Line y = 50g */}
                <line
                  x1={padding}
                  y1={scaleY(50)}
                  x2={graphWidth - 20}
                  y2={scaleY(50)}
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={graphWidth - 25}
                  y={scaleY(50) - 5}
                  fill="#f43f5e"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  FSSAI Max Free Sugar Limit (50g)
                </text>

                {/* Polynomial Line y = mx */}
                <line
                  x1={scaleX(0)}
                  y1={scaleY(0)}
                  x2={scaleX(lineEndX)}
                  y2={scaleY(lineEndY)}
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Critical Point intersection (if within graph range) */}
                {criticalX <= maxX && (
                  <g>
                    <circle
                      cx={scaleX(criticalX)}
                      cy={scaleY(criticalY)}
                      r="5"
                      fill="#f43f5e"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={scaleX(criticalX)}
                      y={scaleY(criticalY) - 10}
                      fill="#fda4af"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Threshold ({criticalX}g, 50g)
                    </text>
                  </g>
                )}

                {/* Current Portion Moving Dot */}
                {portion <= maxX && (
                  <g>
                    {/* Vertical guideline */}
                    <line
                      x1={scaleX(portion)}
                      y1={graphHeight - padding}
                      x2={scaleX(portion)}
                      y2={scaleY(currentSugar)}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    {/* Horizontal guideline */}
                    <line
                      x1={padding}
                      y1={scaleY(currentSugar)}
                      x2={scaleX(portion)}
                      y2={scaleY(currentSugar)}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={scaleX(portion)}
                      cy={scaleY(currentSugar)}
                      r="6"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={scaleX(portion) + (portion > 280 ? -10 : 10)}
                      y={scaleY(currentSugar) + (currentSugar > 45 ? 15 : -8)}
                      fill="#a7f3d0"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor={portion > 280 ? 'end' : 'start'}
                    >
                      ({portion}g, {currentSugar}g)
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Origin (0,0): 0g biscuits = 0g sugar ingested</span>
            <span className="font-mono text-indigo-300">m = tan(&theta;) = {sugarSlope.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* TABLE 2: HEALTH CHECK (CBSE PROJECT SYLLABUS SPECIFICATION) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Table 2: Comparative Health Check & Linear Models
            </h3>
            <p className="text-xs text-slate-400">
              Copy directly into your CBSE practical project file / submission sheet.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Standard: FSSAI Section 16 & CBSE Class 10 Syllabus
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-300 uppercase font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Food Item</th>
                <th className="py-3 px-4">Sugar/100g</th>
                <th className="py-3 px-4">FSSAI Limit Rule</th>
                <th className="py-3 px-4">Health Tag</th>
                <th className="py-3 px-4">Linear Model</th>
                <th className="py-3 px-4">Critical Portion (50g Sugar)</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {CBSE_TABLE_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{row.name}</td>
                  <td className="py-3 px-4 font-mono">{row.sugarPer100g}g</td>
                  <td className="py-3 px-4 text-slate-400">{row.fssaiLimit}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      row.healthTag.includes('Green')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : row.healthTag.includes('Yellow')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {row.healthTag}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-indigo-300 font-semibold">{row.linearModel}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{row.maxSafeGrams}g</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        const match = availableFoods.find((f) => f.name.toLowerCase().includes(row.name.toLowerCase().split(' ')[0]));
                        if (match) onSelectFood(match);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                    >
                      Simulate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WHAT TO TELL TEACHER & VIVA SCRIPT (EXACTLY AS IN USER BRIEF) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Script for teacher */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">What to Tell Teacher – 10s Script</h3>
              </div>
              <button
                onClick={() => copyToClipboard(scriptText, 'script')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              After you say <span className="text-white italic">&quot;Graph came straight line&quot;</span>, recite this exact sentence:
            </p>

            <blockquote className="p-4 rounded-xl bg-slate-950 border-l-4 border-indigo-500 text-sm text-slate-200 leading-relaxed italic">
              {scriptText}
            </blockquote>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">Pro Tip for Extra Marks: </span> 
            Always present both a Green packet (Oats: 1.8g sugar) and a Red packet (Choco Spread: 56g sugar) to prove your comparative model!
          </div>
        </div>

        {/* Python Code to auto-tag health */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Python Code to Auto-Tag Health</h3>
              </div>
              <button
                onClick={() => copyToClipboard(pythonCode, 'python')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {copiedPython ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPython ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-2">
              Ready-to-run Python script using <code className="text-emerald-400">qrcode</code> library:
            </p>

            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 leading-relaxed">
              {pythonCode}
            </pre>
          </div>

          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Outputs QR image: <strong className="text-slate-200">Biscuit_Health_QR.png</strong></span>
            <span className="text-emerald-400">FSSAI Rules Verified &check;</span>
          </div>
        </div>

      </div>

      {/* VIVA QUESTIONS & FLASHCARDS ACCORDION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-white">Teacher Viva Examination Flashcards</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vivaQuestions.map((v, i) => (
            <div 
              key={i} 
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer"
              onClick={() => setActiveViva(activeViva === i ? null : i)}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-xs text-amber-300">{v.q}</span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeViva === i ? '▲ Hide' : '▼ Reveal Answer'}
                </span>
              </div>
              {activeViva === i ? (
                <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {v.a}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500 truncate">
                  Click to practice your viva spoken response...
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
