import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Keyboard, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { FoodItem } from '../types/nutrition';
import { SAMPLE_FOODS } from '../data/sampleFoods';
import { formatQrPayload, parseQrText } from '../utils/fssaiEngine';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodScanned: (food: FoodItem) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onFoodScanned,
}) => {
  const [mode, setMode] = useState<'presets' | 'camera' | 'manual'>('presets');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [rawInput, setRawInput] = useState<string>(
`Marie Biscuits
MRP: Rs.30
Expiry: 01/11/2026
Sugar/100g: 20g
Fat/100g: 15g
Salt/100g: 1.2g
Calories/100g: 450
Protein/100g: 7.2g
Fiber/100g: 2.5g
Health Tag: High Sugar - Eat in limit`
  );

  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-container';

  useEffect(() => {
    if (mode === 'camera' && isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!qrReaderRef.current) {
        qrReaderRef.current = new Html5Qrcode(scannerContainerId);
      }
      setCameraActive(true);
      await qrReaderRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleDecodedPayload(decodedText);
          stopCamera();
        },
        () => {
          // ignore scan frames
        }
      );
    } catch (err: any) {
      console.warn('Camera start failed or permission denied:', err);
      setCameraError(
        'Camera access not available or blocked in this environment. You can use 1-Click Presets or paste QR text below!'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (qrReaderRef.current && qrReaderRef.current.isScanning) {
      try {
        await qrReaderRef.current.stop();
      } catch (err) {
        console.error('Stop camera error', err);
      }
    }
    setCameraActive(false);
  };

  const handleDecodedPayload = (raw: string) => {
    const parsed = parseQrText(raw);
    if (parsed) {
      const fullItem: FoodItem = {
        id: parsed.id || 'scanned_' + Date.now(),
        name: parsed.name || 'Scanned Food Item',
        mrp: parsed.mrp || 30,
        expiry: parsed.expiry || '01/11/2026',
        servingSizeGrams: parsed.servingSizeGrams || 50,
        sugarPer100g: parsed.sugarPer100g || 0,
        fatPer100g: parsed.fatPer100g || 0,
        saltPer100g: parsed.saltPer100g || 0,
        caloriesPer100g: parsed.caloriesPer100g || 0,
        proteinPer100g: parsed.proteinPer100g || 0,
        fiberPer100g: parsed.fiberPer100g || 0,
        category: 'Scanned Product',
      };
      onFoodScanned(fullItem);
      onClose();
    }
  };

  const handleSelectPreset = (food: FoodItem) => {
    onFoodScanned(food);
    onClose();
  };

  const handleManualSubmit = () => {
    handleDecodedPayload(rawInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              Scan2Know Food Scanner
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Read FSSAI nutritional QR code data & test instant health evaluation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950/40">
          <button
            onClick={() => setMode('presets')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              mode === 'presets'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            1-Click Test Packets
          </button>

          <button
            onClick={() => setMode('camera')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              mode === 'camera'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            Live Camera Scan
          </button>

          <button
            onClick={() => setMode('manual')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              mode === 'manual'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Paste Raw QR Text
          </button>
        </div>

        {/* Body content based on mode */}
        <div className="p-5 flex-1">
          {mode === 'presets' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Select one of the calibrated reference food items to instantly inspect its FSSAI health grade and CBSE linear polynomial:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_FOODS.map((food) => {
                  const isGreen = food.sugarPer100g < 5 && food.fatPer100g < 3;
                  const isYellow = food.sugarPer100g >= 5 && food.sugarPer100g <= 22.5 && food.fatPer100g <= 17.5;
                  const tagType = isGreen ? 'green' : isYellow ? 'yellow' : 'red';

                  return (
                    <div
                      key={food.id}
                      onClick={() => handleSelectPreset(food)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] ${
                        tagType === 'green'
                          ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                          : tagType === 'yellow'
                          ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                          : 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-sm text-white">{food.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          tagType === 'green' ? 'bg-emerald-500/20 text-emerald-300' :
                          tagType === 'yellow' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {tagType} Tag
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300 mt-2">
                        <span>Sugar: <strong className="text-white">{food.sugarPer100g}g</strong></span>
                        <span>•</span>
                        <span>Fat: <strong className="text-white">{food.fatPer100g}g</strong></span>
                        <span>•</span>
                        <span>MRP: <strong className="text-white">₹{food.mrp}</strong></span>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <span className="font-mono text-indigo-400">S(x) = {(food.sugarPer100g / 100).toFixed(2)}x</span>
                        <span className="flex items-center gap-1 text-slate-300 font-semibold group-hover:text-emerald-400">
                          Scan &check;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {mode === 'camera' && (
            <div className="space-y-4">
              <div 
                id={scannerContainerId} 
                className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-950 min-h-[260px] flex items-center justify-center text-slate-500 text-xs"
              >
                {!cameraActive && !cameraError && <span>Initializing camera feed...</span>}
              </div>

              {cameraError && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300">
                  <div className="font-bold mb-1">Camera Notice:</div>
                  {cameraError}
                  <div className="mt-2">
                    <button
                      onClick={() => setMode('presets')}
                      className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                    >
                      Use 1-Click Presets
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400 text-center">
                Point your device camera at any food product QR code generated by Scan2Know.
              </p>
            </div>
          )}

          {mode === 'manual' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                Paste the text encoded inside the QR code (as described in your CBSE project syllabus):
              </div>

              <textarea
                rows={8}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleManualSubmit}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  Parse & Check Health
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
