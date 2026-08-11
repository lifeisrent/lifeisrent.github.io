
const sidebar = document.querySelector('#sidebar');
const sidebar_on_off_btn = document.querySelector('#sidebar_on_off_btn');

const sidebar_area = document.querySelector('#sidebar_area');
const content_area = document.querySelector('#content_area');
const top_area = document.querySelector('#top_area');
const top_nav_bar = document.querySelector('#top_nav_bar');

const post_back = document.querySelector('#post_page .backg');
const cate_back = document.querySelector('#category_page .backg');
const search_back = document.querySelector('#search_page .backg');
const cate_wave = document.querySelector('#category_page .wave');

let sidebar_Open = true;
let sidebar_blocked = false;

function isCompactLayout() {
    return matchMedia("(max-width: 1300px)").matches;
}

function applyRoundedCorners(radius) {
    post_back?.style.setProperty('border-radius', radius, 'important');
    cate_back?.style.setProperty('border-radius', radius, 'important');
    search_back?.style.setProperty('border-radius', radius, 'important');
    cate_wave?.style.setProperty('border-radius', radius, 'important');
}

function menu_close_click() {
    close_menu();
    sidebar_blocked = true;
}
function menu_tag_click() {
    open_menu();
    sidebar_blocked = true;
}


// 버튼
function close_menu(){
    sidebar.style.marginLeft = "-300px";
    sidebar_on_off_btn.style.marginLeft = "20px";
    applyRoundedCorners('0');
    sidebar_area.style.display = "none";
    content_area.style.margin = "0";
    top_area.style.top = "0";
    top_nav_bar.style.padding = "20px 20px 0 20px";
    
    sidebar_Open = false;
}
function open_menu(){
    sidebar.style.marginLeft = "15px";
    applyRoundedCorners('10px');

    if (isCompactLayout()) {
        sidebar_on_off_btn.style.marginLeft = "-140px";
        sidebar_area.style.display = "none";
        content_area.style.margin = "0";
        top_area.style.top = "0";
        top_nav_bar.style.padding = "20px 20px 0 20px";
    } else {
        sidebar_on_off_btn.style.marginLeft = "-140px";
        sidebar_area.style.display = "flex";
        content_area.style.margin = "15px";
        top_area.style.top = "15px";
        top_nav_bar.style.padding = "11px 15px 0 15px";
    }

    sidebar_Open = true;
}

// 미디어 쿼리
updateSidebarStatus();
window.addEventListener('load', updateSidebarStatus);
window.addEventListener('resize', updateSidebarStatus);

function updateSidebarStatus() {
    if(!sidebar_blocked){
        if (matchMedia("(max-width: 1300px)").matches) {
            close_menu()
        } else {
            open_menu()
        }
    }
}

