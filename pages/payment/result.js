import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import AppLayout from '../../components/AppLayout'
import { withTranslation } from '../../i18n'
import { StatusEnum } from '../../constants/index'

const PaymentResultPage = ({ t }) => {
  const router = useRouter()
  const [paymentDescription, setPaymentDescription] = useState('')
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const query = router.query
  useEffect(() => {
    if (query.status === `${StatusEnum.SUCCESS}`) {
      setIsPaymentSuccess(true)
    } else if (query.status === `${StatusEnum.FAILED}`) {
      setIsPaymentSuccess(false)
      setPaymentDescription(query.error)
    }
  }, [query])
  return (
    <AppLayout title={t('paymentResult:title')} noAd>
      {isPaymentSuccess ? (
        <Alert variant="success">
          <Alert.Heading>{t('paymentResult:paymentSuccess.title')}</Alert.Heading>
          <p>{t('paymentResult:paymentSuccess.description')}</p>
          <hr />
          <Link href="/me/payment" passHref>
            <Button variant="outline-success">
              {t('paymentResult:paymentSuccess.cta')}
            </Button>
          </Link>
        </Alert>
      ) : (
        <Alert variant="danger">
          <Alert.Heading>{t('paymentResult:paymentError.title')}</Alert.Heading>
          <p>{paymentDescription}</p>
          <hr />
          <Link href="/pricing" passHref>
            <Button variant="secondary">
              {t('paymentResult:paymentError.cta')}
            </Button>
          </Link>
        </Alert>
      )}
    </AppLayout>
  )
}

PaymentResultPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'paymentResult'],
})

export default withTranslation(['common', 'paymentResult'])(PaymentResultPage)
