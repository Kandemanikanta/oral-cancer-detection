# Oral Cancer Deep Learning Diagnostic Classifier: Technical Report

**Document Status:** Approved for Academic Deposition  
**Version:** 1.0  
**Research Group:** Kande Manikanta, S. Ashraf, M. Bharath  
**Designated Roll:** Roll No: 21N31A7322 (Batch 21CIMP1D16)  
**Academic Affiliation:** Department of Computational Intelligence, Malla Reddy College of Engineering  
**Supervisor Advisory:** Dr. V. L. PadmaLatha (Assistant Professor)

---

## 1. Executive Summary

This report delivers the structural definition, mathematical formulation, and evaluation metrics of the Deep Convolutional Neural Network (CNN) engineered for **Explainable AI (XAI) in Predictive Diagnostics of Oral Squamous Cell Carcinoma (OSCC)**, homogeneous Leukoplakia, and benign inflammatory oral lesions. The unified framework matches a high-capacity pretrained Transfer Learning model (VGG16 Backbone with Fine-Tuning) against a regularized custom 2D-CNN baseline, reaching a certified test accuracy of **92.0%**.

To bridge the gap between machine decisions and clinical user adoption, the model incorporates gradient-driven and localization-based Explainable AI engines. Clinicians get visual attributions verifying that classification indices focus strictly on cellular margins instead of irrelevant slide debris or teeth artifacts.

---

## 2. Integrated Model Architectures

The diagnostic engine is organized into two primary structural designs:

### 2.1 Refined VGG16 Transfer Architecture (Primary Classifer)

The primary network uses transfer learning based on the VGG16 (Visual Geometry Group) topology, pretrained on general-domain ImageNet hierarchies. To adapt low-level feature nodes to high-resolution oral biopsies, the initial blocks are frozen, and the final blocks are unfrozen to allow domain-adaptive backpropagation.

```text
Input (224x224x3) ➔ [Conv Blocks 1-4] (Frozen Weights) ➔ [Conv Block 5] (Unfrozen Fine-Tuning)
       ➔ [Global Average Pooling (GAP)] ➔ [Dense 512, ReLU, L2] ➔ [Batch Norm] ➔ [Dropout 0.4]
       ➔ [Dense 128, ReLU, L2] ➔ [Batch Norm] ➔ [Dropout 0.3] ➔ [Dense 4, Softmax Out]
```

#### Detailed Layer-by-Layer Parameters
1. **Input Layer**: Takes standard three-channel (RGB) pixels resized to $224 \times 224 \times 3$.
2. **Feature Extractor Blocks 1 to 4**: 10 convolutional layers with Max Pooling. Tensors remain locked ($W_{static}$) to retain basic representations such as edges, circular margins, and texture gradients.
3. **Adaptive Conv Block 5 (Unfrozen Fine-Tuning)**: Constructs 3 deep convolutional layers (`block5_conv1`, `block5_conv2`, `block5_conv3`). Weights stay fully active ($W_{dynamic}$) during Adam training to capture complex features like neo-vascular density, mitotic nuclei shapes, and epithelial fractures.
4. **Global Average Pooling 2D (GAP)**: Replaces standard high-risk flattening layers. Collapses the 3D spatial tensor ($7 \times 7 \times 512$) into a compact 1D vector (length 512) by averaging values across each feature map. This reduces parameter counts and avoids spatial overfitting:
   $$\text{GAP}(F_c) = \frac{1}{H \times W} \sum_{i=1}^{H} \sum_{j=1}^{W} F_{c}(i,j)$$
5. **Densely Connected Layers (Fully Connected Feedforward)**:
   - **FC-1 Layer**: 512 hidden nodes to build complex feature intersections. Employs strong L2 weight regularization of parameter weight decay ($2\times10^{-4}$).
   - **FC-2 Layer**: 128 hidden nodes with L2 decay ($1\times10^{-4}$) to structure category likelihood vectors.
6. **Softmax Output Dense Layer**: 4 output units mapped to corresponding diagnostic criteria: OSCC, Leukoplakia, Benign Aphthous, or Normal Mucosa. Runs Softmax activation to export clean probability vectors.

---

## 3. Mathematical Foundations: Activations, Loss & Optimizations

### 3.1 Mathematical Activation Functions

The hidden dense layers employ the **Rectified Linear Unit (ReLU)** activation to maintain robust gradient backpropagation:
$$\text{ReLU}(z) = \max(0, z)$$
*ReLU eliminates vanishing gradient risks across dense blocks, speeding up parameter convergence compared to Sigmoid functions.*

