const setChromeData = async (key, data) => {
  try {
    let obj = {};
    obj[key] = JSON.stringify(data);

    await chrome.storage.sync.set(obj);
    return JSON.parse(obj[key]);
  } catch (error) {
    console.error("Error setting data to storage:", error);
    return null;
  }
};

const getChromeData = async (key, defaultValue = null) => {
  try {
    const result = await chrome.storage.sync.get(key);
    let data = null;

    if (result[key]) {
      data = JSON.parse(result[key]);
    } else {
      data = await setChromeData(key, defaultValue);
    }

    return data;
  } catch (error) {
    console.error("Error getting data from storage:", error);
    return defaultValue;
  }
};

export { getChromeData, setChromeData };
