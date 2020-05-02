import { getThisBrowserId, getSetBrowserName, getAllKeyValueData } from './storage';
import { isUrlBrowserInternal, getRandomId } from './browser';

/**
 * @description replaces data in oldTab with any viable data in newTab
 * @returns a new tab object with updated data
 */
export const addNewTabData = (oldTab = {}, newTab = {}) => {
  // copy old tab
  let newTabObj = Object.assign({}, oldTab);
  // cycle through possible properties and see if newTab has non-empty entries
  for (const tabProperty of ['index', 'title', 'url', 'imageurl', 'pinned', 'lastModified']) {
    if (Object.prototype.hasOwnProperty.call(newTab, tabProperty)) {
      // tabProperty could be a string, int or boolean
      if (
        newTab[tabProperty].length > 0 ||
        newTab[tabProperty] > 0 ||
        Boolean(newTab[tabProperty]) === newTab[tabProperty]
      )
        newTabObj[tabProperty] = newTab[tabProperty];
    }
  }
  return newTabObj;
};

/**
 * @description deciphers data type frome storageKey and adds valueToStore appropiately in targetObj
 * @returns {Object} targetObj mutated with new data added
 */
export const putInObjByStorageKey = (storageKey = '', valueToStore = {}, targetObj = {}) => {
  const keyParts = storageKey.split('-');
  if (keyParts[1] === 'thisbrowserid') return targetObj; // we already know the browserId (hopefully)
  const thisBrowserId = targetObj.thisBrowser.browserId;
  const browserId = keyParts[1];
  let newBrowserObj,
    otherBrowserIndex = -1;

  // get and copy appropiate browser data from targetObj, or create it if empty
  // TODO: should probably refactor to do this by reference to original object for efficiency
  if (browserId === thisBrowserId) {
    newBrowserObj = Object.assign({}, targetObj.thisBrowser);
  } else {
    otherBrowserIndex = targetObj.otherBrowsers.findIndex((browser) => browser.id === browserId);
    if (otherBrowserIndex > 0)
      newBrowserObj = Object.assign({}, targetObj.otherBrowsers[otherBrowserIndex]);
    else {
      newBrowserObj = {}; //so getOwnPropertyNames doesn't error
      otherBrowserIndex = targetObj.otherBrowsers.length; //put it at the end of the array
    }
  }
  if (Object.getOwnPropertyNames(newBrowserObj).length < 1) {
    newBrowserObj = {
      id: '',
      name: '',
      windows: {},
      recents: {},
      devices: {},
    };
  }

  // depending on key, write new data to copied browser object
  switch (keyParts[2]) {
    case 'name':
      newBrowserObj.browserName = valueToStore;
      break;
    case 'tab': {
      const windowId = keyParts[3];
      const tabId = keyParts[4];
      // find and copy appropiate tab object
      const newTabIndex = newBrowserObj.windows[windowId].tabs.findIndex((tab) => tab.id === tabId);
      // newTabObj may be undefined, or only have some properties, likewise valueToStore (incoming tab object)
      if (newTabIndex >= 0) {
        newBrowserObj.windows[windowId].tabs[newTabIndex] = addNewTabData(
          newBrowserObj.windows[windowId].tabs[newTabIndex],
          valueToStore
        );
      } else {
        newBrowserObj.windows[windowId].tabs.push(valueToStore);
      }
      break;
    }
    case 'recent': {
      const tabId = keyParts[3];
      const newTabIndex = newBrowserObj.recents.findIndex((tab) => tab.id === tabId);
      if (newTabIndex >= 0) {
        newBrowserObj.recents[newTabIndex] = addNewTabData(
          newBrowserObj.recents[newTabIndex],
          valueToStore
        );
      } else {
        newBrowserObj.recents.push(valueToStore);
      }
      break;
    }
    case 'device': {
      const deviceId = keyParts[3];
      if (keyParts[4] === 'name') {
        newBrowserObj.devices[deviceId].name = valueToStore;
      } else {
        const tabId = keyParts[4];
        const newTabIndex = newBrowserObj.devices[deviceId].tabs.findIndex(
          (tab) => tab.id === tabId
        );
        if (newTabIndex >= 0) {
          newBrowserObj.devices[deviceId].tabs[newTabIndex] = addNewTabData(
            newBrowserObj.devices[deviceId].tabs[newTabIndex],
            valueToStore
          );
        } else {
          newBrowserObj.devices[deviceId].tabs.push(valueToStore);
        }
      }
      break;
    }
  }
  // add new updated browser data
  if (otherBrowserIndex < 0) targetObj.thisBrowser = newBrowserObj;
  else targetObj.otherBrowsers[otherBrowserIndex] = newBrowserObj;

  // finally return mutated object
  return targetObj;
};

