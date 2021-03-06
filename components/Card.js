import styled from 'styled-components'
import BSCard from 'react-bootstrap/Card'

const Card = styled(BSCard)`
  margin-bottom: 2rem;
`

Card.Header = styled(BSCard.Header)`
  display: flex;
  align-items: center;
`

export default Card
