import React from 'react'
import { Switch, Route, useRouteMatch, Redirect } from 'react-router'
import NavsAdmin from '../../components/navsAdmin'
import AdminDashboard from './adminDashboard'
import AdminOrder from './adminOrder'
import AdminReport from './adminReport'
import MasterProduct from './masterProduct'
import MasterStock from './masterStock'
import MasterUser from './masterUser'
import { useSelector } from 'react-redux'
export default function Admin() {
    const { path } = useRouteMatch()
    const { id_role, username } = useSelector(state => state.user)
    if(id_role!==2||!username)return <Redirect to='/'/>
    return (
        <>
            <NavsAdmin/>
            <Switch>
                <Route path={path + '/dashboard'} exact component={AdminDashboard} />
                <Route path={path + '/orders'} exact component={AdminOrder} />
                <Route path={path + '/reports'} exact component={AdminReport} />
                <Route path={path + '/products'} exact component={MasterProduct} />
                <Route path={path + '/stocks'} exact component={MasterStock} />
                <Route path={path + '/users'} exact component={MasterUser} />
            </Switch>
        </>
    )
}