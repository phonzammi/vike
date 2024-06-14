// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM from 'react-dom/client'
import { Layout } from './Layout'

let root
async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext

  const page = (
    <Layout>
      <Page {...pageProps} />
    </Layout>
  )

  const container = document.getElementById('react-container')
  // SPA
  if (container.innerHTML === '' || !pageContext.isHydration) {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(page)
    // SSR
  } else {
    root = ReactDOM.hydrateRoot(container, page)
  }
}
