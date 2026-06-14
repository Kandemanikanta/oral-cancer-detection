export type DiagnosticClass = 'Normal' | 'OSCC' | 'Leukoplakia' | 'Aphthous';

export interface PresetSample {
  id: string;
  name: string;
  category: DiagnosticClass;
  image: string; // generated image or placeholder
  riskLevel: 'None' | 'High' | 'Moderate' | 'Low';
  clinicalDescription: string;
  findings: string[];
  findingsCoordinates: { x: number; y: number; radius: number }; // where to center the hotspot
  limeSuperpixels: Array<{ points: [number, number][]; score: number }>; // coordinate regions and LIME values
  trueClass: DiagnosticClass;
  cnnConfidence: number;
  vggConfidence: number;
  histopathologyReport: string;
}

export interface DiagnosticResult {
  class: DiagnosticClass;
  confidence: number;
  vggConfidence: number;
  cnnConfidence: number;
  processingTimeMs: number;
  timestamp: string;
  hasLesion: boolean;
  notes: string;
  recommendation: string;
  shapValue: number;
  limeSummary: string;
  gradCamFocus: string;
}

export interface EpochMetric {
  epoch: number;
  accuracy: number;
  val_accuracy: number;
  loss: number;
  val_loss: number;
}
