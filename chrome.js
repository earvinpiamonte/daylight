const chromeGetData = async (key, defaultValue = null) => {
  var promise = new Promise(function (resolve, reject) {
    chrome.storage.sync.get(key, function (result) {
      let data = null;

      if (result[key]) {
        data = JSON.parse(result[key]);
      } else {
        data = chromeSetData(key, defaultValue);
      }

      resolve(data);
    });
  });

  return await promise;
};

const chromeSetData = async (key, data) => {
  let obj = {};
  obj[key] = JSON.stringify(data);

  const promise = new Promise((resolve, reject) => {
    chrome.storage.sync.set(obj, function () {
      resolve(JSON.parse(obj[key]));
    });
  });

  return await promise;
};

export { chromeGetData, chromeSetData };
