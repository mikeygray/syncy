# Syncy

A simple chromium extension for syncing browser data using google account storage

## Background

Like many nerds, particularly those that toy with web technologies, I'm not one to settle down
long-term with one browser. I like to play the field, sometimes seeing many browsers at a time, and
even having the odd wild weekend with [Pale Moon](https://www.palemoon.org/).

Most browsers out there have some form of syncing service, but as far as I can tell these services
are all wall-gardened to their browser alone. This seems even more crazy considering the vast
majority run on a fork of chromium. It doesn't seem a gigantic ask in the 21st century for the stuff
I'm doing in one browser to follow me to the next.

I've tried various setups in my time but nothing did everything I wanted. So, I wrote my own.

## Yeah, but what about non-desktop devices (mobile)

At the time of writing Firefox is the only major mobile browser to support extensions. This is a
shame, and it seems overkill to write a mobile app to try and surreptitiously gather mobile browser
data to sync. The compromise for now is that each browser will show the device tabs last synced by
their own sync service. It's far from perfect, and assumes you're using EVERY browsers sync, but at
least you can quickly get back to something you started elsewhere when you return to a desktop.

## Installation

To install and run the source code locally:

```command line
git clone https://github.com/mikeygray/syncy.git
cd syncy
yarn
yarn watch:dev
```

...and then install the 'unpacked' extension in your chromium browser of choice, selecting the
`./dist/` folder as the load location
([Instructions for Chrome](https://developer.chrome.com/extensions/getstarted))

## Thanks

- Primarily I would have never got anywhere without [Hugo Alliaume](https://github.com/Kocal)'s
  amazing template [vue-web-extension](https://github.com/Kocal/vue-web-extension) and though it
  uses the
  [now deprecated](https://cli.vuejs.org/guide/creating-a-project.html#pulling-2-x-templates-legacy)
  `vue init` command, it's the bestestest bedrock for such a project
- This project started out as an excuse to learn Vue, so without
  [Md Obydullah](https://github.com/mdobydullah)'s great
  [tutorial](https://www.mynotepaper.com/build-a-google-chrome-extension-using-vuejs) (that also
  uses [vue-web-extension](https://github.com/Kocal/vue-web-extension)) I would of wasted a great
  deal of time getting started
- The amazing people responsible for
  [webextension-polyfill](https://github.com/mozilla/webextension-polyfill), though I simay over my
  ineptitude taking so long to properly harness it
- And as always the patient people at [Stack Overflow](https://stackoverflow.com) and their
  retention policy for old questions.

## My dev notes

### to-do

#### v0.1

- ~expand/collapse data cards~
- ~wrap data cards in inclusive browser component~
- ~expand/collapse all~
- incorporate [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) so I can use
  Promises for storage operations
- save/retrive data to storage
- watch storage for changes, bind to UI
- google oauth
- sync storage to cloud
- options screen and integration
- theming and ui refinement (loading animation, dense display, popup?)
- testing with chrome, chromium, brave, edge and opera

#### v0.2

- firefox counterpart

#### v0.3

- browser history?
- sync bookmarks? **LARGE COST!**

### notes

- PascalCase for components, lowercase or kabab-case for component props (because of
  [use in html files](https://vuejs.org/v2/guide/components-props.html#Prop-Casing-camelCase-vs-kebab-case)),
  camelCase for variables and functions
- [Don't use arrow functions](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks) in
  component callbacks!
- Given the advice about
  [chrome.storage limits](https://developer.chrome.com/extensions/storage#limits) the storage model
  keys must be as piece meal as possible, to allow for exacting read/write operations. Thusly, the
  storage keys will be of a discriptive nature. Currently used:
  - `syncy-thisbrowserid` : `browserid`
  - `syncy-(browserid)-name` : `browsername`
  - `syncy-(browserid)-tab-(windowid)-(tabid)` : `{ tabdata }`
  - `syncy-(browserid)-recent-(tabid)` : `{ tabdata }`
  - `syncy-(browserid)-device-(deviceid)-name` : `devicename`
  - `syncy-(browserid)-device-(deviceid)-(tabid)` : `{ tabdata }`

### current architectural thinking

- `*.vue` - the 'views' - watch the 'model' for changes and reflect them visually
- `localstorage` - the 'model' - persistent central source of truth
- `background.js` - the 'controller' - updates the model based on events from the browser and
  changes in the cloud

And somewhere in this:

- `oauth.js` - handles authentication and calls too and from the cloud

### data structure

- user (google_oauth_connection)
  - this device (id?)
    - this browser instance (name, internal_id)
      - window (internal_id)
        - tab
        - tab ...
      - window
        - tabs ...
    - other browser instances ...
  - other devices ...

### data flow pseudocode

- load, check for oauth
- if no oauth
  - check local-storage for data
  - compare to local-live, update each as required, write to local-storage
  - wait for local-live changes, update as required
- if oauth
  - get cloud data, get local-storage data, get local-live data
  - compare and update each as required
  - wait for local-live and cloud changes, update as required
