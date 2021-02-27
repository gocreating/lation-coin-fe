import Jumbotron from 'react-bootstrap/Jumbotron'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'

const HomePage = ({ t }) => {
  return (
    <AppLayout title={t('home.title')} titleSuffix={false}>
      <Jumbotron>
        <h2>{t('home.title')}</h2>
        <p>{t('home.description')}</p>
      </Jumbotron>
    </AppLayout>
  )
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(HomePage)
