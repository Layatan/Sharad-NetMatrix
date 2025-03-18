const textBox = document.getElementById("prompt");
const indicators = document.getElementsByClassName("indicator");
const portraitGallery = document.getElementsByClassName("portraitGallery")[0];

let styleSheet = document.styleSheets[0];

console.log("JS loaded!");

textBox.addEventListener("focus", function () { //pomptBox active
    indicators[1].style.setProperty("animation-name", "blink");
    textBox.setAttribute("rows", "6")
});

textBox.addEventListener('blur', function () { //pomptBox deselected
    indicators[1].style.setProperty("animation-name", "none");
    textBox.value = textBox.value.trim();
    
    if (textBox.value === "") {
        textBox.setAttribute("rows", "1");
        indicators[1].style.setProperty("opacity", "0.3");
    } 
    else {
        
        if (textBox.scrollHeight > textBox.clientHeight) {
            textBox.setAttribute("rows", "6");
        }
        else {
            let rowCount = 0;

            do {
                textBox.setAttribute("rows", (++rowCount).toString());
                if (rowCount == 6) break;
            } while (textBox.clientHeight != textBox.scrollHeight)
        }

        indicators[1].style.setProperty("opacity", "1"); 
    }
});

textBox.addEventListener('keydown', function(event) { 
    if (event.ctrlKey && event.key === 'Enter') { //xss yourself for all i care
        console.log('Control + Enter was pressed!');
        textBox.blur();

        const newDiv = document.createElement("div");
        const newImg = document.createElement("img");
        
        newImg.setAttribute("src", "data/unknown.jpg");
        newDiv.appendChild(newImg);

        // Append the new div to the parent element
        portraitGallery.appendChild(newDiv);
        updateGallery();
    }
});


// Function to manage a dedicated CSS stylesheet
function updateGallery(cssRules) {
    // Check if the dedicated stylesheet already exists
    let dynamicStyleSheet = document.getElementById("portraitBGblurImages");
  
    // If it doesn't exist, create it
    if (!dynamicStyleSheet) {
      dynamicStyleSheet = document.createElement("style");
      dynamicStyleSheet.id = "portraitBGblurImages"; // Give it a unique ID
      document.head.appendChild(dynamicStyleSheet);
    }
    
    dynamicStyleSheet.textContent = cssRules;
    let newCSS = "";
    let index = 1;

    for (let child of portraitGallery.children) {
        const img = child.children[0];

        if (img && img.src) {
            newCSS += `
                #portraits > .portraitGallery > *:nth-child(${index++})::before{
                    background: url('${img.src}');
                    background-size: 100% 100%;
                    filter: blur(10px);
                }
                `;
        }
    }

    dynamicStyleSheet.textContent = newCSS;
}

updateGallery();
portraitGallery.addEventListener('mouseover', (event) => {
    // portraitGallery.mouseout();
});
portraitGallery.addEventListener('mouseover', pgInteraction);
portraitGallery.addEventListener('click', pgInteraction);
function pgInteraction(event) {
    const hoveredElement = event.target;
    if (!hoveredElement.children[1] || hoveredElement.children[1].tagName !== "P") return;
    if (hoveredElement.parentElement === portraitGallery) {
        const textRect = hoveredElement.children[1].getBoundingClientRect();
        const hovRect = hoveredElement.getBoundingClientRect();
        
        hoveredElement.children[1].style.setProperty("top", `${hovRect.top+10}px`);
        hoveredElement.children[1].style.setProperty("left", `${hovRect.left-textRect.width -3}px`);
    }
}


const popup = document.getElementById("popup");
function togglePopup(toggleState){
    // popup.getElementById(elementName);
    if (popup.style.getPropertyValue("display") === "" || toggleState === true) {
        popup.style.setProperty("display", "block");
    }
    else popup.style.setProperty("display", "");
}

const unameTextBox = document.getElementById("uname");
unameTextBox.value = localStorage.getItem("Username") || "username";
const unameInstances = document.getElementsByClassName("username");
Array.from(unameInstances).forEach(element => {
    element.innerText = unameTextBox.value; // Replace 'New Text' with the desired value
    element.addEventListener('dblclick', () => {
        togglePopup();
        unameTextBox.focus();
    });
});
unameTextBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        unameTextBox.blur();
        event.preventDefault();
        localStorage.setItem("Username", unameTextBox.value);
        for (const child of unameInstances) {
            child.innerText = unameTextBox.value; // Replace 'New Text' with the desired value
        }
    }
});



const currHour = document.getElementById('hour');
const currMin = document.getElementById('minute');
const currSec = document.getElementById('second');
function updateTime() {
    const now = new Date(); 

    currHour.innerText = now.getHours().toString().padStart(2, '0');
    currMin.innerText = now.getMinutes().toString().padStart(2, '0');
    currSec.innerText = now.getSeconds().toString().padStart(2, '0');
}
setInterval(updateTime, 1000);
updateTime();