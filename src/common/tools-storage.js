/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { parseTabObject } from './tools-data';

/**
 * @description tries to write a value to local storage, displays error messages
 * @returns the value written, or undefined for failure
 */
export const tryToWriteToStorage = (key = '', value = {}) => {
  chrome.storage.local.set({ key: value }, function () {
    if (chrome.runtime.lastError) {
      console.error('Problem writing to storage ~ ' + chrome.runtime.lastError.message);
      return undefined;
    } else {
      return value;
    }
  });
};

/**
 * @description gets or sets a persistent ID for this browser based on instanceID
 * @returns the browser id, or undefined for failure
 **/
export const getSetThisBrowserId = () => {
  chrome.storage.local.get(['syncy-thisBrowserID'], function (storedID) {
    if (chrome.runtime.lastError) {
      /** if there is no thisBrowserId key, create one */
      chrome.instanceID.getID((instanceId) => {
        return tryToWriteToStorage('syncy-thisBrowserID', instanceId);
      });
    } else return storedID;
  });
};

/**
 * @description removes all local storage data associated with browserId
 * @returns boolean of success
 **/
export const removeAllBrowserData = (browserId = '') => {
  let success = true;
  chrome.storage.local.get(null, function (storedKeyValues) {
    if (chrome.runtime.lastError) {
      console.error(
        'Problem getting this browsers data from storage ~ ' + chrome.runtime.lastError.message
      );
      return false;
    } else {
      const allKeys = Object.keys(storedKeyValues);
      const browserKeyStart = 'syncy-' + browserId + '-';
      for (const key of allKeys) {
        if (key.startsWith(browserKeyStart)) {
          chrome.storage.local.remove(key, function () {
            if (chrome.runtime.lastError) {
              console.error(
                'Problem removing key from storage ~ ' + chrome.runtime.lastError.message
              );
              success = false; /** something hasn't worked, but try the rest */
            }
          });
        }
      }
    }
  });
  return success;
};

/**
 * @description refeshes all of this browsers storage with up-to-date data
 * @returns boolean of success
 **/
export const refreshThisBrowserData = (thisBrowserId = '') => {
  /** to avoid stale data being left behind in storage, remove all storage keys associated with this browser */
  let success = removeAllBrowserData(thisBrowserId);

  /** write all current tab data */
  chrome.windows.getAll({ populate: true }, (windowArray) => {
    for (const window of winArray) {
      let windowId = window.id;
      for (const tab of window.tabs) {
        let storageKey = ['syncy', thisBrowserId, 'tab', windowId, tab.id].join('-');
        success = tryToWriteToStorage(storageKey, parseTabObject(tab)) !== undefined;
      }
    }
  });

  /**
   * TODO: finish up write operations below
   */
  chrome.sessions.getRecentlyClosed({}, (recentArray) => {
    this.thisTabPanels.push(parseRecentsData(recentArray));
    this.tempRecentsContent = JSON.stringify(recentArray, undefined, 2);
  });

  chrome.sessions.getDevices({}, (deviceArray) => {
    this.thisTabPanels.push(...parseDevicesData(deviceArray));
    this.tempDeviceContent = JSON.stringify(deviceArray, undefined, 2);
  });
};

/**
 * @description updates or creates tab data in local storage, only updating the data passed in the tab object
 * @returns boolean of success
 */
export const createUpdateTabData = (windowId = -1, tab = {}) => {
  return undefined;
};

/**
 * @description moves tab to new window or index
 * @returns boolean of success
 */
export const moveTab = (currentWindowId = -1, tabId = -1, newindex = -1, newWindowId = -1) => {
  return undefined;
};
