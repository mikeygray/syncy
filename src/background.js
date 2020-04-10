global.browser = require('webextension-polyfill');

/** Open main interface when icon is clicked */
chrome.browserAction.onClicked.addListener(function(activeTab) {
  var newURL = 'main/main.html';
  chrome.tabs.create({ url: newURL });
});

/** Tab events listened to */
chrome.tabs.onCreated.addListener(tabStateChanged());
chrome.tabs.onUpdated.addListener(tabStateChanged());
chrome.tabs.onRemoved.addListener(tabStateChanged());

/** Window Events?
chrome.tabs.onDetached.addListener(tabStateChanged());
chrome.tabs.onAttached.addListener(tabStateChanged());
chrome.tabs.onMoved.addListener(tabStateChanged());
*/

function tabStateChanged() {
  chrome.tabs.query({}, function(tabArray) {
    chrome.storage.local.set({ syncyCurrentLocalTabs: tabArray }, function() {
      console.log('TAB DATA ADDED TO STORAGE ~ ' + JSON.stringify(tabArray));
      //Send refresh command to main.js?
    });
  });
}

function sanitizeInput(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}
