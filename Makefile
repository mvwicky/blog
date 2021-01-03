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
CACHE_DIR=.cache
PKG=package.json
BUILD_SW=scripts/build-sw.ts
LIB_DIR=lib
LIB_OUT=build/lib
LIB_SENTINEL=$(CACHE_DIR)/lib.built

pathmatch=$(wildcard $(addsuffix /$(1),$(subst :, ,$(PATH))))
pathsearch=$(firstword $(wildcard $(addsuffix /$(1),$(subst :, ,$(PATH)))))
GFIND=$(shell command -v gfind)
FIND=$(or $(GFIND),$(GFIND),find)

YARN_VERSION_ARGS=--no-commit-hooks
OUTPUT_DIR=$(shell jq -r .config.eleventy.dir.output $(PKG))

VERSION=$(shell jq -r .version $(PKG))
VERSION_TAG=v$(VERSION)
WEBPACK_ARGS=--progress
TSC_ARGS=
PORT?=11738

LIB_INPUT=$(shell $(FIND) $(LIB_DIR) -type f -name '*.ts')
TO_OUT=$(addprefix build/,$(LIB_INPUT:.ts=.$(1)))
LIB_OUTPUT=$(call TO_OUT,d.ts) $(call TO_OUT,js)

.PHONY: build prod dev prod-assets dev-assets eleventy service-worker webpack ts-node \
	ts-web clean-dist clean-cache trash clean bump-major bump-minor bump-patch bump \
	version version-tag lib \

build: export NODE_ENV=production
build: clean-dist lib prod-assets eleventy service-worker

prod: build

dev: export NODE_ENV=development
dev: clean-dist lib dev-assets eleventy

prod-assets: export NODE_ENV=production
prod-assets: WEBPACK_ARGS+=--config=./webpack.prod.ts
prod-assets: webpack

dev-assets: export NODE_ENV=development
dev-assets: WEBPACK_ARGS+=--config=./webpack.config.ts
dev-assets: webpack

eleventy:
	$(ELEVENTY)

site: eleventy

service-worker: TS_NODE_ARGS=$(BUILD_SW)
service-worker: ts-node

serve:
	python -m http.server $(PORT) -d $(OUTPUT_DIR)/

lib: $(LIB_SENTINEL) $(LIB_OUTPUT)

$(LIB_SENTINEL): $(LIB_INPUT)
	$(TSC) --build $(LIB_DIR)
	date > $@

webpack: lib
	$(WEBPACK) $(WEBPACK_ARGS)

ts-node:
	$(TS_NODE) $(TS_NODE_ARGS)

ts-web:
	$(TSC) --build src/ts/tsconfig.json

tsc:
	$(TSC) $(TSC_ARGS)

clean-dist: TRASH_ARGS+=$(OUTPUT_DIR)
clean-dist: trash

clean-cache: TRASH_ARGS+=.cache/build-cache
clean-cache: trash

clean-lib: TRASH_ARGS+=$(LIB_OUT) $(LIB_SENTINEL)
clean-lib: trash

clean-lint: TRASH_ARGS+=$(CACHE_DIR)/.eslintcache
clean-lint: TRASH_ARGS+=$(CACHE_DIR)/.stylelintcache
clean-lint: trash

trash:
	$(TRASH) $(TRASH_ARGS)

clean: clean-cache
clean: clean-dist

bump-major: YARN_VERSION_ARGS+=--major
bump-minor: YARN_VERSION_ARGS+=--minor
bump-patch: YARN_VERSION_ARGS+=--patch
bump-major bump-minor bump-patch: bump

bump:
	$(YARN) version $(YARN_VERSION_ARGS)

version:
	@echo $(VERSION_TAG)

version-tag:
	git tag $(VERSION_TAG)

t:
	@: $(foreach f,$(LIB_OUTPUT),$(wildcard $(f)))
