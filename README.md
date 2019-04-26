# simple-node-env
A tiny package that load the environment variables from file

## How to install
```npm install simple-node-env -S```

```yarn add simple-node-env```

## How to use

1. create a .env file in the current directory of the project.by default it read from the current directory. if you create in some other directory then pass the envpath in option

2. require the simple-node-env as soon as you code runs

    ``` require('simple-node-env')()```


## Extra configuration
``` require('simple-node-env')(options)```

### Options

#### envPath

Default: `path.resolve(process.cwd(), '.env')`

You may specify a custom path if your file containing environment variables is located elsewhere.

```js
require('simple-node-env')({ envPath: '/full/path/to/your/env/file' })
```

#### Encoding

Default: `utf8`

You may specify the encoding of your file containing environment variables.

```js
require('simple-node-env')({ encoding: 'latin1' })
```

#### Debug

Default: `false`

You may turn on logging to help debug why certain keys or values are not being set as you expect.

```js
require('simple-node-env')({ debug: process.env.DEBUG })
```

#### Overwrite

Default: `false`

In few scenerio you may want to overwrite the envirment variable if it is already exist

```js
require('simple-node-env')({ overwrite: true })
