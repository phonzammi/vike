export { build }

import { prepareViteApiCall } from './prepareViteApiCall.js'
import { build as buildVite } from 'vite'
import type { APIOptions } from './types.js'
import assert from 'assert'
import { isVikeCli } from '../cli/context.js'
import { isPrerendering } from '../prerender/context.js'

/**
 * Programmatically trigger `$ vike build`
 *
 * https://vike.dev/api#build
 */
async function build(options: APIOptions = {}): Promise<{}> {
  const { viteConfigEnhanced } = await prepareViteApiCall(options.viteConfig, 'build')

  // Pass it to autoFullBuild()
  if (viteConfigEnhanced) viteConfigEnhanced._viteConfigEnhanced = viteConfigEnhanced

  // 1. Build client-side
  // 2. Build server-side
  //    > See: https://github.com/vikejs/vike/blob/c6c7533a56b3a16fc43ed644fc5c10c02d0ff375/vike/node/plugin/plugins/autoFullBuild.ts#L90
  // 3. Pre-render (if enabled)
  //    > See: https://github.com/vikejs/vike/blob/c6c7533a56b3a16fc43ed644fc5c10c02d0ff375/vike/node/plugin/plugins/autoFullBuild.ts#L98
  //    > We purposely don't start the pre-rendering in this `build()` function but in a Rollup hook instead.
  //    > Rationale: https://github.com/vikejs/vike/issues/2123
  await buildVite(viteConfigEnhanced)

  // When using the Vike CLI with pre-rendering the process is forcefully exited at the end of the buildVite() call above
  assert(!(isVikeCli() && isPrerendering()))

  return {
    /* We don't return `viteConfig` because `viteConfigEnhanced` is `InlineConfig` not `ResolvedConfig`
    viteConfig: viteConfigEnhanced,
    */
  }
}
