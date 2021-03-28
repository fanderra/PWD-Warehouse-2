import React from 'react'
import { Dropdown, Pagination } from 'react-bootstrap'

export default function PaginationComp({ setPage, page, length, perPage, setOrderBy, orderBy, children, orderBySelection = ['latest', 'oldest'] }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                <Pagination style={{ margin: '10px' }} >
                    <Pagination.Prev disabled={page <= 0} onClick={() => setPage(page - 1)} />
                    <Pagination.Item disabled>{page + 1}</Pagination.Item>
                    <Pagination.Next disabled={length < perPage} onClick={() => setPage(page + 1)} />
                </Pagination>
                <Dropdown>
                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                        Order by : {orderBy}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    {orderBySelection.map(i =>
                        <Dropdown.Item key={i} onClick={() => {
                            setPage(0)
                            setOrderBy(i)
                        }}>{i}</Dropdown.Item>
                    )}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            {children}
        </div>
    )
}
