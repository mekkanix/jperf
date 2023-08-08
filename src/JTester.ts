import JTLogger from './JTLogger'
import { TestData, TestAnalysis, Config } from './types'
import { ANONYMOUS_TEST_NAME, PKG_VERSION } from './constants'
import { getRunningMode, getHardwareDetails } from './utils'
import { validTest } from './validator'


export default class JTester {
  _mode: string = getRunningMode()
  _hwDetails = getHardwareDetails()
  _config: Config
  _testData: TestData[] = []
  _logger: JTLogger

  constructor(config: Config) {
    this._config = config
    this._logger = new JTLogger(config.verbose, this._hwDetails)
  }
  _getFormattedAnalysis(): TestAnalysis {
    return {
      version: PKG_VERSION,
      tests: this._testData.map((test) => ({
        name: test.name,
        runtime: test.time,
      })),
    }
  }
  _formatAnalysisAsJSON() {
    return JSON.stringify(this._getFormattedAnalysis())
  }
  _formatAnalysisAsXML() {
    const analysis = this._getFormattedAnalysis()
    let output: string = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <analysis>
        <version>${analysis.version}</version>
        <tests>
    `.trim()
    for (const test of this._testData)
      output += `
        <test>
          <name>${test.name}</name>
          <runtime>${test.time}</runtime>
        </test>
      `.trim()
    output += `
        </tests>
      </analysis>
    `.trim()
    // const matches = output.matchAll()
    // output.replace(/>[ \r\n]+</gi, (m, p) => {
    //   console.log(m, p);
    //   return 
    // })
    return output
  }
  test(nameOrFn: string | Function, fn?: Function): JTester {
    if (validTest(nameOrFn, fn)) {
      const func = typeof nameOrFn === 'function' ? nameOrFn : fn
      const nb: number = this._testData.length
      const name =
        typeof nameOrFn === 'function'
          ? `${ANONYMOUS_TEST_NAME} #${nb}`
          : nameOrFn
      const test: TestData = {
        fn: func,
        name,
        time: 0,
        processed: false,
      }
      this._testData.push(test)
      if (this._config.autorun) this.run()
      return this
    }
  }
  run(): JTester {
    this._testData = this._testData.map((test) => {
      if (!test.processed) {
        const start = new Date().getTime()
        test.fn()
        const end = new Date().getTime()
        test.time = end - start
        test.processed = true
      }
      return test
    })
    return this
  }
  showAnalysis(): JTester {
    for (const [i, test] of this._testData.entries())
      if (test.processed) this._logger.addTest(test.name, test.time, test.fn)
    this._logger.log()
    return this
  }
  log(): JTester {
    return this.showAnalysis()
  }
  getAnalysis(format = 'js'): TestAnalysis | string {
    return {
      js: this._getFormattedAnalysis(),
      json: this._formatAnalysisAsJSON(),
      xml: this._formatAnalysisAsXML(),
    }[format]
  }
}
