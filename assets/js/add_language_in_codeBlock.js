
// 언어 이름 추가
window.addEventListener('DOMContentLoaded', function() {
    var codeBlocks = document.querySelectorAll('.highlighter-rouge');

    codeBlocks.forEach(function(codeBlock) {
        var highlight = codeBlock.querySelector('.highlight'); 

        if (highlight) {
            var languageClass = codeBlock.classList[0]; 

            var languageLabel = document.createElement('div');
            languageLabel.textContent = languageClass.substring(9); 
            languageLabel.classList.add('language_label');

            codeBlock.insertBefore(languageLabel, highlight);
        }
    });
});








