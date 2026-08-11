const currentUrl = window.location.href;
const currentPath = window.location.pathname;
const isRootPage = currentPath === '/' || currentPath === '/index.html';
const isVisitingPage = currentUrl.includes('/visiting');


const logo = document.querySelector('.logo');
const top_search = document.querySelector('#top_search');
const backg = document.querySelector('.backg');
const top_area = document.querySelector('#top_area');
const top_nav_bar = document.querySelector('#top_nav_bar');


if(!isRootPage && !isVisitingPage) {
    logo.src = "/assets/images/git-rich-logo.png";
    top_search.src = "/assets/images/icon_search_l_y.png";
}

function updateRootTopNavVisibility() {
    if (!isRootPage || !top_area || !top_nav_bar) {
        return;
    }

    const isAtTop = window.scrollY <= 10;

    top_area.style.opacity = isAtTop ? '1' : '0';
    top_area.style.transform = isAtTop ? 'translateY(0)' : 'translateY(-16px)';
    top_area.style.pointerEvents = isAtTop ? 'auto' : 'none';
    top_area.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    top_nav_bar.classList.toggle('is-hidden-at-scroll', !isAtTop);
}

window.addEventListener("scroll", () => {
    updateRootTopNavVisibility();

    if(!isRootPage && !isVisitingPage) {
        if(window.scrollY < backg.offsetHeight - 40 ) {
            // console.log(window.scrollY);
            logo.src = "/assets/images/git-rich-logo.png";
            top_search.src = "/assets/images/icon_search_l_y.png";
        } else {
            logo.src = "/assets/images/git-rich-logo.png";
            top_search.src = "/assets/images/icon_search_l.png";
        }
    }
})

updateRootTopNavVisibility();
