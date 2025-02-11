document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    showAlert('Please enter a Menti link.', 'error');
});

function initializeEventListeners() {
    document.getElementById('getAnswersForm').addEventListener('submit', (e) => e.preventDefault());
    document.getElementById('notice').addEventListener('click', hideNotice);
    document.getElementById('getAnswers').addEventListener('click', handleGetAnswersClick);
    document.getElementById('getAnswersAdvanced').addEventListener('click', handleGetAnswersAdvancedClick);
}

function handleGetAnswersAdvancedClick() {
    window.history.pushState({}, '', `?seriesId=${document.getElementById('seriesValue').value}`);
    let seriesId = document.getElementById('seriesValue').value;
    if (!isValidSeriesId(seriesId)) {
        showAlert('Please enter a valid Menti Series ID.', 'error');
        window.history.pushState({}, '', window.location.pathname);
        return;
    }
    fetchAndDisplayAnswersAdvanced(seriesId);
}

function isValidSeriesId(seriesId) {
    if (seriesId.contains('menti.com') || seriesId.contains('/')) {
        return false;
    } else {
        return true;
    }
}

function fetchAndDisplayAnswersAdvanced(seriesId) {
    showAlert(`Fetching answers for MentiSeries: ${seriesId}...`, 'loading');
    getData(`https://api.allorigins.win/raw?url=https://api.mentimeter.com/series/${seriesId}`)
        .then(data => {
            clearSolution();
            if (data.series_id !== seriesId) {
                window.history.pushState({}, '', window.location.pathname);
                showAlert(`No questions found. Please check if this is a correct Menti link. (${data.message})`, 'error');
            } else {
                displayQuestions(data.questions);
            }
        })
        .catch(() => {
            window.history.pushState({}, '', window.location.pathname);
            showAlert('Failed to fetch data. Something went wrong.', 'error');
        });
}


function hideNotice() {
    document.getElementById('notice').style.display = 'none';
    localStorage.setItem('hideNotice', 'true');
}

async function handleGetAnswersClick() {
    const mentiLink = document.getElementById('mentiLink').value;
    window.history.pushState({}, '', `?mentiLink=${mentiLink}`);
    if (!isValidMentiLink(mentiLink)) {
        showAlert('Please enter a Menti link.', 'error');
        window.history.pushState({}, '', window.location.pathname);
        return;
    }

    const mentiSessionId = extractMentiSessionId(mentiLink);
    if (mentiSessionId) {
        await fetchAndDisplayAnswers(mentiSessionId);
    } else {
        window.history.pushState({}, '', window.location.pathname);
        showAlert('Please enter a valid menti.com link.', 'error');
    }
}

function isValidMentiLink(link) {
    return link !== '' && link.includes('menti.com');
}

function extractMentiSessionId(link) {
    return link.split('/').pop().split('?')[0];
}

async function fetchAndDisplayAnswers(sessionId) {
    showAlert(`Fetching answers for MentiSession: ${sessionId}...`, 'loading');
    try {
        const data = await getData(`https://api.allorigins.win/raw?url=https://api.mentimeter.com/audience/slide-deck/${sessionId}`);
        clearSolution();
        if (data.series === undefined) {
            window.history.pushState({}, '', window.location.pathname);
            showAlert(`No questions found. Please check if this is a correct Menti link. (${data.message})`, 'error');
        } else {
            displayQuestions(data.series.questions);
        }
    } catch (error) {
        window.history.pushState({}, '', window.location.pathname);
        showAlert('Failed to fetch data. Something went wrong.', 'error');
    }
}

async function getData(link) {
    const response = await fetch(link, {
        headers: {
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-GB,en;q=0.8',
            'dnt': '1',
            'origin': 'https://www.menti.com',
            'referer': 'https://www.menti.com/',
            'sec-ch-ua': '"(Not(A:Brand";v="99", "Opera";v="116", "Chromium";v="131"',
            'sec-ch-ua-full-version-list': '"(Not(A:Brand";v="99.0.0.0", "Opera";v="116", "Chromium";v="131"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6779.75 Safari/537.36 OPR/116.0.5207.26'
        }
    });

    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error('Failed to fetch data');
    }
}

function displayQuestions(questions) {
    questions.forEach(question => {
        if (question.type === 'quiz_open') {
            displayOpenQuizQuestion(question);
        } else if (question.type === 'quiz') {
            displayQuizQuestion(question);
        }
    });
}

function displayOpenQuizQuestion(question) {
    const questionText = question.question;
    const correctAnswers = question.choices;
    const newQuestion = createQuestionElement(questionText);

    correctAnswers.forEach(answer => {
        newQuestion.innerHTML += `<p><b data="${answer.label}">Answer: ${answer.label}</b></p>`;
    });
    newQuestion.addEventListener('click', () => {
        navigator.clipboard.writeText(newQuestion.querySelector('b').getAttribute('data'));
        dropdown('Copied Solution!');
    });
    document.getElementById('solution').appendChild(newQuestion);
}

function displayQuizQuestion(question) {
    const questionText = question.question;
    const correctAnswers = question.choices.filter(choice => choice.correct_answer === true);
    const newQuestion = createQuestionElement(questionText);

    if (correctAnswers.length === 0) {
        newQuestion.innerHTML += `<p><b>This Question Type is not supported with pure menti link.</b></p>`;
    } else {
        correctAnswers.forEach(answer => {
            newQuestion.innerHTML += `<p><b data="${answer.label}">Answer: ${answer.label}</b></p>`;
        });
        newQuestion.addEventListener('click', () => {
            navigator.clipboard.writeText(newQuestion.querySelector('b').getAttribute('data'));
            dropdown('Copied Solution!');
        });
    }

    document.getElementById('solution').appendChild(newQuestion);
}

function createQuestionElement(questionText) {
    const newQuestion = document.createElement('div');
    newQuestion.innerHTML = `<h3>Question: ${questionText}</h3>`;
    return newQuestion;
}

function showAlert(message, type) {
    const solutionDiv = document.getElementById('solution');
    solutionDiv.innerText = message;
    solutionDiv.className = type;
}

function clearSolution() {
    const solutionDiv = document.getElementById('solution');
    solutionDiv.innerText = '';
    solutionDiv.className = '';
}

function dropdown(message) {
    const dropdown = document.getElementById('dropdown');
    dropdown.innerText = message;
    dropdown.classList.add('show');
    setTimeout(() => dropdown.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('hideNotice')) {
        document.getElementById('notice').style.display = 'none';
    }

    if (new URLSearchParams(window.location.search).has('mentiLink')) {
        const mentiLink = new URLSearchParams(window.location.search).get('mentiLink');
        document.getElementById('mentiLink').value = mentiLink;
        handleGetAnswersClick();
    }

    if (new URLSearchParams(window.location.search).has('seriesId')) {
        const seriesId = new URLSearchParams(window.location.search).get('seriesId');
        document.getElementById('seriesValue').value = seriesId;
        fetchAndDisplayAnswersAdvanced(seriesId);
    }
});