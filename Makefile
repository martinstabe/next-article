include n.Makefile

TEST_APP := "ft-article-branch-${CIRCLE_BUILD_NUM}"

install: whitesource.config.json
	$(MAKE) install-super

whitesource.config.json:
	@if $(call IS_GIT_IGNORED); then echo '{ "apiKey": "$(WHITESOURCE_API_KEY)", "productName":"Next", "projectName":"$(call APP_NAME)" }' > $@ && $(DONE); fi

coverage:
	export apikey=12345; export api2key=67890; export AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION=true; export NODE_ENV=test; istanbul cover node_modules/.bin/_mocha --report lcovonly 'test/server/**/*.test.js'

unit-test:
	export apikey=12345; export api2key=67890; export AWS_SIGNED_FETCH_DISABLE_DNS_RESOLUTION=true; export NODE_ENV=test; mocha 'test/server/**/*.test.js' --inline-diffs

test:
	make verify

ifeq ($(CIRCLE_BRANCH),master)
	make coverage && cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
else
	make unit-test
endif

run:
	nbt run

deploy: _deploy_whitesource
	nbt deploy-hashed-assets
	nbt ship -m

_deploy_whitesource:
	(whitesource run && rm -r ws* && rm npm-shrinkwrap.json) || echo "whitesource run failed, skipping"
	(ws-bower && rm -r ws* && rm -r .ws_bower) || echo "whitesource bower failed, skipping"
	@$(DONE)

clean-deploy: clean install deploy

tidy:
	nbt destroy ${TEST_APP}

provision:
	nbt deploy-hashed-assets
	nbt float -md --testapp ${TEST_APP}
	make smoke

smoke:
	nbt test-urls ${TEST_APP} --throttle 1;
	export TEST_APP=${TEST_APP}; nbt nightwatch test/browser/tests/* -e ie9,edge,chrome,firefox,iphone6_plus
