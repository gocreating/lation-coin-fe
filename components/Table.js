import styled, { css } from 'styled-components'
import BSTable from 'react-bootstrap/Table'

const Table = styled(BSTable)`
  margin-bottom: 0px;

  & > thead > tr > td {
    border-top: 0px;
  }
`

const StyledTh = styled.td`
  white-space: nowrap;

  ${props => props.sortable && css`
    cursor: pointer;
  `}
`

export const Th = ({ sortable, sortedDirection, children, ...rest }) => {
  return (
    <StyledTh sortable={sortable} {...rest}>
      {children}
      {sortable && (
        <span>
          {' '}
          {!sortedDirection && (
            <i className="fas fa-sort" />
          )}
          {sortedDirection === 'ascending' && (
            <i className="fas fa-sort-amount-up-alt" />
          )}
          {sortedDirection === 'descending' && (
            <i className="fas fa-sort-amount-down" />
          )}
        </span>
      )}
    </StyledTh>
  )
}


export default Table
