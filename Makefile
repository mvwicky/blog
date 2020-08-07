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
TS_NODE=$(NODE_BIN)/ts-node
TSC=$(NODE_BIN)/tsc
TRASH=$(NODE_BIN)/trash
PKG=package.json
NBUILD_SRC=config/build.nim
NBUILD_DIR=build
NBUILD_EXE=$(NBUILD_DIR)/nbuild
BUILD_SW=config/build-sw.ts
LIB_DIR=lib
LIB_OUT=$(LIB_DIR)/build

GFIND=$(shell command -v gfind)
FIND=$(or $(GFIND),$(GFIND),find)

YARN_VERSION_ARGS=--no-git-tag-version
OUTPUT_DIR=$(shell jq -r .config.eleventy.dir.output $(PKG))

VERSION=$(shell jq -r .version $(PKG))
VERSION_TAG=v$(VERSION)

LIB_INPUT=$(shell $(FIND) $(LIB_DIR) -path $(LIB_OUT) -prune -o -type f -name '*.ts')
LIB_OUTPUT=$(shell $(FIND) $(LIB_OUT) -type f \( -name '*.js' -o -name '*.d.ts' \))

.PHONY: build prod dev prod-assets dev-assets eleventy service-worker webpack ts-node \
	ts-web clean-dist clean-cache trash-dir clean bump-major bump-minor bump-patch bump \
	nbuild clean-nbuild version version-tag \

build: export NODE_ENV=production
build: clean-dist prod-assets eleventy service-worker

prod: build

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

service-worker: TS_NODE_ARGS=$(BUILD_SW)
service-worker: ts-node

.PHONY: lib
lib:
	@echo $(LIB_INPUT)

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

nbuild: $(NBUILD_EXE)

$(NBUILD_EXE): $(NBUILD_SRC)
	mkdir -p $(@D)
	nim compile --out:$(@F) --outdir:$(@D) $<

clean-nbuild: TRASH_DIR+=$(NBUILD_DIR)
clean-nbuild: trash-dir

version:
	@echo $(VERSION_TAG)

version-tag:
	git tag $(VERSION_TAG)
