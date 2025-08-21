console.log("!saveManagement.js loaded!");
const dbName = "GameSaveDB";
const storeName = "SaveFiles";

//all AI code i cant be asked to learn indexedDB

function generateUUID() { //UUIDv4 generation magic
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: "saveID" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
openDB();

async function getAllSaves() {
    const db = await openDB();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();
  
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function newSave(saveID, characterJSON, historyJSON, imageFiles) {
    const db = await openDB();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
  
    // Convert image files to blobs
    const galleryImages = await Promise.all(
        imageFiles.map(file => file.arrayBuffer().then(buffer => new Blob([buffer], { type: file.type })))
    );
  
    const saveData = {
        saveID,
        timestamp: Date.now(),
        characterData: characterJSON,
        historyData: historyJSON,
        galleryImages
    };
  
    store.put(saveData);
    return tx.complete;
}
  

async function loadSave(saveID) {
    const db = await openDB();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(saveID);
  
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

