# Chan Nok Hang — personal academic website

A lightweight, responsive Jekyll website for GitHub Pages. No JavaScript framework or third-party fonts are required.

## Pages
- `index.md`: homepage
- `research.md`: research overview and thesis
- `cv.md`: CV with browser print / Save as PDF support
- `teaching.md`: teaching assistant experience
- `MFS.html.md`: personal page; its original `/MFS.html` URL is preserved

## Update content
Edit the Markdown pages above. Add navigation entries in `_data/navigation.yml`.
Shared markup is in `_layouts/default.html`; styling is in `assets/css/site.css`.
Global title, description and production URL are in `_config.yml`.

For research entries, clearly distinguish thesis, working paper, and published article.
Only add publication status, results, dates, or download links after verification.
The thesis title currently follows the original website; confirm its final official wording before updating it.
The CV is printable; no standalone CV PDF has been supplied.

## Local preview
Install Ruby and Bundler, then run:
```sh
bundle install
bundle exec jekyll serve
```
Open http://127.0.0.1:4000. To build without serving, run `bundle exec jekyll build`.

## Publish
Review and merge the redesign branch into `main`. Keep GitHub Pages configured to
build from the root of `main` using Jekyll. Branch commits alone do not publish this redesign.
After deployment, check navigation, `/MFS.html`, mobile layout, and CV printing.

## Design
Warm paper background, deep blue typography, teal accents, system fonts and a decorative
SVG network illustration. The illustration is not empirical research data.

## Compact interactive homepage
The main navigation now points to sections of the homepage. Older Research, CV,
Teaching and personal URLs remain available. Edit homepage copy in index.md.
Optional dependency-free interactions live in assets/js/home.js: topic buttons,
node selection, dragging, arrow-key movement and layout reset. The network is an
illustration, not real data. No autoplay animation or external requests are used.
Native details/summary elements keep education, teaching and hobbies usable without JavaScript.
