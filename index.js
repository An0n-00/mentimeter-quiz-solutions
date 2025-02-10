document.getElementById('getAnswers').addEventListener('click', async function() {
    let mentiLink = document.getElementById('mentiLink').value;
    let mentiSessionId = mentiLink.split('/').pop().substring(0, 10) + "?";
    if (mentiSessionId) {
        document.getElementById('solution').innerText = `Fetching answers for MentiSession: ${mentiSessionId}...`;
        let data = await getData(`https://api.mentimeter.com/audience/slide-deck/${mentiSessionId}`);
        document.getElementById('solution').innerText = '';
        if (data.series === undefined) {
            document.getElementById('solution').innerText = 'No questions found. Please check if this is a correct Menti link. ' + `(${data.message})`;
        }
        data.series.questions.forEach(question => {
            if (question.type === 'quiz_open') {
                let questionText = question.question;
                let correctAnswers = question.choices;
                let newQuestion = document.createElement('div');
                newQuestion.innerHTML = `<h3>Question: ${questionText}</h3>`;
                correctAnswers.forEach(answer => {
                    newQuestion.innerHTML += `<p>Answer: ${answer.label}</p>`;
                });
                document.getElementById('solution').appendChild(newQuestion);
            }
        });
    } else {
        alert('Please enter a valid menti.com link.');
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
            alert('Failed to fetch data. Something went wrong.');
            throw new Error('Failed to fetch data');
        }
    })
    .then(data => {
        return data;
    });
}