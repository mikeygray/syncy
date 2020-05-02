/**
 * @description this is for data structure reference and doesn't belong in production
 */

export const emptyTabArray = [
  {
    id: -1,
    index: -1, // if the tabs have an order in the parent
    title: '',
    url: '',
    imageurl: '',
    pinned: false,
    lastModified: -1,
  },
];

/**
 * UI 'panel' objects can be gathered in arrays or objects, though objects are more useful when building them (so panels can be referenced by id)
 */

export const emptyPanelsArray = [
  {
    id: -1,
    name: '',
    title: '',
    tabs: emptyTabArray,
  },
];

export const emptyPanelsObject = {
  panelid1: {
    id: -1,
    name: '',
    title: '',
    tabs: emptyTabArray,
  },
  panelid2: {
    id: -1,
    name: '',
    title: '',
    tabs: emptyTabArray,
  },
};

export const emptyRecentsArray = emptyTabArray;

export const emptyWindowsObject = emptyPanelsObject;

export const emptyDevicesObject = emptyPanelsObject;

export const emptyBrowserObject = {
  id: '',
  name: '',
  windows: emptyWindowsObject,
  recents: emptyRecentsArray,
  devices: emptyDevicesObject,
};

export const emptyAppDataArray = {
  thisBrowser: emptyBrowserObject,
  otherBrowsers: [emptyBrowserObject],
};
