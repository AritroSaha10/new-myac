import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
    <AnimatePresence exitBeforeEnter>
      <Component key={router.pathname} {...pageProps} />
    </AnimatePresence>
  )
}

export default MyApp
