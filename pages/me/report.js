import round from 'lodash/round'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import AppLayout from '../../components/AppLayout'
import Spinner from '../../components/Spinner'
import { getBitfinexInterestPayments, selectors as reportSelectors } from '../../ducks/report'
import { formatUSD } from '../../utils/format'
import { withTranslation } from '../../i18n'

const ReportPage = ({ t }) => {
  const dispatch = useDispatch()
  const payments = useSelector(reportSelectors.getBitfinexInterestPayments)
  const getPaymentsMeta = useSelector(reportSelectors.getGetBitfinexInterestPaymentsMeta);

  const fetchLedgers = (currency) => dispatch(getBitfinexInterestPayments(currency))

  useEffect(() => {
    fetchLedgers('USD')
  }, [])

  const totalPaymentAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const annualPercentageRate = payments.reduce((sum, payment) => (sum + payment.amount / payment.balance), 0) / payments.length

  return (
    <AppLayout title={t('me.report.title')} noAd>
      {getPaymentsMeta.isRequesting ? (
        <Spinner />
      ) : (
        <>
          <Card border="info" style={{ marginBottom: '2rem' }}>
            <Card.Header>最近30日USD融資收益</Card.Header>
            <Card.Body>
              <Row>
                <Col xs={6} md={3} lg={2}>
                  累計利息
                  <h3>
                    <Badge pill variant="info">
                      {formatUSD(round(totalPaymentAmount, 2))}
                    </Badge>
                  </h3>
                </Col>
                <Col xs={6} md={3}>
                  平均年化利率
                  <h3>
                    <Badge pill variant="info">
                      {`${round(annualPercentageRate * 100 * 365, 2).toFixed(2)}%`}
                    </Badge>
                  </h3>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Table responsive="lg">
            <thead>
              <tr>
                <th></th>
                <th style={{ whiteSpace: 'nowrap' }}>日期</th>
                <th style={{ whiteSpace: 'nowrap' }}>幣別</th>
                <th style={{ whiteSpace: 'nowrap' }}>利息</th>
                <th style={{ whiteSpace: 'nowrap' }}>餘額</th>
                <th style={{ whiteSpace: 'nowrap' }}>利率</th>
                <th style={{ whiteSpace: 'nowrap' }}>年化利率</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, i) => {
                return (
                  <tr key={payment.id}>
                    <td>{`#${i + 1}`}</td>
                    <td>{format(parseISO(payment.mts), 'yyyy/MM/dd HH:mm:ss')}</td>
                    <td>{payment.currency}</td>
                    <td>
                      {payment.amount?.toFixed(8)}
                    </td>
                    <td>
                      {payment.balance?.toFixed(8)}
                    </td>
                    <td>
                      {`${round((payment.amount / payment.balance) * 100, 5).toFixed(5)}%`}
                    </td>
                    <td>
                      {`${round((payment.amount / payment.balance) * 100 * 365, 2).toFixed(2)}%`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </>
      )}
    </AppLayout>
  )
}

ReportPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(ReportPage)
