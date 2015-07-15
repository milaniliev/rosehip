build: rosehip.js

rosehip.js: src/rosehip.js 
	node_modules/.bin/browserify --transform babelify --standalone rosehip --outfile rosehip.js src/rosehip.js

build_test: build test/rosehip.built.js

test/rosehip.built.js: test/src/test.js
	cd test && node_modules/.bin/browserify --outfile rosehip.built.js src/test.js

test: build_test
	open test/standalone.html
	open test/browserify.html

.PHONY: test
