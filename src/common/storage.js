/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { parseTabObject } from './data';
import { getRandomId, identifyBrowser } from './browser';

/**
 * @description tries to write a value to local storage, with verbose messaging
 * @param {string} key the storage key associated with the entry to write
 * @param {object|string} value the value to write to local storage
 * @param {function(boolean)} callback - callback with success boolean
 * @returns {boolean} boolean of success
 *
 * async to allow promise handling and returns
 */
export const tryWriteToStorage = async (key, value, callback) => {
  if (key && value) {
    chrome.storage.local.set({ [key]: value }, () => {
      let returnVal = false;
      if (chrome.runtime.lastError) {
        console.error('Problem writing to storage ~ ' + chrome.runtime.lastError.message);
      } else {
        console.info('Written to storage ~ {"' + key + '": ' + JSON.stringify(value) + '}');
        returnVal = true;
      }
      if (callback) callback(returnVal);
      return returnVal;
    });
  } else {
    if (callback) callback(false);
    return false;
  }
};

/**
 * @description tries to read a value from local storage, with verbose messaging
 * @param {string} key the storage key associated with the entry to read
 * @param {function(object|string)} callback - callback with the read value, undefined for failure
 * @returns {object|string} value retrieved from storage, undefined for failure
 *
 * async to allow promise handling and returns
 */
export const tryReadFromStorage = async (key, callback) => {
  if (key) {
    chrome.storage.local.get(key, (result) => {
      let returnVal = undefined;
      if (chrome.runtime.lastError) {
        console.error(
          'Problem reading key "' + key + '" from storage ~ ' + chrome.runtime.lastError.message
        );
      } else if (Object.entries(result).length < 1) {
        console.info('Nothing to read for key "' + key + '" from storage');
      } else {
        returnVal = result[key];
        console.info('Read from storage ~ {"' + key + '": ' + JSON.stringify(returnVal) + '}');
      }
      if (callback) callback(returnVal);
      return returnVal;
    });
  } else if (callback) callback(undefined);
};

/**
 * @description tries to remove a value from local storage, with verbose messaging
 * @param {string} key the storage key associated with the entry to remove
 * @param {function(boolean)} callback - optional callback with success boolean
 * @returns {boolean} boolean of success
 *
 * async to allow promise handling and returns
 */
export const tryRemoveFromStorage = async (key, callback) => {
  if (key) {
    chrome.storage.local.remove(key, () => {
      let returnVal = false;
      if (chrome.runtime.lastError) {
        console.error(
          'Problem removing key "' + key + '" from storage ~ ' + chrome.runtime.lastError.message
        );
      } else {
        console.info('Removed from storage ~ { "' + key + '": ... }');
        returnVal = true;
      }
      if (callback) callback(returnVal);
      return returnVal;
    });
  } else {
    if (callback) callback(false);
    return false;
  }
};

/**
 * @description sets a persistent ID for this browser in local storage
 * @param {string} thisBrowserId - this browsers id
 * @param {function(boolean)} callback - callback with boolean of success
 **/
export const setThisBrowserId = (thisBrowserId, callback) => {
  if (thisBrowserId) {
    tryWriteToStorage('syncy-thisbrowserid', thisBrowserId, (success) => {
      if (callback) callback(success);
    });
  } else if (callback) callback(false);
};

/**
 * @description gets the persistent ID for this browser from local storage, if there isn't one sets it based on browsers instance id
 * @param {function(string)} callback - callback with browserId, undefined for failure
 **/
export const getThisBrowserId = (callback) => {
  chrome.storage.local.get(['syncy-thisbrowserid'], (result) => {
    if (chrome.runtime.lastError || Object.entries(result).length < 1) {
      chrome.instanceID.getID((instanceId) => {
        tryWriteToStorage('syncy-thisbrowserid', instanceId, (success) => {
          if (success) {
            console.info('Set this browser id ~ {"syncy-thisbrowserid": ' + instanceId + '}');
            callback(instanceId);
          } else {
            console.error('Problem writing instance id as browser id to storage');
            if (callback) callback(undefined);
          }
        });
      });
    } else {
      const browserId = result['syncy-thisbrowserid'];
      console.info('Got this browser id ~ {"syncy-thisbrowserid": ' + browserId + '}');
      if (callback) callback(browserId);
    }
  });
};

