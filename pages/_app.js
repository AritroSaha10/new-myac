import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

import dynamic from 'next/dynamic';
const ProgressBar = dynamic(() => import('../components/LoadingBar'), { ssr: false });

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <AnimatePresence exitBeforeEnter>
      <Component key={router.pathname} {...pageProps} />
      <ProgressBar />
    </AnimatePresence>
  )
}

export default MyApp
