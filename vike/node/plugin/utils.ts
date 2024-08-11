// Utils needed by Vike's Vite plugin.

// We assume all runtime entries will load this utils.ts file
import { onLoad } from './onLoad.js'
onLoad()

// We tolerate the fact that we load all of the runtime utils even though some of it isn't needed
export * from '../runtime/utils.js'

// Utils only needed by `plugin/*`
export * from '../../utils/viteIsSSR.js'
export * from '../../utils/requireResolve.js'
export * from '../../utils/includes.js'
export * from '../../utils/isDev.js'
export * from '../../utils/getMostSimilar.js'
export * from '../../utils/getRandomId.js'
export * from '../../utils/joinEnglish.js'
export * from '../../utils/escapeRegex.js'
export * from '../../utils/stripAnsi.js'
export * from '../../utils/trimWithAnsi.js'
export * from '../../utils/removeEmptyLines.js'
export * from '../../utils/findPackageJson.js'
export * from '../../utils/getPropAccessNotation.js'
export * from '../../utils/deepEqual.js'
export * from '../../utils/assertKeys.js'
export * from '../../utils/injectRollupInputs.js'
export * from '../../utils/humanizeTime.js'
export * from '../../utils/pLimit.js'
export * from '../../utils/assertVersion.js'
export * from '../../utils/assertPathFilesystemAbsolute.js'
export * from '../../utils/isArray.js'
export * from '../../utils/PROJECT_VERSION.js'
