// Confetti logic
let canvas = document.getElementById("confetti-canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let confetti = [];

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
      d: Math.random() * 5 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 5 - 2.5,
      shape: Math.random() > 0.5 ? 'circle' : 'rect'
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < confetti.length; i++) {
    let c = confetti[i];
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation * Math.PI / 180);
    
    if (c.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, c.r, 0, 2 * Math.PI);
    } else {
      ctx.rect(-c.r, -c.r/2, c.r*2, c.r);
    }
    
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.restore();
    
    c.y += c.d;
    c.rotation += c.rotationSpeed;
    
    if (c.y > canvas.height) {
      c.y = -10;
      c.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(drawConfetti);
}

// Mic input and flame blowing
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let flame = document.getElementById("flame");

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  let mic = audioCtx.createMediaStreamSource(stream);
  let analyser = audioCtx.createAnalyser();
  mic.connect(analyser);
  let data = new Uint8Array(analyser.frequencyBinCount);

  function checkVolume() {
    analyser.getByteFrequencyData(data);
    let volume = data.reduce((a, b) => a + b) / data.length;

    if (volume > 60 && flame) {
      flame.style.display = "none";
      setTimeout(() => {
        createConfetti();
        drawConfetti();
      }, 50);
    }

    requestAnimationFrame(checkVolume);
  }

  checkVolume();
}).catch(err => {
  console.log("Microphone access not granted:", err);
  // Fallback in case microphone access is denied
  flame.addEventListener('click', () => {
    flame.style.display = "none";
    createConfetti();
    drawConfetti();
  });
});

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
