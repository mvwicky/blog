SHELL:=bash
.SHELLFLAGS:=-eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS+=--warn-undefined-variables
MAKEFLAGS+=--no-builtin-rules

YARN=yarn
YRUN=$(YARN) --silent run
TSC=$(YRUN) tsc
TRASH=$(YRUN) trash
CACHE_DIR=.cache
PKG=package.json
BUILD_SW=scripts/build-sw.ts
LIB_DIR=lib
LIB_OUT=build/lib

pathmatch=$(wildcard $(addsuffix /$(1),$(subst :, ,$(PATH))))
pathsearch=$(firstword $(wildcard $(addsuffix /$(1),$(subst :, ,$(PATH)))))
GFIND=$(shell command -v gfind)
FIND=$(or $(GFIND),$(GFIND),find)

GET_SCRIPT=$(shell jq -r '.["scripts"]|.["$1"]' $(PKG))

YARN_VERSION_ARGS=--no-commit-hooks
OUTPUT_DIR=$(shell jq -r .config.eleventy.dir.output $(PKG))

VERSION_TAG=v$(shell jq -r .version $(PKG))
WEBPACK_ARGS=--progress --config=./webpack.config.ts
TSC_ARGS=
PORT?=11738


.PHONY: build prod dev prod-assets dev-assets eleventy service-worker webpack ts-node \
	ts-web clean-dist clean-cache trash clean bump-major bump-minor bump-patch bump \
	version version-tag ts-lib tsc

build: export NODE_ENV=production
build: clean-dist ts-lib prod-assets eleventy service-worker

prod: build

dev: export NODE_ENV=development
dev: clean-dist ts-lib dev-assets eleventy

prod-assets: export NODE_ENV=production
prod-assets: webpack

dev-assets: export NODE_ENV=development
dev-assets: export TAILWIND_MODE=build
dev-assets: webpack

eleventy: ts-lib
	$(YRUN) eleventy

site: eleventy

service-worker: TS_NODE_ARGS=$(BUILD_SW)
service-worker: ts-node

serve:
	python -m http.server $(PORT) -d $(OUTPUT_DIR)/

webpack: ts-lib
	$(YRUN) webpack $(WEBPACK_ARGS)

ts-all: TSC_ARGS+=--build --verbose --pretty .
ts-all: tsc

ts-lib: TSC_ARGS+=--build --verbose --pretty $(LIB_DIR)
ts-lib: tsc

ts-node:
	$(YRUN) ts-node $(TS_NODE_ARGS)

ts-web: TSC_ARGS+=--build src/ts
ts-web: tsc

tsc:
	$(TSC) $(TSC_ARGS)

clean-dist: TRASH_ARGS+=$(OUTPUT_DIR)
clean-dist: trash

clean-cache: TRASH_ARGS+=.cache/build-cache
clean-cache: trash

clean-lib: TRASH_ARGS+=$(LIB_OUT)
clean-lib: trash

clean-lint: TRASH_ARGS+=$(CACHE_DIR)/.eslintcache $(CACHE_DIR)/.stylelintcache
clean-lint: trash

trash:
	$(YRUN) trash $(TRASH_ARGS)

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
