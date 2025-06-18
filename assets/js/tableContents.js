const table_contents = document.querySelector('.table_contents');
const table_contents_btn = document.querySelector('.table_contents_btn');
const table_contents_btn_p = document.querySelector('.table_contents_btn p');

const original_table_contents_btn = table_contents_btn ? window.getComputedStyle(table_contents_btn) : "";

function table_close_click(){
    if (table_contents.style.right === '' || table_contents.style.right === '15px') {
        close_contents_btn();
    } else {
        open_contents_btn();
    }
}


const mediaQuery1470 = window.matchMedia('(max-width: 1470px)');
function check_matches() {
    if (mediaQuery1470.matches){
        close_contents_btn();
    } else {
        open_contents_btn();
    }
}

check_matches();
mediaQuery1470.addListener(() =>{
    check_matches();
});


function close_contents_btn(){
    table_contents.style.right = '-300px'
    table_contents_btn.style.right = '15px'
    table_contents_btn.style.marginRight = '0px'
    table_contents_btn.style.borderRadius = '10px'
    table_contents_btn.style.width = '75px'
    table_contents_btn.style.height = '30px'
    table_contents_btn_p.innerText = 'Contents'
}
function open_contents_btn(){
    table_contents.style.right = '15px'
    table_contents_btn.style = original_table_contents_btn;
    table_contents_btn_p.innerText = 'C'
}




document.addEventListener('DOMContentLoaded', function() {
    const articleContainer = document.querySelector('#body .article');
    const headings = articleContainer.querySelectorAll('h1, h2');
    const table_content_inner = document.querySelector('.table_content_inner');

    if (headings.length > 0) {
        table_contents.style.display = 'flex';

        const tocList = document.createElement('ul');

        headings.forEach((heading) => {
            const listItem = document.createElement('li');
            listItem.textContent = heading.textContent;
            listItem.classList.add('toc-item', `toc-level-${heading.tagName[1]}`);

            listItem.addEventListener('click', () => {
                heading.scrollIntoView({ behavior: 'smooth' });
            });

            tocList.appendChild(listItem);
        });

        table_content_inner.appendChild(tocList);
    } else {
        table_contents.style.display = "none";
        table_contents_btn.style.display = "none";
    }
});

