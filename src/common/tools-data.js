import { isUrlBrowserInternal, hashStringToInt } from './tools-helpers';

/**
 * @description takes verbose tab data and strips out only what is needed
 */
export const parseTabObject = (tabData = {}) => {
  return {
    id: tabData.id,
    index: tabData.index,
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
      id: window.id,
      name: 'Window ' + window.id,
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
    id: -1,
    name: 'Recents',
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
      id: hashStringToInt(device.deviceName),
      name: device.deviceName,
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
