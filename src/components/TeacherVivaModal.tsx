import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  Check, 
  Copy, 
  HelpCircle, 
  Sparkles,
  Award
} from 'lucide-react';

interface TeacherVivaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherVivaModal: React.FC<TeacherVivaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const script = `"I also checked if it’s healthy using FSSAI rules. Since sugar is 20g per 100g, my QR shows 'Yellow - Eat in Limit'. The linear polynomial S(x) = 0.2x helped me calculate that 250g gives 50g sugar, which is the full day limit."`;

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">CBSE Viva Cheat Sheet & Teacher Pitch</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* 10-Second Script */}
          <div className="bg-indigo-950/40 p-5 rounded-2xl border border-indigo-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                What to Tell Teacher (10-Second Script)
              </span>
              <button
                onClick={copyScript}
                className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-indigo-900/60 px-2.5 py-1 rounded-lg border border-indigo-700/50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              After you state that the polynomial graph is a straight line through the origin, immediately deliver:
            </p>

            <blockquote className="p-3.5 rounded-xl bg-slate-950 border-l-4 border-amber-400 text-sm font-medium text-slate-200 leading-relaxed italic">
              {script}
            </blockquote>
          </div>

          {/* Key Viva Questions & Bullet Answers */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Frequently Asked Viva Questions
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-1">
                  Viva Q1: How do you know Marie Biscuits are moderately healthy and not red?
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> &quot;Ma&apos;am, FSSAI regulations state that more than 22.5g sugar per 100g is categorized as High Sugar (Red), while less than 5g is Healthy (Green). Marie Biscuits have 20g of sugar per 100g, which lies in the intermediate zone. Hence, it receives a Yellow tag (&apos;Eat in limit, not daily&apos;).&quot;
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-1">
                  Viva Q2: What is the mathematical significance of S(x) = 0.2x?
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> &quot;Sir, it is a degree-1 linear polynomial P(x) = mx + c. Since zero portion means zero sugar consumed, the constant term c = 0. The slope m = 20/100 = 0.20 represents the rate of sugar consumed per gram of biscuits eaten. By solving 0.20x = 50, we determine that 250g of biscuits equals the maximum adult daily free sugar limit.&quot;
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-1">
                  Viva Q3: Did you test comparison with Green and Red items?
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> &quot;Yes! I compared Rolled Oats (Sugar: 1.8g/100g, S(x) = 0.018x, Green tag) with Chocolate Spread (Sugar: 56g/100g, S(x) = 0.56x, Red tag). The slope of the chocolate spread is 31 times steeper than oats, reaching the danger limit in just 89g.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Quick Matrix Cheat Table */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-bold text-slate-300 block mb-2">
              FSSAI Standard Cheat Table (Per 100g):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Sugar:</span>
                <span className="text-emerald-400">&lt;5g (Green)</span><br />
                <span className="text-rose-400">&gt;22.5g (Red)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Total Fat:</span>
                <span className="text-emerald-400">&lt;3g (Green)</span><br />
                <span className="text-rose-400">&gt;17.5g (Red)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Salt:</span>
                <span className="text-emerald-400">&lt;0.3g (Green)</span><br />
                <span className="text-rose-400">&gt;1.5g (Red)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Calories:</span>
                <span className="text-emerald-400">&lt;200 kcal</span><br />
                <span className="text-rose-400">&gt;400 kcal</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
