const { nextI18NextRewrites } = require('next-i18next/rewrites')

const localeSubpaths = {
  'en': 'en',
  'zh-TW': 'zh-TW',
}

module.exports = {
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
}