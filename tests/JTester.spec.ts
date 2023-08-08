import { test, expect } from '@jest/globals'
import { TestAnalysis } from '@src/types'
import { PKG_VERSION } from '@src/constants'
import JTester from '@src/JTester'


let jtester: JTester

afterEach(() => {
  jtester = undefined
})

describe('JTester', () => {
  test('.test', () => {
    jtester = new JTester({ autorun: true, verbose: false })
    expect(jtester.test(() => { const foo = 'bar' })).toEqual(jtester)
  })
  test('.run', () => {
    jtester = new JTester({ autorun: true, verbose: false })
    expect(jtester.run()).toEqual(jtester)
  })
  test('.showAnalysis', () => {
    jtester = new JTester({ autorun: true, verbose: false })
    expect(jtester.showAnalysis()).toEqual(jtester)
  })
  test('.getAnalysis', () => {
    jtester = new JTester({ autorun: true, verbose: false })
    // JS
    const jsDefault = jtester.getAnalysis() as TestAnalysis
    const js = jtester.getAnalysis('js') as TestAnalysis
    expect(jsDefault).toHaveProperty('version')
    expect(jsDefault).toHaveProperty('tests')
    expect(jsDefault.tests.length).toBe(0)
    expect(js).toHaveProperty('version')
    expect(js).toHaveProperty('tests')
    expect(js.tests.length).toBe(0)
    // JSON
    const output = { version: PKG_VERSION, tests: [] }
    const json = JSON.parse(jtester.getAnalysis('json') as string)
    expect(json).toEqual(output)
    // XML
    // expect(jtester.getAnalysis('xml')).toHaveProperty('tests')
  })
})