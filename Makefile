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
PKG=package.json
NBUILD_SRC=config/build.nim
NBUILD_EXE=bin/nbuild

GFIND=$(shell command -v gfind)
FIND=$(or $(GFIND),$(GFIND),find)
FIND_ARGS=-mindepth 1 -maxdepth 1 -type d -printf '%f\n'
LOCAL_MODS=$(shell $(FIND) local_modules $(FIND_ARGS))

YARN_VERSION_ARGS=--no-git-tag-version
OUTPUT_DIR=$(shell jq -r .config.eleventy.dir.output $(PKG))

VERSION=$(shell jq -r .version $(PKG))
VERSION_TAG=v$(VERSION)

.PHONY: prod-assets dev-assets clean-cache clean-tsbuild clean version version-tag build \
	ts-web yarn-version bump-major bump-minor bump-patch reinstall-locals

build: export NODE_ENV=production
build: clean-dist prod-assets eleventy

dev: export NODE_ENV=development
dev: clean-dist dev-assets eleventy

prod-assets: export NODE_ENV=production
prod-assets: WEBPACK_ARGS=--config webpack.prod.ts -p
prod-assets: webpack

dev-assets: export NODE_ENV=development
dev-assets: WEBPACK_ARGS=--mode=development
dev-assets: webpack

eleventy:
	$(ELEVENTY)

webpack:
	$(WEBPACK) $(WEBPACK_ARGS)

ts-web:
	$(TSC) -p src/ts/tsconfig.json

clean-dist: TRASH_DIR+=$(OUTPUT_DIR)
clean-dist: trash-dir

clean-cache: TRASH_DIR+=.cache/build-cache
clean-cache: trash-dir

clean-tsbuild: TRASH_DIR+=build
clean-tsbuild: trash-dir

trash-dir:
	$(TRASH) $(TRASH_DIR)

clean: clean-cache
clean: clean-tsbuild
clean: clean-dist

bump-major: YARN_VERSION_ARGS+=--major
bump-major: bump

bump-minor: YARN_VERSION_ARGS+=--minor
bump-minor: bump

bump-patch: YARN_VERSION_ARGS+=--patch
bump-patch: bump

bump:
	$(YARN) version $(YARN_VERSION_ARGS)

nbuild: $(NBUILD_EXE)

$(NBUILD_EXE): $(NBUILD_SRC)
	mkdir -p $(@D)
	nim compile --out:$(@F) --outdir:$(@D) $<

reinstall-locals:
	yarn upgrade $(LOCAL_MODS)

version:
	@echo $(VERSION_TAG)

version-tag:
	git tag $(VERSION_TAG)
