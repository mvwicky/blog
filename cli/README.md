cli
===

Blog cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/cli)
[![CircleCI](https://circleci.com/gh/mvwicky/blog/tree/master.svg?style=shield)](https://circleci.com/gh/mvwicky/blog/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/cli.svg)](https://npmjs.org/package/cli)
[![License](https://img.shields.io/npm/l/cli.svg)](https://github.com/mvwicky/blog/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cli
$ blog COMMAND
running command...
$ blog (-v|--version|version)
cli/0.0.0 darwin-x64 node-v12.16.2
$ blog --help [COMMAND]
USAGE
  $ blog COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`blog hello [FILE]`](#blog-hello-file)
* [`blog help [COMMAND]`](#blog-help-command)

## `blog hello [FILE]`

describe the command here

```
USAGE
  $ blog hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ blog hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/mvwicky/blog/blob/v0.0.0/src/commands/hello.ts)_

## `blog help [COMMAND]`

display help for blog

```
USAGE
  $ blog help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src/commands/help.ts)_
<!-- commandsstop -->
