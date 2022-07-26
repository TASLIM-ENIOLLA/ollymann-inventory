import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString} from '../../functions'
import {Button} from '../../components/authentication'

export default () => {
	return (
		<DashBoardTemplate>
			<div className = ''>
				<div className = 'mb-4'>
					<p className = 'bold text-primary p-4 rounded-1x bg-white mb-4 shadow-sm w-auto d-block'>Stock Data</p>
					<div className = 'row'>
						<div className = 'col-lg-6 mb-4'>
							<span className = 'mb-2 d-inline-block'>Name</span>
							<input className = 'd-block w-100 form-control p-4' />
						</div>
						<div className = 'col-lg-6 mb-4'>
							<span className = 'mb-2 d-inline-block'>Product</span>
							<input className = 'd-block w-100 form-control p-4' />
						</div>
						<div className = 'col-lg-6 mb-4'>
							<span className = 'mb-2 d-inline-block'>Quantity</span>
							<input className = 'd-block w-100 form-control p-4' />
						</div>
						<div className = 'col-lg-6 mb-4'>
							<span className = 'mb-2 d-inline-block'>Price</span>
							<input className = 'd-block w-100 form-control p-4' />
						</div>
					</div>
				</div>
				<div className = 'mb-4'>
					<p className = 'bold text-primary p-4 rounded-1x bg-white mb-4 shadow-sm w-auto d-block'>Customer Data</p>
					<div className = 'row'>
						<div className = 'col-lg-6 mb-4'>
							<span className = 'mb-2 d-inline-block'>Name</span>
							<input className = 'd-block w-100 form-control p-4' />
						</div>
						<div className = 'col-lg-6 mb-4'>
							<span className = 'mb-2 d-inline-block'>Phone Number</span>
							<input className = 'd-block w-100 form-control p-4' />
						</div>
						<div className = 'col-lg-12 mb-4'>
							<span className = 'mb-2 d-inline-block'>Email Address</span>
							<input className = 'd-block w-100 form-control p-4' />
						</div>
						<div className = 'col-lg-12 mb-4'>
							<span className = 'mb-2 d-inline-block'>Delivery Address</span>
							<textarea rows = '5' className = 'd-block resize-0 w-100 form-control p-4'></textarea>
						</div>
						<div className = 'col-12 mb-4 pt-3'>
							<Button className = 'py-3 px-5 btn btn-success text-capitalize'>save stock</Button>
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