import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString, cookieStore} from '../../functions'
import {useRouter} from 'next/router'

export default () => {
	const {back: goBack} = useRouter()

	return (
		<DashBoardTemplate>
			<div className = 'row'>
				<div className = 'col-12'>
					<div className = 'p-4 mx-auto animated slideInDown bg-white shadow rounded-2x' style = {{maxWidth: '500px'}}>
						<div>
							<p className = 'text-capitalize fo-s-15 bold text-muted text-center'>logout</p>
							<div className = 'py-3'>
								<p className = 'text-capitalize fo-s-15 text-dark text-center'>Are you sure you really want to logout?</p>
								<div className = 'row mt-5'>
									<div className = 'col-6'>
										<button onClick = {() => goBack()} className = 'd-block w-100 border border-danger text-danger bg-clear py-4 px-3 text-uppercase bold rounded-1x'>cancel</button>
									</div>
									<div className = 'col-6'>
										<button onClick = {() => cookieStore.setCookie({
											name: 'OLLYMANN_INVENTORY',
											value: undefined,
											expires: new Date().getTime() - (3600 * 24 * 30 * 1000),
											path: '/'
										}).then(() => window.location = '/')} className = 'd-block btn btn-success w-100 py-4 px-3 text-uppercase bold border-0 shadow'>logout</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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
	else if(cookie.account_type === 'users'){
		return {
			redirect: {
				destination: '../user/dashboard'
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