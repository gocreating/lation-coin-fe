import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'

const ErrorPage = ({ t }) => {
  return (
    <AppLayout title={t('error.title')}>
      <Jumbotron>
        <Container>
          <h1>{t('error.title')}</h1>
          <p>{t('error.description')}</p>
        </Container>
      </Jumbotron>
    </AppLayout>
  )
}

export default withTranslation('common')(ErrorPage)
