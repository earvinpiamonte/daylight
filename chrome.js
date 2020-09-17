const chromeGetData = (key, callback) => {
  chrome.storage.sync.get(key, function (result) {
    let data = null;
    if (result[key]) {
      data = JSON.parse(result[key]);
    }

    callback(data);
  });
};

const chromeSetData = (key, data, callback = null) => {
  let obj = {};
  obj[key] = JSON.stringify(data);
  chrome.storage.sync.set(obj, callback);
};

export { chromeGetData, chromeSetData };
