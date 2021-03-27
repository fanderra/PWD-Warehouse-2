import React from 'react'
import { Switch, Route, useRouteMatch, Redirect } from 'react-router'
import Navs from '../../components/navs'
import Canceled from './canceled'
import Completed from './completed'
import Pending from './pending'
import Delivery from './delivery'
import Confirmed from './confirmed'
import { useSelector } from 'react-redux'
export default function History() {
    const { path } = useRouteMatch()
    const { username,id_status, id_role } = useSelector(state => state.user)
    if(id_status!==2||!username || +id_role !== 1)return <Redirect to='/'/>
    return (
        <>
            <Navs/>
            <Switch>
                <Route path={path + '/pending'} exact component={Pending} />
                <Route path={path + '/confirmed'} exact component={Confirmed} />
                <Route path={path + '/delivery'} exact component={Delivery} />
                <Route path={path + '/completed'} exact component={Completed} />
                <Route path={path + '/canceled'} exact component={Canceled} />
            </Switch>
        </>
    )
}
