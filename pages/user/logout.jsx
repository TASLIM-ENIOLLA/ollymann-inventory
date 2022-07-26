import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString, cookieStore} from '../../functions'
import {useRouter} from 'next/router'

export default () => {
	const {back: goBack} = useRouter()

	return (
		<DashBoardTemplate>
			<div className = 'container-fluid'>
				<div className = 'row'>
					<div className = 'bg-white pt-5 pb-4 mb-5 fo-s-15 px-3 col-12 rounded-1x shadow'>
						<div className = 'col-12 mb-2'>
							<div className = 'text-capitalize bold letter-spacing-1 mb-2'>logout</div>
							<p className = 'mb-4 text-muted fo-s-15'>All progress has been saved. No data will be lost!</p>
						</div>
						<div className = 'flex-h a-i-c'>
							<div className = 'col-12 col-sm-auto mb-2'>
								<input onClick = {() => cookieStore.setCookie({
									name: 'OLLYMANN_INVENTORY',
									value: undefined,
									expires: new Date().getTime() - (3600 * 24 * 30 * 1000),
									path: '/'
								}).then(() => window.location = '/')} type = 'button' className = 'py-4 rounded-1x text-white bold letter-spacing-1 shadow px-5 btn-danger btn border text-capitalize' defaultValue = 'logout' />
							</div>
							<div className = 'col-12 col-sm-auto mb-2'>
								<input onClick = {() => goBack()} type = 'button' className = 'py-4 rounded-1x text-danger bold letter-spacing-1 px-5 bg-clear border text-capitalize' defaultValue = 'cancel' />
							</div>
						</div>
						
					</div>
					{/*<div className = 'col-12'>
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
					</div>*/}
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