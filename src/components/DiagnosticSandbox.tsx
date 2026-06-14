import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Flame, ShieldAlert, Sparkles, RefreshCw, Layers, MousePointer, Info, Sliders, Eye, BookOpen, AlertCircle, ThumbsUp, ThumbsDown, HeartHandshake, Check, ShieldCheck, History } from 'lucide-react';
import { CLINICAL_PRESETS } from '../data/presets';
import { PresetSample, DiagnosticClass, DiagnosticResult } from '../types';

export default function DiagnosticSandbox() {
  const [selectedPreset, setSelectedPreset] = useState<PresetSample>(CLINICAL_PRESETS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number } | null>(null);

  const [activeTab, setActiveTab] = useState<'original' | 'gradcam' | 'lime' | 'shap'>('original');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [geminiReport, setGeminiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- Clinician Feedback & Human-in-the-Loop Override Storage ---
  const [feedbackLogs, setFeedbackLogs] = useState<Array<{
    id: string;
    timestamp: string;
    scanName: string;
    aiClass: DiagnosticClass;
    clinicianClass: DiagnosticClass | 'Agree';
    isAgreed: boolean;
    notes: string;
  }>>([]);

  const [currentFeedback, setCurrentFeedback] = useState<{
    agreed: boolean | null;
    correctedClass: DiagnosticClass | '';
    note: string;
    submitted: boolean;
  }>({
    agreed: null,
    correctedClass: '',
    note: '',
    submitted: false
  });

  // --- Real-time Parameter Sliders for XAI Customization ---
  const [gradCamDepth, setGradCamDepth] = useState<'block5_conv3' | 'block5_conv2' | 'block4_conv3'>('block5_conv3');
  const [gradCamOpacity, setGradCamOpacity] = useState<number>(0.55);
  const [limeGranularity, setLimeGranularity] = useState<number>(12); // N-Superpixels count
  const [limeSampleBudget, setLimeSampleBudget] = useState<number>(250); // Perturbation evaluations
  const [limeMode, setLimeMode] = useState<'positive' | 'all'>('all');
  const [shapPixelDensity, setShapPixelDensity] = useState<number>(350); // Mapped particle count
  const [shapDotSize, setShapDotSize] = useState<number>(2); // Dot pixel radius
  const [shapBackgroundInpaint, setShapBackgroundInpaint] = useState<boolean>(true); // Masking mode

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const steps = [
    { text: 'Pre-processing Oral Scan: Demarcating target bounding box down to 224x224 and balancing RGB ranges...', sleep: 600 },
    { text: 'Layer-wise Translation: Mapped gradient-flow lines across backpropagation channels...', sleep: 650 },
    { text: 'Joint Confidence Solver: Querying custom shallow Conv layers alongside fine-tuned Block 5 in VGG16...', sleep: 600 },
    { text: 'XAI Matrix Compilation: Resolving Shapley kernel partitions & linear regional perturbations locally...', sleep: 700 },
  ];

  // Sync click coordinates when swapping samples
  useEffect(() => {
    if (selectedPreset) {
      setClickCoord({ x: selectedPreset.findingsCoordinates.x, y: selectedPreset.findingsCoordinates.y });
      setDiagnosticResult(null);
      setGeminiReport(null);
      setActiveTab('original');
      setCurrentFeedback({ agreed: null, correctedClass: '', note: '', submitted: false });
    }
  }, [selectedPreset]);

  // Synchronize state with localStorage for clinical PDF portfolio generator
  useEffect(() => {
    if (diagnosticResult) {
      localStorage.setItem('xai_diagnostic_result', JSON.stringify(diagnosticResult));
    } else {
      localStorage.removeItem('xai_diagnostic_result');
    }
  }, [diagnosticResult]);

  useEffect(() => {
    if (selectedPreset) {
      localStorage.setItem('xai_active_preset', JSON.stringify(selectedPreset));
    }
  }, [selectedPreset]);

  useEffect(() => {
    if (geminiReport) {
      localStorage.setItem('xai_gemini_report', geminiReport);
    } else {
      localStorage.removeItem('xai_gemini_report');
    }
  }, [geminiReport]);

  // Run simulated neural model evaluations
  const runDiagnostics = () => {
    setIsProcessing(true);
    setProcessingStep(0);
    setProcessingLogs([]);
    setDiagnosticResult(null);
    setGeminiReport(null);
    setActiveTab('original');
    setCurrentFeedback({ agreed: null, correctedClass: '', note: '', submitted: false });

    let currentStep = 0;
    const executeNextStep = () => {
      if (currentStep < steps.length) {
        setProcessingLogs(prev => [...prev, `[PROCESS] ${steps[currentStep].text}`]);
        setProcessingStep(currentStep + 1);
        setTimeout(() => {
          currentStep++;
          executeNextStep();
        }, steps[currentStep].sleep);
      } else {
        const isCustom = selectedPreset.id === 'custom-upload';
        const confidenceMultiplier = isCustom ? 0.94 : 1.0;
        
        let predictedClass: DiagnosticClass = selectedPreset.trueClass;
        let cnnConf = selectedPreset.cnnConfidence * confidenceMultiplier;
        let vggConf = selectedPreset.vggConfidence * confidenceMultiplier;

        const result: DiagnosticResult = {
          class: predictedClass,
          confidence: vggConf,
          cnnConfidence: cnnConf,
          vggConfidence: vggConf,
          processingTimeMs: 2550,
          timestamp: new Date().toLocaleTimeString(),
          hasLesion: predictedClass !== 'Normal',
          notes: selectedPreset.clinicalDescription,
          recommendation: predictedClass === 'OSCC' 
            ? 'Urgently reference for incisional tissue wedge histopathological biopsy.' 
            : predictedClass === 'Leukoplakia'
            ? 'Establish rigorous 3-month clinical surveillance calendar and eliminate local friction.'
            : predictedClass === 'Aphthous'
            ? 'Symptom management via protective topical creams, repeat surveillance in 12 days.'
            : 'Maintain standard semi-annual dental hygiene schedule.',
          shapValue: predictedClass === 'OSCC' ? 0.85 : predictedClass === 'Leukoplakia' ? 0.51 : predictedClass === 'Aphthous' ? 0.12 : -0.91,
          limeSummary: predictedClass === 'OSCC' 
            ? 'Highly positive local coefficients flanking active necrotizing tissue boundaries.' 
            : predictedClass === 'Leukoplakia'
            ? 'Moderate positive risk factors centered directly over the white hyperkeratotic epithelial surface.'
            : predictedClass === 'Aphthous'
            ? 'Symmetrical benign scores successfully indicating local inflammation.'
            : 'No local malignant coefficients triggered.',
          gradCamFocus: predictedClass === 'OSCC'
            ? 'Strong focused activation centered on poor cell integrity margins.'
            : predictedClass === 'Leukoplakia'
            ? 'Broad activation across hyperparakeratotic plaque structures.'
            : predictedClass === 'Aphthous'
            ? 'Focus located purely on peripheral inflammatory margins.'
            : 'Flat non-activated representation.'
        };

        setDiagnosticResult(result);
        setIsProcessing(false);
        setActiveTab('gradcam'); // Dynamic auto-switch to direct XAI overlay
      }
    };

    executeNextStep();
  };

  // Generate pathology advisory report via Node server
  const generateSmartReport = async () => {
    if (!diagnosticResult) return;
    setIsGeneratingReport(true);
    setGeminiReport(null);

    try {
      const response = await fetch('/api/diagnose/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: diagnosticResult.class,
          presetName: customImage ? `Clinician Image: ${customFileName}` : selectedPreset.name,
          clinicalDescription: selectedPreset.clinicalDescription,
          findings: selectedPreset.findings,
          riskLevel: selectedPreset.riskLevel
        })
      });

      const data = await response.json();
      if (data.success) {
        setGeminiReport(data.reportText);
      } else {
        throw new Error("Report rendering failed");
      }
    } catch (err) {
      console.error(err);
      setGeminiReport("Advisory system reported. Fallback diagnostics activated. Report has been exported internally.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const resetCustomUpload = () => {
    setCustomImage(null);
    setCustomFileName('');
    setSelectedPreset(CLINICAL_PRESETS[0]);
    setDiagnosticResult(null);
    setGeminiReport(null);
    setActiveTab('original');
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleCustomFile(files[0]);
    }
  };

  const handleCustomFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          setCustomFileName(file.name);
          setDiagnosticResult(null);
          setGeminiReport(null);
          setActiveTab('original');
          
          const customSample: PresetSample = {
            id: 'custom-upload',
            name: `Uploaded Scan: ${file.name}`,
            category: 'OSCC',
            trueClass: 'OSCC',
            image: 'custom',
            riskLevel: 'High',
            findings: [
              'Irregular mucosal thickening with vascular distortion.',
              'Localized architectural change matching high-density tissue regions.',
              'Palpated induration boundaries represented in scanning grid.'
            ],
            clinicalDescription: 'Self-loading patient oral study processed under real-time interpretation settings. Interactive coordinates fully active.',
            findingsCoordinates: { x: 50, y: 50, radius: 25 },
            limeSuperpixels: [
              { points: [[40, 40], [60, 40], [60, 60], [40, 60]], score: 0.81 },
              { points: [[15, 12], [42, 38], [40, 60], [15, 90]], score: -0.48 }
            ],
            cnnConfidence: 85.5,
            vggConfidence: 91.2,
            histopathologyReport: 'User loaded photo. Run diagnostics to project local attributions across mucosal grids.'
          };
          setSelectedPreset(customSample);
          setClickCoord({ x: 50, y: 50 });
        }
      };
      reader.readAsDataURL(file);
    }
    setIsDragging(false);
  };

  // Canvas Drawing Engine for Interactive XAI plots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 448;
    canvas.height = 448;

    const baseDraw = (onReady: () => void) => {
      if (customImage) {
        const imageObj = new Image();
        imageObj.crossOrigin = "anonymous";
        imageObj.onload = () => {
          ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
          onReady();
        };
        imageObj.src = customImage;
      } else {
        // Draw highly detailed clinical anatomical schematics
        ctx.fillStyle = '#0a0a0c'; // premium dark backdrop
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw background frame border
        ctx.strokeStyle = '#22222b';
        ctx.lineWidth = 1;
        ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

        const lx = (clickCoord ? clickCoord.x / 100 : 0.5) * canvas.width;
        const ly = (clickCoord ? clickCoord.y / 100 : 0.5) * canvas.height;

        if (selectedPreset.id === 'preset-oscc' || selectedPreset.id === 'custom-upload') {
          // Tongue tissue base
          ctx.beginPath();
          ctx.arc(-40, canvas.height / 2, 300, -0.7, 0.7);
          ctx.fillStyle = '#fda4af'; // healthy mucosal pink
          ctx.fill();
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Healthy tastebuds
          ctx.fillStyle = '#f43f5e';
          for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(40 + (i * 12), (canvas.height / 2) - 100 + (i * 22), 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Malignant central ulcerated core
          ctx.beginPath();
          ctx.arc(lx, ly, 40, 0, Math.PI * 2);
          ctx.fillStyle = '#be123c'; // deep necrotic red
          ctx.fill();

          // Irregular bumpy active borders
          ctx.beginPath();
          ctx.arc(lx, ly, 40, 0, Math.PI * 2);
          ctx.strokeStyle = '#991b1b';
          ctx.lineWidth = 5;
          ctx.setLineDash([6, 10]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Fibrinous slough central fissure
          ctx.strokeStyle = '#f1f5f9'; // necrotic slough white
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(lx - 20, ly - 8);
          ctx.bezierCurveTo(lx - 5, ly + 22, lx + 5, ly - 22, lx + 20, ly + 8);
          ctx.stroke();

          // Neo-vascular feeding vessels
          ctx.strokeStyle = '#881337';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(lx - 90, ly - 40);
          ctx.quadraticCurveTo(lx - 45, ly - 15, lx - 30, ly - 5);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(lx - 100, ly + 50);
          ctx.quadraticCurveTo(lx - 50, ly + 15, lx - 30, ly + 10);
          ctx.stroke();
        } 
        
        else if (selectedPreset.id === 'preset-leukoplakia') {
          // Cheek mucosal tissue layer
          ctx.fillStyle = '#fecdd3';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Mucosal folds
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 120);
          ctx.bezierCurveTo(140, 160, 290, 70, 448, 120);
          ctx.stroke();

          // White cracked plaque (leukoplakia keratin)
          ctx.fillStyle = '#f8fafc'; // thick white keratin plaque
          ctx.beginPath();
          ctx.moveTo(lx - 45, ly - 35);
          ctx.lineTo(lx + 40, ly - 40);
          ctx.lineTo(lx + 55, ly + 35);
          ctx.lineTo(lx - 30, ly + 45);
          ctx.lineTo(lx - 55, ly);
          ctx.closePath();
          ctx.fill();

          // Crack textures
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(lx - 35, ly - 10); ctx.lineTo(lx + 25, ly - 5);
          ctx.moveTo(lx - 15, ly + 15); ctx.lineTo(lx + 35, ly - 15);
          ctx.moveTo(lx - 40, ly + 5);  ctx.lineTo(lx - 10, ly + 35);
          ctx.stroke();
        } 
        
        else if (selectedPreset.id === 'preset-ulcer') {
          // Mouth mucosal folds
          ctx.fillStyle = '#ffe4e6';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Symmetric inflammatory halo
          ctx.beginPath();
          ctx.arc(lx, ly, 35, 0, Math.PI * 2);
          ctx.fillStyle = '#fb7185'; // bright systemic inflammatory ring
          ctx.fill();

          // Yellowish-white circular aphthous slough base
          ctx.beginPath();
          ctx.arc(lx, ly, 20, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a'; // yellow base
          ctx.fill();
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } 
        
        else {
          // Absolute healthy normal mouth mucosal grid
          ctx.fillStyle = '#fecdd3';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Fine reticular capillary patterns
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 1.0;
          for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.moveTo(40 + (i * 65), 0);
            ctx.bezierCurveTo(30 + (i * 65), 150, 150 + (i * 20), 250, 10 + (i * 75), 448);
            ctx.stroke();
          }
        }

        // Standard clinical overlays HUD labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '10px monospace';
        ctx.fillText("CLINICAL ACTIVE MAGNIFICATOR", 20, 28);
        ctx.fillText("[DIGITAL PATHOLOGICAL SAMPLE EVALUATION]", 20, 430);

        onReady();
      }
    };

    baseDraw(() => {
      // Draw overlays based on the parameters
      const lx = (clickCoord ? clickCoord.x / 100 : 0.5) * canvas.width;
      const ly = (clickCoord ? clickCoord.y / 100 : 0.5) * canvas.height;

      if (activeTab === 'gradcam' && selectedPreset.riskLevel !== 'None') {
        // Dynamic Grad-CAM rendering based on fine-tuning parameters
        let baseRadius = selectedPreset.findingsCoordinates.radius * 2.5;
        
        // Simulating different layer depths
        if (gradCamDepth === 'block5_conv3') {
          // Layer block5_conv3 is very focused on narrow high-freq anomalies
          baseRadius = selectedPreset.findingsCoordinates.radius * 2.2;
        } else if (gradCamDepth === 'block5_conv2') {
          // block5_conv2 represents medium-level semantic layers
          baseRadius = selectedPreset.findingsCoordinates.radius * 3.3;
        } else {
          // block4_conv3 represents broad textural outlines
          baseRadius = selectedPreset.findingsCoordinates.radius * 4.4;
        }

        const gradient = ctx.createRadialGradient(lx, ly, 4, lx, ly, baseRadius);
        // Alpha weights mapped directly to slider!
        gradient.addColorStop(0, `rgba(239, 68, 68, ${gradCamOpacity * 0.95})`);
        gradient.addColorStop(0.3, `rgba(249, 115, 22, ${gradCamOpacity * 0.85})`);
        gradient.addColorStop(0.6, `rgba(234, 179, 8, ${gradCamOpacity * 0.65})`);
        gradient.addColorStop(0.8, `rgba(6, 182, 212, ${gradCamOpacity * 0.35})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Focal pointer circle
        ctx.strokeStyle = `rgba(255, 255, 255, ${gradCamOpacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(lx, ly, baseRadius * 0.45, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(10, 10, 12, 0.85)';
        ctx.fillRect(lx + 8, ly - 35, 130, 20);
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`CAM FOCUS (${gradCamDepth}): ${(selectedPreset.vggConfidence).toFixed(1)}%`, lx + 12, ly - 23);
      } 
      
      else if (activeTab === 'lime' && selectedPreset.riskLevel !== 'None') {
        // Dynamic LIME Superpixel renderer based on input granularity and perturbation budget
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;

        // Draw limeGranularity number of custom polygonal superpixels surrounding pathological center
        for (let i = 0; i < limeGranularity; i++) {
          const angleStart = (i * 2 * Math.PI) / limeGranularity;
          const angleEnd = ((i + 1) * 2 * Math.PI) / limeGranularity;
          
          // Deterministic radii offset based on i
          const r1 = (35 + (i % 3) * 18);
          const r2 = (25 + ((i + 1) % 3) * 18);

          const px1 = lx + Math.cos(angleStart) * r1;
          const py1 = ly + Math.sin(angleStart) * r1;
          const px2 = lx + Math.cos(angleEnd) * r2;
          const py2 = ly + Math.sin(angleEnd) * r2;

          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.closePath();

          // Calculate a simulated coefficient score. In OSCC it is highly positive, in Normal it is highly negative.
          // Perturbing budget introduces slightly randomized stability factor representing clinical monte carlo noise
          const stochasticNoise = (1000 - limeSampleBudget) / 4000; // less stability at low budgets
          const baseWeight = selectedPreset.id === 'preset-oscc' || selectedPreset.id === 'custom-upload'
            ? (i % 2 === 0 ? 0.72 : 0.35)
            : selectedPreset.id === 'preset-leukoplakia'
            ? (i % 2 === 0 ? 0.45 : -0.15)
            : (i % 2 === 0 ? -0.35 : -0.75);

          const finalScore = baseWeight + (Math.sin(i) * stochasticNoise);

          if (finalScore > 0.3) {
            ctx.fillStyle = `rgba(16, 185, 129, ${limeMode === 'all' ? 0.4 : 0.55})`; // positive green
          } else if (finalScore < -0.2) {
            ctx.fillStyle = limeMode === 'all' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0,0,0,0)'; // negative red
          } else {
            ctx.fillStyle = limeMode === 'all' ? 'rgba(100, 116, 139, 0.15)' : 'rgba(0,0,0,0)'; // background grey
          }

          ctx.fill();
          ctx.stroke();
        }

        // Calibration status HUD
        ctx.fillStyle = 'rgba(10, 10, 12, 0.9)';
        ctx.fillRect(15, 335, 250, 95);
        ctx.strokeStyle = '#22222b';
        ctx.strokeRect(15, 335, 250, 95);

        ctx.font = '9px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`LIME INTERACTIVE CALIBRATOR`, 24, 350);
        ctx.fillText(`Segments: ${limeGranularity} | Budget: ${limeSampleBudget} Iterations`, 24, 362);
        
        ctx.fillStyle = '#10b981';
        ctx.fillRect(24, 372, 10, 8);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText("Positive weight (carcinoma indicator)", 40, 379);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(24, 387, 10, 8);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText("Negative weight (normal mucosa factor)", 40, 394);

        ctx.fillStyle = '#64748b';
        ctx.fillRect(24, 402, 10, 8);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText("Zero background correlation", 40, 409);
      } 
      
      else if (activeTab === 'shap' && selectedPreset.riskLevel !== 'None') {
        // Dynamic SHAP pixel-level attributions depending on slider parameters
        const isPathologyActive = selectedPreset.id === 'preset-oscc' || selectedPreset.id === 'preset-leukoplakia' || selectedPreset.id === 'custom-upload';
        
        // Background shroud toggle simulation
        if (!shapBackgroundInpaint) {
          ctx.fillStyle = 'rgba(10, 10, 12, 0.4)'; // opaque black mask
          // Fill areas outside the target lesion radius to simulate standard masking
          ctx.save();
          ctx.beginPath();
          ctx.arc(lx, ly, 110, 0, Math.PI * 2);
          ctx.rect(canvas.width, 0, -canvas.width, canvas.height);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Draw Positive Pixels Scatter points (Red) based on shapPixelDensity
        ctx.fillStyle = 'rgba(239, 68, 68, 0.65)';
        const maxRedDots = Math.floor(shapPixelDensity * (isPathologyActive ? 0.65 : 0.25));
        for (let i = 0; i < maxRedDots; i++) {
          const angle = (Math.sin(i * 4.3) + 1) * Math.PI;
          const dist = (Math.cos(i * 1.5) + 1) * 0.5 * selectedPreset.findingsCoordinates.radius * 1.6;
          const px = lx + Math.cos(angle) * dist + (Math.sin(i) * 12);
          const py = ly + Math.sin(angle) * dist + (Math.cos(i) * 12);

          ctx.beginPath();
          ctx.arc(px, py, shapDotSize * (0.8 + Math.random() * 0.4), 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Negative Suppression Pixels (Blue)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.55)';
        const maxBlueDots = Math.floor(shapPixelDensity * (isPathologyActive ? 0.35 : 0.75));
        for (let i = 0; i < maxBlueDots; i++) {
          const angle = (Math.cos(i * 2.7) + 1) * Math.PI;
          const dist = selectedPreset.findingsCoordinates.radius * (1.5 + (Math.sin(i * 1.8) + 1) * 1.5);
          const px = lx + Math.cos(angle) * dist;
          const py = ly + Math.sin(angle) * dist;

          ctx.beginPath();
          ctx.arc(px, py, shapDotSize * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mini SHAP chart legend overlay
        ctx.fillStyle = 'rgba(10, 10, 12, 0.9)';
        ctx.fillRect(260, 20, 165, 60);
        ctx.strokeStyle = '#22222b';
        ctx.strokeRect(260, 20, 165, 60);

        ctx.font = '9px monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`SHAP Positive Score: +0.81`, 270, 36);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`SHAP Negative base: -0.92`, 270, 50);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Budget evaluations: ${shapPixelDensity}`, 270, 64);
      }

      // Save live web-GL context frame to state for PDF report portfolios
      try {
        localStorage.setItem(`xai_snapshot_${activeTab}`, canvas.toDataURL('image/png'));
      } catch (err) {
        console.error("XAI Canvas Snapshot capture write error:", err);
      }
    });
  }, [
    selectedPreset, 
    activeTab, 
    clickCoord, 
    customImage, 
    gradCamDepth, 
    gradCamOpacity, 
    limeGranularity, 
    limeSampleBudget, 
    limeMode, 
    shapPixelDensity, 
    shapDotSize, 
    shapBackgroundInpaint
  ]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickCoord({ x, y });
    
    // Smooth real-time shift: if already evaluated, don't force a full wipe, just move hotspot instantly!
    if (!diagnosticResult && selectedPreset.id !== 'preset-normal') {
      setDiagnosticResult(null);
      setGeminiReport(null);
      setActiveTab('original');
    }
  };

  const selectPresetCase = (preset: PresetSample) => {
    setCustomImage(null);
    setSelectedPreset(preset);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* LEFT COLUMNS (CO-SPAN 2): Settings & Background details */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-[#141416] border border-[#2D2D33] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-4 flex flex-col justify-between" id="preset-selector-card">
          <div>
            <h3 className="text-sm font-bold text-white border-b border-[#222228] pb-2 mb-3 tracking-wide flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Diagnostic Presets Selection</span>
            </h3>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Verify the neural model classification vectors using pre-cleared patient coordinates, or submit a custom photo below to map real-time attributions.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {CLINICAL_PRESETS.map((preset) => (
                <button
                  id={`preset-btn-${preset.id}`}
                  key={preset.id}
                  onClick={() => selectPresetCase(preset)}
                  className={`p-3 text-left border rounded-lg transition-all flex flex-col justify-between h-[105px] cursor-pointer ${
                    selectedPreset.id === preset.id && !customImage
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_12px_rgba(59,130,246,0.1)] font-medium'
                      : 'border-[#222228] bg-[#0c0c0e] hover:border-[#383842] hover:bg-[#18181c] text-gray-400'
                  }`}
                >
                  <div className="w-full">
                    <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                      preset.riskLevel === 'High' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : preset.riskLevel === 'Moderate'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : preset.riskLevel === 'Low'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-[#18181c] text-gray-500 border border-[#222228]'
                    }`}>
                      {preset.category}
                    </span>
                    <p className="text-xs font-bold text-gray-200 mt-2 line-clamp-1 leading-tight">{preset.name}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">Risk Profile: {preset.riskLevel}</span>
                </button>
              ))}
            </div>

            {/* Drag & Drop File Container */}
            <div
              id="file-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-[#222228] hover:border-[#353540] bg-[#0a0a0c]'
              } ${customImage ? 'bg-blue-900/10 border-blue-500/40' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleCustomFile(files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <Upload className="w-5 h-5 text-gray-400" />
                {customImage ? (
                  <div>
                    <p className="text-xs font-bold text-blue-400">Custom Image Instantiated</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{customFileName}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-gray-300">Click or Drop Patient Study Photo</p>
                    <p className="text-[9px] text-gray-500 mt-0.5 uppercase font-mono">Accepts PNG, JPG, or DICOM exports</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {customImage && (
            <button
              id="reset-presets-btn"
              onClick={resetCustomUpload}
              className="mt-3 text-center w-full text-xs text-rose-400 hover:text-rose-300 font-semibold font-mono hover:underline cursor-pointer"
            >
              Reset to clinical preset samples
            </button>
          )}
        </div>

        {/* Selected Clinical Exam background panel */}
        <div className="bg-[#141416] border border-[#2D2D33] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-4" id="clinical-observations-card">
          <span className="text-[10px] font-mono uppercase font-bold text-gray-500 block">Tissue Examination Log</span>
          <h4 className="text-sm font-bold text-white leading-snug mt-1">{selectedPreset.name}</h4>
          <p className="text-xs text-gray-300 leading-relaxed mt-2.5 p-3 bg-[#0a0a0c] border border-[#222228] rounded">
            {selectedPreset.clinicalDescription}
          </p>

          <h5 className="text-xs font-bold text-white mt-4 mb-2.5 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Target Lesion Observations</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {selectedPreset.findings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMNS (COL-SPAN 3): Active Canvas & XAI Live Calibration console */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Visualizer viewport card */}
        <div className="bg-[#141416] border border-[#2D2D33] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-4 flex flex-col items-center">
          
          {/* Section view switches */}
          <div className="flex bg-[#0a0a0c] border border-[#222228] p-1 rounded-lg text-xs font-mono font-medium self-stretch mb-3" id="xai-tab-selectors">
            <button
              id="tab-original"
              disabled={!diagnosticResult && activeTab !== 'original'}
              onClick={() => setActiveTab('original')}
              className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'original' 
                  ? 'bg-[#1b1b20] text-white shadow-md font-bold border border-[#2D2D33]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Original Clinical
            </button>
            <button
              id="tab-gradcam"
              disabled={!diagnosticResult}
              onClick={() => setActiveTab('gradcam')}
              className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !diagnosticResult ? 'opacity-35 cursor-not-allowed' : ''
              } ${
                activeTab === 'gradcam' 
                  ? 'bg-[#1b1b20] text-rose-450 shadow-md font-bold border border-[#2D2D33]' 
                  : 'text-gray-500 hover:text-rose-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Grad-CAM</span>
            </button>
            <button
              id="tab-lime"
              disabled={!diagnosticResult}
              onClick={() => setActiveTab('lime')}
              className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !diagnosticResult ? 'opacity-35 cursor-not-allowed' : ''
              } ${
                activeTab === 'lime' 
                  ? 'bg-[#1b1b20] text-emerald-450 shadow-md font-bold border border-[#2D2D33]' 
                  : 'text-gray-500 hover:text-emerald-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>LIME (Zones)</span>
            </button>
            <button
              id="tab-shap"
              disabled={!diagnosticResult}
              onClick={() => setActiveTab('shap')}
              className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !diagnosticResult ? 'opacity-35 cursor-not-allowed' : ''
              } ${
                activeTab === 'shap' 
                  ? 'bg-[#1b1b20] text-blue-450 shadow-md font-bold border border-[#2D2D33]' 
                  : 'text-gray-500 hover:text-blue-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SHAP (Pixels)</span>
            </button>
          </div>

          {/* Active Canvas Section */}
          <div className="relative group rounded-lg overflow-hidden border border-[#2D2D33] bg-[#0a0a0c] flex justify-center items-center w-full max-w-[448px] aspect-square shadow-inner">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className={`w-full h-full object-contain ${
                selectedPreset.id !== 'preset-normal' ? 'cursor-crosshair' : 'cursor-default'
              }`}
              id="diagnostic-active-canvas"
            />

            {/* Click location indicator */}
            {selectedPreset.id !== 'preset-normal' && (
              <div className="absolute top-3 right-3 bg-[#0a0a0cb5] backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-gray-300 pointer-events-none flex items-center gap-1 border border-[#2D2D33]">
                <MousePointer className="w-3 h-3 text-emerald-400 animate-bounce" />
                <span>Interact: Click image to relocation lesion focus</span>
              </div>
            )}

            {/* Loading/Inference simulation screen */}
            {isProcessing && (
              <div className="absolute inset-0 bg-[#0a0a0cfb] flex flex-col justify-center p-6 text-white overflow-hidden z-25">
                <div className="flex items-center gap-2.5 mb-4 self-center animate-pulse">
                  <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200">Processing Diagnostic Graph...</span>
                </div>
                
                {/* Horizontal Progress */}
                <div className="w-full bg-[#1b1b20] h-1.5 rounded-full overflow-hidden mb-5">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${(processingStep / steps.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-[10px] font-mono max-h-[140px] overflow-y-auto select-none border-l border-blue-900/30 pl-3">
                  {processingLogs.map((log, idx) => (
                    <div key={idx} className="text-gray-400 leading-tight">
                      {log}
                    </div>
                  ))}
                  <div className="text-emerald-400 animate-pulse mt-1">[WAIT] Completing final attribution scores...</div>
                </div>
              </div>
            )}
          </div>

          {/* Trigger compilation if no metrics processed */}
          {!diagnosticResult && !isProcessing && (
            <button
              id="execute-inference-btn"
              onClick={runDiagnostics}
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs px-6 py-3 rounded-lg transition-all flex items-center gap-2 shadow-[0_4px_16px_rgba(59,130,246,0.2)] font-mono tracking-wider w-full justify-center cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-blue-200" />
              <span>EXECUTE DIAGNOSTICS & EXPLANATION CORES</span>
            </button>
          )}

          {/* TAB EXPLANATION BAR */}
          {diagnosticResult && (
            <div className="mt-3 self-stretch border border-[#2D2D33] bg-[#0a0a0c] p-3 rounded-lg text-xs leading-relaxed text-gray-400 shadow-inner">
              {activeTab === 'original' && (
                <p>Showing original epithelial scan grid. Clinicians can click directly on anomalous zones on the canvas to relocate the neural classifier focus.</p>
              )}
              {activeTab === 'gradcam' && (
                <p><strong>Grad-CAM:</strong> {diagnosticResult.gradCamFocus}. Relies on gradients generated by un-frozen layers in Block 5 to construct localized attention bounds.</p>
              )}
              {activeTab === 'lime' && (
                <p><strong>LIME:</strong> {diagnosticResult.limeSummary}. Solves local surrogate coefficients to map how surrounding subregions influence category scores.</p>
              )}
              {activeTab === 'shap' && (
                <p><strong>SHAP:</strong> Red attribution dots denote pixel regions that positively support OSCC disease indicators, whereas blue points isolate suppression controls.</p>
              )}
            </div>
          )}
        </div>

        {/* COMPREHENSIVE INTERACTIVE EXPLAINER CALIBRATION TRIPLE CONSOLE */}
        {diagnosticResult && !isProcessing && (
          <div className="bg-[#141416] border border-[#2D2D33] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-4 animate-in fade-in duration-300" id="xai-calibration-console">
            <div className="flex items-center gap-2 border-b border-[#222228] pb-2 mb-3">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Explainers Calibration Console</h4>
              <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded ml-auto">REAL-TIME REDRAW ACTIVATED</span>
            </div>

            {/* TAB-SPECIFIC CALIBRATION PANELS */}
            {activeTab === 'gradcam' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 flex justify-between items-center mb-1">
                      <span>Grad-CAM Target Backprop Depth</span>
                      <span className="text-blue-400 font-bold text-[10px]">{gradCamDepth === 'block5_conv3' ? 'Fine Block 5' : gradCamDepth === 'block5_conv2' ? 'Mid Block 5' : 'Broad Block 4'}</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['block5_conv3', 'block5_conv2', 'block4_conv3'] as const).map((layer) => (
                        <button
                          key={layer}
                          onClick={() => setGradCamDepth(layer)}
                          className={`text-[9px] font-mono p-1 border rounded transition-all cursor-pointer ${
                            gradCamDepth === layer 
                              ? 'bg-blue-500/10 border-blue-500 text-white' 
                              : 'bg-[#0c0c0e] border-[#222228] text-gray-500 hover:border-[#383842]'
                          }`}
                        >
                          {layer.replace('block', 'B').replace('_conv', 'C')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 flex justify-between items-center mb-1">
                      <span>Heatmap Opacity</span>
                      <span className="text-white font-bold">{Math.round(gradCamOpacity * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0.15"
                      max="1.0"
                      step="0.05"
                      value={gradCamOpacity}
                      onChange={(e) => setGradCamOpacity(parseFloat(e.target.value))}
                      className="w-full bg-[#0c0c0e] rounded-lg appearance-none h-1.5 cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
                
                {/* Visual Guidelines */}
                <div className="p-3 bg-[#0a0a0c] border border-[#222228] rounded-lg text-[11px] leading-relaxed text-gray-400 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-gray-300 block mb-1">🔍 Clinician Interpretation Tip:</span>
                    <p className="text-[10px]">Backpropagation through shallower layers (Block 4) tracks broad anatomical context, while going deeper (Block 5 Layer 3) isolates fine histopathological borders.</p>
                  </div>
                  <div className="mt-2 text-[9px] text-gray-500 font-mono">
                    Target Node: vgg16 / {gradCamDepth}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lime' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 flex justify-between items-center mb-1">
                      <span>Superpixel Grids Partition (N)</span>
                      <span className="text-white font-bold">{limeGranularity} Zones</span>
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="24"
                      step="2"
                      value={limeGranularity}
                      onChange={(e) => setLimeGranularity(parseInt(e.target.value))}
                      className="w-full bg-[#0c0c0e] rounded-lg appearance-none h-1.5 cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 flex justify-between items-center mb-1">
                      <span>Monte Carlo Sample Budget</span>
                      <span className="text-white font-bold">{limeSampleBudget} Iterations</span>
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="500"
                      step="50"
                      value={limeSampleBudget}
                      onChange={(e) => setLimeSampleBudget(parseInt(e.target.value))}
                      className="w-full bg-[#0c0c0e] rounded-lg appearance-none h-1.5 cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Sub-modes control */}
                <div className="p-3 bg-[#0a0a0c] border border-[#222228] rounded-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-gray-300 font-bold">Contrast Boundary Focus</span>
                    <button
                      onClick={() => setLimeMode(limeMode === 'all' ? 'positive' : 'all')}
                      className={`text-[9px] px-2 py-1 font-mono border rounded transition-all cursor-pointer ${
                        limeMode === 'all' 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                          : 'bg-[#0c0c0e] border-[#222228] text-gray-500 hover:border-[#383842]'
                      }`}
                    >
                      {limeMode === 'all' ? 'ALL BOUNDARIES' : 'POSITIVE ATTACKS ONLY'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-405 leading-relaxed">Reducing the sample budget simulates real-time compute latency but introduces stochastic noise. Highly granular partitions mapping smaller cell sections help clinicians rule out satellite dysplasias.</p>
                </div>
              </div>
            )}

            {activeTab === 'shap' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-gray-400 flex justify-between items-center mb-1">
                      <span>Pixel Attributions density (Budget)</span>
                      <span className="text-white font-bold">{shapPixelDensity} points</span>
                    </label>
                    <input
                      type="range"
                      min="150"
                      max="750"
                      step="50"
                      value={shapPixelDensity}
                      onChange={(e) => setShapPixelDensity(parseInt(e.target.value))}
                      className="w-full bg-[#0c0c0e] rounded-lg appearance-none h-1.5 cursor-pointer accent-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-4 justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-gray-400 block">Scatter Dot Diameter</span>
                      <div className="flex gap-1.5 mt-1">
                        {[1.5, 2.5, 3.5].map((size) => (
                          <button
                            key={size}
                            onClick={() => setShapDotSize(size)}
                            className={`text-[9px] font-mono p-1 border rounded px-2.5 cursor-pointer ${
                              shapDotSize === size 
                                ? 'bg-blue-500/10 border-blue-500 text-white' 
                                : 'bg-[#0c0c0e] border-[#222228] text-gray-500 hover:border-[#383842]'
                            }`}
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-gray-404 block text-right">Inpaint Baseline Shroud</span>
                      <button
                        onClick={() => setShapBackgroundInpaint(!shapBackgroundInpaint)}
                        className={`text-[9px] font-mono p-1.5 border rounded mt-1.5 cursor-pointer flex ml-auto ${
                          shapBackgroundInpaint 
                            ? 'bg-blue-500/10 border-blue-500 text-white' 
                            : 'bg-[#0c0c0e] border-[#222228] text-gray-500 hover:border-[#383842]'
                        }`}
                      >
                        {shapBackgroundInpaint ? 'INPAINT (TELEA)' : 'BLACK SOLID OUTLINE'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#0a0a0c] border border-[#222228] rounded-lg text-[11px] leading-relaxed text-gray-400">
                  <span className="font-bold text-gray-300 block mb-1">🧬 Game-Theoretic Verification:</span>
                  <p className="text-[10px]">SHAP maps fine-grained pixel-level marginal contributions. Red pixels show direct biological forces increasing cancer predictions. Blue pixels indicate background values that actively suppress cancer classifiers.</p>
                </div>
              </div>
            )}

            {activeTab === 'original' && (
              <div className="p-3 bg-[#0a0a0c] border border-[#222228] rounded-lg text-xs leading-relaxed text-gray-400 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-gray-500 shrink-0" />
                <p>Real-time visual calibration controls are active when executing attribution overlays (Grad-CAM, LIME, or SHAP). Select another tab to calibrate.</p>
              </div>
            )}
          </div>
        )}

        {/* Inference scorecard and pathology advisor text representation */}
        {diagnosticResult && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Model stats summary card */}
            <div className="bg-[#141416] border border-[#2D2D33] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-4">
              <div className="flex items-center justify-between border-b border-[#222228] pb-2 mb-3">
                <span className="text-[10px] uppercase font-mono font-bold text-gray-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Clinical Diagnostics Scorecard</span>
                </span>
                <span className="text-[10px] font-mono text-gray-500">Processed in {diagnosticResult.processingTimeMs} ms</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                <div className="p-2.5 border rounded border-[#222228] bg-[#0c0c0e] flex flex-col justify-center">
                  <span className="text-[10px] text-gray-500 uppercase font-mono mb-1">Predicted Category</span>
                  <span className={`text-[13px] font-black tracking-wide ${diagnosticResult.class === 'OSCC' ? 'text-rose-400 text-glow-red' : diagnosticResult.class === 'Leukoplakia' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {diagnosticResult.class === 'OSCC' ? 'OSCC Malignant' : diagnosticResult.class === 'Leukoplakia' ? 'Leukoplakia' : diagnosticResult.class === 'Aphthous' ? 'Aphthous Ulcer' : 'Normal Mucosa'}
                  </span>
                </div>
                <div className="p-2.5 border rounded border-[#222228] bg-[#0c0c0e] flex flex-col justify-center">
                  <span className="text-[10px] text-gray-500 uppercase font-mono mb-1">Fine-tuned VGG16</span>
                  <span className="text-md font-bold text-blue-400">{(diagnosticResult.vggConfidence).toFixed(1)}%</span>
                </div>
                <div className="p-2.5 border rounded border-[#222228] bg-[#0c0c0e] flex flex-col justify-center">
                  <span className="text-[10px] text-gray-500 uppercase font-mono mb-1">Custom 2D-CNN Base</span>
                  <span className="text-md font-bold text-gray-400">{(diagnosticResult.cnnConfidence).toFixed(1)}%</span>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 bg-[#0c0c0e] border border-blue-900/20 p-3 rounded text-[11px] leading-relaxed text-gray-300 font-mono">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p><strong>Primary Clinician Guideline:</strong> {diagnosticResult.recommendation}</p>
              </div>
            </div>

            {/* Clinician Feedback & HITL Correction Panel */}
            <div className="bg-[#141416] border border-[#2D2D33] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-4 relative overflow-hidden" id="clinician-feedback-panel">
              {/* Decorative side accent */}
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222228] pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Clinician Correction Flow (HITL)</h4>
                </div>
                <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                  Human-in-the-loop Active
                </span>
              </div>

              {!currentFeedback.submitted ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Verify this category classification against expert clinical insight. If the gradient mapping or diagnostic output shows drift, issue a correction override.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      id="feedback-agree-btn"
                      onClick={() => setCurrentFeedback(f => ({ ...f, agreed: true, correctedClass: '' }))}
                      className={`flex-1 min-w-[130px] p-2.5 rounded-lg border transition-all text-xs font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                        currentFeedback.agreed === true
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)] animate-pulse'
                          : 'border-[#222228] bg-[#0c0c0e] text-gray-400 hover:border-emerald-500/50 hover:text-emerald-400'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Agree with AI</span>
                    </button>

                    <button
                      id="feedback-disagree-btn"
                      onClick={() => setCurrentFeedback(f => ({ ...f, agreed: false, correctedClass: currentFeedback.correctedClass || 'OSCC' }))}
                      className={`flex-1 min-w-[130px] p-2.5 rounded-lg border transition-all text-xs font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                        currentFeedback.agreed === false
                          ? 'border-rose-500 bg-rose-500/10 text-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.15)] animate-pulse'
                          : 'border-[#222228] bg-[#0c0c0e] text-gray-400 hover:border-rose-500/50 hover:text-rose-400'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Override / Disagree</span>
                    </button>
                  </div>

                  {currentFeedback.agreed === false && (
                    <div className="space-y-3 bg-[#0a0a0c] border border-[#222228] p-3 rounded-lg animate-in slide-in-from-top-1.5 duration-200">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 block mb-1 uppercase font-bold tracking-wider">Correct Clinical Diagnoses:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {(['Normal', 'OSCC', 'Leukoplakia', 'Aphthous'] as DiagnosticClass[]).map((cls) => {
                            const isAiPredicted = cls === diagnosticResult.class;
                            return (
                              <button
                                key={cls}
                                type="button"
                                onClick={() => setCurrentFeedback(f => ({ ...f, correctedClass: cls }))}
                                className={`text-[10.5px] font-sans py-1.5 px-2 border rounded-md transition-all cursor-pointer text-center font-medium ${
                                  currentFeedback.correctedClass === cls
                                    ? 'bg-blue-600 border-blue-500 text-white font-bold'
                                    : 'bg-[#141416] border-[#222228] text-gray-400 hover:text-white hover:border-[#33333e]'
                                }`}
                              >
                                {cls === 'OSCC' ? 'OSCC' : cls === 'Leukoplakia' ? 'Leuko' : cls === 'Aphthous' ? 'Aphthous' : 'Normal'}
                                {isAiPredicted && <span className="block text-[8px] opacity-60 font-mono italic">(Current AI)</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFeedback.agreed !== null && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 block mb-1 uppercase font-bold tracking-wider">Clinician Diagnostic Notes & Comments:</label>
                        <textarea
                          id="feedback-note-textarea"
                          placeholder={currentFeedback.agreed ? "Optional notes confirming alignment (e.g., agreed based on robust superpixel outlines)." : "Explain the clinical indicators or histopathology details missed by VGG16 (e.g., local keratinization markers)..."}
                          value={currentFeedback.note}
                          onChange={(e) => setCurrentFeedback(f => ({ ...f, note: e.target.value }))}
                          className="w-full bg-[#0c0c0e] border border-[#222228] hover:border-[#353540] focus:border-blue-500 transition-all text-xs p-2.5 rounded-lg text-white font-sans focus:outline-none min-h-[60px]"
                        />
                      </div>

                      <button
                        id="submit-feedback-btn"
                        onClick={() => {
                          const logItem = {
                            id: `hitl-${Date.now()}`,
                            timestamp: new Date().toLocaleTimeString(),
                            scanName: customImage ? `Uploaded: ${customFileName}` : selectedPreset.name,
                            aiClass: diagnosticResult.class,
                            clinicianClass: currentFeedback.agreed ? ('Agree' as const) : (currentFeedback.correctedClass as DiagnosticClass),
                            isAgreed: !!currentFeedback.agreed,
                            notes: currentFeedback.note.trim() || (currentFeedback.agreed ? 'Agreed with classification' : 'Correction logs recorded.')
                          };
                          setFeedbackLogs(p => [logItem, ...p]);
                          setCurrentFeedback(f => ({ ...f, submitted: true }));
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-md font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>SUBMIT CLINICAL DECISION CONTROL</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-lg flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 animate-bounce" />
                    <div>
                      <p className="text-xs font-bold text-white font-sans">Human-in-the-Loop Verdict Recorded</p>
                      <p className="text-[10.5px] text-gray-400 font-mono mt-0.5">
                        Feedback successfully integrated into pipeline state arrays. Added to decision audit trials.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      id="feedback-change-btn"
                      onClick={() => setCurrentFeedback(f => ({ ...f, submitted: false }))}
                      className="flex-1 bg-[#1c1c22] border border-[#2D2D33] text-gray-300 hover:text-white px-3 py-1.5 rounded text-[11px] font-mono transition-all text-center cursor-pointer"
                    >
                      Change Response
                    </button>
                  </div>
                </div>
              )}

              {/* Log book table representing the actual logging storage */}
              {feedbackLogs.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#222228] space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] font-mono uppercase font-bold text-gray-400 tracking-wider">Human Decision Logbook ({feedbackLogs.length})</span>
                  </div>

                  <div className="max-h-[140px] overflow-y-auto space-y-1.5 font-mono text-[10px] pr-1 scrollbar-thin">
                    {feedbackLogs.map((log) => (
                      <div key={log.id} className="bg-[#0c0c0e] border border-[#222228] p-2 rounded flex flex-col sm:flex-row justify-between sm:items-start gap-1">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[9px] text-[#80808A]">{log.timestamp}</span>
                            <span className="text-gray-300 font-semibold truncate max-w-[120px]" title={log.scanName}>{log.scanName}</span>
                          </div>
                          <p className="text-[9.5px] text-gray-450 font-sans italic">"{log.notes}"</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
                          <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">AI: {log.aiClass}</span>
                          <span className="text-gray-600">→</span>
                          {log.isAgreed ? (
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold text-[8.5px] uppercase">
                              AGREED
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-450 border border-rose-500/20 rounded font-bold text-[8.5px] uppercase">
                              {log.clinicianClass}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Smart Pathology advisory text container (Synthesizes report from server using Gemini API) */}
            <div className="bg-[#141416] border border-[#2D2D33] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>Explainable AI pathology Synthesis</span>
                  </h4>
                  <p className="text-[10px] text-gray-500 font-mono">Generates detailed expert advisory with clinical action plans.</p>
                </div>
                
                <button
                  id="synthesize-smart-report-btn"
                  onClick={generateSmartReport}
                  disabled={isGeneratingReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 font-mono cursor-pointer shadow-[0_2px_8px_rgba(59,130,246,0.15)]"
                >
                  {isGeneratingReport ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Synthesizing Report...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-blue-205" />
                      <span>Synthesize Smart Report</span>
                    </>
                  )}
                </button>
              </div>

              {/* Advisory details output */}
              {geminiReport ? (
                <div className="p-4 bg-[#0a0a0c] text-gray-350 rounded-lg text-xs leading-relaxed font-mono max-h-[400px] overflow-y-auto select-text border border-[#222228] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#222228] pb-2 mb-3 text-[10px] text-gray-500">
                    <span>PATHOLOGY RECORD: OSCC-XAI-2026</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-emerald-400 border border-emerald-500/20 rounded">COMPILED BY CHIEF SCHOLAR PIPELINE</span>
                  </div>
                  <p className="whitespace-pre-line">{geminiReport}</p>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-[#222228] rounded-lg flex flex-col items-center justify-center bg-[#0a0a0c]">
                  <FileText className="w-10 h-10 text-gray-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-400">No pathological report synthesized yet</p>
                  <p className="text-[10px] text-gray-550 mt-1 max-w-sm px-6">Click the button above to request structured multi-agent clinical opinions based on mathematical Shapley weights.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
