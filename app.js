let model;
const upload = document.getElementById('upload');
const loading = document.getElementById('loading-overlay');
let images = [];

// Load the AI Model immediately
cocoSsd.load().then(ltdModel => {
    model = ltdModel;
    loading.style.display = 'none';
    console.log("AI Model Loaded");
});

upload.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    document.getElementById('previews').innerHTML = '';
    images = [];
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                img.className = 'preview-thumb';
                document.getElementById('previews').appendChild(img);
                images.push(img);
            };
        };
        reader.readAsDataURL(file);
    });
});

async function analyzeWithAI() {
    if (!model) return alert("Neural engine still loading...");
    if (images.length === 0) return alert("Upload clothes first!");

    let score = 0;
    let detectedTags = [];

    for (const img of images) {
        const predictions = await model.detect(img);
        predictions.forEach(p => {
            if(['shirt', 'pants', 'handbag', 'shoe'].includes(p.class)) {
                detectedTags.push(p.class);
                score += 25;
            }
        });
    }

    const finalScore = Math.min(score, 100);
    updateUI(finalScore, detectedTags);
}

function updateUI(score, tags) {
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('score-text').textContent = score;
    document.getElementById('score-path').setAttribute('stroke-dasharray', `, 100`);
    document.getElementById('feedback-text').innerHTML = 
        score > 60 ? '🔥 Neural Match: High Drip Factor' : '🛠️ Incomplete Fit: More Layers Needed';
}
