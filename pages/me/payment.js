import AppLayout from '../../components/AppLayout'
import { withTranslation } from '../../i18n'

const PaymentPage = ({ t }) => {
  return (
    <AppLayout title={t('me.payment.title')}>
      {t('me.payment.title')}
    </AppLayout>
  )
}

PaymentPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(PaymentPage)
