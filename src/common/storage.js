/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { parseTabObject } from './data';
import { identifyBrowser, deviceNameToDeviceId } from './browser';

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
 * @returns {Promise} promise of completion
 **/
export const refreshThisBrowserData = (thisBrowserId) => {
  // to avoid stale data remove all storage keys associated with this browser then add back name
  return removeAllBrowserData(thisBrowserId)
    .then(() => {
      return getSetThisBrowserName(thisBrowserId);
    })
    .then(() => {
      return browser.windows.getAll({ populate: true });
    })
    .then((windowArray) => {
      // cycle through windows and gather storage write promises
      return Promise.all(
        Object.values(windowArray).reduce((accumulatedPromiseArray, window) => {
          const now = new Date().getTime();
          const windowId = window.id;
          return accumulatedPromiseArray.concat(
            Object.values(window.tabs).map((tab) => {
              const storageKey = ['syncy', thisBrowserId, 'tab', windowId, tab.id].join('-');
              return browser.storage.local.set({ [storageKey]: parseTabObject(tab, now) });
            })
          );
        }, [])
      );
    })
    .then(() => {
      return browser.sessions.getRecentlyClosed();
    })
    .then((recentsArray) => {
      // cycle through recents and gather storage write promises
      return Promise.all(
        Object.values(recentsArray).reduce((accumulatedPromiseArray, recent) => {
          const whenModified = recent.lastModified;
          if (Object.prototype.hasOwnProperty.call(recent, 'window')) {
            return accumulatedPromiseArray.concat(
              Object.values(recent.window.tabs).map((tab) => {
                const storageKey = ['syncy', thisBrowserId, 'recent', tab.sessionId].join('-');
                return browser.storage.local.set({
                  [storageKey]: parseTabObject(tab, whenModified),
                });
              })
            );
          } else if (Object.prototype.hasOwnProperty.call(recent, 'tab')) {
            const storageKey = ['syncy', thisBrowserId, 'recent', recent.tab.sessionId].join('-');
            return accumulatedPromiseArray.concat(
              browser.storage.local.set({ [storageKey]: parseTabObject(recent.tab, whenModified) })
            );
          }
        }, [])
      );
    })
    .then(() => {
      return browser.sessions.getDevices();
    })
    .then((devicesArray) => {
      // cycle through device entries and gather storage write promises
      // TODO: I seem to have done this with for loops?
      return Promise.all(
        Object.values(devicesArray).reduce((accumulatedPromiseArray, device) => {
          const deviceId = deviceNameToDeviceId(device.deviceName);
          for (const session of device.sessions) {
            const lastModifed = session.lastModifed;
            for (const tab of session.window.tabs) {
              const tabsId = tab.sessionId.split('.').pop();
              const storageKey = ['syncy', thisBrowserId, 'device', deviceId, tabsId].join('-');
              accumulatedPromiseArray.concat(
                browser.storage.local.set({ [storageKey]: parseTabObject(tab, lastModifed) })
              );
            }
          }
          return accumulatedPromiseArray;
        }, [])
      );
    })
    .finally(() => {
      /* DEBUG
      browser.storage.local.get().then((allKeyValues) => {
        console.info(
          '[DEBUG] New local storage state:\n' + JSON.stringify(allKeyValues, undefined, 2)
        );
      });*/
    })
    .catch((error) => {
      console.error(`Error refreshing this browsers data id "${thisBrowserId}" ~ ${error.message}`);
    });

  // TODO: compare functions between storage and current state? (to minimise write operations)
};

/**
 * @description updates or creates tab data in local storage, only updating the data passed in the tab object
 * @returns {Promise} promise of completion
 */
export const createUpdateTabData = async (browserId, windowId, tab) => {
  const storageKey = ['syncy', browserId, 'tab', windowId, tab.id].join('-');
  //get the current tab from storage if it exists
  let newTab = await browser.storage.local.get(storageKey);
  if (Object.values(newTab).length < 1) {
    newTab = tab;
  } else {
    // tab exists in storage so only change passed data
    for (const tabProperty of ['index', 'title', 'url', 'imageurl', 'pinned', 'lastModified']) {
      if (Object.prototype.hasOwnProperty.call(tab, tabProperty)) {
        newTab[tabProperty] = tab[tabProperty];
      }
    }
  }
  return browser.storage.local.set({ [storageKey]: newTab });
};

/**
 * @description moves tab data in local storage to new index and/or window
 * @returns {Promise} promise of completion
 */
export const moveTab = async (
  browserId = '',
  currentWindowId = -1,
  tabId = -1,
  newIndex = -1,
  newWindowId = -1
) => {
  let storageKey = ['syncy', browserId, 'tab', currentWindowId, tab.id].join('-');
  let tab = await browser.storage.local.get(storageKey);
  if (tab === undefined || (newWindowId < 0 && newIndex < 0)) {
    // if there's no tab to change, or nothing to change
    return Promise.resolve(tab);
  } else {
    if (newWindowId >= 0) {
      // we have to move this tab to a new storage key
      storageKey = ['syncy', browserId, 'tab', newWindowId, tab.id].join('-');
    }
    if (newIndex >= 0) {
      tab.index = newIndex;
    }
  }
  return browser.storage.local.set({ [storageKey]: tab });
};
