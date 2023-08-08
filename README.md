# <div align="center">jTester</div>

jTester is a lightweight JavaScript code tester utility for the browser and Node.js. It provides a flexible way to perf test arbitrary code and exposes related performance informations.

## Installation

The main package's bundle uses the UMD format, meaning that it can be installed in multiple ways.  
An ESM-specific bundle is also available for use in modern projects.

### CDN (browser-only)

As this tool will often be used only temporary for testing purposes, the quickest way to add it to your codebase is by using a CDN-based script (which can be easily removed after testing).

```html
<script src="https://cdn.jsdelivr.net/npm/jtester-tool@latest/dist/jtester.min.js"></script>
```

### Package manager

However, you can also use a package manager to install jTester to your project.

```sh
npm i -D jtester-tool
```

```sh
yarn add -D jtester-tool
```

### Usage

When used as an IIFE (e.g. `<script>` tags), a `jtester` function is exposed in the global context and can be used directly.

```js
jtester().test(/* ... */)
```

The package can also be imported using CommonJS or ESM syntaxes.

```js
import jtester from 'jtester-tool' // ESM
// or
const jtester = require('jtester-tool') // CJS

jtester().test(/* ... */)
```

Each call of the jTester function returns a new `JTester` instance on which the `.test` method can be called to test inner code.

```js
const testData = []
for (let i = 0; i < 10000; i++) testData.push(Math.random())

jtester()
  .test(() => {
    testData.sort()
  })
  .showAnalysis()
```

Multiple tests can be executed at once by chaining the `.test` method multiple times.

```js
const testData = []
for (let i = 0; i < 10000; i++) testData.push(Math.random())

jtester()
  .test(() => {
    testData.sort()
  })
  .test(() => {
    testData.map((item) => Math.toFixed(3))
  })
  .test(() => {
    // ...
  })
  .showAnalysis()
```

Note that only the inner code of the `.test`-provided function will be analysed, which means that you need to isolate the tested code in this function to get accurate running informations.

## Configuration

jTester behavior can be customized by passing a configuration object to the `jTester` function.

```js
jtester({
  // configuration options...
})
```

All available options are described below.

### `autorun`

| type    | default |
| ------- | ------- |
| boolean | true    |

**_Defines the global running strategy._**

By default, code tests will be executed on-the-fly right away after they are defined through the `.test` method.  
Setting this option to `false` will prevent code tests to be executed directly. The execution must be triggered manually using the `.run` method in that case.

### `verbose`

| type    | default |
| ------- | ------- |
| boolean | false   |

**_Displays advanced informations about system and code tests._**

Set to `false` by default, it can be enabled to display advanced debug informations, like system and hardware-related infos.

> **:warning: Note:** Especially in browsers contexts, system or hardware-related informations are mostly based on properties that can be user-modified or are experimental features. They are only presented for testing and informational purposes.

## Public API

Here is the full list of the public properties and methods exposed by the jTester instance.

### Methods

Note: All methods that return a `JTester` object can be chained during calls.

### `.test`

**Signature** `.test(nameOrFn: string | Function, fn?: Function): JTester`

**Params**

- `nameOrFn` (required): Defines the test name in case of `string` given, or the code test otherwise (`function`).
- `fn` (optional): Required to define the code test if first argument is of type `string`.

**_Defines a test task._**

This method accepts a function as only argument which is internally executed and analysed.  
Each call to this method will automatically trigger the corresponding `testFn` function execution unless `autorun` configuration option is set to `false`.

### `.run`

**Signature** `.run(): JTester`

**_Runs previously defined test tasks._**

This method manually triggers tasks' execution. It is not needed if `autorun` configuration option is set to `true`.
It is chainable with other instance methods.

### `.showAnalysis`

**Signature** `.showAnalysis(): JTester`

**_Logs testing results._**

Method used to log performance results of previous test tasks in the console.  
It is chainable with other instance methods.

### `.log`

**Signature** `.log(): JTester`

**_Alias of `.showAnalysis`._**

### `.getAnalysis`

**Signature** `.getAnalysis(format: string = 'js'): Object | string`

**Params**

- `format` (optional): Defines output format for analysis data. Defaults to `js`.

**_Get analysis logs data._**

Use this method to retrieve analysis data using various formats.  
Accepts one `format` argument which must be one of: `js`, `json` or `xml`.

Here is the list of analysis properties returned by this method (applicable to all formats).

```js
{
  version: "x.x.x", // jTester version
  tests: [
    {
      name: 'test', // test name
      runtime: 0, // test's execution runtime (milliseconds)
    }
  ]
}
```

### Properties

/

## Licensing

This package is released under the [MIT](https://opensource.org/license/mit/) license.
