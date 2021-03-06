import BSSpinner from 'react-bootstrap/Spinner'

const Spinner = () => (
  <div className="text-center" style={{ minHeight: 200 }}>
    <BSSpinner
      animation="border"
      role="status"
      style={{ marginTop: '2rem' }}
    >
      <span className="sr-only">Loading...</span>
    </BSSpinner>
  </div>
)

export default Spinner
