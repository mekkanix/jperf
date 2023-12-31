import { UserConfig, Config } from './types'
import { DEFAULT_OUTPUT, ANONYMOUS_TEST_NAME, ANONYMOUS_TEST_IDX } from './constants'
import JPerf from './JPerf'
import { validConfig } from './validator'

const fillConfigDefaults = (config: UserConfig): Config => {
  const conf = config || {}
  return {
    autorun: conf.autorun !== undefined ? config.autorun : true,
    verbose: conf.verbose !== undefined ? config.verbose : false,
    hardwareDetails: conf.hardwareDetails !== undefined ? config.hardwareDetails : false,
    anonymousTestName: conf.anonymousTestName !== undefined ? config.anonymousTestName : ANONYMOUS_TEST_NAME,
    anonymousTestIndex: conf.anonymousTestIndex !== undefined ? config.anonymousTestIndex : ANONYMOUS_TEST_IDX,
    output: conf.output || DEFAULT_OUTPUT,
    selector: conf.selector || undefined
  }
}

export default function (config: UserConfig = {}): JPerf {
  if (validConfig(config)) {
    return new JPerf(fillConfigDefaults(config))
  }
}
