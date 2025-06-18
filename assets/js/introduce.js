let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect(){
  const words = ["Robot Engineers", "Vision Algorithm developers", "Equipment Engineers"];
  const word = document.querySelector('.emp_word');
  const currentWord = words[wordIndex];

  word.textContent =currentWord.substring(0, charIndex);

  if(!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(typeEffect, 140);
  } else if(isDeleting && charIndex >0){
    charIndex--;
    setTimeout(typeEffect, 30);
  } else {
    isDeleting = !isDeleting;
    wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
    setTimeout(typeEffect, 1500);
  }
}
typeEffect();