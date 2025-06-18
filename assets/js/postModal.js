// JavaScript
const articleImages = document.querySelectorAll('#post_page .article img');
const filteredImages = Array.from(articleImages).filter((img) => {
    let parentElement = img.parentElement;
    while (parentElement) {
        if (parentElement.tagName === 'LI' || parentElement.tagName === 'OL') {
            return false;
        }
        parentElement = parentElement.parentElement;
    }
    return true;
});


const main_img = document.querySelector('#postModal .main_img div');
const all_img = document.querySelector('#postModal .all_img');

let currentIndex = 0;

filteredImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        all_img.innerHTML = '';
        main_img.innerHTML = '';

        // All IMG
        filteredImages.forEach((articleImg) => {

            const allImage = document.createElement('img');
            allImage.src = articleImg.src;
            allImage.alt = articleImg.alt;
            all_img.appendChild(allImage);

            if(img === articleImg) allImage.style.borderColor = '#e76f51';
        });

        const allImages = all_img.querySelectorAll('img');
        allImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                reviseImage(index);
            });
        });


        // Modal IMG
        const modalImage = document.createElement('img');
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        main_img.appendChild(modalImage);

        currentIndex = index;

        document.querySelector('#postModal').style.display = 'flex';
    });
});

const closeModal = () => {
    document.querySelector('#postModal').style.display = 'none';
};



function reviseImage(index) {

    main_img.innerHTML = '';

    const modalImage = document.createElement('img');
    modalImage.src = filteredImages[index].src;
    modalImage.alt = filteredImages[index].alt;
    main_img.appendChild(modalImage);

    const allImages = all_img.querySelectorAll('img');
    allImages.forEach((img) => {
        img.style.borderColor = '#003049';
    });

    allImages[index].style.borderColor = '#e76f51';

    currentIndex = index; 
}



const leftModal = () => {
    if (currentIndex > 0) {
        reviseImage(currentIndex - 1);
    }
}

const rightModal = () => {
    if (currentIndex < filteredImages.length - 1) {
        reviseImage(currentIndex + 1);
    }
};





















