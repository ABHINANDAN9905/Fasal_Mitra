import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { VEHICLE_PRESETS } from '../../constants/location';
import { Mic, MicOff, Sliders, Truck, RefreshCw, Check } from 'lucide-react';

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Web Speech API Voice Recognition
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        if (onVoiceDetected) {
          onVoiceDetected(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSelectVehicle = (v) => {
    if (onVehicleChange) onVehicleChange(v);
    if (onCustomRateChange) onCustomRateChange(v.ratePerKm);
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

      {/* Voice Assistant Search Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 shadow-sm ${
              isListening
                ? 'bg-red-500 text-white animate-ping'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
            title={t('speakInputPrompt')}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {isListening ? t('listeningPrompt') : t('speakInputPrompt')}
            </p>
            {voiceText ? (
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Recognized: "{voiceText}"
              </p>
            ) : (
              <p className="text-[10px] text-slate-500 mt-0.5">
                (Hindi, Marathi & English supported)
              </p>
            )}
          </div>
        </div>

        {voiceText && (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-3 h-3" /> Auto-Applied
          </span>
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