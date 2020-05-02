/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import {
  getThisBrowserId,
  refreshThisBrowserData,
  getSetThisBrowserName,
  getAllKeyValueData,
} from './common/storage';

/** open main page when extension icon is clicked */
chrome.browserAction.onClicked.addListener(function () {
  var newURL = 'main/main.html';
  chrome.tabs.create({ url: newURL });
});

// can't do anything till we have a browserId
getThisBrowserId((browserId) => {
  console.log('Browser id ~ ' + browserId);

  getSetThisBrowserName(browserId, (browserName) => {
    console.log('Browser name ~ ' + browserName);
  });

  getAllKeyValueData((storedKeyValues) => {
    console.info(
      'Current local storage values: \n' + JSON.stringify(storedKeyValues, undefined, 2)
    );
  });

  refreshThisBrowserData(browserId, () => {
    console.log('Apparently refreshed browser data!');
    getAllKeyValueData((storedKeyValues) => {
      console.info(
        'Current local storage values: \n' + JSON.stringify(storedKeyValues, undefined, 2)
      );
    });
  });
});

/**
 * TODO: At the moment background.js is acting as the controller. This probably needs to change.
 */

/** debug storage output */
chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log('STORAGE CHANGED: ', JSON.stringify(changes));
  /*if (changes) {
    for (const key of changes) {
      let storageChange = changes[key];
      console.log(
        'STORAGE CHANGED: Key "%s" in namespace "%s" ~ Old value: "%s", New value: "%s"',
        key,
        namespace,
        storageChange.oldValue,
        storageChange.newValue
      );
    }
  }*/
});

/** debug tab output */
chrome.tabs.onCreated.addListener(function (tab) {
  console.log('TAB CREATED: TabId "%s" in window "%s"', tab.id, tab.windowId);
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(
    'TAB UPDATED: TabId "%s" in window "%s" ~ changeInfo: "%s"',
    tabId,
    tab.windowId,
    JSON.stringify(changeInfo)
  );
});
chrome.tabs.onMoved.addListener(function (tabId, moveInfo) {
  console.log(
    'TAB MOVED: TabId "%s" in window "%s" ~ fromIndex: "%s", toIndex: "%s"',
    tabId,
    moveInfo.windowId,
    moveInfo.fromIndex,
    moveInfo.toIndex
  );
});
chrome.tabs.onDetached.addListener(function (tabId, detachInfo) {
  console.log(
    'TAB DETATCHED: TabId "%s" ~ oldWindowId: "%s", oldPosition: "%s"',
    tabId,
    detachInfo.oldWindowId,
    detachInfo.oldPosition
  );
});
chrome.tabs.onAttached.addListener(function (tabId, attachInfo) {
  console.log(
    'TAB ATTACHED: TabId "%s" ~ newWindowId: "%s", newPosition: "%s"',
    tabId,
    attachInfo.newWindowId,
    attachInfo.newPosition
  );
});
chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
  console.log('TAB REMOVED: addedTabId: "%s", removedTabId: "%s"', addedTabId, removedTabId);
});

/** Any last actions before background.js is unloaded */
chrome.runtime.onSuspend.addListener(function () {
  console.log('background.js unloading');
  //chrome.browserAction.setBadgeText({text: ""});
});
