import React from 'react'
import Head from 'next/head'
import App from '../components/app/App'
import { ThemeProvider } from '../components/ui/theme-provider'

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <App />
      </ThemeProvider>
    </React.Fragment>
  )
}
