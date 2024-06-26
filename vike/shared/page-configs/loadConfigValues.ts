export { loadConfigValues }

import { objectAssign } from '../utils.js'
import type { PageConfigRuntime, PageConfigRuntimeLoaded } from './PageConfig.js'
import { parseConfigValuesSerialized } from './serialize/parsePageConfigs.js'

async function loadConfigValues(pageConfig: PageConfigRuntime, isDev: boolean): Promise<PageConfigRuntimeLoaded> {
  if (
    'isAllLoaded' in pageConfig &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigRuntimeLoaded
  }
  const configValuesLoaded = await pageConfig.loadConfigValuesAll()
  const configValues = parseConfigValuesSerialized(configValuesLoaded.configValuesSerialized)
  Object.assign(pageConfig.configValues, configValues)
  objectAssign(pageConfig, { isAllLoaded: true as const })
  return pageConfig
}
