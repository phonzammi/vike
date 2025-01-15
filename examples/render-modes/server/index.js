// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

import express from 'express'
import compression from 'compression'
import { renderPage, createDevMiddleware } from 'vike/server'
import { root } from './root.js'
const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  app.use(compression())

  if (isProduction) {
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/dist/client`))
  } else {
    const { devMiddleware } = await createDevMiddleware({ root })
    app.use(devMiddleware)
  }

  app.get('*', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)
    const { statusCode, headers, earlyHints, pipe } = pageContext.httpResponse

    // No JavaScript early hint <=> HTML-only without +client.js
    {
      const hasJavaScriptEarlyHint = earlyHints.some((h) => h.assetType === 'script')
      const htmlOnlyPage = '/html-only'
      const { urlPathname } = pageContext
      assert(
        !hasJavaScriptEarlyHint === [htmlOnlyPage, '/'].includes(urlPathname),
        `Unexpected early hints for the page ${urlPathname}`
      )
      assert(
        [htmlOnlyPage, '/', '/html-js', '/spa', '/ssr'].includes(urlPathname),
        'Assertion at server/index.js needs to be updated'
      )
    }

    if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
    headers.forEach(([name, value]) => res.setHeader(name, value))
    res.status(statusCode)
    pipe(res)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

function assert(condition, msg) {
  if (condition) return
  throw new Error(msg)
}
