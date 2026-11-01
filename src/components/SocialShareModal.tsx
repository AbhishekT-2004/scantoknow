import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Dna, 
  Wheat, 
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { FoodItem, HealthEvaluation } from '../types/nutrition';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: FoodItem;
  evaluation: HealthEvaluation;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  food,
  evaluation,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const shareText = `🔍 I just scanned "${food.name}" on Scan2Know!
✨ Health Score: ${evaluation.score}/100 (Grade ${evaluation.grade})
🚥 FSSAI Status: ${evaluation.tag}
📐 CBSE Linear Model: ${evaluation.linearModels.sugar.formula} (Safe Limit: ${evaluation.linearModels.sugar.maxSafePortionGrams}g)
🥦 Fiber: ${food.fiberPer100g || 0}g | 🥩 Protein: ${food.proteinPer100g || 0}g

Can you beat my health score? Scan your grocery snacks with Scan2Know!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Scan2Know: ${food.name} Health Score`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // user cancelled or failed
      }
    } else {
      handleCopy();
    }
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Share Health Progress with Friends</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Card Preview */}
        <div className="p-5">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-5 rounded-2xl border border-indigo-500/30 shadow-lg relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                  Scan2Know Health Audit
                </span>
                <h4 className="text-xl font-extrabold text-white mt-1.5">{food.name}</h4>
                <p className="text-xs text-slate-400 font-mono">₹{food.mrp} • Sugar: {food.sugarPer100g}g/100g</p>
              </div>

              {/* Circular Score Badge */}
              <div className="text-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/60">
                <div className="text-2xl font-black text-white">{evaluation.score}</div>
                <div className="text-[9px] uppercase font-bold text-slate-400">Score / 100</div>
              </div>
            </div>

            {/* Traffic tag */}
            <div className="mt-3 py-1.5 px-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                evaluation.overallColor === 'green' ? 'bg-emerald-400' :
                evaluation.overallColor === 'yellow' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className="font-semibold truncate">{evaluation.tag}</span>
            </div>

            {/* Macros pill */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-300">
                <Dna className="w-3.5 h-3.5" />
                <span>Protein: <strong>{food.proteinPer100g || 0}g</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <Wheat className="w-3.5 h-3.5" />
                <span>Fiber: <strong>{food.fiberPer100g || 0}g</strong></span>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-500 font-mono text-right">
              CBSE Maths: {evaluation.linearModels.sugar.formula}
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md shadow-indigo-600/20"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Card</span>
            </button>

            <button
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
