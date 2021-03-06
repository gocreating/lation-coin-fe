import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

const RefreshButton = ({ loading, ...rest }) => (
  <Button
    variant="light"
    size="sm"
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
      <i className="fas fa-sync-alt" />
    )}
  </Button>
)

export default RefreshButton
