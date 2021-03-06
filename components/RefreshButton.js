import Button from './Button'

const RefreshButton = ({ ...rest }) => (
  <Button
    variant="light"
    size="sm"
    {...rest}
  >
    <i className="fas fa-sync-alt" />
  </Button>
)

export default RefreshButton
