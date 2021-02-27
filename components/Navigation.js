import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { selectors as authSelectors, logout } from '../ducks/auth'
import { i18n, withTranslation, Link } from '../i18n'
import { API_HOST } from '../utils/config'

const Navigation = ({ t }) => {
  const dispatch = useDispatch()
  const isAuth = useSelector(authSelectors.getIsAuth)
  return (
    <>
      <Navbar collapseOnSelect expand="md">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>
              <Image
                src="/logo.png"
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link href="/" passHref>
                <Nav.Link>{t('navbar.title')}</Nav.Link>
              </Link>
              <Link href="/usage" passHref>
                <Nav.Link>{t('navbar.usage')}</Nav.Link>
              </Link>
              <Link href="/pricing" passHref>
                <Nav.Link>{t('navbar.pricing')}</Nav.Link>
              </Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={() => i18n.changeLanguage('en')}>English</Nav.Link>
              <Nav.Link onClick={() => i18n.changeLanguage('zh-TW')}>中文</Nav.Link>
              {isAuth ? (
                <Nav.Link as={Button} variant="light" onClick={() => dispatch(logout())}>
                  {t('navbar.logout')}
                </Nav.Link>
              ) : (
                <Link href={`${API_HOST}/auth/line`} passHref>
                  <Nav.Link as={Button} variant="success" style={{ color: 'white' }}>
                    <i className="fab fa-line fa-lg"></i> {t('navbar.lineLogin')}
                  </Nav.Link>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

Navigation.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(Navigation)
