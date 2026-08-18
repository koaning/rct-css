# rct.css — dead simple build.
SASS = npx sass --no-source-map

.PHONY: build docs watch serve clean

build: docs  ## Compile src/ -> dist/ and provision docs/ for GitHub Pages

docs:  ## Compile CSS and copy CSS + assets into docs/ (the GitHub Pages root)
	$(SASS) src/rct.scss dist/rct.css --style=expanded
	$(SASS) src/rct.scss dist/rct.min.css --style=compressed
	mkdir -p docs/dist docs/fonts docs/js
	cp dist/rct.css dist/rct.min.css docs/dist/
	cp fonts/departure-mono.woff2 fonts/DEPARTURE-MONO-LICENSE.txt docs/fonts/
	cp js/rct.js docs/js/

watch:  ## Rebuild on change
	$(SASS) --watch src/rct.scss:dist/rct.css --style=expanded

serve: docs  ## Preview the docs/ site at http://localhost:8000/ (same layout as GitHub Pages)
	npx --yes http-server docs -p 8000 -c-1 -o /

clean:  ## Remove build output
	rm -f dist/rct.css dist/rct.min.css
	rm -rf docs/dist docs/fonts docs/js
