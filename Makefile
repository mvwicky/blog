SHELL:=bash
.ONESHELL:
.SHELLFLAGS:=-eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

YARN=yarn
NODE_BIN=node_modules/.bin
WEBPACK=$(NODE_BIN)/webpack
ELEVENTY=$(NODE_BIN)/eleventy
TSC=$(NODE_BIN)/tsc
TRASH=$(NODE_BIN)/trash

YARN_VERSION_ARGS=--no-git-tag-version
OUTPUT_DIR=dist

VERSION=$(shell jq -r .version package.json)
VERSION_TAG=v$(VERSION)

.PHONY: prod-assets dev-assets clean-cache clean-tsbuild clean version version-tag build \
	ts-web yarn-version bump-major bump-minor bump-patch bump-premajor bump-preminor \
	bump-prepatch bump-prerelease

build: export NODE_ENV=production
build: clean-dist prod-assets
	$(ELEVENTY)

prod-assets: export NODE_ENV=production
prod-assets:
	$(NODE_BIN)/webpack --config webpack.prod.ts -p

dev-assets: export NODE_ENV=development
dev-assets: clean-dist
	$(WEBPACK) --mode=development

ts-web:
	$(TSC) -p src/ts/tsconfig.json

clean-dist: TRASH_DIR=$(OUTPUT_DIR)
clean-dist: trash-dir

clean-cache: TRASH_DIR=.cache/build-cache
clean-cache: trash-dir

clean-tsbuild: TRASH_DIR=build
clean-tsbuild: trash-dir

trash-dir:
	$(TRASH) $(TRASH_DIR)

clean: clean-cache clean-tsbuild clean-dist

bump-major: YARN_VERSION_ARGS+=--major
bump-major: bump
bump-minor: YARN_VERSION_ARGS+=--minor
bump-minor: bump
bump-patch: YARN_VERSION_ARGS+=--patch
bump-patch: bump
bump-premajor: YARN_VERSION_ARGS+=--premajor
bump-premajor: bump
bump-preminor: YARN_VERSION_ARGS+=--preminor
bump-preminor: bump
bump-prepatch: YARN_VERSION_ARGS+=--prepatch
bump-prepatch: bump
bump-prerelease: YARN_VERSION_ARGS+=--prerelease
bump-prerelease: bump

bump:
	$(YARN) version $(YARN_VERSION_ARGS)


yarn-version:
	$(YARN) version $(YARN_VERSION_ARGS)

version:
	@echo $(VERSION_TAG)

version-tag:
	git tag $(VERSION_TAG)
