import BSButton from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

const Button = ({ loading, children, ...rest }) => (
  <BSButton
    disabled={loading}
    {...rest}
  >
    {loading ? (
      <Spinner
        as="span"
        animation="grow"
        size="sm"
      />
    ) : (
      children
    )}
  </BSButton>
)

export default Button
