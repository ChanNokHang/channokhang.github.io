# Chan Nok Hang — single-page academic profile

All profile content lives in index.md. Navigation jumps within that page.
Research, CV, Teaching and /MFS.html are compatibility redirects, not separate profiles.

## Edit
- index.md: biography, research, education, teaching, contact, illustrated skyline.
- assets/css/site.css: responsive layout, print styles and reduced-motion support.
- assets/js/home.js: topic selection, draggable network, ripple, shuffle and idea garden.
- _data/navigation.yml: homepage section links.

The skyline is an original schematic illustration. The network and ripple are visual toys,
not market data, a contagion simulation, or a risk prediction. The garden retains no data.
Animations are brief, with no looping autoplay, and respect reduced-motion settings.
All profile content remains readable without JavaScript. Print or Save as PDF from Background.

## Build
Install Ruby and Bundler, then run:
```sh
bundle install
bundle exec jekyll serve
```
Open http://127.0.0.1:4000. Build with bundle exec jekyll build.
Review the PR before merging into main for GitHub Pages deployment.
