const upload = document.getElementById('upload');
const previews = document.getElementById('previews');
let images = [];

upload.addEventListener('change', () => {
    previews.innerHTML = '';
    images = [];
    Array.from(upload.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.src = e.target.result;
            img.className = 'preview-thumb';
            previews.appendChild(img);
            images.push(img);
        };
        reader.readAsDataURL(file);
    });
});

function analyzeFit() {
    if (images.length === 0) return alert('Upload pieces first!');
    document.getElementById('result').classList.remove('hidden');

    const items = images.map(img => ({
        category: categorize(img),
        color: getDominantColor(img)
    }));

    let score = 0;
    const categories = items.map(i => i.category);
    if (categories.includes('top')) score += 35;
    if (categories.includes('bottom')) score += 35;
    if (categories.includes('shoes')) score += 30;

    updateUI(score, items);
}

function categorize(img) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (ratio < 0.85) return 'top';
    if (ratio > 1.3) return 'bottom';
    return 'shoes';
}

function getDominantColor(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1; canvas.height = 1;
    ctx.drawImage(img, 0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2] };
}

function updateUI(score, items) {
    document.getElementById('score-text').textContent = score;
    document.getElementById('score-path').setAttribute('stroke-dasharray', `${score}, 100`);
    document.getElementById('feedback-text').innerHTML = `<p>Analysis complete.</p><small>Detected: ${items.map(i => i.category).join(', ')}</small>`;
}