import {readFileSync,writeFileSync} from 'node:fs';
const html=readFileSync('index.html','utf8').replace('<head>','<head><base href="../">');
writeFileSync('tests/browser.html',html.replace('<script type="module" src="src/main.js"></script>','<pre id="report" style="white-space:pre-wrap;background:white;color:black;padding:20px">Running</pre><script type="module" src="tests/browser.js"></script>'));
writeFileSync('tests/layout.html',html.replace('<script type="module" src="src/main.js"></script>','<pre id="layout-report"></pre><script type="module" src="tests/layout.js"></script>'));
