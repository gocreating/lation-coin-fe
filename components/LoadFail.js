import styled from 'styled-components'
import Alert from 'react-bootstrap/Alert'

const StyledAlert = styled(Alert)`
  border-radius: 0px;
  margin-bottom: 0px;
`

const LoadFail = () => {
  return (
    <StyledAlert variant="warning">
      載入時發生問題。
    </StyledAlert>
  )
}

export default LoadFail
