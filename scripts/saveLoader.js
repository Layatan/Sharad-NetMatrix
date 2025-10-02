console.log("!saveLoader.js loaded!");
// const getSave = document.getElementById("getSave");
const input = document.getElementById("loadSaveFile");
// const fileFeedback = getSave.querySelector("h2"); // HEY DUMBASS REUSE THIS for the label
// const loadFeedback = getSave.querySelector("ul");

// let characterJSON; //permanent RAM kept freq updated global
// let historyJSON; //permanent RAM kept freq updated global - WTF was i talking about

input.addEventListener('change', () => {
    const file = input.files[0]; //
    console.log("User input file: " + file.name)

    // loadFeedback.innerHTML = "<li>check console for verbose loading progress</li>";

    if (!file) return;
    if (file.name.toLowerCase().endsWith('.zip') == false) {
    //   fileFeedback.innerText = "This ain't a zip file bruh >:|";
    //   fileFeedback.style.color = "red";
      return;
    }
    else {
    //   fileFeedback.innerText = `Loading... ${file.name}`;
    //   fileFeedback.removeAttribute("style");
    }

    validateSaveFile(file);
});

async function validateSaveFile(file){
    const zip = await JSZip.loadAsync(file);

    let hasCharacter = false;
    let characterParsed; //temp to load
    let hasHistory = false;
    let historyParsed; //temp to load

    // console.log("checking smn" + zip.files)

    // untested AI code check and complete
    for (const filename of Object.keys(zip.files)) {
        const entry = zip.files[filename];
        if (entry.dir) continue;
        console.log(filename);
    
        if (/character\.json$/i.test(filename)) {
            hasCharacter = true;
            
            // Load and parse Character.json
            const charData = await entry.async("string");
            try {
                characterParsed = JSON.parse(charData);
            } catch (err) {
                console.error("Invalid Character.json:", err);
                // fileFeedback.innerText = "CAN'T LOAD SAVE!!! Character.json is invalid.";
                // fileFeedback.style.color = "red";
            }
        }

        if (/history\.json$/i.test(filename)) {
            hasHistory = true;
            
            const historyData = await entry.async("string");
            try {
                historyParsed = JSON.parse(historyData);
            } catch (err) {
                console.error("Invalid History.json:", err);
                const newEntry = document.createElement("li");
                newEntry.innerText = "History.json couldn't parse! starting new story with character."
                loadFeedback.appendChild(newEntry);
            }
        }
        
    }
    
    if (hasCharacter) {
        // loadCharacter(characterParsed);
        const newEntry = document.createElement("li");
        newEntry.style.color = "green";
        newEntry.innerText = "Valid Character.json found - loading character."
        // loadFeedback.appendChild(newEntry);
    }
    else {
        // fileFeedback.innerText = "CAN'T LOAD SAVE!!! Character.json not found.";
        // fileFeedback.style.color = "red";
    }
    if (hasHistory) {
        // loadHistory(historyParsed);
        const newEntry = document.createElement("li");
        newEntry.style.color = "green";
        newEntry.innerText = "Valid History.json found - loading game history."
        // loadFeedback.appendChild(newEntry);
    }
    else {
        const newEntry = document.createElement("li");
        newEntry.style.color = "red";
        newEntry.innerText = "History.json not found! starting new story with character."
        // loadFeedback.appendChild(newEntry);
    }
}