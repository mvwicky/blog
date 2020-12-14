SHELL:=bash
.ONESHELL:
.SHELLFLAGS:=-eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

YARN=yarn
YRUN=$(YARN) --silent run
WEBPACK=$(YRUN) webpack
ELEVENTY=$(YRUN) eleventy
TS_NODE=$(YRUN) ts-node
TSC=$(YRUN) tsc
TRASH=$(YRUN) trash
PKG=package.json
BUILD_SW=config/build-sw.ts
LIB_DIR=lib
LIB_OUT=build/lib
LIB_SENTINEL=.cache/lib.built

GFIND=$(shell command -v gfind)
FIND=$(or $(GFIND),$(GFIND),find)

YARN_VERSION_ARGS=--no-commit-hooks
OUTPUT_DIR=$(shell jq -r .config.eleventy.dir.output $(PKG))

VERSION=$(shell jq -r .version $(PKG))
VERSION_TAG=v$(VERSION)
WEBPACK_ARGS=--progress

LIB_INPUT=$(shell $(FIND) $(LIB_DIR) -type f -name '*.ts')

.PHONY: build prod dev prod-assets dev-assets eleventy service-worker webpack ts-node \
	ts-web clean-dist clean-cache trash-dir clean bump-major bump-minor bump-patch bump \
	version version-tag lib \

build: export NODE_ENV=production
build: clean-dist lib prod-assets eleventy service-worker

prod: build

dev: export NODE_ENV=development
dev: clean-dist dev-assets eleventy

prod-assets: export NODE_ENV=production
prod-assets: WEBPACK_ARGS+= --config=./webpack.prod.ts
prod-assets: webpack

dev-assets: export NODE_ENV=development
dev-assets: WEBPACK_ARGS+= --config=./webpack.config.ts
dev-assets: webpack

eleventy:
	$(ELEVENTY)

site: eleventy

service-worker: TS_NODE_ARGS=$(BUILD_SW)
service-worker: ts-node

lib: $(LIB_SENTINEL)

$(LIB_SENTINEL): $(LIB_INPUT)
	$(TSC) -p $(LIB_DIR)
	date > $@

webpack:
	$(WEBPACK) $(WEBPACK_ARGS)

ts-node:
	$(TS_NODE) $(TS_NODE_ARGS)

ts-web:
	$(TSC) -p src/ts/tsconfig.json

clean-dist: TRASH_DIR+=$(OUTPUT_DIR)
clean-dist: trash-dir

clean-cache: TRASH_DIR+=.cache/build-cache
clean-cache: trash-dir

clean-lib: TRASH_DIR+=$(LIB_OUT) $(LIB_SENTINEL)
clean-lib: trash-dir

trash-dir:
	$(TRASH) $(TRASH_DIR)

clean: clean-cache
clean: clean-dist

bump-major: YARN_VERSION_ARGS+=--major
bump-major: bump

bump-minor: YARN_VERSION_ARGS+=--minor
bump-minor: bump

bump-patch: YARN_VERSION_ARGS+=--patch
bump-patch: bump

bump:
	$(YARN) version $(YARN_VERSION_ARGS)

version:
	@echo $(VERSION_TAG)

version-tag:
	git tag $(VERSION_TAG)
