import AppLayout from '../../components/AppLayout'
import { withTranslation } from '../../i18n'

const FundingPage = ({ t }) => {
  return (
    <AppLayout title={t('me.funding.title')}>
      {t('me.funding.title')}
    </AppLayout>
  )
}

FundingPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(FundingPage)
