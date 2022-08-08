import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString} from '../../functions'
import {useContext, useState, useEffect} from 'react'
import {api_routes} from '../../config'
import {GlobalContext} from '../../contexts/Global'

export default () => {
    const [dashboardData, setDashboardData] = useState()

    useEffect(async () => {
        const req = await fetch(api_routes.admin.dashboard)
        const {data} = await req.json()

        console.log(data)
        setDashboardData(data)
    }, [])

    if(!dashboardData){
        return (<></>)
    }

	return (
		<DashBoardTemplate>
			<div className = 'row my-4'>
                <div className="col-lg-3 col-sm-12 col-md-6">
                    <div style = {{height: '130px'}} className = 'my-3 p-4 flex-v rounded-1x shadow bg-light-purple'>
                        <div className = 'flex-1'>
                            <div title = 'Total users' className = 'text-muted one-line'>Total users</div>
                            <h2 title = {new Intl.NumberFormat().format(dashboardData.users.length)} className = 'text-dark one-line pt-3'>{new Intl.NumberFormat().format(dashboardData.users.length)} user{dashboardData.users.length > 1 ? 's' : ''}</h2>
                        </div>
                        <div>
                            <p className = 'text-muted flex-h a-i-c m-0'>
                                <a href = './users' className = 'underline-0 flex-1 one-line text-action'>See users</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-12 col-md-6">
                    <div style = {{height: '130px'}} className = 'my-3 p-4 flex-v rounded-1x shadow bg-light-blue'>
                        <div className = 'flex-1'>
                            <div title = 'All contents' className = 'text-muted one-line'>All stock</div>
                            <h2 title = {new Intl.NumberFormat().format(dashboardData.stocks.length)} className = 'text-dark one-line pt-3'>{new Intl.NumberFormat().format(dashboardData.stocks.length)} stock</h2>
                        </div>
                        <div>
                            <p className = 'text-muted flex-h a-i-c m-0'>
                                <a href = './stock' className = 'underline-0 flex-1 one-line text-action'>See stock</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-12 col-md-6">
                    <div style = {{height: '130px'}} className = 'my-3 p-4 flex-v rounded-1x shadow bg-light-creame'>
                        <div className = 'flex-1'>
                            <div title = 'Total creators' className = 'text-muted one-line'>Total products</div>
                            <h2 title = {new Intl.NumberFormat().format(dashboardData.products.length)} className = 'text-dark one-line pt-3'>{new Intl.NumberFormat().format(dashboardData.products.length)} product{dashboardData.products.length > 1 ? 's' : ''}</h2>
                        </div>
                        <div>
                            <p className = 'text-muted flex-h a-i-c m-0'>
                                <a href = './products' className = 'underline-0 flex-1 one-line text-action'>See products</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-12 col-md-6">
                    <div style = {{height: '130px'}} className = 'my-3 p-4 flex-v rounded-1x shadow bg-light-green'>
                        <div className = 'flex-1'>
                            <div title = 'Total companies' className = 'text-muted one-line'>Total companies</div>
                            <h2 title = {new Intl.NumberFormat().format(dashboardData.companies.length)} className = 'text-dark one-line pt-3'>{new Intl.NumberFormat().format(dashboardData.companies.length)} compan{dashboardData.companies.length > 1 ? 'ies' : 'y'}</h2>
                        </div>
                        <div>
                            <p className = 'text-muted flex-h a-i-c m-0'>
                                <a href = './companies' className = 'underline-0 flex-1 one-line text-action'>See companies</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .bg-light-purple{
                    background: #e9d6f3bd;
                }
                .bg-light-creame{
                    background: #f3efd5bd;
                }
                .bg-light-green{
                    background: #cdf3e3bd;
                }
                .bg-light-blue{
                    background: #cde7f3bd;
                }
                .text-light-purple{
                    color: #ac21f5;
                }
                .text-light-wine{
                    color: #e84444;
                }
                .text-light-creame{
                    color: #f1d625;
                }
                .text-light-green{
                    color: #1fef97;
                }
                .text-light-blue{
                    color: #25acea;
                }
            `}</style>
		</DashBoardTemplate>		
	)
}

export const getServerSideProps = (context) => {
    const {req: {cookies}} = context
    const cookie = cookies['OLLYMANN_INVENTORY'] ? JSON.parse(decryptString(cookies['OLLYMANN_INVENTORY'])) : undefined

    if(!cookie){
        return {
            redirect: {
                destination: '/login'
            }
        }
    }
    else if(cookie.account_type === 'admins'){
        return {
            redirect: {
                destination: '../admin/dashboard'
            }
        }   
    }

    return {
        props: {
            userData: cookie,
            accountType: cookie.account_type
        }
    }
}