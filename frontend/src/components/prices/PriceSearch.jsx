import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { VEHICLE_PRESETS } from '../../constants/location';
import {
  Mic,
  MicOff,
  Sliders,
  Truck,
  RefreshCw,
  Check,
  Search,
  Sparkles,
  Volume2,
  AlertCircle
} from 'lucide-react';

export default function PriceSearch({
  selectedVehicle = VEHICLE_PRESETS[1],
  onVehicleChange,
  customRatePerKm = 14,
  onCustomRateChange,
  onVoiceDetected,
  onCalculate
}) {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [manualText, setManualText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [appliedInfo, setAppliedInfo] = useState(null);
  const recognitionRef = useRef(null);

  const samplePrompts = [
    { label: '🧅 10Q Onion Nashik', text: '10 quintal onion in Nashik Maharashtra' },
    { label: '🌾 20Q Wheat Gurugram', text: '20 quintal wheat in Gurugram Haryana' },
    { label: '🍅 25Q Tomato Kolar', text: '25 quintal tomato in Kolar Karnataka' },
    { label: '🌱 30Q Soybean Indore', text: '30 quintal soybean in Indore Madhya Pradesh' },
    { label: '🌾 50Q Wheat Khanna', text: '50 quintal wheat in Khanna Punjab' }
  ];

  const applyQuery = (text) => {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    setVoiceText(clean);
    setSpeechError(null);

    if (onVoiceDetected) {
      onVoiceDetected(clean);
      setAppliedInfo(`Applied: "${clean}"`);
      setTimeout(() => setAppliedInfo(null), 4000);
    }
  };

  // Web Speech API Voice Recognition
  const handleToggleVoice = (e) => {
    e?.stopPropagation?.();
    setSpeechError(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Voice recording is not supported in this browser. You can type your query below.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        applyQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition event error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access or type your query below.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please speak closer to the microphone or tap a quick chip.');
        } else {
          setSpeechError(`Voice error (${event.error}). Please type query or tap a quick chip.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition exception:', err);
      setIsListening(false);
      setSpeechError('Could not start voice listener. You can type your query below.');
    }
  };

  const handleSelectVehicle = (v) => {
    if (onVehicleChange) onVehicleChange(v);
    if (onCustomRateChange) onCustomRateChange(v.ratePerKm);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualText.trim()) {
      applyQuery(manualText);
      setManualText('');
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5">
      {/* Header with Advanced Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            {t('vehicleSelector')}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Simple View' : t('editParams')}</span>
        </button>
      </div>

      {/* Voice / Natural Language Assistant Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div
            onClick={handleToggleVoice}
            className="flex items-center gap-3 cursor-pointer flex-1 select-none"
          >
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-md ${
                isListening
                  ? 'bg-red-500 text-white ring-4 ring-red-400/40 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
              }`}
              title="Click to speak"
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                {isListening ? (
                  <span className="text-red-600 animate-pulse flex items-center gap-1">
                    <Volume2 className="w-4 h-4" /> Listening... Speak now
                  </span>
                ) : (
                  <span>Tap to speak (e.g. "10 quintals onion near Nashik")</span>
                )}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Speak or type in Hindi, Marathi, or English (Auto-selects crop, quantity & mandi location)
              </p>
            </div>
          </div>

          {appliedInfo && (
            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1 shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-700" /> {appliedInfo}
            </span>
          )}
        </div>

        {/* Quick Voice / Query Chips */}
        <div className="pt-1 flex flex-wrap items-center gap-1.5 border-t border-emerald-200/60">
          <span className="text-[10px] font-bold text-emerald-800 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick Ask:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyQuery(p.text)}
              className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-emerald-100/90 text-slate-700 hover:text-emerald-900 border border-emerald-200 text-[11px] font-bold transition-all shadow-2xs active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Text Search Fallback Input */}
        <form onSubmit={handleManualSubmit} className="pt-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Or type here (e.g. '20 quintals wheat in Gurugram')..."
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={!manualText.trim()}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs shrink-0"
          >
            Apply
          </button>
        </form>

        {/* Speech Error Warning Alert */}
        {speechError && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}
      </div>

      {/* Vehicle Preset Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {VEHICLE_PRESETS.map((v) => {
          const isSelected = selectedVehicle?.id === v.id;
          const localizedName =
            language === 'hi' ? v.hindiName : language === 'mr' ? v.marathiName : v.name;

          return (
            <div
              key={v.id}
              onClick={() => handleSelectVehicle(v)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-2xl block mb-1">{v.icon}</span>
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate" title={localizedName}>
                  {localizedName}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Max {v.capacityQuintals}Q ({v.capacityQuintals * 100}kg)
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-extrabold text-emerald-700">₹{v.ratePerKm}/km</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Adjusters (Rate per km & Recalculate) */}
      {showAdvanced && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {t('customRatePerKm')}
                </label>
                <span className="text-xs font-extrabold text-emerald-700">
                  ₹{customRatePerKm} / km
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={customRatePerKm}
                onChange={(e) => onCustomRateChange && onCustomRateChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="shrink-0 flex items-end">
              <button
                type="button"
                onClick={() => onCalculate && onCalculate()}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recalculate Net Profit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}