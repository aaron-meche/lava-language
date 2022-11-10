let version = '4';

window.addEventListener('load', function () {
    let url_param = new URLSearchParams(document.location.search);
    let url_request = url_param.get('p');

    if (url_request) {
        sessionStorage['activePage'] = urlPageRequest;
        open_url('index.html');
    } 
    else if (!sessionStorage['activePage']) {
        sessionStorage['activePage'] = 'home';
    }
    display(sessionStorage['activePage']);
})

function display(page_name) {
    let fetched_content = fetchContents(`content/${page_name}.lava`);
    let compiled_content = compile(fetched_content);

    if (fetched_content.includes('<pre>Cannot GET')) {
        alert('404 Error: Page not found');
        open_page('home');
        window.location.reload();
    } 

    document.body.innerHTML = compile(fetched_content);
    document.querySelectorAll('div[lavatype="view"]').forEach(function(element) {
        element.style = `
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            background-color: inherit;
            overflow: auto;
            visibility: hidden;
        `;
    })
    open_view('boot');
    document.querySelectorAll('div[lavatype="module"]').forEach(function(module) {
        document.querySelectorAll('div[lavatype="module-import"][lavatitle="' + module.getAttribute('lavatitle') + '"]').forEach(function(template) {
            template.innerHTML = module.innerHTML;
        })
    });
    document.querySelectorAll('div[lavatype="js-import"]').forEach(function(request) {
        let script = document.createElement("script");
            script.src = request.getAttribute('lavatitle');
            script.type = "text/javascript";
        document.head.appendChild(script);
    })
    document.querySelectorAll('div[lavatype="page-preload"]').forEach(function(request) {
        preload(request.getAttribute('lavatitle'));
    })
    document.querySelectorAll('div[lavatype="title"]').forEach(function(element) {
        document.title = element.getAttribute('lavatitle');
    })

    main();
}



// COMPILER

function compile(code) {
    // Will hold viewport contents
    var collection = '';
    var splitCode = code.split('\n');

    // Cycles through every line of code
    for (i = 0; i < splitCode.length; i++) {
        let line = splitCode[i].split(' > ');
        let instruction = line[0];
        let first = line[1];
        let second = line[2];

        // Reading Lines
        if (line == '') {
            continue;
        } 
        else if (line[0].trim().split('')[0] == '~') {
            continue;
        } 
        else if (line[0].trim().split('')[0] == ':') {
            collection += instruction.replace(': ','');
            continue;
        } 
        else {
            instruction = instruction.toLowerCase()
            instruction = instruction.replaceAll(' ', '');
            instruction = instruction.replaceAll('<', '_$vectorStart$_');
            instruction = instruction.replaceAll('>', '_$vectorEnd$_');
            instruction = instruction.replaceAll('{', '_$braceStart$_');
            instruction = instruction.replaceAll('}', '_$braceEnd$_');
            instruction = instruction.replaceAll('(', '_$parenthesisStart$_');
            instruction = instruction.replaceAll(')', '_$parenthesisEnd$_');
            instruction = instruction.replaceAll('/', '_$slash$_');
            instruction = instruction.replaceAll(' ', '');
            instruction = instruction.replaceAll('-', '');
        }

        // Dictionary
        const objects = {
            // Standard HTML
            title: {
                format: `<title ${convertToAttribute(second)}>${first}</title>`,
            },
            button: {
                format: `<button ${convertToAttribute(second)}>${first}</button>`,
            },
            img: {
                format: `<img src='${first}' ${convertToAttribute(second)}>`,
            },
            link: {
                format: `<a href='${first}' ${convertToAttribute(second)}>`,
            },
            _$slash$_link: {
                format: `</a>`,
            },
            h: {
                format: `<h1 ${convertToAttribute(second)}>${first}</h1>`,
            },
            hh: {
                format: `<h2 {convertToAttribute(second)}>${first}</h2>`,
            },
            hhh: {
                format: `<h3 ${convertToAttribute(second)}>${first}</h3>`,
            },
            p: {
                format: `<p>`,
            },
            _$slash$_p: {
                format: `</p>`,
            },
            break: {
                format: `<br>`,
            },
            form: {
                format: `<form ${convertToAttribute(first)}>`,
            },
            _$slash$_form: {
                format: `</form>`,
            },
            input: {
                format: `<input ${convertToAttribute(first)}>`,
            },
            iframe: {
                format: `<iframe ${convertToAttribute(first)}></iframe>`,
            },     
            div: {
                format: `<div ${convertToAttribute(first)}>`,
            }, 
            elem: {
                format: `<div ${convertToAttribute(first)}>`,
            },            
            lnelm: {
                format: `<div ${convertToAttribute(first)}>${second}</div>`,
            },
            _$braceEnd$_: {
                format: `</div>`,
            },  

            // Imports
            importcss: {
                format: `<link rel='stylesheet' href='${first}' ${convertToAttribute(second)}>`,
            },
            importjs: {
                format: `<div lavatype='js-import' lavatitle='${first}' style='display:none'></div>`,
            },
            importwebicon: {
                format: `<link rel='shortcut icon' type='image/jpg' href='${first}' ${convertToAttribute(second)}>`,
            },
            importmodule: {
                format: `<div lavatype='module-import' lavatitle='${first}'></div>`,
            },

            // Defines
            definetitle: {
                format: `<div lavatype='title' lavatitle='${convertToAttribute(first)}' style='display:none'></div>`,
            },
            definemeta: {
                format: `<meta ${convertToAttribute(first)}>`,
            },
            defineview: {
                format: `<div lavatype='view' lavatitle='${convertToAttribute(first)}' ${convertToAttribute(second)}>`,
            },
            definemodule: {
                format: `<div lavatype='module' lavatitle='${convertToAttribute(first)}' style='display:none'>`,
            },
            definestyle: {
                format: `<style>`,
            },
            _$parenthesisEnd$_: {
                format: `</style>`,
            }, 

            // Lava Implementation
            preload: {
                format: `<div lavatype='page-preload' lavatitle='${first}' style='display:none'></div>`,
            },
        }

        // If command exists
        if (objects[instruction]) {
            collection += objects[instruction]['format'];
        }
        // If it does not exist, throw error
        else {
            console.warn(`Syntax Error: ${line}`);
        }
    }
    return collection;
}

function convertToAttribute(attributes) {
    if (attributes == undefined) {
        return '';
    } 
    else {
        // Base
        attributes = attributes.replace('.','class');
        attributes = attributes.replace('#','id');
        attributes = attributes.replace('$','onclick');
        attributes = attributes.replace('@','name');
        // Required for Compile
        attributes = attributes.replaceAll('[','="');
        attributes = attributes.replaceAll(']','"');
        attributes = attributes.replaceAll(' {','');
        return attributes;
    }
}



// LIBRARY

function open_page(page) {
    sessionStorage['activePage'] = page;
    display(page);
}

function open_view(view) {
    document.querySelectorAll('div[lavatype="view"]').forEach(function(element) {
        element.style.visibility = 'hidden';
    });
    document.querySelectorAll('div[lavatype="view"][lavatitle="' + view + '"]').forEach(function(element) {
        element.style.visibility = 'visible';
    });
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

function preload(fileName) {
    let content = fetchContents('pages/' + fileName + '.tgr');
    if (content.includes('<pre>Cannot GET')) {
        console.warn('Page Not Found! Preload failed due to 404 error: ' + fileName + '.tgr');
    } 
    // If page exists, build page
    else {
        sessionStorage['page preload: ' + fileName] = compile(content);
    }
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