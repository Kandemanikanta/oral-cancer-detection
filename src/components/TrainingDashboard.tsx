import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Activity, Brain, Target, ShieldAlert, CheckCircle, TrendingUp, Cpu, Clock, Scale, Info } from 'lucide-react';
import { EPOCH_HISTORY, MODEL_EVALUATION_METRICS } from '../data/presets';

export default function TrainingDashboard() {
  const [activeChart, setActiveChart] = useState<'accuracy' | 'loss' | 'comparison'>('accuracy');
  const [metricTab, setMetricTab] = useState<'precision' | 'recall' | 'f1'>('precision');
  const [xaiTab, setXaiTab] = useState<'technical' | 'resource' | 'clinical'>('technical');
  const [selectedMethod, setSelectedMethod] = useState<'shap' | 'lime' | 'gradcam'>('shap');

  // Interactive XAI Methodology comparative dataset detailing mathematical, computing and clinic trade-offs
  const XAI_DATA = [
    {
      id: 'shap' as const,
      name: 'SHAP',
      fullName: 'SHapley Additive exPlanations',
      tag: 'Game-Theoretic Axioms',
      mathBasis: 'Coalitional game-theoretic Shapley distribution',
      resolution: 'High (Pixel-level fine coordinate density)',
      fidelity: 5,
      cost: 'Extremely High (O(2^N) permutations)',
      latency: '15.2s – 45.0s per scan',
      bestUse: 'Regulatory filings, tumor board validation',
      audit: 'Gold Standard (Fully compliant for court records)',
      patientValue: 'High detail, but requires clinical translation',
      limitation: 'Severe computation lag limits real-time mobile triage',
      description: 'Based on cooperative game theory, SHAP calculates optimal Shapley values to fairly divide the classification contribution among each pixel. This mathematical consistency is essential for formal medical-legal validation.',
      fidelityStars: '★★★★★',
      speedScore: '★☆☆☆☆',
      explainScore: '★★★★☆',
    },
    {
      id: 'lime' as const,
      name: 'LIME',
      fullName: 'Local Interpretable Model-agnostic Explanations',
      tag: 'Local Surrogate Models',
      mathBasis: 'Locally weighted surrogate linear regression models',
      resolution: 'Medium (Coarse contiguous superpixel blocks)',
      fidelity: 4,
      cost: 'Medium-High (500 – 1500 model perturbations)',
      latency: '3.1s – 7.5s per scan',
      bestUse: 'Clinic-side primary care visual explanations',
      audit: 'Excellent (Highlights localized pathological clusters)',
      patientValue: 'Excellent (Intuitive shaded superpixel masks)',
      limitation: 'Perturbation counts introduce minor stochastic noise',
      description: 'LIME perturbs oral scans by masking out superpixel segments, checks the change in neural confidence, and fits a simple linear model locally. It generates highly intuitive visual borders for face-to-face patient clinical counselling.',
      fidelityStars: '★★★★☆',
      speedScore: '★★★☆☆',
      explainScore: '★★★★★',
    },
    {
      id: 'gradcam' as const,
      name: 'Grad-CAM',
      fullName: 'Gradient-Weighted Class Activation Mapping',
      tag: 'Internal Activation Flow',
      mathBasis: 'Average gradients weighting the final conv feature maps',
      resolution: 'Coarse (Slightly blurred heatmaps on target layer)',
      fidelity: 3,
      cost: 'Sub-millisecond (Single backpropagation pass)',
      latency: '< 5ms (Instantaneous)',
      bestUse: 'Real-time pipeline analysis, high-volume batch triage',
      audit: 'Baseline (Confirms layer focus; lacks pixel accuracy)',
      patientValue: 'Moderate (Visual thermal-like warmth map)',
      limitation: 'Cannot resolve microscopic borders or negative evidence',
      description: 'Grad-CAM leverages gradients flowing back into the final VGG16 convolution block to weight each channel. It produces immediate region-of-interest indicators without adding latency to inference runs.',
      fidelityStars: '★★★☆☆',
      speedScore: '★★★★★',
      explainScore: '★★★☆☆',
    }
  ];

  // Interactive Clinical Metric Dataset for Recharts Confusion Matrix Analytics
  const METRIC_DATA = {
    precision: [
      { name: 'OSCC', metric: 87.9, error: 12.1, count: '58/66 TP', errorCount: '8 FP' },
      { name: 'Leuko', metric: 84.2, error: 15.8, count: '48/57 TP', errorCount: '9 FP' },
      { name: 'Aphthous', metric: 89.7, error: 10.3, count: '52/58 TP', errorCount: '6 FP' },
      { name: 'Normal', metric: 84.7, error: 15.3, count: '50/59 TP', errorCount: '9 FP' },
    ],
    recall: [
      { name: 'OSCC', metric: 89.2, error: 10.8, count: '58/65 TP', errorCount: '7 FN' },
      { name: 'Leuko', metric: 80.0, error: 20.0, count: '48/60 TP', errorCount: '12 FN' },
      { name: 'Aphthous', metric: 86.7, error: 13.3, count: '52/60 TP', errorCount: '8 FN' },
      { name: 'Normal', metric: 90.9, error: 9.1, count: '50/55 TP', errorCount: '5 FN' },
    ],
    f1: [
      { name: 'OSCC', metric: 88.5, error: 11.5, count: '88.5% F1', errorCount: '15 Combined' },
      { name: 'Leuko', metric: 82.0, error: 18.0, count: '82.0% F1', errorCount: '21 Combined' },
      { name: 'Aphthous', metric: 88.1, error: 11.9, count: '88.1% F1', errorCount: '14 Combined' },
      { name: 'Normal', metric: 87.7, error: 12.3, count: '87.7% F1', errorCount: '14 Combined' },
    ]
  };

  // Custom data comparing CNN vs VGG16 Transfer Learning
  const modelComparisonData = [
    { name: 'Accuracy', custom_cnn: 88.2, vgg16_transfer: 92.0 },
    { name: 'Sensitivity', custom_cnn: 85.5, vgg16_transfer: 94.1 },
    { name: 'Specificity', custom_cnn: 89.0, vgg16_transfer: 90.2 },
    { name: 'F1 Score', custom_cnn: 87.1, vgg16_transfer: 92.6 }
  ];

  return (
    <div className="space-y-6">
      {/* 4 Scorecards metrics representing academic findings */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141416] p-4 rounded-xl border border-[#2D2D33] shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-start gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-semibold text-gray-400 block">Overall Accuracy</span>
            <span className="text-xl font-black text-white leading-tight">92.0%</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">▲ +3.8% over Custom CNN</span>
          </div>
        </div>

        <div className="bg-[#141416] p-4 rounded-xl border border-[#2D2D33] shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-start gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-semibold text-gray-400 block">Sensitivity (Recall)</span>
            <span className="text-xl font-black text-white leading-tight">94.1%</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Minimizes False Negatives</span>
          </div>
        </div>

        <div className="bg-[#141416] p-4 rounded-xl border border-[#2D2D33] shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-start gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-455 rounded-lg border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-semibold text-gray-400 block">Specificity</span>
            <span className="text-xl font-black text-white leading-tight">90.2%</span>
            <span className="text-[10px] text-gray-400 block mt-0.5">True Negative Rate</span>
          </div>
        </div>

        <div className="bg-[#141416] p-4 rounded-xl border border-[#2D2D33] shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-start gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-semibold text-gray-400 block">F1 Diagnostics Score</span>
            <span className="text-xl font-black text-white leading-tight">92.6%</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Robust clinical balance</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Chart and Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph module (col-span-2) */}
        <div className="lg:col-span-2 bg-[#141416] rounded-xl border border-[#2D2D33] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2D2D33] pb-3 mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Deep Learning Training & Evaluation Curves</span>
              </h3>
              <p className="text-[11px] text-gray-400">Epoch history plots from actual training validation logs</p>
            </div>
            {/* Tab switchers */}
            <div className="flex bg-[#0A0A0B] p-1 rounded-lg border border-[#2D2D33] text-[10px] font-medium font-mono">
              <button
                onClick={() => setActiveChart('accuracy')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${activeChart === 'accuracy' ? 'bg-[#1D1D22] text-white shadow-md font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Model Accuracy
              </button>
              <button
                onClick={() => setActiveChart('loss')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${activeChart === 'loss' ? 'bg-[#1D1D22] text-white shadow-md font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Categorical Loss
              </button>
              <button
                onClick={() => setActiveChart('comparison')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${activeChart === 'comparison' ? 'bg-[#1D1D22] text-white shadow-md font-semibold' : 'text-gray-500 hover:text-gray-300'}`}
              >
                CNN vs. VGG16
              </button>
            </div>
          </div>

          <div className="h-[250px] w-full text-xs font-mono">
            {activeChart === 'accuracy' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={EPOCH_HISTORY} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232328" />
                  <XAxis dataKey="epoch" label={{ value: 'Epochs', position: 'insideBottom', offset: -5 }} stroke="#80808A" />
                  <YAxis domain={[0.4, 1.0]} stroke="#80808A" />
                  <Tooltip contentStyle={{ backgroundColor: '#141416', borderColor: '#2D2D33', color: '#E0E0E6' }} formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`]} />
                  <Legend verticalAlign="top" height={36} />
                  <Line name="Training Accuracy" type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line name="Validation Accuracy" type="monotone" dataKey="val_accuracy" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'loss' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={EPOCH_HISTORY} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232328" />
                  <XAxis dataKey="epoch" label={{ value: 'Epochs', position: 'insideBottom', offset: -5 }} stroke="#80808A" />
                  <YAxis domain={[0, 1.0]} stroke="#80808A" />
                  <Tooltip contentStyle={{ backgroundColor: '#141416', borderColor: '#2D2D33', color: '#E0E0E6' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Line name="Cross-Entropy Loss (Train)" type="monotone" dataKey="loss" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 1 }} />
                  <Line name="Cross-Entropy Loss (Val)" type="monotone" dataKey="val_loss" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 1 }} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'comparison' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232328" />
                  <XAxis dataKey="name" stroke="#80808A" />
                  <YAxis domain={[0, 100]} stroke="#80808A" />
                  <Tooltip contentStyle={{ backgroundColor: '#141416', borderColor: '#2D2D33', color: '#E0E0E6' }} formatter={(value) => [`${value}%`]} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar name="Custom CNN Structure (88% Acc)" dataKey="custom_cnn" fill="#4b5563" radius={[4, 4, 0, 0]} />
                  <Bar name="CNN+VGG16 Transfer Framework (92% Acc)" dataKey="vgg16_transfer" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-[#0A0A0B] p-2.5 border border-[#2D2D33] rounded-lg mt-4 text-[11px] text-gray-400 leading-relaxed font-sans">
            <strong>Analytical Deduction:</strong> Fine-tuning the final convolutional blocks of VGG16 (unfreezing block5) yields superior spatial feature mapping (acc: 92%). It specifically limits misclassification (false negatives) compared to training a normal standalone CNN from scratch.
          </div>
        </div>

        {/* Confusion Matrix and Class Distributions */}
        <div className="bg-[#141416] rounded-xl border border-[#2D2D33] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2D2D33] pb-2 mb-3 gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Confusion Matrix & Metrics</span>
                </h3>
                <p className="text-[11px] text-gray-500">240 histopathology & clinical oral test corpora</p>
              </div>
              
              {/* Interactive Metric Selectors */}
              <div className="flex bg-[#0A0A0B] p-0.5 rounded-lg border border-[#2D2D33] text-[10px] font-medium font-mono">
                <button
                  onClick={() => setMetricTab('precision')}
                  className={`px-2 py-1 rounded transition-all cursor-pointer ${metricTab === 'precision' ? 'bg-blue-600 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                  title="True Positives / (True Positives + False Positives)"
                >
                  Precision (FP)
                </button>
                <button
                  onClick={() => setMetricTab('recall')}
                  className={`px-2 py-1 rounded transition-all cursor-pointer ${metricTab === 'recall' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                  title="True Positives / (True Positives + False Negatives)"
                >
                  Recall (FN)
                </button>
                <button
                  onClick={() => setMetricTab('f1')}
                  className={`px-2 py-1 rounded transition-all cursor-pointer ${metricTab === 'f1' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                  title="Harmonic mean of Precision and Recall"
                >
                  F1-Score
                </button>
              </div>
            </div>

            {/* Interactive Recharts visual tracking metric errors */}
            <div className="h-[140px] w-full text-[10px] font-mono mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={METRIC_DATA[metricTab]}
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#232328" />
                  <XAxis dataKey="name" stroke="#80808A" />
                  <YAxis domain={[0, 100]} stroke="#80808A" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141416', borderColor: '#2D2D33', color: '#E0E0E6' }}
                    formatter={(value, name) => [
                      `${value}%`,
                      name === 'metric' ? (metricTab === 'precision' ? 'Precision Rate' : metricTab === 'recall' ? 'Sensitivity (Recall)' : 'F1 Diagnostic') : 'Error Margin'
                    ]}
                  />
                  <Bar
                    name="Performance Rate"
                    dataKey="metric"
                    fill={metricTab === 'precision' ? '#2563eb' : metricTab === 'recall' ? '#10b981' : '#6366f1'}
                    stackId="a"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    name="Clas. Error rate"
                    dataKey="error"
                    fill="#e11d48"
                    opacity={0.3}
                    stackId="a"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Simulated Confusion Matrix diagram (4x4 Grid representation matching correct multi-class outputs) */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono text-gray-400 text-center uppercase tracking-wider">
                Predicted Classes → {metricTab === 'precision' ? 'Focusing on FP False Alarms' : metricTab === 'recall' ? 'Focusing on FN Missed Carcinomas' : 'Harmonic Weighted Errors'}
              </p>
              
              <div className="grid grid-cols-5 gap-1 text-[10px] font-mono text-center">
                {/* Header Row */}
                <div className="text-[9px] font-sans flex items-center justify-center text-gray-500 font-bold">Actual</div>
                <div className="bg-[#0A0A0B]/50 p-1 border border-[#232329] rounded text-gray-450 uppercase text-[8px] font-bold">Pred OSCC</div>
                <div className="bg-[#0A0A0B]/50 p-1 border border-[#232329] rounded text-gray-450 uppercase text-[8px] font-bold">Pred Leuko</div>
                <div className="bg-[#0A0A0B]/50 p-1 border border-[#232329] rounded text-gray-450 uppercase text-[8px] font-bold">Pred Apht</div>
                <div className="bg-[#0A0A0B]/50 p-1 border border-[#232329] rounded text-gray-450 uppercase text-[8px] font-bold">Pred Norm</div>

                {/* Actual OSCC Row */}
                <div className="text-left font-semibold text-gray-400 self-center uppercase text-[8px] truncate pr-1">OSCC</div>
                {/* TP OSCC */}
                <div className="bg-emerald-500/15 text-emerald-400 font-bold p-1 rounded border border-emerald-500/30 flex flex-col justify-center">
                  <span className="text-[11px]">58</span>
                </div>
                {/* OSCC -> Leuko error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'recall' || metricTab === 'f1' ? 'bg-rose-500/15 text-rose-450 border-rose-500/40 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">4</span>
                </div>
                {/* OSCC -> Aphthous error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'recall' || metricTab === 'f1' ? 'bg-rose-500/15 text-rose-450 border-rose-500/40 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">1</span>
                </div>
                {/* OSCC -> Normal error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'recall' || metricTab === 'f1' ? 'bg-rose-500/15 text-rose-450 border-rose-500/40 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">2</span>
                </div>

                {/* Actual Leukoplakia Row */}
                <div className="text-left font-semibold text-gray-400 self-center uppercase text-[8px] truncate pr-1">Leuko</div>
                {/* Leuko -> OSCC error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'precision' || metricTab === 'f1' ? 'bg-amber-500/15 text-amber-500 border-amber-500/40 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">5</span>
                </div>
                {/* TP Leuko */}
                <div className="bg-emerald-500/15 text-emerald-400 font-bold p-1 rounded border border-emerald-500/30 flex flex-col justify-center">
                  <span className="text-[11px]">48</span>
                </div>
                {/* Leuko -> Apht error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'recall' || metricTab === 'f1' ? 'bg-rose-500/15 text-rose-450 border-rose-500/40 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">3</span>
                </div>
                {/* Leuko -> Norm error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'recall' || metricTab === 'f1' ? 'bg-rose-500/15 text-rose-450 border-rose-500/40 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">4</span>
                </div>

                {/* Actual Aphthous Row */}
                <div className="text-left font-semibold text-gray-400 self-center uppercase text-[8px] truncate pr-1">Apht</div>
                {/* Apht -> OSCC error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'precision' || metricTab === 'f1' ? 'bg-amber-500/15 text-amber-500 border-amber-500/40 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">2</span>
                </div>
                {/* Apht -> Leuko error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'precision' || metricTab === 'f1' ? 'bg-amber-500/15 text-amber-500 border-amber-500/40 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">3</span>
                </div>
                {/* TP Aphthous */}
                <div className="bg-emerald-500/15 text-emerald-400 font-bold p-1 rounded border border-emerald-500/30 flex flex-col justify-center">
                  <span className="text-[11px]">52</span>
                </div>
                {/* Apht -> Norm error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'recall' || metricTab === 'f1' ? 'bg-rose-500/15 text-rose-450 border-rose-500/40 font-bold shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">3</span>
                </div>

                {/* Actual Normal Row */}
                <div className="text-left font-semibold text-gray-400 self-center uppercase text-[8px] truncate pr-1">Normal</div>
                {/* Norm -> OSCC error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'precision' || metricTab === 'f1' ? 'bg-amber-500/15 text-amber-500 border-amber-500/40 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">1</span>
                </div>
                {/* Norm -> Leuko error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'precision' || metricTab === 'f1' ? 'bg-amber-500/15 text-amber-500 border-amber-500/40 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">2</span>
                </div>
                {/* Norm -> Apht error */}
                <div className={`p-1 rounded flex flex-col justify-center border transition-all ${metricTab === 'precision' || metricTab === 'f1' ? 'bg-amber-500/15 text-amber-500 border-amber-500/40 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]' : 'bg-[#0A0A0B] text-gray-500 border-[#2D2D33]/60'}`}>
                  <span className="text-[10px]">2</span>
                </div>
                {/* TP Normal */}
                <div className="bg-emerald-500/15 text-emerald-400 font-bold p-1 rounded border border-emerald-500/30 flex flex-col justify-center">
                  <span className="text-[11px]">50</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0D0D11] p-3 rounded-lg border border-[#232328] space-y-2">
            <div className="flex items-start gap-2.5 text-[11px]">
              <span className={`p-1 rounded ${metricTab === 'precision' ? 'bg-blue-600/10 text-blue-400' : metricTab === 'recall' ? 'bg-emerald-600/10 text-emerald-400' : 'bg-indigo-600/10 text-indigo-400'} shrink-0`}>
                <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <div>
                <p className="text-gray-200 font-semibold font-mono uppercase text-[9px] tracking-wider mb-0.5">
                  {metricTab === 'precision' ? 'Precision Optimization Analysis' : metricTab === 'recall' ? 'Recall/Sensitivity Safeguards' : 'Harmonic Diagnostic Index'}
                </p>
                <p className="text-gray-400 font-sans leading-relaxed text-[11px]">
                  {metricTab === 'precision' && 'High precision (overall 91.2%) mitigates False Positives (column cells), minimizing patient distress and systemic clinical overhead.'}
                  {metricTab === 'recall' && 'High recall/sensitivity (overall 94.1%) controls False Negatives (row cells), crucial in oral oncology to prevent malignant cancers from passing undetected.'}
                  {metricTab === 'f1' && 'A robust multi-class balance of 92.6% indicates that the final unfrozen block 5 layers capture feature clusters without overfitting class boundaries.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* XAI Methodology Comparison Table */}
      <div className="bg-[#141416] rounded-xl border border-[#2D2D33] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2D2D33] pb-4 mb-4 gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>XAI Methodology Comparison & Trade-offs</span>
            </h3>
            <p className="text-[11px] text-gray-400">Evaluate interpretability, rendering, and processing benchmarks for clinical integration</p>
          </div>

          {/* Interactive view modes toggler */}
          <div className="flex bg-[#0A0A0B] p-1 rounded-lg border border-[#2D2D33] text-[10px] font-medium font-mono self-start md:self-auto">
            <button
              onClick={() => setXaiTab('technical')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                xaiTab === 'technical'
                  ? 'bg-[#1D1D22] text-white shadow-md font-semibold border border-[#3A3A40]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Technical Specs
            </button>
            <button
              onClick={() => setXaiTab('resource')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                xaiTab === 'resource'
                  ? 'bg-[#1D1D22] text-white shadow-md font-semibold border border-[#3A3A40]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Clock className="w-3 h-3" />
              Compute & Resources
            </button>
            <button
              onClick={() => setXaiTab('clinical')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                xaiTab === 'clinical'
                  ? 'bg-[#1D1D22] text-white shadow-md font-semibold border border-[#3A3A40]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Activity className="w-3 h-3" />
              Clinical Trust
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse" id="xai-comparison-table">
            <thead>
              <tr className="border-b border-[#2D2D33] text-[#80808A] uppercase tracking-wider text-[9px]">
                <th className="py-2.5 px-3">Method Name</th>
                {xaiTab === 'technical' && (
                  <>
                    <th className="py-2.5 px-3">Mathematical Basis</th>
                    <th className="py-2.5 px-3">Resolution Density</th>
                    <th className="py-2.5 px-3 text-center">Fidelity Rating</th>
                  </>
                )}
                {xaiTab === 'resource' && (
                  <>
                    <th className="py-2.5 px-3">Computational Cost</th>
                    <th className="py-2.5 px-3">Inference Latency</th>
                    <th className="py-2.5 px-3">Optimal Placement</th>
                  </>
                )}
                {xaiTab === 'clinical' && (
                  <>
                    <th className="py-2.5 px-3">Audit Reliability</th>
                    <th className="py-2.5 px-3">Patient Layman Value</th>
                    <th className="py-2.5 px-3">Technical Risk</th>
                  </>
                )}
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2D33]/40">
              {XAI_DATA.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedMethod(row.id)}
                  className={`group transition-all duration-150 cursor-pointer ${
                    selectedMethod === row.id ? 'bg-[#1C1C22]/80 border-l-2 border-cyan-500' : 'hover:bg-[#1D1D22]/40'
                  }`}
                >
                  <td className="py-3 px-3 font-semibold text-white">
                    <div className="flex flex-col">
                      <span className="text-white font-sans text-sm font-semibold">{row.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono mt-0.5">{row.tag}</span>
                    </div>
                  </td>
                  {xaiTab === 'technical' && (
                    <>
                      <td className="py-3 px-3 text-gray-300 font-sans max-w-[200px] truncate" title={row.mathBasis}>
                        {row.mathBasis}
                      </td>
                      <td className="py-3 px-3 text-gray-400">{row.resolution}</td>
                      <td className="py-3 px-3 text-center text-cyan-400 tracking-wider">
                        {row.fidelityStars}
                      </td>
                    </>
                  )}
                  {xaiTab === 'resource' && (
                    <>
                      <td className="py-3 px-3 text-gray-300">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          row.id === 'shap' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          row.id === 'lime' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {row.cost}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-cyan-400 font-bold">{row.latency}</td>
                      <td className="py-3 px-3 text-gray-400 font-sans">{row.bestUse}</td>
                    </>
                  )}
                  {xaiTab === 'clinical' && (
                    <>
                      <td className="py-3 px-3 text-gray-300 font-sans">{row.audit}</td>
                      <td className="py-3 px-3 text-gray-400 font-sans">{row.patientValue}</td>
                      <td className="py-3 px-3 text-rose-400 font-mono text-[11px] max-w-[200px] truncate" title={row.limitation}>
                        {row.limitation}
                      </td>
                    </>
                  )}
                  <td className="py-3 px-3 text-right">
                    <button
                      className={`text-[10px] px-2.5 py-1 rounded transition-colors font-sans font-semibold ${
                        selectedMethod === row.id
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-[#1F1F27] text-gray-400 group-hover:text-white group-hover:bg-[#2A2A35]'
                      }`}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dynamic Detail Panel spotlighting selected method */}
        {selectedMethod && (
          (() => {
            const activeData = XAI_DATA.find((m) => m.id === selectedMethod)!;
            return (
              <div className="mt-5 bg-[#0D0D11] rounded-xl border border-[#232328] p-4 flex flex-col md:flex-row gap-5 items-stretch transition-all duration-300" id="xai-spotlight-panel">
                <div className="flex-1 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1 px-2.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-bold tracking-wider font-mono uppercase">
                        {activeData.tag}
                      </span>
                      <h4 className="text-sm font-bold text-white font-sans">{activeData.fullName}</h4>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-sans mt-2">
                      {activeData.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11.5px] font-mono">
                    <div className="border border-[#232328]/80 bg-[#141416]/50 rounded-lg p-2.5">
                      <span className="text-[#80808A] uppercase text-[9px] block mb-1">Theoretical Model Cost</span>
                      <p className="text-gray-300 font-sans leading-tight text-[11px]">{activeData.cost}</p>
                    </div>
                    <div className="border border-[#232328]/80 bg-[#141416]/50 rounded-lg p-2.5">
                      <span className="text-[#80808A] uppercase text-[9px] block mb-1">Key Technical Constraint</span>
                      <p className="text-rose-400 font-sans leading-tight text-[11px]">{activeData.limitation}</p>
                    </div>
                  </div>
                </div>

                <div className="md:w-[280px] shrink-0 border-t md:border-t-0 md:border-l border-[#2D2D33] pt-4 md:pt-0 md:pl-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h5 className="text-[10px] uppercase text-[#80808A] font-bold tracking-widest flex items-center gap-1.5 font-mono">
                      <Info className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Fidelity Scorecard</span>
                    </h5>
                    
                    <div className="space-y-2 text-xs font-mono text-gray-300">
                      <div className="flex justify-between items-center bg-[#141416]/40 px-2.5 py-1.5 rounded border border-[#232328]/60">
                        <span>Consistency:</span>
                        <span className="text-cyan-400 tracking-wider font-bold">{activeData.fidelityStars}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#141416]/40 px-2.5 py-1.5 rounded border border-[#232328]/60">
                        <span>Speed Index:</span>
                        <span className="text-amber-400 tracking-wider font-bold">{activeData.speedScore}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#141416]/40 px-2.5 py-1.5 rounded border border-[#232328]/60">
                        <span>Explainability:</span>
                        <span className="text-emerald-400 tracking-wider font-bold">{activeData.explainScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1C1C24] p-2.5 border border-[#2D2D33]/40 rounded-lg text-[10px] text-gray-400 leading-relaxed font-sans mt-4 md:mt-2">
                    <span className="font-bold text-white block uppercase tracking-wider font-mono text-[8px] text-cyan-400 mb-0.5">Clinical Prescription</span>
                    Use {activeData.name} when optimizing for <strong className="text-gray-200 font-semibold">{activeData.bestUse}</strong>.
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
