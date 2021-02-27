import AppLayout from '../../components/AppLayout'
import { withTranslation } from '../../i18n'

const ReportPage = ({ t }) => {
  return (
    <AppLayout title={t('me.report.title')} titleSuffix={false}>
      {t('me.report.title')}
    </AppLayout>
  )
}

ReportPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(ReportPage)
