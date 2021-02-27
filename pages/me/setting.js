import AppLayout from '../../components/AppLayout'
import { withTranslation } from '../../i18n'

const SettingPage = ({ t }) => {
  return (
    <AppLayout title={t('me.setting.title')} titleSuffix={false}>
      {t('me.setting.title')}
    </AppLayout>
  )
}

SettingPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(SettingPage)
