# mentimeter-quiz-solutions

[![GitHub issues](https://img.shields.io/github/issues/An0n-00/mentimeter-quiz-solutions?label=Issues&color=red)](https://github.com/An0n-00/mentimeter-quiz-solutions/issues)  [![GitHub stars](https://img.shields.io/github/stars/An0n-00/mentimeter-quiz-solutions?label=Stars&color=yellow)](https://github.com/An0n-00/mentimeter-quiz-solutions/stargazers)   [![GitHub license](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-orange)](https://github.com/An0n-00/mentimeter-quiz-solutions/blob/main/LICENSE.md)  [![GitHub open pull requests](https://img.shields.io/github/issues-pr/An0n-00/mentimeter-quiz-solutions?label=Open%20PRs&color=cyan)](https://github.com/An0n-00/mentimeter-quiz-solutions/pulls)

A website that automatically gets the solutions of your mentimeter quiz. 🎉

This project is merely a proof of concept and should not be used for any malicious purposes. ⚠️

## How to use

1. 📋 Copy the link of the mentimeter quiz you want to get the solutions of.

2. 🌐 Go to the website: [https://an0n-00.github.io/mentimeter-quiz-solutions/](https://an0n-00.github.io/mentimeter-quiz-solutions/) and paste the link in the input field.

3. 🖱️ Click on the "Get solutions" button.

4. ✅ The solutions will be displayed on the screen.

## Userscript

You can also use this project as a userscript. To do this, you need to install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/), [Greasemonkey](https://www.greasespot.net/) or [Violentmonkey](https://violentmonkey.github.io/).

After installing the userscript manager, you can install the userscript by adding the following link to the userscript manager:

[Install userscript](https://github.com/An0n-00/mentimeter-quiz-solutions/raw/refs/heads/main/script.user.js)

After installing the userscript, you can go to any mentimeter quiz and click on the userscript icon to get the solutions of the quiz.

## How it works

I noticed that the mentimeter all the data of the quiz are requested on page load. This means that the solutions are also requested and can be found in the response data. This website simply gets the data of the quiz and extracts the solutions from it. 🕵️‍♂️

## Disclaimer

This project is merely a proof of concept and should not be used for any malicious purposes. I am not responsible for any misuse of this project. 🚫

## License

License: mentimeter-quiz-solutions by An0n-00 is [licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](./LICENSE). 📜
