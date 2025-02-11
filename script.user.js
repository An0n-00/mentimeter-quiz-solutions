// ==UserScript==
// @name        Mentimeter Quiz Solution Userscript
// @namespace   https://github.com/an0n-00/mentimeter-quiz-solutions
// @match       https://www.menti.com/*
// @grant       none
// @version     1.0
// @author      An0n-00
// @description Get answers for mentimeter quizzes
// @license     CC BY-NC-SA 4.0
// @updateURL   https://an0n-00.github.io/mentimeter-quiz-solutions/script.user.js
// @downloadURL https://an0n-00.github.io/mentimeter-quiz-solutions/script.user.js
// @supportURL  https://github.com/An0n-00/mentimeter-quiz-solutions/issues
// @icon        https://an0n-00.github.io/mentimeter-quiz-solutions/pics/github-mark-white.svg
// ==/UserScript==

(() => {
    function extractMentiSessionId(link) {
        return link.split('/').pop().split('?')[0];
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    fetch(`https://www.menti.com/core/audience/series/${extractMentiSessionId(window.location.href)}/series-id`, {
        "headers": {
            "accept": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-identifier": getCookie('identifier1')
        },
        "referrer": window.location.href,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })
    .then(response => response.json())
    .then(data => {
        let seriesId = data.series_id;
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '10px';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';
        div.style.zIndex = '1000';
        div.style.width = '80%';
        div.style.maxWidth = '600px';
        div.style.padding = '15px';
        div.style.backgroundColor = '#1f1f1f';
        div.style.color = '#e0e0e0';
        div.style.textAlign = 'center';
        div.style.fontFamily = 'Roboto, sans-serif';
        div.style.fontSize = '18px';
        div.style.borderRadius = '8px';
        div.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        div.style.transition = 'opacity 0.3s ease';
        div.innerHTML = `
            <p>Click the button below to get the answers:</p>
            <button id="getAnswers" style="padding: 10px 20px; background-color: #6200ea; color: #fff; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">Get Answers</button>
            <button id="closeAdvanced" style="padding: 10px 20px; background-color: #6200ea; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        `;
        div.querySelector('#getAnswers').addEventListener('click', () => {
            window.open(`https://an0n-00.github.io/mentimeter-quiz-solutions/?seriesId=${seriesId}`, '_blank');
            document.querySelector('#closeAdvanced').click();
        });
        div.querySelector('#closeAdvanced').addEventListener('click', () => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        });
        document.body.appendChild(div);

        const buttons = div.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#3700b3';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#6200ea';
            });
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });
            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1)';
            });
        });
    });
})();