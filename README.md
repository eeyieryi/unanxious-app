# Unanxious

Free your memory slots from events that are not to be done at the moment.

Keep it away from now, and bring it closer when it's time to do so.

> [!WARNING]
> This app is under active development. New deployments may break data model compatibility with previous versions, meaning that previous saved data may be unusable with the new version without manual intervention.

## Functionality

After fetching the static assets, these will be cached and the website will be available to use offline.

All the data is stored and persisted on the browser. Because of that fact, clearing the browser's data will also make it so that the saved app data be deleted. Make sure to backup your data before doing so.

Backup data may be exported and imported on different clients/devices.

> [!CAUTION]
> When importing data, all data is overridden.

Exported data is a JSON file with unencrypted data.

## Features

- Tasks (TODOs)
- Focus (Timer Tracking)
- Counter (Count Tracker)
- Backup/Restore

## Developing

### Requirements

Bun must be installed <https://bun.sh/docs/installation>

Make sure you have bun install and then proceed with the following steps

Once you've cloned this repository, install the dependencies with `bun install --frozen-lockfile`, and then start a development server:

```bash
bun run dev
```

## Building

To create a production version of this app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.