/**
 * @description assumes background.js is tidying up local storage, and tried to parse the lot
 * @returns an overly complicated object representing the app state
 */
export const getAllParsedData = () => {
  // check for usable data
  const thisBrowserId = getThisBrowserId();
  if (thisBrowserId === undefined) return undefined;
  const thisBrowserName = getSetBrowserName(thisBrowserId);
  if (thisBrowserName === undefined) return undefined;
  const allStorageData = getAllKeyValueData();
  if (allStorageData === undefined) return undefined;

  let convolutedAppDataObject = {
    thisBrowser: {
      id: thisBrowserId,
      name: thisBrowserName,
      windows: {},
      recents: [],
      devices: {},
    },
    otherBrowsers: [],
  };
  for (const [key, tab] of Object.entries(allStorageData)) {
    convolutedAppDataObject = putInObjByStorageKey(key, tab, convolutedAppDataObject);
  }
  return convolutedAppDataObject;
};

/**
 * @description takes tab data (returned by chrome.tabs.*) and strips out only what is required
 */
export const parseTabObject = (tabData = {}, whenModified = 0) => {
  return {
    id: tabData.id,
    index: tabData.index,
    title: tabData.title,
    url: tabData.url,
    imageurl: tabData.favIconUrl,
    pinned: tabData.pinned,
    lastModified: whenModified,
  };
};

/**
 * @param {[]} windowData array of window data returned by chrome.windows.getAll()
 * @returns an array of panel objects each representing a window with an array of tab objects
 */
export const parseWindowsData = (windowData = []) => {
  let returnData = [];
  const now = new Date().getTime();
  for (const window of windowData) {
    let windowEntry = {
      id: window.id,
      name: 'Window ' + window.id,
      title: 'Window',
      tabs: [],
    };
    for (const tab of window.tabs) {
      if (!isUrlBrowserInternal(tab.url)) windowEntry.tabs.push(parseTabObject(tab, now));
    }
    returnData.push(windowEntry);
  }
  return returnData;
};

/**
 * @param {[]} recentData array of recent data returned by chrome.sessions.getRecentlyClosed()
 * @description flatterns the tab data in recents data into one 'panel' object
 * @returns a 'panel' object (with id and title), containing an array of tab objects
 */
export const parseRecentsData = (recentData = []) => {
  let returnData = {
    id: -1,
    name: 'Recents',
    title: 'Recent',
    tabs: [],
  };
  for (const recent of recentData) {
    const whenModified = recent.lastModified;
    if (Object.prototype.hasOwnProperty.call(recent, 'window')) {
      for (const tab of recent.window.tabs) {
        if (!isUrlBrowserInternal(tab.url)) returnData.tabs.push(parseTabObject(tab, whenModified));
      }
    } else {
      if (!isUrlBrowserInternal(recent.tab.url))
        returnData.tabs.push(parseTabObject(recent.tab, whenModified));
    }
  }
  return returnData;
};

/**
 * @param {[]} deviceData array of device data returned by chrome.sessions.getDevices()
 * @returns an array of panel objects each representing a device with an array of tab objects
 */
export const parseDevicesData = (deviceData = []) => {
  let returnData = [];
  for (const device of deviceData) {
    let deviceEntry = {
      id: getRandomId(),
      name: device.deviceName,
      title: 'Device',
      tabs: [],
    };
    for (const session of device.sessions) {
      const whenModified = session.lastModified;
      for (const tab of session.window.tabs) {
        if (!isUrlBrowserInternal(tab.url))
          deviceEntry.tabs.push(parseTabObject(tab, whenModified));
      }
    }
    returnData.push(deviceEntry);
  }
  return returnData;
};
