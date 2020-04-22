# syncy

A simple chromium extension for syncing browser data using google account storage

## data structure

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

## to-do

### v0.1

- expand/collapse data cards
- wrap data cards in inclusive browser component
- expand/collapse all?
- save/retire data to storage
- watch storage for changes, bind to UI
- google oauth
- sync storage to cloud
- theming
- testing with chrome, chromium, brave, edge and opera

### v0.2

- firefox counterpart

### v0.3

- browser history?
- sync bookmarks? **LARGE COST!**

## notes

- PascalCase for components, camelCase for variables and functions
