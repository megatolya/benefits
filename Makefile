NODE= ./node_modules/.bin

test::

	@$(NODE)/grunt db:start
	@$(NODE)/grunt db:start --fresh
	@$(NODE)/mocha server --tests

.PHONY: test
