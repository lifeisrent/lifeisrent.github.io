function randomText(){
  const text = ["💰", "🍕", "💧", "🌂", "🌀"];
  return text[Math.floor(Math.random() * text.length)];
}

function rain(){
  const cloud = document.querySelector('.cloud');
  const e = document.createElement('div');
  const left = Math.floor(Math.random() * 230);
  const size = Math.random() * 1.3 + 0.5;
  const duration = Math.random() + 1.5; 

  e.classList.add('text');
  cloud.appendChild(e);
  e.innerText = randomText();
  e.style.left = `${20 + left}px`;
  e.style.fontSize = `${size}em`;
  e.style.animationDuration = `${duration}s`;

  setTimeout(() => {
    e.remove(); 
  }, duration * 1000);
}

setInterval(() => {
  rain();
}, 100); 
