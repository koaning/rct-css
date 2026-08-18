# rct.css — dead simple build.
SASS = npx sass --no-source-map

.PHONY: build watch serve clean

build:  ## Compile src/ -> dist/rct.css + dist/rct.min.css
	$(SASS) src/rct.scss dist/rct.css --style=expanded
	$(SASS) src/rct.scss dist/rct.min.css --style=compressed

watch:  ## Rebuild on change
	$(SASS) --watch src/rct.scss:dist/rct.css --style=expanded

serve:  ## Preview the demo at http://localhost:8000/docs/ (caching disabled)
	npx --yes http-server . -p 8000 -c-1 -o /docs/

clean:  ## Remove build output
	rm -f dist/rct.css dist/rct.min.css
