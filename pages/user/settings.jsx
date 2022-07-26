import {useState, useContext, useEffect} from 'react'
import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString} from '../../functions'
import {api_routes} from '../../config'
import {GlobalContext} from '../../contexts/Global'

export default () => {
	const {userData: {id}} = useContext(GlobalContext)
	const [userData, setUserData] = useState()

	useEffect(async () => {
		const formData = new FormData()
			  formData.append('id', id)

		const req = await fetch(api_routes.user.getUserData, {method: 'POST', body: formData})
		const {data} = await req.json()

		setUserData(data)
	}, [])

	return (
		<DashBoardTemplate>
			<div className = 'row'>
				<div className = 'col-12 mb-5'>
					<div className = 'bg-white p-4 rounded-1x shadow bold theme-color text-uppercase'>
						User Profile
					</div>
				</div>
				<div className = 'col-12 mb-5'>
					<ProfileImage />
				</div>
				<div className = 'mb-5'>
					<div className = 'row px-4'>
						<div className = 'bg-white pt-5 pb-4 mb-5 fo-s-15 px-3 col-12 rounded-1x shadow'>
							<div className = 'row'>
								<div className = 'col-lg-6 mb-4'>
									<div className = 'text-capitalize bold letter-spacing-1 mb-2'>first name</div>
									<input type = 'text' className = 'p-4 pointer-events-0 d-block w-100 text-capitalize bg-light border-0 rounded flex-h flex-1' defaultValue = {userData?.f_name} />
								</div>
								<div className = 'col-lg-6 mb-4'>
									<div className = 'text-capitalize bold letter-spacing-1 mb-2'>last name</div>
									<input type = 'text' className = 'p-4 pointer-events-0 d-block w-100 text-capitalize bg-light border-0 rounded flex-h flex-1' defaultValue = {userData?.l_name} />
								</div>
								<div className = 'col-lg-6 mb-4'>
									<div className = 'text-capitalize bold letter-spacing-1 mb-2'>username</div>
									<input type = 'text' className = 'p-4 pointer-events-0 d-block w-100 bg-light border-0 rounded flex-h flex-1' defaultValue = {userData?.username} />
								</div>
								<div className = 'col-lg-6 mb-4'>
									<div className = 'text-capitalize bold letter-spacing-1 mb-2'>email address</div>
									<input type = 'text' className = 'p-4 pointer-events-0 d-block w-100 bg-light border-0 rounded flex-h flex-1' defaultValue = {userData?.email} />
								</div>
								<div className = 'col-lg-6 mb-4'>
									<div className = 'text-capitalize bold letter-spacing-1 mb-2'>phone</div>
									<input type = 'text' className = 'p-4 pointer-events-0 d-block w-100 bg-light border-0 rounded flex-h flex-1' defaultValue = {userData?.phone} />
								</div>
								<div className = 'col-lg-6 mb-4'>
									<div className = 'text-capitalize bold letter-spacing-1 mb-2'>status</div>
									<input type = 'text' className = 'p-4 pointer-events-0 d-block w-100 text-capitalize bg-light border-0 rounded flex-h flex-1' defaultValue = {userData?.status} />
								</div>
							</div>
						</div>
						<div className = 'bg-white pt-5 pb-4 mb-5 fo-s-15 px-3 col-12 rounded-1x shadow'>
							<div className = 'col-12 mb-2'>
								<div className = 'text-capitalize bold letter-spacing-1 mb-2'>change password</div>
								<p className = 'mb-4 text-muted fo-s-15'>A link will be sent to your email. Open link to change password</p>
							</div>
							<div className = 'col-12 mb-2'>
								<input type = 'button' className = 'py-4 rounded-1x text-white bold letter-spacing-1 shadow-sm px-5 theme-bg border text-capitalize flex-h flex-1' defaultValue = 'request email' />
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashBoardTemplate>		
	)
}

const ProfileImage = () => {
	return (
		<div className = 'rounded-circle user-image bg-white shadow border po-rel' style = {{width: '200px', height: '200px'}}>
			<label title = 'Click to select new profile picture' className = 'cursor-pointer rounded-circle flex-h a-i-c j-c-c theme-bg po-abs right-0' style = {{bottom: '10%', right: '5%', width: '30px', height: '30px'}}>
				<span className = 'bi bi-pencil fo-s-15 text-white'></span>
				<input hidden = {true} type = 'file' accept = ".jpg, .gif, .png, .jpeg" className = 'po-abs' />
			</label>
			<style jsx>{`
				.user-image{
					background-size: cover;
					background-position: center;
					background-image: url(/images/user_002.png)
				}
			`}</style>
		</div>
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