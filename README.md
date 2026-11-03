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

## Depth and reading update
Profile content is always visible: there are no disclosure sections or topic tabs.
Each section uses its own tinted surface. Body copy is larger, with serif display
headings, humanist section headings and monospace labels.
The network uses real XYZ coordinates, perspective projection and depth-sorted SVG
spheres. Drag rotates the view; arrow keys and rotation buttons work too. Use the
zoom slider or +/- keys. Selection, ripple, reset and new constellation are retained.
This is a lightweight 3D projection, without WebGL or external libraries.

## Dense personal workbench
The homepage uses a compact desktop grid: intro/network, research and background,
then a small garden and interests. Mobile stacks content in reading order.
Operation controls use inline SVG icons with accessible names and hover/focus labels.
Body text remains 17px; density comes from spacing and layout rather than tiny type.
