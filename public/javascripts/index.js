// Delay to later add a sophisticated text editor
// Let's focus on the most interesting part:

// Writing code
// Uploading code
// Sending back the output or the errors

const shortcuts = {
    'ControlEnter': function() {
        console.log("Let's execute the code !");
    }
}

const editor = document.querySelector('#editor');
const run = document.querySelector('#run');
const language = document.querySelector('#language');

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
    const serverURL = "http://localhost:3000/compiler";
    const code = editor.value;
    const lang = language.value;

    const body = {code, lang };

    const result = await fetch(serverURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
});