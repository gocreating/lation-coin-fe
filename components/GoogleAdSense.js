import { useEffect } from 'react'
import { adUnitIdMap, ADSENSE_CLIENT_ID } from '../utils/config'

export const GoogleAdSenseHeader = () => {
  return (
    <script
      data-ad-client={ADSENSE_CLIENT_ID}
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    />
  )
}

export const GoogleAdSenseAdUnit = ({ adUnitId }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={adUnitId}
      data-ad-format="auto"
      data-full-width-responsive="true"
      data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
    />
  )
}

GoogleAdSenseAdUnit.defaultProps = {
  adUnitId: adUnitIdMap.adunit_official_site_banner,
}
