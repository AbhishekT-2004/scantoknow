import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  FileText,
  ShieldCheck,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { FoodItem } from '../types/nutrition';
import { evaluateFoodHealth, formatQrPayload } from '../utils/fssaiEngine';

interface QrGeneratorProps {
  onScanGeneratedFood?: (food: FoodItem) => void;
}

export const QrGenerator: React.FC<QrGeneratorProps> = ({ onScanGeneratedFood }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'healthy' | 'moderate' | 'unhealthy'>('moderate');
  const [foodName, setFoodName] = useState<string>('Marie Biscuits');
  const [mrp, setMrp] = useState<number>(30);
  const [expiry, setExpiry] = useState<string>('01/11/2026');
  const [sugar, setSugar] = useState<number>(20);
  const [fat, setFat] = useState<number>(15);
  const [salt, setSalt] = useState<number>(1.2);
  const [cal, setCal] = useState<number>(450);
  const [protein, setProtein] = useState<number>(7.2);
  const [fiber, setFiber] = useState<number>(2.5);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Template switchers
  const applyTemplate = (type: 'healthy' | 'moderate' | 'unhealthy') => {
    setSelectedTemplate(type);
    if (type === 'healthy') {
      setFoodName('Rolled Oats Superfood');
      setMrp(120);
      setExpiry('15/12/2026');
      setSugar(1.8);
      setFat(2.8);
      setSalt(0.05);
      setCal(195);
      setProtein(13.5);
      setFiber(10.4);
    } else if (type === 'moderate') {
      setFoodName('Marie Biscuits');
      setMrp(30);
      setExpiry('01/11/2026');
      setSugar(20);
      setFat(15);
      setSalt(1.2);
      setCal(450);
      setProtein(7.2);
      setFiber(2.5);
    } else {
      setFoodName('Chocolate Hazelnut Spread');
      setMrp(190);
      setExpiry('10/08/2026');
      setSugar(56);
      setFat(31);
      setSalt(1.8);
      setCal(540);
      setProtein(4.2);
      setFiber(1.5);
    }
  };

  const currentFood: FoodItem = {
    id: 'qr_' + Date.now(),
    name: foodName,
    mrp,
    expiry,
    servingSizeGrams: 50,
    sugarPer100g: sugar,
    fatPer100g: fat,
    saltPer100g: salt,
    caloriesPer100g: cal,
    proteinPer100g: protein,
    fiberPer100g: fiber,
  };

  const evalResult = evaluateFoodHealth(currentFood);
  const qrPayload = formatQrPayload(currentFood, evalResult.tag);

  useEffect(() => {
    QRCode.toDataURL(
      qrPayload,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [qrPayload]);

  const downloadQrPng = () => {
    const link = document.createElement('a');
    link.download = `${foodName.replace(/\s+/g, '_')}_FSSAI_QR.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 p-6 sm:p-7 rounded-2xl border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
              CBSE Project Asset Generator
            </span>
            <span className="text-xs text-slate-400">Physical Printouts & Exhibition QR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            FSSAI Nutritional QR Code Maker
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Generate printable QR codes embedded with nutrient metadata and health tags. Print and paste on your biscuit or cereal packets for school exhibition!
          </p>
        </div>

        {/* 3 Quick-Template Selector requested in prompt */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <button
            onClick={() => applyTemplate('healthy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTemplate === 'healthy'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Green (Healthy)</span>
          </button>

          <button
            onClick={() => applyTemplate('moderate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTemplate === 'moderate'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>2. Yellow (Moderate)</span>
          </button>

          <button
            onClick={() => applyTemplate('unhealthy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTemplate === 'unhealthy'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>3. Red (Limit)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Nutrient Customizer Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Food Package Metadata & Nutritional Values</h3>
            <span className="text-xs text-slate-400">Values per 100g standard</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Food Name</label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">MRP (₹)</label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Sugar (g)</label>
              <input
                type="number"
                step="0.1"
                value={sugar}
                onChange={(e) => setSugar(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">&lt;5g Grn / &gt;22.5g Red</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Fat (g)</label>
              <input
                type="number"
                step="0.1"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">&lt;3g Grn / &gt;17.5g Red</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Salt (g)</label>
              <input
                type="number"
                step="0.01"
                value={salt}
                onChange={(e) => setSalt(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">&lt;0.3g Grn / &gt;1.5g Red</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={cal}
                onChange={(e) => setCal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">&lt;200 Grn / &gt;400 Red</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-indigo-300 mb-1">Protein (g)</label>
              <input
                type="number"
                step="0.1"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full bg-slate-950 border border-indigo-900/60 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[10px] text-indigo-400/80 mt-0.5 block">&gt;10g High Protein</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1">Dietary Fiber (g)</label>
              <input
                type="number"
                step="0.1"
                value={fiber}
                onChange={(e) => setFiber(Number(e.target.value))}
                className="w-full bg-slate-950 border border-emerald-900/60 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-emerald-400/80 mt-0.5 block">&gt;6g High Dietary Fiber</span>
            </div>
          </div>

          {/* Encoded String Preview */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300">Exact QR Payload String:</span>
              <button
                onClick={copyPayload}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-36 leading-relaxed">
              {qrPayload}
            </pre>
          </div>
        </div>

        {/* Right: Live QR Code Preview & Download */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col items-center justify-between text-center">
          <div>
            <div className="flex items-center gap-1.5 justify-center mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                evalResult.overallColor === 'green'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : evalResult.overallColor === 'yellow'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                Auto-Tagged: {evalResult.overallColor.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-mono">Score: {evalResult.score}/100</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-xl inline-block border-4 border-slate-800 mb-4">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`${foodName} QR Code`}
                  className="w-52 h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <h4 className="text-base font-bold text-white">{foodName}</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{evalResult.linearModels.sugar.formula}</p>
          </div>

          <div className="w-full space-y-2 mt-4">
            <button
              onClick={downloadQrPng}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res QR (PNG)</span>
            </button>

            {onScanGeneratedFood && (
              <button
                onClick={() => onScanGeneratedFood(currentFood)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Inspect Live in Scan2Know
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
