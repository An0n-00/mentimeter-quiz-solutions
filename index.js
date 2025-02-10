showAlert('Please enter a Menti link.', 'error');

document.getElementById('getAnswersForm').addEventListener('submit', (e) => {e.preventDefault();});

document.getElementById('notice').addEventListener('click', (e) => {
    document.getElementById('notice').style.display = 'none';
});

document.getElementById('getAnswers').addEventListener('click', async function() {
    let mentiLink = document.getElementById('mentiLink').value;
    if (mentiLink === '' || !mentiLink.includes('menti.com')) {
        showAlert('Please enter a Menti link.', 'error');
        return;
    }
    let mentiSessionId = mentiLink.split('/').pop().split('?')[0];
    if (mentiSessionId) {
        showAlert(`Fetching answers for MentiSession: ${mentiSessionId}...`, 'loading');
        let data = await getData(`https://api.allorigins.win/raw?url=https://api.mentimeter.com/audience/slide-deck/${mentiSessionId}`);
        document.getElementById('solution').innerText = '';
        if (data.series === undefined) {
            showAlert('No questions found. Please check if this is a correct Menti link. ' + `(${data.message})`, "error");
        }
        data.series.questions.forEach(question => {
            if (question.type === 'quiz_open') {
                let questionText = question.question;
                let correctAnswers = question.choices;
                let newQuestion = document.createElement('div');
                newQuestion.innerHTML = `<h3>Question: ${questionText}</h3>`;
                correctAnswers.forEach(answer => {
                    newQuestion.innerHTML += `<p><b>Answer: ${answer.label}</b></p>`;
                });
                document.getElementById('solution').appendChild(newQuestion);
            } else if (question.type === 'quiz') {
                let questionText = question.question;
                let correctAnswer = question.choices.filter(choice => choice.correct_answers === true);
                let newQuestion = document.createElement('div');
                newQuestion.innerHTML = `<h3>Question: ${questionText}</h3>`;
                if (correctAnswer.length === 0) {
                    newQuestion.innerHTML += `<p><b>This Question Type is not supported yet.</b></p>`;
                } else {
                    correctAnswer.forEach(answer => {
                        newQuestion.innerHTML += `<p><b>Answer: ${answer.label}</b></p>`;
                    });
                }
                document.getElementById('solution').appendChild(newQuestion);
            }
        });
    } else {
        showAlert('Please enter a valid menti.com link.', 'error');
    }
});

async function getData(link) {
    return await fetch(link, {
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
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            showAlert('Failed to fetch data. Something went wrong.', 'error');
            throw new Error('Failed to fetch data');
        }
    })
    .then(data => {
        return data;
    });
}

function showAlert(message, type) {
    const solutionDiv = document.getElementById('solution');
    solutionDiv.innerText = message;
    solutionDiv.className = type;
}

function showLoading(message) {
    const solutionDiv = document.getElementById('solution');
    solutionDiv.innerText = message;
    solutionDiv.className = 'loading';
}

function clearSolution() {
    const solutionDiv = document.getElementById('solution');
    solutionDiv.innerText = '';
    solutionDiv.className = '';
}