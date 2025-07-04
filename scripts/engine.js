console.log("!engine.js loaded!");

const transcript = document.getElementById("transcript");

textBox.addEventListener('keydown', function(event) { 
    if (event.ctrlKey && event.key === 'Enter') { //xss yourself for all i care
        console.log('Control + Enter was pressed!');
        textBox.blur();

        addChatEntry(true);
    }
});

function addChatEntry(isPlayerEntry) {
    const newChatEntry = document.createElement("p");
    
    if (entryAllowed == true && isPlayerEntry == true) { // if player entry
        const playerEntry = document.createElement("span");
        const username = document.createElement("span");

        newChatEntry.setAttribute("class", "playerInput");
        playerEntry.setAttribute("class", "playerEntry");
        username.setAttribute("class", "username");

        newChatEntry.appendChild(playerEntry);
        newChatEntry.appendChild(username);

        playerEntry.innerText = textBox.value;
        username.innerText = unameTextBox.value; //consult styleHelper.js for the variable - it gets it from a cookie

        transcript.appendChild(newChatEntry);

        textBox.value = "";
        unameDBLCupdate();
        checkEntry();
        return
    } 
    else {
        // const newSpeaker = document.createElement("span");
        // const newDialogue = document.createElement("span");
        
        // newChatEntry.appendChild(newSpeaker);
        // newChatEntry.appendChild(newDialogue);
        
        // newSpeaker.innerText = ()   
    }
}

function ollamaConversate(params) {
    
}

// // -- Add an Image of an UNKN --- 
// const newDiv = document.createElement("div");
// const newImg = document.createElement("img");
// const charAttr = document.createElement("p");
// const charAttr_allyName = document.createElement("span");
// const charAttr_allyLoyalty = document.createElement("span");
// const charAttr_allyConn = document.createElement("span");

// newImg.setAttribute("src", "data/unknown.jpg");
// newDiv.appendChild(newImg);

// charAttr_allyName.setAttribute("class", "allyName");
// charAttr_allyName.innerText = "??????????";
// charAttr_allyLoyalty.setAttribute("class", "allyLoyalty");
// charAttr_allyLoyalty.innerText = "?";
// charAttr_allyConn.setAttribute("class", "allyConn");
// charAttr_allyConn.innerText = "?";

// charAttr.appendChild(charAttr_allyName);
// charAttr.appendChild(charAttr_allyLoyalty);
// charAttr.appendChild(charAttr_allyConn);
// newDiv.appendChild(charAttr);

// // Append the new div to the parent element
// portraitGallery.appendChild(newDiv);
// updateGallery();
// // -- end snippet --