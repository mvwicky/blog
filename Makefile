SHELL:=bash
.ONESHELL:
.SHELLFLAGS:=-eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

NODE_BIN=node_modules/.bin
YARN=yarn
TSC=$(NODE_BIN)/tsc
TRASH=$(NODE_BIN)/trash
YARN_VERSION_ARGS=--no-git-tag-version

VERSION=$(shell jq -r .version package.json)
VERSION_TAG=v$(VERSION)

.PHONY: prod-assets dev-assets clean-cache clean-tsbuild clean version version-tag

prod-assets:
	$(YARN) npm-run-all clean build:assets

dev-assets:
	$(YARN) npm-run-all clean webpack:assets

ts-web:
	$(TSC) -p src/ts/tsconfig.json

clean-cache:
	$(TRASH) .cache/build-cache

clean-tsbuild:
	$(TRASH) build

clean: clean-cache clean-tsbuild
clean:
	$(YARN) clean

bump-major: YARN_VERSION_ARGS+=--major
bump-minor: YARN_VERSION_ARGS+=--minor
bump-patch: YARN_VERSION_ARGS+=--patch
bump-premajor: YARN_VERSION_ARGS+=--premajor
bump-preminor: YARN_VERSION_ARGS+=--preminor
bump-prepatch: YARN_VERSION_ARGS+=--prepatch
bump-prerelease: YARN_VERSION_ARGS+=--prerelease

bump-%:
	$(YARN) version $(YARN_VERSION_ARGS)


yarn-version:
	$(YARN) version $(YARN_VERSION_ARGS)

version:
	@echo $(VERSION_TAG)

version-tag:
	git tag $(VERSION_TAG)
