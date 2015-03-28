NODE= ./node_modules/.bin

test::

	@$(NODE)/grunt db:start
	@$(NODE)/grunt db:start --fresh
	@$(NODE)/mocha servers/api --tests

.PHONY: test
