import round from 'lodash/round'
import format from 'date-fns/format'
import getTime from 'date-fns/getTime'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import parseISO from 'date-fns/parseISO'
import zhTWLocale from 'date-fns/locale/zh-TW'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import BSCard from 'react-bootstrap/Card'
import BSSpinner from 'react-bootstrap/Spinner'
import BSTable from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import AppLayout from '../../components/AppLayout'
import RefreshButton from '../../components/RefreshButton'
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

const Card = styled(BSCard)`
  margin-bottom: 2rem;
`

Card.Header = styled(BSCard.Header)`
  display: flex;
  align-items: center;
`

const Table = styled(BSTable)`
  margin-bottom: 0px;

  & > thead > tr > td {
    border-top: 0px;
  }
`

const Th = styled.td`
  white-space: nowrap;
`

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
  const cancelOfferMetaMap = useSelector(fundingSelectors.getCancelBitfinexFundingOfferMetaMap)

  const handleCancelOfferClick = (offerId) => dispatch(cancelBitfinexFundingOffer(offerId))
  const fetchState = () => dispatch(getState())
  const fetchBitfinexWallets = () => dispatch(getBitfinexWallets())
  const fetchBitfinexFundingOffers = () => dispatch(getBitfinexFundingOffers('fUSD'))
  const fetchBitfinexFundingCredits = () => dispatch(getBitfinexFundingCredits('fUSD'))

  useEffect(() => {
    fetchState()
    fetchBitfinexWallets()
    fetchBitfinexFundingOffers()
    fetchBitfinexFundingCredits()
  }, [])

  const fundingWallet = wallets.find(wallet => wallet.wallet_type === 'funding')
  const dailyInterest = credits.reduce((sum, credit) => (sum + credit.amount * credit.rate), 0);

  return (
    <AppLayout title={t('me.funding.title')} noAd>
      <Card border="info">
        <Card.Header>
          總覽
          <RefreshButton
            loading={getStateMeta.isRequesting || getWalletsMeta.isRequesting}
            onClick={() => {
              fetchState()
              fetchBitfinexWallets()
            }}
          />
        </Card.Header>
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
              <Col xs={12} md={3}>
                預估每日利息
                <h3>
                  <Badge pill variant="info">
                    {formatUSD(round(dailyInterest * 0.85, 2))}
                  </Badge>
                </h3>
              </Col>
            </Row>
          </Card.Body>
        )}
      </Card>

      <Card>
        <Card.Header>
          {offers.length === 0 ? '出價及報價' : `出價及報價（${offers.length} 筆）`}
          <RefreshButton
            loading={getOffersMeta.isRequesting}
            onClick={() => fetchBitfinexFundingOffers()}
          />
        </Card.Header>
        {getOffersMeta.isRequesting ? (
          <Spinner />
        ) : (
          offers.length === 0 ? (
            <Card.Body>
              目前無出價及報價
            </Card.Body>
          ) :(
            <Table responsive="lg">
              <thead>
                <tr>
                  <Th>委託單號</Th>
                  <Th>委託類別</Th>
                  <Th>數量</Th>
                  <Th>日利率</Th>
                  <Th>年化利率</Th>
                  <Th>出借期間</Th>
                  <Th>操作</Th>
                </tr>
              </thead>
              <tbody>
                {offers.map(offer => {
                  const meta = cancelOfferMetaMap[offer.id] || {}
                  return (
                    <tr key={offer.id}>
                      <td>{offer.id}</td>
                      <td>{offer.symbol}</td>
                      <td>{round(offer.amount, 2).toFixed(2)}</td>
                      <td>{`${round(offer.rate * 100, 5).toFixed(5)}%`}</td>
                      <td>{`${round(offer.rate * 365 * 100, 1).toFixed(1)}%`}</td>
                      <td>{`${offer.period} 天`}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={meta.isRequesting}
                          onClick={() => handleCancelOfferClick(offer.id)}
                        >
                          {meta.isRequesting ? (
                            <BSSpinner
                              as="span"
                              animation="grow"
                              size="sm"
                            />
                          ) : (
                            <i className="fas fa-times" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )
        )}
      </Card>

      <Card>
        <Card.Header>
          {credits.length === 0 ? '已提供資金' : `已提供資金（${credits.length} 筆）`}
          <RefreshButton
            loading={getCreditsMeta.isRequesting}
            onClick={() => fetchBitfinexFundingCredits()}
          />
        </Card.Header>
        {getCreditsMeta.isRequesting ? (
          <Spinner />
        ) : (
          <Table responsive="lg">
            <thead>
              <tr>
                <Th />
                <Th>數量</Th>
                <Th>日息</Th>
                <Th>日利率</Th>
                <Th>年化利率</Th>
                <Th>出借期間</Th>
                <Th>剩餘出借時間</Th>
                <Th>成交時間</Th>
                <Th>倉位</Th>
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
