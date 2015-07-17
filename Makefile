build: rosehip.js

rosehip.js: src/rosehip.js src/rosehip.css
	node_modules/.bin/browserify --transform babelify --transform cssify --standalone rosehip --outfile rosehip.tmp.js src/rosehip.js
	node_modules/.bin/derequire rosehip.tmp.js > rosehip.js
	rm rosehip.tmp.js

test/rosehip.built.js: test/src/test.js src/*
	cd test && node_modules/.bin/browserify --outfile rosehip.built.js src/test.js

test: build test/rosehip.built.js
	open test/standalone.html
	open test/browserify.html

.PHONY: test
