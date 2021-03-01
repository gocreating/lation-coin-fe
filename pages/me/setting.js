import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import AppLayout from '../../components/AppLayout'
import { getUserBitfinexConfig, updateUserBitfinexConfig, selectors as userSelectors } from '../../ducks/user'
import { withTranslation } from '../../i18n'

const SettingPage = ({ t }) => {
  const dispatch = useDispatch()
  const getMeta = useSelector(userSelectors.getGetBitfinexConfigMeta)
  const updateMeta = useSelector(userSelectors.getUpdateBitfinexConfigMeta)
  const { reset, watch, control, handleSubmit } = useForm()
  const fUSDFieldArray = useFieldArray({
    control,
    name: `bitfinex.funding_strategy.symbol_strategy.fUSD.rate_to_period_rules`
  })
  const fetchUserSetting = useCallback(() => {
    dispatch(getUserBitfinexConfig((config) => {
      reset({ bitfinex: config })
    }))
  }, [dispatch, reset])

  useEffect(() => {
    fetchUserSetting()
  }, [fetchUserSetting])

  const handleSubmitBitfinexCredential = (config) => {
    if (getMeta.isRequesting) {
      alert('You cannot update settings before they are initialized')
    }
    dispatch(updateUserBitfinexConfig({
      api_key: config.bitfinex.api_key,
      api_secret: config.bitfinex.api_secret,
    }, () => {
      fetchUserSetting()
    }))
  }

  const handleSubmitBitfinexFundingStrategy = (config) => {
    if (getMeta.isRequesting) {
      alert('You cannot update settings before they are initialized')
    }
    dispatch(updateUserBitfinexConfig({
      funding_strategy: config.bitfinex.funding_strategy,
    }, () => {
      fetchUserSetting()
    }))
  }

  const symbol_strategy = watch('bitfinex.funding_strategy.symbol_strategy') || {}

  return (
    <AppLayout title={t('me.setting.title')} noAd>
      <Form>
        <legend>金鑰</legend>
        <Form.Group as={Row}>
          <Form.Label column sm={12} md={2}>API Key</Form.Label>
          <Col sm={12} md={10}>
            <Controller
              control={control}
              name="bitfinex.api_key"
              defaultValue=""
              render={({ onChange, value, ref }) => (
                <Form.Control
                  ref={ref}
                  onChange={e => onChange(e.target.value)}
                  value={value || ''}
                />
              )}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={12} md={2}>API Secret</Form.Label>
          <Col sm={12} md={10}>
            <Controller
              control={control}
              name="bitfinex.api_secret"
              defaultValue=""
              render={({ onChange, value, ref }) => (
                <Form.Control
                  ref={ref}
                  onChange={e => onChange(e.target.value)}
                  value={value || ''}
                />
              )}
            />
          </Col>
        </Form.Group>
        <Button variant="primary" onClick={handleSubmit(handleSubmitBitfinexCredential)}>
          測試並儲存
        </Button>
      </Form>
      <hr />
      <Form>
        <legend>放貸策略</legend>
        <Form.Group as={Row}>
          <Col sm={12} md={10}>
            <Controller
              control={control}
              name="bitfinex.funding_strategy.enabled"
              defaultValue={false}
              render={({ onChange, value, ref }) => (
                <Form.Check
                  ref={ref}
                  label="啟用所有貨幣的策略"
                  id="bitfinex.funding_strategy.enabled"
                  type="switch"
                  onChange={e => onChange(e.target.checked)}
                  checked={value}
                />
              )}
            />
          </Col>
        </Form.Group>
        {Object.entries(symbol_strategy).map(([symbol, strategy]) => {
          const { fields, remove, insert } = fUSDFieldArray
          return (
            <Form.Group key={symbol} as={Row}>
              <Form.Label column sm={12} md={2}>{symbol}</Form.Label>
              <Col sm={12} md={10}>
                <fieldset>
                  <Form.Group as={Row}>
                    <Col>
                      <Controller
                        control={control}
                        name={`bitfinex.funding_strategy.symbol_strategy.${symbol}.enabled`}
                        defaultValue={false}
                        render={({ onChange, value, ref }) => (
                          <Form.Check
                            ref={ref}
                            label={`啟用${symbol}的策略`}
                            id={`bitfinex.funding_strategy.symbol_strategy.${symbol}.enabled`}
                            type="switch"
                            onChange={e => onChange(e.target.checked)}
                            checked={value}
                          />
                        )}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={12} md={3}>保留金額</Form.Label>
                    <Col sm={12} md={2}>
                      <Controller
                        control={control}
                        name={`bitfinex.funding_strategy.symbol_strategy.${symbol}.amount_strategy.hold_amount`}
                        defaultValue={0}
                        render={({ onChange, value, ref }) => (
                          <Form.Control
                            ref={ref}
                            type="number" min={0} step={50}
                            onChange={e => onChange(parseFloat(e.target.value))}
                            value={value}
                          />
                        )}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={12} md={3}>最小每次委託金額</Form.Label>
                    <Col sm={12} md={2}>
                      <Controller
                        control={control}
                        name={`bitfinex.funding_strategy.symbol_strategy.${symbol}.amount_strategy.min_per_offer_amount`}
                        defaultValue={0}
                        render={({ onChange, value, ref }) => (
                          <Form.Control
                            ref={ref}
                            type="number" min={50} step={50}
                            onChange={e => onChange(parseFloat(e.target.value))}
                            value={value}
                          />
                        )}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={12} md={3}>最大每次委託金額</Form.Label>
                    <Col sm={12} md={2}>
                      <Controller
                        control={control}
                        name={`bitfinex.funding_strategy.symbol_strategy.${symbol}.amount_strategy.max_per_offer_amount`}
                        defaultValue={0}
                        render={({ onChange, value, ref }) => (
                          <Form.Control
                            ref={ref}
                            type="number" min={50} step={50}
                            onChange={e => onChange(parseFloat(e.target.value))}
                            value={value}
                          />
                        )}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm={12} md={3}>最低委託年化利率</Form.Label>
                    <Col sm={12} md={2}>
                      <Controller
                        control={control}
                        name={`bitfinex.funding_strategy.symbol_strategy.${symbol}.rate_strategy.min_per_offer_rate`}
                        defaultValue={0}
                        render={({ onChange, value, ref }) => (
                          <Form.Control
                            ref={ref}
                            type="number" min={0} max={2555} step={0.2}
                            onChange={e => onChange(parseFloat(e.target.value))}
                            value={value}
                          />
                        )}
                      />
                    </Col>
                  </Form.Group>
                  <hr />
                  {fields.length === 0 ? (
                    <Button size="sm" variant="outline-secondary" onClick={() => insert(0, {})}>新增天數規則</Button>
                  ) : (
                    fields.map((field, i) => {
                      const rules = watch(`bitfinex.funding_strategy.symbol_strategy.${symbol}.rate_to_period_rules`)
                      return (
                        <Form.Group key={field.id} as={Row}>
                          <Col lg={12} xl={2}>
                            <DropdownButton title={`編輯規則 #${i + 1}`} variant="outline-secondary" drop="down" size="sm">
                              <Dropdown.Item onClick={() => insert(i, {})}>向上新增天數規則</Dropdown.Item>
                              <Dropdown.Item onClick={() => insert(i + 1, {})}>向下新增天數規則</Dropdown.Item>
                              <Dropdown.Item onClick={() => remove(i)}>刪除此規則</Dropdown.Item>
                            </DropdownButton>
                          </Col>

                          <Col sm={12} xl={2}>
                            <Form.Control plaintext readOnly defaultValue="市場年化利率" />
                          </Col>
                          <Col sm={12} xl={2}>
                            <InputGroup>
                              <Controller
                                control={control}
                                name={`bitfinex.funding_strategy.symbol_strategy.${symbol}.rate_to_period_rules[${i}].gte_rate`}
                                defaultValue={rules[i].gte_rate}
                                render={({ onChange, value, ref }) => (
                                  <Form.Control
                                    ref={ref}
                                    type="number" min={0} max={2555} step={0.2}
                                    onChange={e => onChange(parseFloat(e.target.value))}
                                    value={value}
                                  />
                                )}
                              />
                              <InputGroup.Append>
                                <InputGroup.Text>%</InputGroup.Text>
                              </InputGroup.Append>
                            </InputGroup>
                          </Col>
                          <Col sm={12} xl={1}>
                            <Form.Control plaintext readOnly defaultValue="至" />
                          </Col>
                          <Col sm={12} xl={2}>
                            <InputGroup>
                              <Controller
                                control={control}
                                name={`bitfinex.funding_strategy.symbol_strategy.${symbol}.rate_to_period_rules[${i}].lt_rate`}
                                defaultValue={rules[i].lt_rate}
                                render={({ onChange, value, ref }) => (
                                  <Form.Control
                                    ref={ref}
                                    type="number" min={0} max={2555} step={0.2}
                                    onChange={e => onChange(parseFloat(e.target.value))}
                                    value={value}
                                  />
                                )}
                              />
                              <InputGroup.Append>
                                <InputGroup.Text>%</InputGroup.Text>
                              </InputGroup.Append>
                            </InputGroup>
                          </Col>
                          <Col sm={12} xl={1}>
                            <Form.Control plaintext readOnly defaultValue="時借出" />
                          </Col>
                          <Col sm={12} xl={2}>
                            <InputGroup>
                              <Controller
                                control={control}
                                name={`bitfinex.funding_strategy.symbol_strategy.${symbol}.rate_to_period_rules[${i}].period`}
                                defaultValue={rules[i].period}
                                render={({ onChange, value, ref }) => (
                                  <Form.Control
                                    ref={ref}
                                    type="number" min={2} max={120}
                                    onChange={e => onChange(parseInt(e.target.value))}
                                    value={value}
                                  />
                                )}
                              />
                              <InputGroup.Append>
                                <InputGroup.Text>天</InputGroup.Text>
                              </InputGroup.Append>
                            </InputGroup>
                          </Col>
                        </Form.Group>
                      )
                    })
                  )}
                </fieldset>
              </Col>
            </Form.Group>
          )
        })}
        <Button variant="primary" onClick={handleSubmit(handleSubmitBitfinexFundingStrategy)}>
          套用策略
        </Button>
      </Form>
    </AppLayout>
  )
}

SettingPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(SettingPage)
