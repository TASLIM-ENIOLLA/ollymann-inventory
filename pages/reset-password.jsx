import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {Button, UsernameField, PasswordField} from '../components/authentication'
import {parseObjectToFormData, cookieStore, decryptString, encryptString} from '../functions'
import {notify} from '../components/popups'

export default ({reset_id}) => {
	const [formData, setFormData] = useState({
		username: '',
		new_password: '',
		c_new_password: ''
	})

	useEffect(() => {
		console.log('User SSR to enusre the user really wants to reset password')

	}, [])

	return (
		<div className = 'vh100 bg-white'>
			<div className = 'container'>
				<div className = 'row py-5'>
					<div className = 'py-5 col-12'>
						<div className = 'border mx-auto rounded-1x p-5' style = {{maxWidth: '450px'}}>
							<div className = 'text-center pb-5'>
								<h1 className = 'text-primary bold mb-3'>Reset</h1>
								<h5 className = 'bold text-muted'>Change your password</h5>
							</div>
							<div className = 'pt-5'>
								<div className = 'mb-5'>
									<div className = 'pb-3 bold text-muted text-uppercase theme-color'>username</div>
									<div className = 'disabled bg-light'>
										<UsernameField className = 'bg-clear' value = {formData.username} onChange = {(username) => setFormData({...formData, username})} />
									</div>
								</div>
								<div className = 'mb-5'>
									<div className = 'pb-3 bold text-muted text-uppercase theme-color'>new password</div>
									<PasswordField onChange = {(new_password) => setFormData({...formData, new_password})} />
								</div>
								<div className = 'mb-5'>
									<div className = 'pb-3 bold text-muted text-uppercase theme-color'>confirm new password</div>
									<PasswordField onChange = {(c_new_password) => setFormData({...formData, c_new_password})} />
								</div>
								<div className = 'mb-5'>
									<Button onClick = {() => ResetPassword(formData).then(
										({type, data}) => notify({
											message: type === 'success' ? 'Login successful, redirecting...' : data,
											type: type !== 'success' ? 'danger' : type,
											callback: () => type !== 'success' ? undefined : cookieStore.setCookie({
												name: 'OLLYMANN_INVENTORY',
												value: encryptString(JSON.stringify(data)),
												expires: new Date().getTime() + (3600 * 24 * 30 * 1000),
												path: '/'
											}).then(() => window.location = `./${data.account_type.replace(/s$/, '')}/dashboard`)
										})
									)} type = 'submit' className = 'd-block outline-0 w-100 bg-primary shadow text-uppercase rounded-lg border-0 text-white p-4'>reset password</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const ResetPassword = (formData) => fetch(api_routes.reset_password, {method: 'POST', body: parseObjectToFormData(formData)}).then(res => res.json())

export const getServerSideProps = (context) => {
	const {query: {reset_id}} = context

	if(!reset_id){
		return {
			notFound: true
		}
	}

	return {
		props: {
			reset_id: reset_id.replace(/^usr\-/, '')
		}
	}
}