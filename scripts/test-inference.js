/** Quick test: verify the quantized model works with the JS inference engine */
const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, '..', 'public', 'models', 'chat', 'model.json');
const raw = fs.readFileSync(modelPath, 'utf8');
const data = JSON.parse(raw);

console.log('Model loaded. Tags:', data.tags.length);
console.log('Quantized:', data.quantized);
console.log('Architecture:', JSON.stringify(data.architecture));

// Simulate the JS dequant + forward pass
const src = data.weights_quantized;

function dequantAndFlatten(layer) {
  if (layer.q) {
    const { q, scale, zp, shape, ndim } = layer;
    if (ndim === 1) return Float32Array.from(q.map(v => (v - zp) * scale));
    const [rows, cols] = shape;
    const out = new Float32Array(rows * cols);
    let idx = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out[idx++] = (q[r * cols + c] - zp) * scale;
    return out;
  }
  if (Array.isArray(layer) && Array.isArray(layer[0])) {
    const rows = layer.length, cols = layer[0].length;
    const out = new Float32Array(rows * cols);
    let idx = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out[idx++] = layer[r][c];
    return out;
  }
  return Float32Array.from(layer);
}

const W1 = dequantAndFlatten(src.W1);
const b1 = dequantAndFlatten(src.b1);
const W2 = dequantAndFlatten(src.W2);
const b2 = dequantAndFlatten(src.b2);
const W3 = dequantAndFlatten(src.W3);
const b3 = dequantAndFlatten(src.b3);

console.log('W1 length:', W1.length, '(expected', data.architecture.input_size * data.architecture.hidden1, ')');

function relu(x) { for (let i = 0; i < x.length; i++) if (x[i] < 0) x[i] = 0; return x; }
function softmax(x) { const m = Math.max(...x); const e = x.map(v => Math.exp(v - m)); const s = e.reduce((a, b) => a + b, 0); return e.map(v => v / s); }
function dense(W, b, x, outRows) { const out = new Float32Array(outRows); for (let i = 0; i < outRows; i++) { let s = b[i]; for (let j = 0; j < x.length; j++) s += W[j * outRows + i] * x[j]; out[i] = s; } return out; }

function preprocess(text) { return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean); }

function bagOfWords(tokens, word2idx, vocabSize, oovIdx) {
  const bag = new Float32Array(vocabSize);
  for (let i = 0; i < Math.min(tokens.length, 20); i++) {
    const idx = word2idx[tokens[i]];
    bag[idx !== undefined ? idx : oovIdx] = 1.0;
  }
  return bag;
}

function predict(text) {
  const tokens = preprocess(text);
  const bag = bagOfWords(tokens, data.word2idx, data.architecture.input_size, data.oov_index);
  const z1 = dense(W1, b1, bag, data.architecture.hidden1); relu(z1);
  const z2 = dense(W2, b2, z1, data.architecture.hidden2); relu(z2);
  const z3 = dense(W3, b3, z2, data.architecture.output_size);
  const probs = softmax(Array.from(z3));
  let maxIdx = 0; for (let i = 1; i < probs.length; i++) if (probs[i] > probs[maxIdx]) maxIdx = i;
  return { tag: data.tags[maxIdx], confidence: probs[maxIdx] };
}

// Test cases
const tests = [
  'hello',
  'how much does pro cost',
  'i need a mobile app',
  'tell me about cloud rental',
  'can i pause my subscription',
  'i want to build a website',
  'contact you',
  'ai solutions',
  'privacy policy',
  'bye',
];

console.log('\n--- Inference Tests ---');
for (const t of tests) {
  const r = predict(t);
  console.log(`  "${t}" → ${r.tag} (${(r.confidence * 100).toFixed(1)}%)`);
}
