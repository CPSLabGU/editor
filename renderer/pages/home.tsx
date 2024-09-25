import React from 'react'
import Head from 'next/head'
import App from './_components/app/App'

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <App />
    </React.Fragment>
  )
}
