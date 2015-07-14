build: rosehip.js rosehip.standalone.js

rosehip.js: src/rosehip.js
	node_modules/.bin/babel  --out-file rosehip.js src/rosehip.js

rosehip.standalone.js: src/rosehip.js
	node_modules/.bin/browserify --transform babelify --standalone rosehip --outfile rosehip.standalone.js src/rosehip.js
