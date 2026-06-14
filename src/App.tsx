import React, { useState } from 'react';
import { BookOpen, Cpu, Code2, LineChart, FileText, Sparkles, Activity, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DiagnosticSandbox from './components/DiagnosticSandbox';
import TrainingDashboard from './components/TrainingDashboard';
import CodeExporter from './components/CodeExporter';
import AcademicSRS from './components/AcademicSRS';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'training' | 'code' | 'srs'>('sandbox');

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E6] flex flex-col font-sans selection:bg-blue-900 selection:text-white">
      
      {/* Clinician Hub: Header Bar */}
      <header className="bg-[#0F0F12] border-b border-[#2D2D33] py-4 px-6 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Activity className="w-5 h-5 animate-pulse text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  Explainable AI (XAI)
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Acc: 92.0%
                </span>
              </div>
              <h1 className="text-md sm:text-lg font-black text-white tracking-tight leading-tight mt-1">
                Oral Cancer Diagnostics Support Neural Network
              </h1>
              <p className="text-[11px] text-gray-400">
                Department of Computational Intelligence, Malla Reddy College of Engineering (Batch: 21CIMP1D16)
              </p>
            </div>
          </div>

          {/* Academic Team Profiles */}
          <div className="flex flex-col text-right text-[11px] font-mono text-gray-400 border-l pl-4 border-[#2D2D33] md:border-l-2">
            <span className="font-semibold text-gray-200">Student Team: K. Manikanta, S. Ashraf, M. Bharath</span>
            <span>Supervisor: Dr. V. L. PadmaLatha (Assistant Professor)</span>
            <span className="text-[10px] text-gray-500">Academic Project Ref: 21N31A7322 / MRCET Core</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2D2D33] pb-px gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold font-mono tracking-tight transition border-b-2 whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>1. Diagnostics Classroom (Simulator)</span>
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold font-mono tracking-tight transition border-b-2 whitespace-nowrap ${
              activeTab === 'training'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <LineChart className="w-4 h-4 shrink-0" />
            <span>2. Model Training Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold font-mono tracking-tight transition border-b-2 whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Code2 className="w-4 h-4 shrink-0" />
            <span>3. Repository Export (Python/TF)</span>
          </button>
          <button
            onClick={() => setActiveTab('srs')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold font-mono tracking-tight transition border-b-2 whitespace-nowrap ${
              activeTab === 'srs'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>4. Academic SRS Docs</span>
          </button>
        </div>

        {/* Tab display animations */}
        <div className="min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'sandbox' && <DiagnosticSandbox />}
              {activeTab === 'training' && <TrainingDashboard />}
              {activeTab === 'code' && <CodeExporter />}
              {activeTab === 'srs' && <AcademicSRS />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Informative Guidance Notification */}
        <div className="bg-[#141416] border border-[#2D2D33] p-4 rounded-xl flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-300 leading-relaxed space-y-1">
            <p className="font-semibold text-blue-400">Academics Project Resume Booster Tip:</p>
            <p>
              Use this live dashboard during interviews or link it at the top of your **GitHub Repository README**. It demonstrates end-to-end fullstack ML tooling capabilities—bridging Python TensorFlow neural activations directly into a polished React browser view paired with real-time explainability overlays.
            </p>
          </div>
        </div>

      </main>

      {/* Structured Footer */}
      <footer className="bg-[#0F0F12] border-t border-[#2D2D33] py-8 px-6 mt-12 text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed font-mono">
          
          {/* Logo and citation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-sans font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>XAI Oral Cancer Diagnostics Center</span>
            </div>
            <p className="text-gray-500">
              A peer-reviewed research project exploring interpretability (SHAP, LIME, Grad-CAM) under deep convolutional learning backbones.
            </p>
            <p className="text-[10px] text-gray-650">
              © {new Date().getFullYear()} Student Research Group. All rights reserved.
            </p>
          </div>

          {/* Technology stack attributes */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-300">Integrated Tech Stack Specs</span>
            <p className="text-gray-400">• Python 3.8 / TensorFlow 2.11 / Keras</p>
            <p className="text-gray-400">• SHAP (Shapley Additive Attribution) / LIME</p>
            <p className="text-gray-400">• React 19 / TypeScript / Tailwind CSS / Recharts</p>
            <p className="text-gray-400">• Google GenAI (Gemini 3.5 Flash Model Proxy)</p>
          </div>

          {/* Legal Compliance and Medical boundaries */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
              <span>Clinical Disclaimer Statement</span>
            </span>
            <p className="text-gray-500">
              In accordance with **HIPAA and GDPR compliance policies**, zero patient identifiable records are stored. Diagnostic pipelines are mock simulators optimized for diagnostic presentation, training, and academic demonstration. Incisional scalpel biopsy remains mandatory for cancer diagnosis.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
