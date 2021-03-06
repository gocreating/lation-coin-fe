import round from 'lodash/round'
import format from 'date-fns/format'
import getTime from 'date-fns/getTime'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import parseISO from 'date-fns/parseISO'
import zhTWLocale from 'date-fns/locale/zh-TW'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import AppLayout from '../../components/AppLayout'
import Spinner from '../../components/Spinner'
import {
  cancelBitfinexFundingOffer,
  getBitfinexWallets,
  getBitfinexFundingOffers,
  getBitfinexFundingCredits,
  getState,
  selectors as fundingSelectors,
} from '../../ducks/funding'
import { formatUSD } from '../../utils/format'
import { withTranslation } from '../../i18n'

const FundingPage = ({ t }) => {
  const dispatch = useDispatch()

  const state = useSelector(fundingSelectors.getState)
  const getStateMeta = useSelector(fundingSelectors.getGetStateMeta)
  const wallets = useSelector(fundingSelectors.getBitfinextWallets)
  const getWalletsMeta = useSelector(fundingSelectors.getGetBitfinexWalletsMeta)
  const offers = useSelector(fundingSelectors.getBitfinexFundingOffers)
  const getOffersMeta = useSelector(fundingSelectors.getGetBitfinexFundingOffersMeta)
  const credits = useSelector(fundingSelectors.getBitfinexFundingCredits)
  const getCreditsMeta = useSelector(fundingSelectors.getGetBitfinexFundingCreditsMeta)

  const fetchState = () => dispatch(getState())
  const fetchBitfinexWallets = () => dispatch(getBitfinexWallets())
  const fetchBitfinexFundingOffers = (symbol) => dispatch(getBitfinexFundingOffers(symbol))
  const fetchBitfinexFundingCredits = (symbol) => dispatch(getBitfinexFundingCredits(symbol))

  useEffect(() => {
    fetchState()
    fetchBitfinexWallets()
    fetchBitfinexFundingOffers('fUSD')
    fetchBitfinexFundingCredits('fUSD')
  }, [])

  const fundingWallet = wallets.find(wallet => wallet.wallet_type === 'funding')

  return (
    <AppLayout title={t('me.funding.title')}>
      <Card border="info" style={{ marginBottom: '2rem' }}>
        <Card.Header>總覽</Card.Header>
        {getStateMeta.isRequesting || getWalletsMeta.isRequesting ? (
          <Spinner />
        ) : (
          <Card.Body>
            <Row>
              <Col xs={12} md={3}>
                融資錢包總餘額
                <h3>
                  <Badge pill variant="info">
                    {formatUSD(round(fundingWallet?.balance, 2))}
                  </Badge>
                </h3>
              </Col>
              <Col xs={12} md={3}>
                融資錢包可用餘額
                <h3>
                  <Badge pill variant="info">
                    {formatUSD(round(fundingWallet?.available_balance, 2))}
                  </Badge>
                </h3>
              </Col>
              <Col xs={12} md={3}>
                目前最佳年化利率
                <h3>
                  <Badge pill variant="info">
                    {`${round(state.funding_market_recommended_ask_rate * 365 * 100, 1).toFixed(1)}%`}
                  </Badge>
                </h3>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>

      <Card>
        <Card.Header>已提供資金</Card.Header>
        {getCreditsMeta.isRequesting ? (
          <Spinner />
        ) : (
          <Table responsive="lg">
            <thead>
              <tr>
                <th></th>
                <th style={{ whiteSpace: 'nowrap' }}>數量</th>
                <th style={{ whiteSpace: 'nowrap' }}>日息</th>
                <th style={{ whiteSpace: 'nowrap' }}>日利率</th>
                <th style={{ whiteSpace: 'nowrap' }}>年化利率</th>
                <th style={{ whiteSpace: 'nowrap' }}>出借期間</th>
                <th style={{ whiteSpace: 'nowrap' }}>剩餘出借時間</th>
                <th style={{ whiteSpace: 'nowrap' }}>成交時間</th>
                <th style={{ whiteSpace: 'nowrap' }}>倉位</th>
              </tr>
            </thead>
            <tbody>
              {credits.map((credit, index) => {
                const now = new Date()
                const interestAmount = credit.amount * credit.rate
                const closeTime = new Date(getTime(parseISO(credit.mts_create)) + credit.period * 86400000)
                return (
                  <tr key={credit.id}>
                    <td>{`#${index + 1}`}</td>
                    <td>{round(credit.amount, 2).toFixed(2)}</td>
                    <td>{`${round(interestAmount, 3).toFixed(3)}`}</td>
                    <td>{`${round(credit.rate * 100, 5).toFixed(5)}%`}</td>
                    <td>{`${round(credit.rate * 100 * 365, 1).toFixed(1)}%`}</td>
                    <td>{`${credit.period} 天`}</td>
                    <td>
                      {closeTime < now
                        ? '結算中'
                        : formatDistanceToNowStrict(closeTime, { roundingMethod: 'floor', locale: zhTWLocale })
                      }
                    </td>
                    <td>{format(parseISO(credit.mts_create), 'yyyy/MM/dd HH:mm:ss')}</td>
                    <td>{credit.position_pair}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </AppLayout>
  )
}

FundingPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(FundingPage)
