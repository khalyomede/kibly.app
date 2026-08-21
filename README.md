## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)

## Re-format images

### Logo (horizontal)

```bash
docker compose run --rm magick src/images/kibly-logo.png -define webp:lossless=true src/images/kibly-logo.webp

docker compose run --rm magick src/images/kibly-logo.png -resize 390x -define webp:lossless=true src/images/kibly-logo-mobile.webp
docker compose run --rm magick src/images/kibly-logo.png -resize 769x -define webp:lossless=true src/images/kibly-logo-tablet.webp
docker compose run --rm magick src/images/kibly-logo.png -resize 1024x -define webp:lossless=true src/images/kibly-logo-laptop.webp
docker compose run --rm magick src/images/kibly-logo.png -resize 1440x -define webp:lossless=true src/images/kibly-logo-desktop.webp

docker compose run --rm magick src/images/kibly-logo.png -resize 390x src/images/kibly-logo-mobile.png
docker compose run --rm magick src/images/kibly-logo.png -resize 769x src/images/kibly-logo-tablet.png
docker compose run --rm magick src/images/kibly-logo.png -resize 1024x src/images/kibly-logo-laptop.png
docker compose run --rm magick src/images/kibly-logo.png -resize 1440x src/images/kibly-logo-desktop.png
```

### Icon (favicon, app icon)

```bash
docker compose run --rm magick public/icons/kibly-icon.png -resize 1024x1024 public/icons/kibly-icon-1024.png
docker compose run --rm magick public/icons/kibly-icon.png -resize 512x512 public/icons/kibly-icon-512.png
docker compose run --rm magick public/icons/kibly-icon.png -resize 192x192 public/icons/kibly-icon-192.png

docker compose run --rm magick public/icons/kibly-maskable-icon.png -resize 1024x1024 public/icons/kibly-maskable-icon-1024.png
docker compose run --rm magick public/icons/kibly-maskable-icon.png -resize 512x512 public/icons/kibly-maskable-icon-512.png
docker compose run --rm magick public/icons/kibly-maskable-icon.png -resize 192x192 public/icons/kibly-maskable-icon-192.png

docker compose run --rm magick public/icons/kibly-maskable-duo-tone-icon.png -resize 1024x1024 public/icons/kibly-maskable-duo-tone-icon-1024.png
docker compose run --rm magick public/icons/kibly-maskable-duo-tone-icon.png -resize 512x512 public/icons/kibly-maskable-duo-tone-icon-512.png
docker compose run --rm magick public/icons/kibly-maskable-duo-tone-icon.png -resize 192x192 public/icons/kibly-maskable-duo-tone-icon-192.png
```
