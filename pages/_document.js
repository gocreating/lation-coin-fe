import Document, { Html, Head, Main, NextScript } from 'next/document'
import { FacebookRoot } from '../components/FacebookMessenger'
import { GoogleAdSenseHeader } from '../components/GoogleAdSense'

class LationDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link href="/fontawesome-free-5.15.1-web/css/fontawesome.min.css" rel="stylesheet" />
          <link href="/fontawesome-free-5.15.1-web/css/brands.min.css" rel="stylesheet" />
        </Head>
        <GoogleAdSenseHeader />
        <body>
          <FacebookRoot />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default LationDocument
