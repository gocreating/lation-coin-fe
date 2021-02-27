import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import AppLayout from '../../components/AppLayout'
import { withTranslation } from '../../i18n'
import { StatusEnum } from '../../constants/index'

const AuthResultPage = ({ t }) => {
  const router = useRouter()
  const [loginError, setLoginError] = useState('')
  const query = router.query
  useEffect(() => {
    if (query.status === `${StatusEnum.SUCCESS}`) {
      router.push('/')
    } else if (query.status === `${StatusEnum.FAILED}`) {
      setLoginError(query.error)
    }
  }, [query])
  return loginError ? (
    <AppLayout title={t('auth.loginError.title')} noAd>
      <Alert variant="danger">
        <Alert.Heading>{t('auth.loginError.title')}</Alert.Heading>
        <p>{loginError}</p>
        <hr />
        <Link href="/" passHref>
          <Button variant="secondary">
            {t('auth.loginError.cta')}
          </Button>
        </Link>
      </Alert>
    </AppLayout>
  ) : null
}

AuthResultPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(AuthResultPage)
