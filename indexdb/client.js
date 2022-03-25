window.addEventListener('load', init)

let db = null

function onDbError (e) {
  console.log("DB error: ", e);
}

function initDB() {
  const dbRequest = indexedDB.open('test_db', 1);

  dbRequest.onsuccess = function (e) {  // db già esistente e della stessa versione
    console.log("indexDb: init - onsuccess");
    db = e.target.result;
    db.onerror = onDbError;
    showFiledFromDB()
  }

  dbRequest.onupgradeneeded = function (e) {  // db nuovo o nuova versione
    console.log("IndexDb: init - onupgradeneeded");
    db = e.target.result;
    db.onerror = onDbError;
    if (!db.objectStoreNames.contains("Files")) {
      const filesStore = db.createObjectStore("Files", { keyPath: "id", autoIncrement: true });
      // filesStore.createIndex("fileObject", "fileObject", { unique: false });
      filesStore.transaction.oncomplete = showFiledFromDB;
    } else {
      showFiledFromDB();
    }
  }
}

function showFiledFromDB() {
  console.log('showFiledFromDB')
  const keyRange = IDBKeyRange.lowerBound(0);
  const cursorRequest = db.transaction("Files", "readwrite").objectStore("Files").openCursor(keyRange, "prev");
  const results = [];
  cursorRequest.onsuccess = function (e) {
    const row = e.target.result;
    if (row) {
      results.push(row.value);
      row.continue();
    } else {
      document.getElementById('dbImagesContainer').innerHTML = renderFiles(results.map(row => row.fileObject))
    }
  };
}

function renderFiles(files) {
  return files.map(file => {
    if (file.type.indexOf('video') >= 0) {
      return `<video controls src="${window.URL.createObjectURL(file)}"></video><br /><br />`
    } else {
      return `<image src="${window.URL.createObjectURL(file)}" /><br /><br />`
    }
  }).join('')
}

function saveFileToDb(file) {
  console.log('saveFileToDb', file)
  const request = db.transaction("Files", "readwrite").objectStore("Files").put({
    fileObject: file,
  });
  request.onsuccess = showFiledFromDB;
}

function handleNewFile(e) {
  console.log('handleNewFile')
  const file = e.target.files[0]
  document.getElementById('localImagesContainer').innerHTML = renderFiles([file])
  saveFileToDb(file)
}

function deleteLast() {
  const store = db.transaction("Files", "readwrite").objectStore("Files")
  store.delete(IDBKeyRange.lowerBound(0))
}

function init() {
  initDB()
  const input = document.getElementById('selectFile')
  const deleteAll = document.getElementById('deleteAll')
  input.addEventListener('change', handleNewFile)
  deleteAll.addEventListener('click', deleteLast)
}
