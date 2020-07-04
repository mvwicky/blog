SHELL:=bash
.ONESHELL:
.SHELLFLAGS:=-eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

VERSION=$(shell jq -r .version package.json)
VERSION_TAG=v$(VERSION)

.PHONY: prod-assets
prod-assets:
	yarn npm-run-all clean build:assets

version:
	@echo $(VERSION_TAG)

version-tag:
	git tag $(VERSION_TAG)
