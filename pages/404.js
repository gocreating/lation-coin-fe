import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import AppLayout from '../components/AppLayout'
import { withTranslation } from '../i18n'

const NotFoundPage = ({ t }) => {
  return (
    <AppLayout title={t('404.title')}>
      <Jumbotron>
        <Container>
          <h1>{t('404.title')}</h1>
          <p>{t('404.description')}</p>
        </Container>
      </Jumbotron>
    </AppLayout>
  )
}

export default withTranslation('common')(NotFoundPage)
