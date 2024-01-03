// Delay to later add a sophisticated text editor
// Let's focus on the most interesting part:

// Writing code
// Uploading code
// Sending back the output or the errors

const serverURL = location.origin;
const editor = document.querySelector('#editor');
const _console = document.querySelector('#console');
const stdout = _console.querySelector('.stdout')
const stderr = _console.querySelector('.stderr')
const compileOutput = _console.querySelector('.compile-output')
const run = document.querySelector('#run');
const language = document.querySelector('#language');
const spinner = document.querySelector(".spinner");
let token = "";
const MAX_CODE_EXEC = 10;


// Load available programming languages
window.addEventListener('load', async () => {
    const response = await fetch(`${serverURL}/languages`)
    const languages = await response.json();
    
    const defaultLanguage = localStorage.getItem('default_language');

    let html = '<option>Choose a programming language...</option>\n';
    for(lang of languages) {
        html += `<option ${defaultLanguage == lang.id ? 'selected' : ''} value=${lang.id}>${lang.name}</option>`;
    }

    language.innerHTML = html;
});


editor.addEventListener('keydown', e => {
    const key = e.key;
    // Detect press on key tab
    if(key == 'Tab') {
        e.preventDefault()
        
        const position = editor.selectionStart;
        const tab = '    ';
        const currentCode = editor.value;
        
        const before = currentCode.slice(0, position);
        const after = currentCode.slice(position)
        const codeAfterChange = before + tab + after;
        const newPosition = position + tab.length;
        
        editor.value = codeAfterChange;
        editor.setSelectionRange(newPosition, newPosition);
    } else if(e.ctrlKey && key === "Enter") {
        run.click();
    }
});

// Exécution du code
run.addEventListener('click', async e => {
    const code = editor.value;
    const lang = language.value;
    localStorage.setItem('default_language', lang);
    const body = {code, lang };
    spinner.style.display="inline";

    if(token == "") {
        const response = await fetch(`${serverURL}/submissions`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        
        console.log(data)
    
        if(!('token' in data)) {
            alert("Saisissez le code et choisissez un language de programmation !");
            spinner.style.display="none";
            return;
        }

        token = data.token;
    }

    const intervalId = setInterval(getCodeExecution, 1000);
    let execution_times = 0;
    
    async function getCodeExecution() {
        execution_times++;
        if(execution_times >= MAX_CODE_EXEC) {
            clearInterval(intervalId);
            spinner.style.display="none";
        }
        const response = await fetch(`${serverURL}/submissions/${token}`);
        const data = await response.json();

        // If the submission is not in queue
        if(data.status.id >= 3) {
            token = ""
            clearInterval(intervalId);
            spinner.style.display="none";

            // output the results           
            stdout.innerText = data.stdout || 'N/A';

            stderr.innerText = data.stderr || 'N/A';
            compileOutput.innerText = data.compile_output || 'N/A';

            _console.parentElement.style.display="block";
        }
    }
});