/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { parseTabObject } from './data';
import { getRandomId, identifyBrowser } from './browser';

var browser = require('webextension-polyfill');

/**
 * @description sets a persistent ID for this browser in local storage
 * @param {String} thisBrowserId - this browsers id
 * @returns {Promise} promise of completion
 **/
export const setThisBrowserId = (thisBrowserId) => {
  return browser.storage.local
    .set({
      'syncy-thisbrowserid': thisBrowserId,
    })
    .catch((error) => {
      console.error(`Error setting this browser id to "${thisBrowserId}" ~ ${error.message}`);
    });
};

/**
 * @description gets the persistent ID for this browser from local storage, if there isn't one sets it based on the browsers chome.instanceID
 * @returns {Promise} promise resolving to this browser id
 **/
export const getThisBrowserId = () => {
  return browser.storage.local
    .get('syncy-thisbrowserid')
    .then((result) => {
      if (!result) {
        chrome.instanceID.getID((instanceId) => {
          return setThisBrowserId(instanceId);
        });
      } else return Promise.resolve(result['syncy-thisbrowserid']);
    })
    .catch((error) => {
      console.error(`Error getting this browser id ~ ${error.message}`);
    });
};

/**
 * @description gets or sets the browser name (chrome, edge, etc) in local storage
 * @param {String} thisBrowserId - this browsers id
 * @returns {Promise} promise resolving to browser name
 **/
export const getSetThisBrowserName = (thisBrowserId) => {
  const storageKey = `syncy-${thisBrowserId}-name`;
  return browser.storage.local
    .get(storageKey)
    .then((result) => {
      if (!result[storageKey]) {
        const browserName = identifyBrowser();
        return browser.storage.local.set({ [storageKey]: browserName });
      } else return Promise.resolve(result[storageKey]);
    })
    .catch((error) => {
      console.error(`Error get/setting this browser name ~ ${error.message}`);
    });
};

/**
 * @description gets all local storage key-value pairs associated with browserId
 * @param {string} browserId - browser id of data to retrieve
 * @returns {Promise} promise resolving to key-value pairs
 **/
export const getAllBrowserKeyValues = (browserId) => {
  return browser.storage.local
    .get()
    .then((results) => {
      if (results) {
        const storageKeyStart = `syncy-${browserId}-`;
        let output = {};
        if (Object.keys(results).length > 0) {
          for (const [key, value] of Object.entries(results)) {
            if (key.startsWith(storageKeyStart)) output[key] = value;
          }
        }
        return Promise.resolve(output);
      } else {
        console.error(
          `Error removing storage data for browser id "${browserId}" ~ storage items returned "${JSON.stringify(
            results
          )}" which is not truthy`
        );
        return Promise.reject(results);
      }
    })
    .catch((error) => {
      console.error(`Error getting storage data for browser id "${browserId}" ~ ${error.message}`);
    });
};

/**
 * @description removes all local storage data associated with browserId, baring the id entry
 * @param {String} browserId - browser id of data to remove
 * @returns {Promise} promise of completion
 **/
export const removeAllBrowserData = (browserId) => {
  return getAllBrowserKeyValues(browserId)
    .then((results) => {
      if (results) {
        return Promise.all(
          Object.keys(results).map((key) => {
            return browser.storage.local.remove(key);
          })
        );
      } else {
        console.error(
          `Error removing storage data for browser id "${browserId}" ~ browser keys returned "${JSON.stringify(
            results
          )}" which is not truthy`
        );
        return Promise.reject(results);
      }
    })
    .catch((error) => {
      console.error(`Error removing storage data for browser id "${browserId}" ~ ${error.message}`);
    });
};

/**
 * @description refreshes all of this browsers local storage data
 * @param {String} thisBrowserId - this browsers id
 * @returns {boolean}
 **/
export const refreshThisBrowserData = (thisBrowserId) => {
  // to avoid stale data remove all storage keys associated with this browser then add back name
  removeAllBrowserData(thisBrowserId)
    .then(() => {
      // DEBUG
      browser.storage.local.get().then((allKeyValues) => {
        console.info('[DEBUG] Local storage state:\n' + JSON.stringify(allKeyValues, undefined, 2));
      });
    })
    .then(() => {
      return getSetThisBrowserName(thisBrowserId);
    })
    .then(() => {
      return browser.windows.getAll({ populate: true });
    })
    .then((windowArray) => {
      // cycle through and write tab data
      return Promise.all(
        Object.values(windowArray).reduce((accumulatedArray, window) => {
          const now = new Date().getTime();
          const windowId = window.id;
          return accumulatedArray.concat(
            Object.values(window.tabs).map((tab) => {
              const storageKey = ['syncy', thisBrowserId, 'tab', windowId, tab.id].join('-');
              return browser.storage.local.set({ [storageKey]: parseTabObject(tab, now) });
            })
          );
        }, [])
      );
    })
    .finally(() => {
      // DEBUG
      browser.storage.local.get().then((allKeyValues) => {
        console.info(
          '[DEBUG] New local storage state:\n' + JSON.stringify(allKeyValues, undefined, 2)
        );
      });
    })
    .catch((error) => {
      console.error(`Error refreshing this browsers data id "${thisBrowserId}" ~ ${error.message}`);
    });

  // TODO: (maybe) a compare function between what's there and what's to store?? (to minimise write operations)

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

  // TODO: How do I maintain deviceId/deviceName between refreshes?

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
 * TODO: UPDATE BELOW TO USE POLYFILL AND PROMISES
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
