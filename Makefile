build: rosehip.js

rosehip.js: src/* src/reporters/*
	node_modules/.bin/browserify --transform babelify --transform cssify --standalone rosehip --outfile rosehip.tmp.js src/rosehip.js
	node_modules/.bin/derequire rosehip.tmp.js > rosehip.js
	rm rosehip.tmp.js

test/browserify_test.js: test/src/browserify_test.js rosehip.js
	cd test && node_modules/.bin/browserify --outfile browserify_test.js src/browserify_test.js

test: build test/browserify_test.js
	# open test/standalone.html
	# open test/browserify.html

.PHONY: test