/**
 * @description gets or sets the browser name (chrome, edge, etc) in local storage
 * @param {string} thisBrowserId - this browsers id
 * @param {function(string)} callback - callback with browserName, or undefined for failure
 **/
export const getSetThisBrowserName = (thisBrowserId, callback) => {
  if (thisBrowserId) {
    const storageKey = 'syncy-' + thisBrowserId + '-name';
    chrome.storage.local.get(storageKey, async (result) => {
      if (chrome.runtime.lastError || Object.entries(result).length < 1) {
        const thisBrowserName = identifyBrowser();
        tryWriteToStorage(storageKey, thisBrowserName, (success) => {
          if (success) {
            console.info('Set this browser name ~ {"' + storageKey + '": ' + thisBrowserName + '}');
            if (callback) callback(thisBrowserName);
          } else {
            console.error(
              'Problem setting this browser name (id "' +
                thisBrowserId +
                '") ~ storage key "' +
                storageKey +
                '" could not be read or written'
            );
            if (callback) callback(undefined);
          }
        });
      } else {
        const thisBrowserName = result[storageKey];
        console.info('Got this browser name ~ {"' + storageKey + '": ' + thisBrowserName + '}');
        if (callback) callback(thisBrowserName);
      }
    });
  } else if (callback) callback(undefined);
};

/**
 * @description gets all local storage key-value pairs
 * @param {function(object)} callback - callback with object of all key-value data pairs, or undefined for failure
 **/
export const getAllKeyValueData = (callback) => {
  chrome.storage.local.get(null, (result) => {
    if (chrome.runtime.lastError) {
      console.error('Problem reading from storage ~ ' + chrome.runtime.lastError.message);
      result = undefined;
    } else if (Object.entries(result).length < 1)
      console.info('No appropiate entries to read from local storage!');
    if (callback) callback(result);
  });
};

/**
 * @description gets all local storage key-value pairs associated with browserId
 * @param {string} browserId - browser id of data to retrieve
 * @param {function(object)} callback - callback with an object containing the browsers associated key-value pairs, or undefined for failure
 **/
export const getAllBrowserKeyValues = (browserId, callback) => {
  if (browserId) {
    getAllKeyValueData((result) => {
      let output = {};
      if (result === undefined) {
        console.error('Problem getting data for browse id "' + browserId + '"');
        output = undefined;
      } else if (Object.entries(result).length < 1) {
        console.info('Nothing to retrieve for browse id "' + browserId + '"');
      } else {
        const browserKeyStart = 'syncy-' + browserId + '-';
        for (const [key, value] of Object.entries(result)) {
          if (key.startsWith(browserKeyStart)) output[key] = value;
        }
        console.info(
          'Got all key-value data from storage for browser id "' +
            browserId +
            '" ~ \n' +
            JSON.stringify(output, undefined, 2)
        );
      }
      if (callback) callback(output);
    });
  } else if (callback) callback(undefined);
};

/**
 * @description removes all local storage data associated with browserId
 * @param {string} browserId - browser id of data to remove
 * @param {function(boolean)} callback - callback with boolean of success
 **/
export const removeAllBrowserData = (browserId, callback) => {
  if (browserId) {
    getAllBrowserKeyValues(browserId, (result) => {
      if (result === undefined) {
        console.error('Problem removing data for browse id "' + browserId + '"');
        callback(false);
      } else if (Object.entries(result).length < 1) {
        console.info('Nothing to remove for browse id "' + browserId + '"');
        callback(true);
      } else {
        const finalValue = Object.keys(result).reduce((previousValue, key) => {
          return tryRemoveFromStorage(key) && previousValue;
        }, true);
        console.info(
          'Attept to remove all key-value data for browser id "' +
            browserId +
            '" ~ Successful: ' +
            JSON.stringify(finalValue)
        );
        if (callback && finalValue) callback(finalValue);
      }
    });
  } else if (callback) callback(false);
};

/**
 * @description refreshes all of this browsers local storage data
 * @param {function()} callback
 * @returns {boolean}
 **/
