console.log("!saveManagement.js loaded!");
const dbName = "GameSaveDB";
const saveFiles = "SaveFiles";

//because some mobile browsers are stingy with IndexedDB space i've set a max 15, 
// if youre on computer you can have many many more saves, 100 or smn depending on how large your saves are
const global_MaxSaves = 15; //technically this plus one in ever you load from file - assuming i implemented it.

//TOUCH NOTHING ELSE UNLESS YOU KNOW WHAT YOU'RE DOING. thanks :*


function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(saveFiles, { keyPath: "saveID" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
openDB();

async function newSave(characterJSON, historyJSON,  imageFiles) {
    const galleryImages = await Promise.all( //not doing this before a transaction fails for whatever reason. whatever :/
        imageFiles.map(file => file.arrayBuffer().then(buffer => new Blob([buffer], { type: file.type })))
    );

    const db = await openDB();
    const tx = db.transaction(saveFiles, "readwrite");
    const saves = tx.objectStore(saveFiles);
    
    const currSaveCount = await new Promise((resolve, reject) => {
        const countRequest = saves.count();
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = () => reject(countRequest.error);
    });  
    if (currSaveCount > global_MaxSaves) {
        console.log(`You've reached the maximum saves set: ${global_MaxSaves}\n If you want more saves change 'global_MaxSaves' variable in 'scripts/saveManagement.js' file`);
        return;
    }
    
    console.log(galleryImages);
  
    const saveData = {
        saveID: crypto.randomUUID(),
        createdDate: Date.now(),
        lastSaved: Date.now(),
        characterData: characterJSON,
        historyData: historyJSON
    };
  
    const putRequest = saves.put(saveData);

    await new Promise((resolve, reject) => {
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
    });
    
    await tx.complete;
}
  
async function getAllSaves() {
    const db = await openDB();
    const tx = db.transaction(saveFiles, "readonly");
    const store = tx.objectStore(saveFiles);
    const request = store.getAll();
  
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function loadSave(saveID) {
    const db = await openDB();
    const tx = db.transaction(saveFiles, "readonly");
    const store = tx.objectStore(saveFiles);
    const request = store.get(saveID);
  
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
} 

async function dbg_clearSaveStore() { //debug only - 
    const db = await openDB();
    const tx = db.transaction(saveFiles, "readwrite");
    const store = tx.objectStore(saveFiles);
  
    const clearRequest = store.clear();
  
    await new Promise((resolve, reject) => {
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  
    await tx.done;
    console.log("SaveFiles store cleared.");
}