# iframe-pen-test

# system requirements

-   Make sure you're on Node.js version 18+ (16+ might work too). Check with `node --version`. To update your Node.js version, use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
-   Make sure you're on npm version 9+. Check with `npm --version`. To update your NPM version, run `npm i -g npm@latest`

These versions are required because this is a mono-repo that takes advantage of [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces?v=true).

# startup

1. `npm i` after first clone or any future pulls
2. `npm start` to run the parent and child dev servers
3. navigate to http://127.0.0.1:5801 in a browser

After running `npm start`, the browser page will automatically refresh when any source code changes are made.

-   `npm test:all` in repo root to run all tests (formatting, types, actual tests, etc.)
-   `npm run format` in repo root to run formatting (if your editor doesn't already do this automatically)

# instructions

The goal is for the child iframe to be able to read and display the parent iframe's `secret-code`.

-   Only changes to [`packages/frontend-iframe-child/src`](./packages/frontend-iframe-child/src) are allowed.
-   The parent window stores the secret code in session storage, local storage, in its DOM, and in a cookie. Retrieving the secret code from any of these sources is valid.
-   The parent window communicates back and forth with the child window using messages. These are a valid possible hijacking route, though the parent does not directly send the secret code to the child.
-   The child iframe already tries various methods to grab the secret code (they don't work).