export const refreshThisBrowserData = (thisBrowserId, callback) => {
  if (thisBrowserId === undefined) return undefined;

  // to avoid stale data, remove all storage keys associated with this browser
  // and then add back the id and name
  // TODO: a compare function to at least minimise write operations?

  removeAllBrowserData(thisBrowserId, (removeSuccess) => {
    setThisBrowserId(thisBrowserId, (idSuccess) => {
      getSetThisBrowserName(thisBrowserId, (browserName) => {
        const success = removeSuccess && idSuccess && browserName;
        if (success) {
          // write all current tab data
          chrome.windows.getAll({ populate: true }, (windowArray) => {
            const now = new Date().getTime();
            for (const window of windowArray) {
              let windowId = window.id;
              for (const tab of window.tabs) {
                let storageKey = ['syncy', thisBrowserId, 'tab', windowId, tab.id].join('-');
                // TODO: visibility on success
                tryWriteToStorage(storageKey, parseTabObject(tab, now));
              }
            }
          });

          if (success && callback) callback();
          return success;
        } else {
          console.error(
            'Problem refreshing this browser local storage',
            thisBrowserId,
            removeSuccess,
            idSuccess,
            browserName
          );

          return undefined;
        }
      });
    });
  });

  /*
  // write all recents data
  chrome.sessions.getRecentlyClosed(null, (recentArray) => {
    for (const recent of recentArray) {
      const whenModified = recent.lastModified;
      if (Object.prototype.hasOwnProperty.call(recent, 'window')) {
        for (const tab of recent.window.tabs) {
          const storageKey = ['syncy', thisBrowserId, 'recent', tab.id].join('-');
          isSuccess =
            isSuccess &&
            tryWriteToStorage(storageKey, parseTabObject(tab, whenModified)) !== undefined;
        }
      } else {
        const storageKey = ['syncy', thisBrowserId, 'recent', recent.tab.id].join('-');
        isSuccess =
          isSuccess &&
          tryWriteToStorage(storageKey, parseTabObject(recent.tab, whenModified)) !== undefined;
      }
    }
  });

  // TODO: How do I maintain deviceId between refreshes?

  // write all devices data
  chrome.sessions.getDevices(null, (deviceArray) => {
    for (const device of deviceArray) {
      const deviceId = getRandomId();
      for (const session of device.sessions) {
        const whenModified = session.lastModified;
        for (const tab of session.window.tabs) {
          const storageKey = ['syncy', thisBrowserId, 'device', deviceId, tab.id].join('-');
          isSuccess =
            isSuccess &&
            tryWriteToStorage(storageKey, parseTabObject(tab, whenModified)) !== undefined;
        }
      }
    }
  });
*/
};

/***************************************************
 *
 * TODO: UPDATE BELOW TO USE ASYNC-CALLBACKS
 *
 */

/**
 * @description updates or creates tab data in local storage, only updating the data passed in the tab object
 * @returns boolean of isSuccess
 */
export const createUpdateTabData = (browserId = '', windowId = -1, tab = {}) => {
  const storageKey = ['syncy', browserId, 'tab', windowId, tab.id].join('-');
  //get the current tab from storage if it exists
  let newTab = tryReadFromStorage(storageKey);
  if (newTab === undefined) {
    newTab = tab;
  } else {
    // tab exists in storage so only change passed data
    for (const tabProperty of ['index', 'title', 'url', 'imageurl', 'pinned', 'lastModified']) {
      if (Object.prototype.hasOwnProperty.call(tab, tabProperty)) {
        newTab[tabProperty] = tab[tabProperty];
      }
    }
  }
  return tryWriteToStorage(storageKey, tab) !== undefined;
};

/**
 * @description moves tab data in local storage to new index and/or window
 * @returns boolean of isSuccess
 */
export const moveTab = (
  browserId = '',
  currentWindowId = -1,
  tabId = -1,
  newIndex = -1,
  newWindowId = -1
) => {
  let storageKey = ['syncy', browserId, 'tab', currentWindowId, tab.id].join('-');
  let tab = tryReadFromStorage(storageKey);
  if (tab === undefined || (newWindowId < 0 && newIndex < 0)) {
    // if there's no tab to change, or nothing to change
    return false;
  } else {
    if (newWindowId >= 0) {
      // we have to move this tab to a new storage key
      storageKey = ['syncy', browserId, 'tab', newWindowId, tab.id].join('-');
    }
    if (newIndex >= 0) {
      tab.index = newIndex;
    }
  }
  return tryWriteToStorage(storageKey, tab) !== undefined;
};
