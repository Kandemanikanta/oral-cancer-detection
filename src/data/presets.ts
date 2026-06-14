import { PresetSample } from '../types';

export const CLINICAL_PRESETS: PresetSample[] = [
  {
    id: 'preset-oscc',
    name: 'OSCC - Lateral Tongue Lesion',
    category: 'OSCC',
    trueClass: 'OSCC',
    image: 'oscc_tongue',
    riskLevel: 'High',
    clinicalDescription: 'A 1.8 cm exophytic, ulcerated, and poorly defined lesion on the right lateral border of the tongue. Indurated edges noticed on palpation.',
    findings: [
      'Ulcerated central core indicating mucosal breakdown.',
      'Raised, hyperkeratotic borders with irregular architecture.',
      'Slight bleeding upon contact, indicating neo-vascularization.'
    ],
    findingsCoordinates: { x: 55, y: 48, radius: 24 }, // percentage-based coordinates
    limeSuperpixels: [
      { points: [[45, 38], [63, 35], [68, 52], [48, 56]], score: 0.85 }, // positive impact (cancerous)
      { points: [[35, 30], [45, 38], [48, 56], [32, 48]], score: 0.12 }, // neutral
      { points: [[63, 35], [75, 28], [80, 45], [68, 52]], score: 0.72 }, // positive impact
      { points: [[20, 20], [35, 30], [32, 48], [15, 40]], score: -0.45 }, // negative (healthy tissue)
    ],
    cnnConfidence: 89.4,
    vggConfidence: 94.2,
    histopathologyReport: 'Biopsy exhibits cellular atypia, hyperchromatism, pleomorphism, and keratin pearls penetrating deep into the lamina propria, confirming well-differentiated squamous cell carcinoma.'
  },
  {
    id: 'preset-leukoplakia',
    name: 'Homogeneous Leukoplakia',
    category: 'Leukoplakia',
    trueClass: 'Leukoplakia',
    image: 'leukoplakia_buccal',
    riskLevel: 'Moderate',
    clinicalDescription: 'A broad, homogeneous, non-wiped white plaque on the left buccal mucosa. Asymptomatic and discovered during routine dental prophylaxis.',
    findings: [
      'Sharply demarcated white surface plaque (hyperkeratosis).',
      'No evidence of ulceration, induration, or erythema.',
      'Textured surface mimicking sand-paper consistency.'
    ],
    findingsCoordinates: { x: 62, y: 55, radius: 20 },
    limeSuperpixels: [
      { points: [[50, 45], [72, 40], [75, 62], [52, 65]], score: 0.48 }, // moderate positive (dysplasia risk)
      { points: [[72, 40], [85, 35], [90, 58], [75, 62]], score: 0.05 },
      { points: [[10, 10], [50, 45], [52, 65], [10, 80]], score: -0.62 }, // highly healthy
    ],
    cnnConfidence: 84.1,
    vggConfidence: 88.7,
    histopathologyReport: 'Hyperparakeratosis with a thickened spinous layer (acanthosis). No epithelial dysplasia observed at this site, but regular clinical monitoring is advised.'
  },
  {
    id: 'preset-ulcer',
    name: 'Benign Aphthous Ulcer',
    category: 'Aphthous',
    trueClass: 'Aphthous',
    image: 'aphthous_ulcer',
    riskLevel: 'Low',
    clinicalDescription: 'A painful, small 4 mm oval ulcer located on the labial vestibule mucosa. Patient reports recurrence related to stress. Resolves within 10-14 days.',
    findings: [
      'Fibrinous membranous center with a greyish-white appearance.',
      'Symmetric erythematous halo (red boundary of inflammation).',
      'Extremely well-defined boundaries with clean margins.'
    ],
    findingsCoordinates: { x: 50, y: 52, radius: 15 },
    limeSuperpixels: [
      { points: [[42, 45], [58, 45], [58, 59], [42, 59]], score: -0.25 }, // negative/benign feature
      { points: [[30, 30], [70, 30], [70, 70], [30, 70]], score: 0.15 }, // minor inflammatory response
      { points: [[10, 10], [30, 30], [30, 70], [10, 90]], score: -0.78 }, // strongly safe
    ],
    cnnConfidence: 91.5,
    vggConfidence: 93.8,
    histopathologyReport: 'Infiltrate of mixed inflammatory cells, vasculitis, and fibrinopurulent exudate covering a raw, exposed ulcerated squamous margin file. Entirely benign aphthosis.'
  },
  {
    id: 'preset-normal',
    name: 'Healthy Normal Mucosa',
    category: 'Normal',
    trueClass: 'Normal',
    image: 'healthy_gingiva',
    riskLevel: 'None',
    clinicalDescription: 'Uniform, salmon-pink, moist, and smooth pink mucosa of the soft palate and gingiva. No masses, lesions, ulcers, or patches observed.',
    findings: [
      'Consistent mucosal vascularity with no micro-vascular congestion.',
      'Symmetric epithelial texture with zero architectural distortion.',
      'Absence of keratotic debris, fissures, or ulcerated fissures.'
    ],
    findingsCoordinates: { x: 50, y: 50, radius: 0 }, // no focal points
    limeSuperpixels: [
      { points: [[0, 0], [100, 0], [100, 100], [0, 100]], score: -0.92 } // uniformly negative prediction of carcinoma
    ],
    cnnConfidence: 96.8,
    vggConfidence: 98.9,
    histopathologyReport: 'Stratified squamous epithelium of normal thickness with an intact basal membrane. Subepithelial connective tissue shows normal cellularity and vasculature.'
  }
];

export const MODEL_EVALUATION_METRICS = {
  accuracy: 92.0,
  precision: 91.2,
  recall: 94.1,
  f1Score: 92.6,
  sensitivity: 94.1,
  specificity: 90.2,
};

export const EPOCH_HISTORY: { epoch: number; accuracy: number; val_accuracy: number; loss: number; val_loss: number }[] = [
  { epoch: 1, accuracy: 0.552, val_accuracy: 0.615, loss: 0.941, val_loss: 0.812 },
  { epoch: 5, accuracy: 0.684, val_accuracy: 0.721, loss: 0.725, val_loss: 0.668 },
  { epoch: 10, accuracy: 0.745, val_accuracy: 0.782, loss: 0.584, val_loss: 0.521 },
  { epoch: 15, accuracy: 0.812, val_accuracy: 0.824, loss: 0.441, val_loss: 0.428 },
  { epoch: 20, accuracy: 0.854, val_accuracy: 0.861, loss: 0.352, val_loss: 0.365 },
  { epoch: 25, accuracy: 0.891, val_accuracy: 0.885, loss: 0.281, val_loss: 0.312 },
  { epoch: 30, accuracy: 0.914, val_accuracy: 0.902, loss: 0.221, val_loss: 0.285 },
  { epoch: 35, accuracy: 0.932, val_accuracy: 0.915, loss: 0.178, val_loss: 0.271 },
  { epoch: 40, accuracy: 0.948, val_accuracy: 0.920, loss: 0.142, val_loss: 0.264 },
];

export const CONFUSION_MATRIX = [
  { actual: 'OSCC', predictedOSCC: 112, predictedNormal: 7 },
  { actual: 'Normal', predictedOSCC: 12, predictedNormal: 109 },
];
