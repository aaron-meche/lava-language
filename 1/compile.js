let lava_version = '2';

window.addEventListener('load', function () {
    let url_param   = new URLSearchParams(document.location.search);
    let url_request = url_param.get('p');

    if (url_request) {
        sessionStorage['activePage'] = url_request;
        window.location.reload();
    } 
    if (!sessionStorage['activePage']) sessionStorage['activePage'] = 'home';
    display(sessionStorage['activePage']);
})

function display(page_name) {
    let fetched_content = fetchContents(`./content/${page_name}.lava`);

    var js         = compile(fetched_content);
    var script     = document.createElement("script");
    var scriptText = document.createTextNode(js);
    script.          appendChild(scriptText);
    document.body.   appendChild(script);

    if (fetched_content.includes('<pre>Cannot GET')) {
        alert    ('404 Error: Page not found');
        open_page('home');
        window.location.reload();
    } 
    view_boot();
}



// WEB COMPILER

function compile(code) {
    let collection = '';
    code = code.replaceAll(' {','');
    code = code.replaceAll(' (','');
    var code_lineSplit = code.split('\n');

    // Cycle through every line of code
    for (i = 0; i < code_lineSplit.length; i++) {
        let line = code_lineSplit[i].trim().split(': ');

        // Key Words
        let instruction = line[0];
        let first =       line[1];
        let second =      line[2];
        let third =       line[3];
        let fourth =      line[3];
        let fifth =       line[3];
        let sixth =       line[3];
        let seventh =     line[3];
        let eighth =      line[3];
        let ninth =       line[3];
        let tenth =       line[3];

        // Instruction Breakup
        let instruction_word = instruction.split(' ');
        let instruction_key =  instruction_word[0];
        let instruction_val =  instruction_word[1];

        // Garbage Collecter
        let first_character = line[0].trim().split('')[0];
        if (first_character == '~') {
            continue;
        } 
        else if (first_character == '}') {
            collection += '}';
        }
        else if (first_character == ')') {
            collection += "+`</div>`";
        }
        else {
            instruction = instruction.toLowerCase()
            instruction = instruction.replaceAll(' ', '');
        }
        
        
        // Conditionals
        if (instruction == 'if') {
            collection += `if (${convertToAttribute(first)}) {`;
        }
        else if (instruction == 'eif') {
            collection += `else if (${convertToAttribute(first)}) {`;
        }
        else if (instruction == 'else') {
            collection += `else {`;
        }

        // Functions, Structures, and Views
        else if (instruction_key == 'func') {
            collection += `function ${instruction_val} (${first}) {`;
        }
        else if (instruction_key == 'struct') {
            collection += `function struct_${instruction_val} (${first}) { return ""`;
        }
        else if (instruction_key == 'view') {
            collection += `function view_${instruction_val}() {`;
        }
        else if (instruction_key == 'import') {
            // Import Structure
            if (instruction_val == 'struct') {
                collection += `document.body.innerHTML += struct_${first}(${second}) ;`;
            }
        }

        // Viewport Elements
        else if (instruction == 'elem') {
            collection += "+`<div " + convertToAttribute(first) + ">`";
        }
        else if (instruction_key == '>') {
            collection += "+`" + instruction.replace('>', '') + "`";
        }

        // Variables
        else if (instruction_key == 'let') {
            collection += `let ${instruction_val} = ${first}`;
        }
        else if (instruction_key == 'var') {
            collection += `var ${instruction_val} = ${first} ;`;
        }
        else if (instruction_key == 'const') {
            collection += `const ${instruction_val} = ${first} ;`;
        }
        else if (instruction_key == 'catch') {
            collection += `let ${instruction_val} = ${first.replace('$','')}(${second}) ;`;
        }

        // Misc. Operations
        else if (instruction == 'return') { // Return value from function
            collection += `return ${first} ;`;
        }
        else if (instruction == 'display') { // Insert HTML into DOM
            collection += `document.body.innerHTML += ${first} ;`;
        }
        else if (first_character == '$') { // Call functions
            collection += `${instruction.replace('$','')}(${first}) ;`;
        }

        collection += '\n';
    }
    console.log(collection);
    return collection;
}

function convertToAttribute(attributes) {
    if (attributes == undefined) {
        return '';
    } 
    else {
        // Quick HTML Actions
        attributes = attributes.replace('.','class');
        attributes = attributes.replace('#','id');
        attributes = attributes.replace('$','onclick');
        attributes = attributes.replace('@','name');
        // Extended Actions
        attributes = attributes.replaceAll('[','="');
        attributes = attributes.replaceAll(']','"');
        attributes = attributes.replaceAll('{','');
        // Conditional Shortcuts
        attributes = attributes.replaceAll('is','==');
        attributes = attributes.replaceAll('iss','===');
        attributes = attributes.replaceAll('less','<');
        attributes = attributes.replaceAll('more','>');
        return attributes;
    }
}

function display_text(text) {
    document.body.innerHTML += text;
}



// LIBRARY
function open_page(page) {
    sessionStorage['activePage'] = page;
    display(page);
}

function open_url(page) {
    window.open(page, '_self')
}

function dom(id) {
    return document.getElementById(id);
}

function dom_c(className) {
    return document.getElementsByClassName(className);
}

function generateNum(amount) {
    let library = [0,1,2,3,4,5,6,7,8,9];
    var generatedKey = '';
    for (let i = 0; i < amount; i++) {
        generatedKey = generatedKey + Math.floor(Math.random() * 10);
    }
    return generatedKey
}

function generateKey(amount) {
    let library = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',0,1,2,3,4,5,6,7,8,9];
    var generatedKey = '';
    for (let i = 0; i < amount; i++) {
        generatedKey = generatedKey + library[Math.floor(Math.random() * library.length)];
    }
    return generatedKey;
}

// Desktop Page Navigator
window.addEventListener('keydown', function (event) {
    if (event.code == 'Backslash') open_page(prompt("Enter Destination Page"));
})

// Mobile Page Navigatior
window.addEventListener('touchstart', (e) => {
    if (e.touches.length == 4) {
        open_page(prompt("Enter Destination Page"));
    }
})

function fetchContents(url) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener('readystatechange', function( ){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            return xmlhttp.responseText;
        }
    })
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    return xmlhttp.response;
}