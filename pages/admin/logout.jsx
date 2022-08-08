import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString, cookieStore} from '../../functions'
import {useRouter} from 'next/router'

export default () => {
	const {back: goBack} = useRouter()

	return (
		<DashBoardTemplate>
			<div className = 'row'>
				<div className = 'bg-white pt-5 pb-4 mb-5 px-3 col-12 rounded-1x shadow'>
					<div className = 'col-12 mb-2'>
						<div className = 'text-capitalize bold letter-spacing-1 mb-2'>logout</div>
						<p className = 'mb-4 text-muted'>All progress has been saved. No data will be lost!</p>
					</div>
					<div className = 'flex-h a-i-c'>
						<div className = 'col-12 col-sm-auto mb-2'>
							<input onClick = {() => cookieStore.setCookie({
								name: 'OLLYMANN_INVENTORY',
								value: undefined,
								expires: new Date().getTime() - (3600 * 24 * 30 * 1000),
								path: '/'
							}).then(() => window.location = '/')} type = 'button' className = 'py-3 rounded-1x text-white bold letter-spacing-1 shadow px-5 btn-danger btn border text-capitalize' defaultValue = 'logout' />
						</div>
						<div className = 'col-12 col-sm-auto mb-2'>
							<input onClick = {() => goBack()} type = 'button' className = 'py-3 rounded-1x text-danger bold letter-spacing-1 px-5 bg-clear border text-capitalize' defaultValue = 'cancel' />
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