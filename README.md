# Syncy

A simple chromium extension for syncing browser data using google account storage

## Background

Like many nerds, particularly those that toy with web technologies, I'm not one to settle down
long-term with one browser. I like to play the field, sometimes dating many browsers at once and
even having the odd wild weekend with [Pale Moon](https://www.palemoon.org/)

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
- This started out as an excuse to learn Vue, so without
  [Md Obydullah](https://github.com/mdobydullah)'s great
  [tutorial](https://www.mynotepaper.com/build-a-google-chrome-extension-using-vuejs) (that also
  uses [vue-web-extension](https://github.com/Kocal/vue-web-extension)) I would of wasted a great
  deal of time getting started

## My dev notes

### notes

- PascalCase for components, kebab-case for component props (because of
  [use in html files](https://vuejs.org/v2/guide/components-props.html#Prop-Casing-camelCase-vs-kebab-case)),
  camelCase for variables and functions
- [Don't use arrow functions](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks) in
  component callbacks!

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

### to-do

#### v0.1

- ~expand/collapse data cards~
- ~wrap data cards in inclusive browser component~
- ~expand/collapse all~
- save/retrive data to storage
- watch storage for changes, bind to UI
- google oauth
- sync storage to cloud
- theming
- testing with chrome, chromium, brave, edge and opera

#### v0.2

- firefox counterpart

#### v0.3

- browser history?
- sync bookmarks? **LARGE COST!**
