import {Button, UsernameField, PasswordField} from '../components/authentication'
import {parseObjectToFormData, cookieStore, decryptString, encryptString} from '../functions'
import {api_routes} from '../config'
import {useState} from 'react'
import {notify} from '../components/popups'

export default () => {
	const [formData, setFormData] = useState({
		userID: '',
		password: ''
	})

	return (
		<div className = 'vh100 bg-white'>
			<div className = 'container'>
				<div className = 'row py-5'>
					<div className = 'py-5 col-12'>
						<div className = 'border mx-auto rounded-1x p-5' style = {{maxWidth: '450px'}}>
							<div className = 'text-center pb-5'>
								<h1 className = 'theme-color bold mb-3'>Log In</h1>
								<h5 className = 'bold text-muted'>Log in to dashboard</h5>
							</div>
							<form className = 'pt-5'>
								<div className = 'mb-5'>
									<div className = 'pb-3 bold text-muted text-uppercase theme-color'>user id</div>
									<UsernameField onChange = {(userID) => setFormData({...formData, userID})} />
								</div>
								<div className = 'mb-5'>
									<div className = 'pb-3 bold text-muted text-uppercase theme-color'>password</div>
									<PasswordField onChange = {(password) => setFormData({...formData, password})} />
								</div>
								<div className = 'mb-5'>
									<Button onClick = {(e) => e.preventDefault() | Login(formData).then(
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
									)} type = 'submit' className = 'd-block outline-0 w-100 theme-bg shadow text-uppercase rounded-lg border-0 text-white p-4'>log in</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const Login = (formData) => fetch(api_routes.login, {method: 'POST', body: parseObjectToFormData(formData)}).then(res => res.json())

export const getServerSideProps = (context) => {
	const {req: {cookies}} = context
	const cookie = cookies['OLLYMANN_INVENTORY'] ? JSON.parse(decryptString(cookies['OLLYMANN_INVENTORY'])) : undefined

	if(cookie && cookie.id){
		return {
			redirect: {
				destination: `./${cookie.account_type.replace(/s$/, '')}/dashboard`
			}
		}
	}

	return {
		props: {}
	}
}