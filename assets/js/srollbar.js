const scoll_bar = document.querySelector('#scoll_bar');
        
window.addEventListener("scroll", () => {
    let fullHeight = document.body.scrollHeight - window.innerHeight;
    let scroll = scrollY;
    let progress = (scroll/fullHeight)*100;

    scoll_bar.style.width = progress + '%';
})

