import styled from 'styled-components'
import BSTable from 'react-bootstrap/Table'

const Table = styled(BSTable)`
  margin-bottom: 0px;

  & > thead > tr > td {
    border-top: 0px;
  }
`

export const Th = styled.td`
  white-space: nowrap;
`

export default Table
