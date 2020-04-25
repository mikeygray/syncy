import { mdiMicrosoftEdge, mdiGoogleChrome, mdiOpera, mdiSafeSquare, mdiHelpBox } from '@mdi/js';

/**
 * @description checks url for "internal style" urls
 */
const isUrlBrowserInternal = (url = '') => {
  return [
    'chrome:',
    'chrome-extension:',
    'brave:',
    'edge:',
    'extension:',
    'settings',
    'extensions',
  ].some((substring) => url.startsWith(substring));
};

/**
 * @description takes verbose tab data and strips out only what is needed
 */
export const parseTabObject = (tabData = {}) => {
  return {
    id: tabData.id,
    title: tabData.title,
    url: tabData.url,
    imageurl: tabData.favIconUrl,
    pinned: tabData.pinned,
  };
};

/**
 * @returns an array of panel objects each representing a window with an array of tab objects
 */
export const parseWindowsData = (windowData = []) => {
  let returnData = [];
  for (const window of windowData) {
    let windowEntry = {
      id: '' + window.id,
      title: 'Window',
      tabs: [],
    };
    for (const tab of window.tabs) {
      if (!isUrlBrowserInternal(tab.url)) windowEntry.tabs.push(parseTabObject(tab));
    }
    returnData.push(windowEntry);
  }
  return returnData;
};

/**
 * @description flatterns the tab data in recents data into one 'panel' object
 * @returns a 'panel' object (with id and title), containing an array of tab objects
 */
export const parseRecentsData = (recentData = []) => {
  let returnData = {
    id: '',
    title: 'Recent',
    tabs: [],
  };
  for (const recent of recentData) {
    if (Object.prototype.hasOwnProperty.call(recent, 'window')) {
      for (const tab of recent.window.tabs) {
        if (!isUrlBrowserInternal(tab.url)) returnData.tabs.push(parseTabObject(tab));
      }
    } else {
      if (!isUrlBrowserInternal(recent.tab.url)) returnData.tabs.push(parseTabObject(recent.tab));
    }
  }
  return returnData;
};

/**
 * @returns an array of panel objects each representing a device with an array of tab objects
 */
export const parseDevicesData = (deviceData = []) => {
  let returnData = [];
  for (const device of deviceData) {
    let deviceEntry = {
      id: device.deviceName,
      title: 'Device',
      tabs: [],
    };
    for (const session of device.sessions) {
      for (const tab of session.window.tabs) {
        if (!isUrlBrowserInternal(tab.url)) deviceEntry.tabs.push(parseTabObject(tab));
      }
    }
    returnData.push(deviceEntry);
  }
  return returnData;
};

/**
 * @description tries to identify the browser type from the useragent and mostly fails in this duty
 */
export const identifyBrowser = (useragent = '') => {
  if (useragent.includes('Edg/')) return 'edge';
  /** doesn't exist ➡ */ else if (useragent.includes('Chromium/')) return 'chromium';
  /** doesn't exist (yet) ➡ */ else if (useragent.includes('Brave/')) return 'brave';
  /** doesn't exist ➡ */ else if (useragent.includes('Vivaldi/')) return 'vivaldi';
  else if (useragent.includes('OPR/')) return 'opera';
  else if (useragent.includes('Chrome/')) return 'chrome';
  else return 'unknown';
};

/**
 * @returns the svg code for an icon representing the browser
 */
export const getBrowserIcon = (browserName = '') => {
  switch (browserName) {
    case 'edge':
      return mdiMicrosoftEdge;
    case 'brave':
      /** doesn't exist (yet) */
      return mdiSafeSquare;
    case 'opera':
      return mdiOpera;
    case 'chrome':
    case 'chromium':
      return mdiGoogleChrome;
    default:
      return mdiHelpBox;
  }
};
