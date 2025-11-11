# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Changes from the original Galenus Verbatim

As of 2025-09-22

- Rewrite search index using ElasticLunr and Svelte
- Rewrite site in Javascript using SvelteKit

## TODO:

- [x] Fix background color not extending to bottom of page
- [x] Add links to side navigation
- Fix empty French titles
- Clean up parts of /titres page (make sure everything mostly works)
- [ ] Improve search (partial matches without \*)
- [ ] Improve search links: go directly to line in treatise
- [ ] Add editor name to search screen

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# License

[GNU GPLv3](./LICENSE)
