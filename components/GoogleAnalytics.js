import { useEffect } from 'react'
import { GA_TRACKING_ID } from '../utils/config'

export const GoogleAnalyticsHeader = () => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function _gtag(){dataLayer.push(arguments);}
    window.gtag = _gtag;
    _gtag('js', new Date());
    _gtag('config', GA_TRACKING_ID);
  }, [])

  /* Global Site Tag (gtag.js) - Google Analytics */
  return (
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
    />
  )
}
