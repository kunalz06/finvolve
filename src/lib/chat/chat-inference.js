/**
 * DEV∞ Chatbot — ML Inference Engine
 * Pure JS forward-pass through the trained neural network.
 * Supports int8-quantized weights (dequantized on load).
 * No TensorFlow.js dependency — just matrix math.
 */

let model = null;
let loading = null;
let W1, b1, W2, b2, W3, b3;

/**
 * Load model JSON + dequantize weights once
 */
export async function loadModel() {
  if (model) return model;
  if (loading) return loading;

  loading = fetch("/models/chat/model.json")
    .then((r) => {
      if (!r.ok) throw new Error(`Model load failed: ${r.status}`);
      return r.json();
    })
    .then((data) => {
      model = data;
      const src = data.quantized ? data.weights_quantized : data.weights;
      W1 = dequantAndFlatten(src.W1);
      b1 = dequantAndFlatten(src.b1);
      W2 = dequantAndFlatten(src.W2);
      b2 = dequantAndFlatten(src.b2);
      W3 = dequantAndFlatten(src.W3);
      b3 = dequantAndFlatten(src.b3);
      loading = null;
      return model;
    })
    .catch((err) => {
      loading = null;
      console.error("Chat model load error:", err);
      return null;
    });

  return loading;
}

/** Dequantize a 2D layer and flatten to 1D Float32Array (row-major stored as col-major for dense()) */
function dequantAndFlatten(layer) {
  // If quantized
  if (layer.q) {
    const { q, scale, zp, shape, ndim } = layer;
    if (ndim === 1) return Float32Array.from(q.map((v) => (v - zp) * scale));
    const [rows, cols] = shape;
    const out = new Float32Array(rows * cols);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out[idx++] = (q[r * cols + c] - zp) * scale;
      }
    }
    return out;
  }
  // If raw float array-of-arrays
  if (Array.isArray(layer) && Array.isArray(layer[0])) {
    const rows = layer.length;
    const cols = layer[0].length;
    const out = new Float32Array(rows * cols);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out[idx++] = layer[r][c];
      }
    }
    return out;
  }
  return Float32Array.from(layer);
}

function dequant1D(layer) {
  if (layer.q) {
    const { q, scale, zp } = layer;
    return q.map((v) => (v - zp) * scale);
  }
  return layer;
}

/** ReLU */
function relu(x) {
  for (let i = 0; i < x.length; i++) {
    if (x[i] < 0) x[i] = 0;
  }
  return x;
}

/** Softmax */
function softmax(x) {
  const max = Math.max(...x);
  const exps = x.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

/**
 * Dense layer: W (row-major flat) @ x + b
 * W shape: [inputSize, outputSize] stored as flat [inputSize * outputSize]
 * Access pattern: W[j * outRows + i] for input j, output i
 */
function dense(W_flat, b, x, outRows) {
  const out = new Float32Array(outRows);
  for (let i = 0; i < outRows; i++) {
    let sum = b[i];
    for (let j = 0; j < x.length; j++) {
      sum += W_flat[j * outRows + i] * x[j];
    }
    out[i] = sum;
  }
  return out;
}

/** Normalize and tokenize */
function preprocess(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

/** Bag-of-words */
function bagOfWords(tokens, word2idx, vocabSize, oovIdx) {
  const bag = new Float32Array(vocabSize);
  for (let i = 0; i < Math.min(tokens.length, 20); i++) {
    const idx = word2idx[tokens[i]];
    bag[idx !== undefined ? idx : oovIdx] = 1.0;
  }
  return bag;
}

/**
 * Run inference
 */
export function predict(text, mdl) {
  if (!mdl || !W1) return null;

  const { word2idx, tags, oov_index } = mdl;
  const vocabSize = mdl.architecture.input_size;
  const h1 = mdl.architecture.hidden1;
  const h2 = mdl.architecture.hidden2;
  const numClasses = mdl.architecture.output_size;

  const tokens = preprocess(text);
  const bag = bagOfWords(tokens, word2idx, vocabSize, oov_index);

  // Forward: Input(373) → Dense(128,relu) → Dense(64,relu) → Dense(30,softmax)
  const z1 = dense(W1, b1, bag, h1);
  relu(z1);

  const z2 = dense(W2, b2, z1, h2);
  relu(z2);

  const z3 = dense(W3, b3, z2, numClasses);
  const probs = softmax(Array.from(z3));

  let maxIdx = 0;
  let maxProb = probs[0];
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > maxProb) {
      maxProb = probs[i];
      maxIdx = i;
    }
  }

  return {
    tag: tags[maxIdx],
    confidence: maxProb,
    probabilities: tags.map((tag, i) => ({ tag, prob: probs[i] })).sort((a, b) => b.prob - a.prob),
  };
}
