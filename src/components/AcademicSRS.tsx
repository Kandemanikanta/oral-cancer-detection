import React, { useState } from 'react';
import { BookOpen, Shield, Cpu, Activity, Award, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SRSSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export default function AcademicSRS() {
  const [activeSection, setActiveSection] = useState('intro');

  const srsSections: SRSSection[] = [
    {
      id: 'intro',
      title: '1. Document Purpose & Scope',
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">1.1 Document Purpose</h4>
            <p className="text-gray-300 leading-relaxed text-sm">
              This Software Requirements Specification (SRS) outlines the operational goals, software deliverables, and design boundaries of 
              <strong> "Explainable Artificial Intelligence (XAI) in Predictive Diagnostics of Oral Cancer using Neural Networks"</strong> (Version 1.0). 
              The system is designed to provide actionable decision support to oncologists, dental surgeons, and general medical practitioners, 
              automating pre-screening while answering the clinical imperative for algorithmic transparency.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">1.2 Project Scope</h4>
            <p className="text-gray-300 leading-relaxed text-sm">
              The scope centers on applying localized deep learning convolutional architectures (custom 2D-CNN & VGG16) to process raw oral mucosal scans, 
              classify tissues with a target accuracy of 92%, and generate pixel-level attributions via SHAP (Shapley Additive Explanations) alongside local pertubation 
              mapping via LIME. It prioritizes interpretability to bridge the clinical adoption gap.
            </p>
            <div className="mt-4 bg-[#0A0A0B] border-l-4 border-gray-600 p-3 rounded-r">
              <span className="text-xs font-mono font-semibold uppercase text-gray-400 block mb-1">Out of Scope</span>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hardware design of intraoral endoscopic cameras, formal Phase III pharmaceutical clinical trials, or dynamic live hospital EHR synchronization 
                databases. These represent secondary integration phases.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#2D2D33] rounded-lg bg-[#0A0A0B] shadow-md flex flex-col justify-between">
              <span className="text-xs font-semibold text-gray-500 font-mono">MODEL ARCHITECTURE</span>
              <span className="text-md font-bold text-white mt-2">Duo-CNN Framework</span>
              <p className="text-xs text-gray-400 mt-1">Comparing custom shallow CNN layers vs. pretrained deep model structures (VGG16 Transfer Learning).</p>
            </div>
            <div className="p-4 border border-[#2D2D33] rounded-lg bg-[#0A0A0B] shadow-md flex flex-col justify-between">
              <span className="text-xs font-semibold text-gray-500 font-mono">XAI INTEGRATION</span>
              <span className="text-md font-bold text-white mt-2">Triple Explainers</span>
              <p className="text-xs text-gray-400 mt-1">Synthesizing Grad-CAM hotspots, LIME superpixels, and SHAP attributions into a standard report.</p>
            </div>
            <div className="p-4 border border-[#2D2D33] rounded-lg bg-[#0A0A0B] shadow-md flex flex-col justify-between">
              <span className="text-xs font-semibold text-gray-500 font-mono">TARGET OUTCOME</span>
              <span className="text-md font-bold text-white mt-2">Clinician Trust</span>
              <p className="text-xs text-gray-400 mt-1">Enabling non-invasive early triage by backing up categorical predictions with anatomical heatmap proof.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'desc',
      title: '2. Overall System Description',
      icon: Cpu,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">2.1 Feasibility Study SUMMARY</h4>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              A comprehensive feasibility analysis was conducted across four primary axes to authorize system development:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#2D2D33]">
                <h5 className="font-semibold text-white text-xs uppercase font-mono">Technical Feasibility</h5>
                <p className="text-xs text-gray-400 mt-1">Leveraging highly stable standard deep learning frameworks (TensorFlow, PyTorch, OpenCV). Backpropagation layers mathematically support gradient recording for Grad-CAM natively.</p>
              </div>
              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#2D2D33]">
                <h5 className="font-semibold text-white text-xs uppercase font-mono">Economic Feasibility</h5>
                <p className="text-xs text-gray-400 mt-1">Utilizing transfer learning reduces massive computational training overhead from weeks to single-digit hours. Relies on open-source weights, eliminating proprietary medical software licensing fees.</p>
              </div>
              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#2D2D33]">
                <h5 className="font-semibold text-white text-xs uppercase font-mono">Operational Feasibility</h5>
                <p className="text-xs text-gray-400 mt-1">The interface integrates directly into traditional clinical triage workflows, acting as a collaborative peer review tool rather than a cold, uncooperative replacement.</p>
              </div>
              <div className="p-3 bg-[#0A0A0B] rounded-lg border border-[#2D2D33]">
                <h5 className="font-semibold text-white text-xs uppercase font-mono">Scheduling Feasibility</h5>
                <p className="text-xs text-gray-400 mt-1">Subdivided into clear milestones: dataset acquisition (cleaning, augmentation), network training, XAI pipeline implementation, clinical user testing, and static release.</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">2.2 Design & Implementation Constraints</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Hardware Restrictions:</strong> Patient scans must be preprocessed and resized down to standard 224x224 to protect computational pipelines during high-throughput clinics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Platform Compatibility:</strong> Core training is engineered in pure clinical Python with TensorFlow/OpenCV for maximum platform/server portability.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Security Boundary:</strong> Patient identification data should be decoupled at ingress. Only raw scans and basic clinical metadata are ingested.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'functional',
      title: '3. Functional Requirements',
      icon: Activity,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">3.1 System Flow & Use Case Actors</h4>
            <div className="p-4 bg-[#0A0A0B] rounded-lg border border-[#2D2D33] mb-4">
              <span className="text-xs font-mono font-semibold uppercase text-gray-450 block mb-2">Use Case Actor: Bi-directional Diagnostic Pipeline</span>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans">
                <div className="p-2.5 bg-[#0F0F12] border border-[#2D2D33] rounded text-center w-full max-w-[150px]">
                  <span className="font-semibold text-white">1. Clinician User</span>
                  <p className="text-gray-400 mt-1 text-[10px]">Uploads image / selects lesion profile</p>
                </div>
                <div className="text-gray-500">➔</div>
                <div className="p-2.5 bg-[#0F0F12] border border-[#2D2D33] rounded text-center w-full max-w-[150px]">
                  <span className="font-semibold text-white">2. Preprocessing</span>
                  <p className="text-gray-400 mt-1 text-[10px]">Normalizes pixels / CLAHE adjustments</p>
                </div>
                <div className="text-gray-500">➔</div>
                <div className="p-2.5 bg-[#0F0F12] border border-[#2D2D33] rounded text-center w-full max-w-[150px]">
                  <span className="font-semibold text-white">3. Neural Core</span>
                  <p className="text-gray-400 mt-1 text-[10px]">CNN/VGG16 joint logit inference</p>
                </div>
                <div className="text-gray-500">➔</div>
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded text-center w-full max-w-[150px]">
                  <span className="font-semibold text-blue-400">4. XAI Explanations</span>
                  <p className="text-blue-350 mt-1 text-[10px]">Grad-CAM, LIME & SHAP Generation</p>
                </div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              The primary use case centers on **Clinical Diagnosis Support** (Traceability PR1-PR3, XAI1, DR1). Preconditions require the availability of a stable digital scan. Postconditions mandate that categorical predictions must be returned with corresponding confidence parameters and aligned explainability maps.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">3.2 Technical Requirements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#0A0A0B] border border-[#2D2D33] text-gray-300 rounded-lg space-y-1.5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Training Tech Stack</span>
                <p>• Language: Python 3.8 / Keras Core</p>
                <p>• Tensor Engine: TensorFlow 2.11.0</p>
                <p>• Explainers: SHAP 0.41.0, LIME 0.2.0.1</p>
                <p>• Matrix Processing: NumPy 1.21.6, OpenCV</p>
              </div>
              <div className="p-3 bg-[#0A0A0B] border border-[#2D2D33] text-gray-300 rounded-lg space-y-1.5">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Minimum Hardware Needs</span>
                <p>• CPU: Intel Core i7 / AMD Ryzen 7</p>
                <p>• System RAM: 16 GB Core allocation</p>
                <p>• Acceleration VRAM: NVIDIA CUDA 16GB+</p>
                <p>• Local Storage: 20 GB solid-state disk</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'non-functional',
      title: '4. Non-Functional & Safety Requirements',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">4.1 Performance & Latency Thresholds</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-[#2D2D33] pb-1 font-mono">
                <span className="text-gray-400">P1. Image Preprocessing Latency</span>
                <span className="text-white font-bold">&lt; 2.0 seconds</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-[#2D2D33] pb-1 font-mono">
                <span className="text-gray-400">P2. Model Inference Computations (CNN+VGG16)</span>
                <span className="text-white font-bold">&lt; 3.0 seconds</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-[#2D2D33] pb-1 font-mono">
                <span className="text-gray-400">P3. Visual XAI Map Synthesis (LIME/SHAP/Grad-CAM)</span>
                <span className="text-white font-bold">&lt; 5.0 seconds</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-[#2D2D33] pb-1 font-mono">
                <span className="text-gray-400">P4. Targeted System Classification Sensitivity</span>
                <span className="text-white font-bold">&gt; 90.0%</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">4.2 Safety and HIPAA Compliance Guidelines</h4>
            <div className="p-3 bg-[#0A0A0B] text-gray-300 border border-[#2D2D33] rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Medical Data Protection & Privacy Protocol</span>
              </div>
              <p className="leading-relaxed">
                As the application handles clinical oncology scans, it must strictly comply with <strong>HIPAA (Health Insurance Portability and Accountability Act)</strong> and <strong>GDPR guidelines</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-emerald-400">
                <li>Zero-Persistence of Patient Identifiable Information (PII) on the diagnostic server.</li>
                <li>Secure TLS 1.3 socket paths during batch image transmissions between hospital network hubs and models.</li>
                <li>Anonymization of headers in medical imagery folders (DICOM cleanups).</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'other',
      title: '5. Academic Certification & References',
      icon: Award,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">5.1 Reuse Objectives</h4>
            <p className="text-gray-300 leading-relaxed text-sm">
              The project is engineered under strict modular architectures. The core feature extraction networks, classification boundaries, and mathematical explainer loops are isolated. They are instantly reusable for other oncology tasks such as melanocytic lesion segmentation or breast cytopathology.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white border-b border-[#2D2D33] pb-2 mb-3">5.2 Academic Research References</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-mono list-disc pl-4">
              <li>Lundberg, S. M. & Lee, S.-I. (2017). "A Unified Approach to Interpreting Model Predictions." Advances in Neural Information Processing Systems (NeurIPS 2017).</li>
              <li>Ribeiro, M. T., Singh, S., & Guestrin, C. (2016). "Why Should I Trust You?": Explaining the Predictions of Any Classifier. ACM SIGKDD (2016).</li>
              <li>Selvaraju, R. R., et al. (2017). "Grad-CAM: Visual Explanations from Deep Networks via Gradient-based Localization." IEEE International Conference on Computer Vision (ICCV).</li>
              <li>Explainable AI in Healthcare: Interpretable Machine Learning for Medical Diagnosis - Springer.</li>
            </ul>
          </div>
          <div className="border border-[#2D2D33] rounded-lg p-4 bg-[#0A0A0B] text-gray-300 space-y-2 mt-4 text-xs font-sans">
            <span className="font-semibold text-white block text-sm">Academic Certification Panel [DEPARTMENT REVIEW COMMITTEE]</span>
            <div className="grid grid-cols-2 gap-4 font-mono mt-2 pt-2 border-t border-[#2D2D33]">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase font-semibold">Supervisor</span>
                <span className="font-semibold text-white font-sans text-xs">Dr. V. L. PadmaLatha</span>
                <span className="text-gray-400 block text-[10px]">Assistant Professor, Dept. of Computational Intelligence</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase font-semibold">Submitted By Research Group</span>
                <span className="font-semibold text-white font-sans text-xs">Kande Manikanta, S. Ashraf, M. Bharath</span>
                <span className="text-gray-400 block text-[10px]">Roll No: 21N31A7322 | Batch: 21CIMP1D16</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const activeContent = srsSections.find(s => s.id === activeSection);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar navigation */}
      <div className="lg:col-span-1 space-y-2">
        <div className="p-4 bg-[#0F0F12] border border-[#2D2D33] rounded-lg mb-4">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase font-mono tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Academic SRS V1.0</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Authorized requirements definition document prepared on behalf of Malla Reddy College of Engineering.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          {srsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-4 py-3 text-left text-xs font-medium rounded-lg transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-[#1D1D22] border-[#444450] text-white font-semibold shadow-md'
                    : 'bg-[#141416] border-[#2D2D33] hover:border-[#33333E] text-gray-400 hover:bg-[#1C1C20]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="truncate">{section.title.substring(3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content pane */}
      <div className="lg:col-span-3 border border-[#2D2D33] rounded-xl bg-[#141416] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 border-b border-[#2D2D33] pb-4 mb-2">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                {activeContent && React.createElement(activeContent.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {activeContent?.title}
                </h3>
                <span className="text-[10px] font-mono text-gray-500 uppercase">System Specification Document Node</span>
              </div>
            </div>
            {activeContent?.content}
          </motion.div>
        </AnimatePresence>
        <div className="border-t border-[#2D2D33] pt-4 mt-6 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>SRS v1.0 - Fully Traceable</span>
          <span>Approved for Prototyping</span>
        </div>
      </div>
    </div>
  );
}
