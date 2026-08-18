# rct.css

A tiny CSS framework that recreates **RollerCoaster Tycoon 2** window chrome:
flat fills framed by 2px light/dark bevel edges, the RCT2 pixel font with
anti-aliasing switched off, and CSS-only `<details>`-based windows and dropdowns.

Authored in Sass, but shipped as a single plain **`dist/rct.css`** you can drop in
anywhere — and reskin entirely in plain CSS, no build step required.

![Three RCT-style windows: a tan scenario window, a taupe options window, and a component sheet](docs/index.html)

> See the live demo: open [`docs/index.html`](docs/index.html) in a browser.

## Install

Drop the compiled file in and go:

```html
<link rel="stylesheet" href="dist/rct.css">
<!-- optional: adds dropdown select-and-close niceties -->
<script src="js/rct.js" defer></script>
```

The stylesheet loads its bundled font from `../fonts/rct2.otf` relative to the CSS
file, so keep `dist/` and `fonts/` siblings (the default layout, and how a CDN
serves the package).

## A minimal window

```html
<details class="rct-window rct-window--taupe" open>
  <summary class="rct-titlebar">
    <span class="rct-close" aria-hidden="true">X</span>Options
  </summary>
  <div class="rct-body">
    <fieldset class="rct-group">
      <legend>Controls</legend>
      <button class="rct-button rct-button--wide" type="button">Customize Keys…</button>
      <label class="rct-checkbox"><input type="checkbox" checked> Scroll at edge</label>
    </fieldset>
  </div>
</details>
```

Windows are `<details>` elements: **clicking the title bar rolls the window up**,
leaving just the bar. Nothing here needs JavaScript.

## Components

| Class | Element | Notes |
| --- | --- | --- |
| `.rct-window` | `<details>` | The frame; also sets the RCT type context. Add a theme modifier. |
| `.rct-titlebar` | `<summary>` | Roll-up title bar. Put a `.rct-close` inside it. |
| `.rct-body` | `<div>` | Padded content area. |
| `.rct-tabs` / `.rct-tab` | `<div>` / `<button>` | Tab strip; add `.is-active` to the current tab. Give tabs `data-tab="id"` + panels `data-tab-panel="id"` for rct.js switching. |
| `.rct-page` / `.rct-heading` | `<div>` / `<h2>` | Tab page body and yellow heading. |
| `.rct-group` | `<fieldset>` + `<legend>` | Etched group box. |
| `.rct-dropdown` | `<details>` | CSS-only select: `.value` well + `.arrow`, then a `.rct-menu` of `.item`s. |
| `.rct-button` | `<button>` | Add `.is-pressed` to pin it down, `.rct-button--wide` to fill a group. |
| `.rct-checkbox` | `<label>` + `<input type="checkbox">` | Native input, redrawn. |
| `.rct-input` | `<input type="text">` / `<textarea>` | Recessed text-field well; `.rct-input--wide` to indent inside a group. |
| `dialog.rct-window` | `<dialog>` | Modal styled as a window. Open with `.showModal()` or a `[data-rct-open="id"]` button; close with `[data-rct-close]`, Escape, or a backdrop click. |
| `.rct-scene` / `.rct-stage` / `.rct-row` | layout helpers | Optional grass backdrop, window shelf, inline control row. |

The framework never styles your `<body>`; the typographic baseline lives on
`.rct-window` (and the opt-in `.rct-scene`), so dropping `rct.css` into an existing
page changes nothing until you use an `.rct-*` class.

## Theming

Every component reads six CSS custom properties. The built-in themes just set them:

| Variable | Controls |
| --- | --- |
| `--body` | frame / button / tab surface |
| `--light` | raised bevel highlight (top-left) |
| `--dark` | raised bevel shadow (bottom-right) |
| `--field` | sunken input / value wells |
| `--title` | title bar + menu-hover fill |
| `--page` | tab page fill |

Ships with `rct-window--taupe`, `rct-window--tan`, `rct-window--slate`, and
`rct-window--olive`.

### Add a theme — two ways

**No build** — override the six variables on any `.rct-window` in plain CSS:

```css
.rct-window--candy {
  --body:  #b0568a;
  --light: #dd8cbb;
  --dark:  #5e2748;
  --field: #9c4879;
  --title: #4a1f38;
  --page:  #b0568a;
}
```

**With Sass** — add an entry to the `$themes` map in `src/_tokens.scss` and rebuild;
it generates the `.rct-window--<name>` class for you.

## The rct.js enhancer

`js/rct.js` is optional progressive enhancement — every component still works
without it. It auto-initializes on load; after injecting markup dynamically call
`RCT.init(rootElement)` (idempotent). It wires three things:

- **Dropdowns** — what a real `<select>` does: opening one closes the others,
  clicking an item writes its label into the value well and closes, and an
  outside click closes everything.
- **Tabs** — clicking `.rct-tab[data-tab="id"]` marks it active and shows the
  matching `[data-tab-panel="id"]` within the same window, hiding the rest.
- **Modals** — a `[data-rct-open="id"]` button opens that `<dialog>`; a
  `[data-rct-close]` button, Escape, or a backdrop click closes it.

## Build from source

Requires [Dart Sass](https://sass-lang.com/) (dev dependency only, no runtime deps):

```bash
npm install
npm run build      # -> dist/rct.css and dist/rct.min.css
npm run watch      # rebuild on change
```

Or with the Makefile: `make build`, `make watch`, `make serve` (live demo), `make clean`.

Source lives in `src/`: `_tokens.scss` (the pixel grid + theme palettes),
`_mixins.scss` (the `raised()` / `sunken()` bevel grammar), and one partial per
component under `src/components/`.

## The pixel grid (why the magic numbers)

The RCT2 font's grid is 1/16 em, so crisp sizes are multiples of 16px. At the 32px
base, one font-pixel = 2px on screen — a `@2x` game screenshot — which is why every
bevel is 2px. Glyph ink fills only the top half of the em, hence the sub-1
line-height. Change `$unit` / `$font-size` in `src/_tokens.scss` to rescale the
whole system; stay on multiples of 16px to keep glyphs sharp.

## Licenses

The **rct.css stylesheets and JavaScript are MIT licensed** (see [`LICENSE`](LICENSE)).

The bundled font is licensed separately and **requires attribution**:

> The FontStruction “RCT2” (https://fontstruct.com/fontstructions/show/465125)
> by “Qimplef” is licensed under a Creative Commons Attribution Share Alike
> license (http://creativecommons.org/licenses/by-sa/3.0/).

Because the font is CC BY-SA 3.0, redistributing it means keeping this attribution
and staying under a compatible ShareAlike license.

The docs page (`docs/index.html`) also uses **Departure Mono** for code, by Helena
Zhang, licensed under the [SIL Open Font License 1.1](fonts/DEPARTURE-MONO-LICENSE.txt).
It is not required by the framework itself.
