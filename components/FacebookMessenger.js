import { useContext, useEffect } from 'react'
import { I18nContext } from 'next-i18next'
import ErrorBoundary from './ErrorBoundary'
import { FACEBOOK_PAGE_ID } from '../utils/config'

export const FacebookRoot = () => {
  return (
    <div id="fb-root" />
  )
}

export const FacebookMessengerHeader = () => {
  const { i18n: { language } } = useContext(I18nContext)
  useEffect(() => {
    // Load Facebook SDK for JavaScript
    window.fbAsyncInit = function() {
      FB.init({
        xfbml: true,
        version: 'v9.0'
      });
    };

    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = `https://connect.facebook.net/${language.replace('-', '_')}/sdk/xfbml.customerchat.js`;
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, [language])
  return null
}

export const FacebookMessengerChatPlugin = () => {
  // Your Chat Plugin code
  return (
    <div suppressHydrationWarning>
      <ErrorBoundary>
        <div
          className="fb-customerchat"
          attribution="setup_tool"
          page_id={FACEBOOK_PAGE_ID}
          theme_color="#6699cc"
        />
      </ErrorBoundary>
    </div>
  )
}
