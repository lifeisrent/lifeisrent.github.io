
const articleElement = document.querySelector('.article');

const listItems_ul = articleElement.querySelectorAll('ul li');
const listItems_ol = articleElement.querySelectorAll('ol li');


const imageUrl_ul = 'https://img.icons8.com/color/96/totoro.png';
const imageUrl_ol = 'https://img.icons8.com/emoji/48/pushpin-emoji.png';


listItems_ul.forEach((item, index) => {
  const imageElement = document.createElement('img');
  imageElement.setAttribute('width', '96');
  imageElement.setAttribute('height', '96');
  imageElement.src = imageUrl_ul;
  imageElement.alt = 'ghost--v1';

  item.insertBefore(imageElement, item.firstChild);
});

listItems_ol.forEach((item, index) => {

    const imageElement = document.createElement('img');
    imageElement.setAttribute('width', '96');
    imageElement.setAttribute('height', '96');
    imageElement.src = imageUrl_ol;
    imageElement.alt = 'ghost--v1';

    item.insertBefore(imageElement, item.firstChild);
});










