import { NextSeo, ProductJsonLd } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Container from 'react-bootstrap/Container'
import { Trans } from 'react-i18next'
import { FacebookMessengerHeader, FacebookMessengerChatPlugin } from './FacebookMessenger'
import GlobalStatus from './GlobalStatus'
import { GoogleAnalyticsHeader } from './GoogleAnalytics'
import { GoogleAdSenseAdUnit } from '../components/GoogleAdSense'
import Navigation from './Navigation'
import { withTranslation } from '../i18n'
import { adUnitIdMap } from '../utils/config'
import 'bootstrap/dist/css/bootstrap.min.css'

export const config = { amp: true }

const AppLayout = ({ t, title, titleSuffix, noContainer, noAd, children }) => {
  const router = useRouter()
  titleSuffix = titleSuffix === false ? '' : t('site.titleSuffix')
  return (
    <>
      <GlobalStatus />
      <NextSeo
        title={t('site.title')}
        description={t('site.description')}
        languageAlternates={[{
          hrefLang: 'en',
          href: `https://coin.lation.app/en${router.pathname}`,
        }, {
          hrefLang: 'zh-TW',
          href: `https://coin.lation.app/zh-TW${router.pathname}`,
        }]}
      />
      <Head>
        <title>{`${title}${titleSuffix}`}</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <ProductJsonLd
        productName={t('site.title')}
        description={t('site.description')}
        brand="Lation"
        images={[
          'https://coin.lation.app/logo.png',
          'https://lation.app/logo.png',
        ]}
        keywords={t('site.keywords')}
        offers={[]}
        reviews={[]}
        aggregateRating={{
          ratingValue: '5',
          reviewCount: '1',
        }}
      />
      <GoogleAnalyticsHeader />
      <FacebookMessengerHeader />
      <Navigation />
      {noContainer ? children : (
        <Container style={{ marginTop: '2rem', overflow: 'auto' }}>
          {children}
        </Container>
      )}
      {!noAd && (
        <Container style={{ marginTop: '2rem', overflow: 'auto' }}>
          <GoogleAdSenseAdUnit adUnitId={adUnitIdMap.adunit_coin_banner} />
        </Container>
      )}
      <footer style={{ marginTop: '2rem' }}>
        <Container>
          <hr />
          <p className="text-center text-secondary text-nowrap">
            <Trans
              t={t}
              i18nKey="footer.poweredBy"
              components={{
                brand: (
                  <a
                    className="text-secondary"
                    href="https://lation.app/"
                    target="_blank"
                  />
                ),
              }}
            />
          </p>
        </Container>
      </footer>
      <FacebookMessengerChatPlugin />
    </>
  )
}

AppLayout.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(AppLayout)