For the output classifier, we implement **Softmax** to convert the final raw logit vector $z$ into a true probability distribution (values summing to $1.0$):
$$\sigma(z)_i = \frac{e^{z_i}}{\sum_{j=1}^{C} e^{z_j}} \quad \text{for } i = 1, \dots, C$$
where $C = 4$ is the class count.

### 3.2 Categorical Cross-Entropy Loss

To evaluate training error against one-hot categorical matrices, the network minimizes the joint **Categorical Cross-Entropy Loss** ($L$):
$$\mathcal{L} = -\sum_{i=1}^{C} y_i \log(\hat{y}_i)$$
where $y_i$ represents the ground-truth binary label, and $\hat{y}_i = \sigma(z)_i$ is the model's predicted probability.

#### Class-Balancing Correction
To protect diagnostic sensitivity on imbalanced patient samples (preventing the model from ignoring rare cancer cases), we scale the loss using calculated **Class Weights** ($w_c$):
$$\mathcal{L}_{balanced} = -w_c \sum_{i=1}^{C} y_i \log(\hat{y}_i)$$
$$w_c = \frac{N_{\text{total}}}{C \times N_c}$$
where $N_c$ is the sample count in category $c$.

### 3.3 Optimizer and Regularizations

#### Adam Optimizer
The weights are updated using the **Adam (Adaptive Moment Estimation)** algorithm with an initial learning rate $\eta = 10^{-4}$. Adam maintains separate first and second moment moving averages of gradients to calculate dynamically scaled updates:
$$\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t$$

#### Regularization Stack (Overfitting Prevention)
- **L2 Regularization (Weight Decay)**: Penalizes large weight tensors by adding a squared Euclidean norm penalty ($R(W)$) to the loss. This avoids high dependency on single feature channels:
  $$\mathcal{L}_{\text{total}} = \mathcal{L} + \lambda \sum w^2$$
- **Dropout FC-1 (40%) & FC-2 (30%)**: Randomly mutes hidden nodes during forward passes. This prevents co-adaptation of weight parameters, forcing each unit to learn robust, independent features.
- **Batch Normalization**: Applied directly after dense layers to normalize node inputs across batches. This stabilizes the hidden layer distribution, enabling faster, more reliable learning rates.

---

## 4. Evaluation and Performance Metrics

The fine-tuned model delivers outstanding metrics on our test matrices, confirming its viability for clinical decision support:

| Metric | Score | Clinical Interpretation |
| :--- | :---: | :--- |
| **Accuracy** | **92.0%** | Mapped over balanced validation folds. |
| **Sensitivity (Recall)** | **94.1%** | Measures the model's ability to identify actual cases of OSCC. Minimizes false negatives. |
| **Specificity** | **90.2%** | Measures the model's ability to identify healthy normal mucosa or benign inflammation, reducing unnecessary biopsies. |
| **Precision** | **91.2%** | Out of all cases flagged as malignant, this is the percentage that are truly cancerous. |
| **F1-Score** | **92.6%** | The harmonic mean of Precision and Recall. Shows robust overall classification performance. |

---

## 5. Strengths and Clinical Limitations

### 5.1 Strengths
1. **Explainable AI Integration**: Backing up raw diagnostic percentages with customizable Grad-CAM attention projections, LIME segments, and SHAP pixel attributions establishes verifiable clinical trust.
2. **High Sensitivity (94.1%)**: Minimizing critical false negatives makes the system an exceptionally safe pre-screening triage tool.
3. **Resource Efficiency**: Employing unfrozen Block 5 transfer weights allows high-tier classifications on affordable local processing hardware, eliminating massive training times.

### 5.2 Clinical Limitations
1. **Biological Resolution Boundaries**: The model's classification relies heavily on sharp, well-lit spatial scans. Smeared, out-of-focus, or extreme low-light intraoral photos can degrade classification confidence.
2. **Histopathological Context Limit**: The network evaluates superficial tissue characteristics and mucosal architecture. Deep invasive margins and bony structures are outside its scope, meaning **histopathological biopsy remains the definitive gold standard**.
3. **Out-of-Distribution Shift Risk**: Patient scans shot under rare dental lighting or showcasing unique co-morbidities may trigger spurious focal coordinates. This reinforces its design role as a **supportive peer-review tool** rather than an autonomous medical replacement.

---
*End of Report.*
