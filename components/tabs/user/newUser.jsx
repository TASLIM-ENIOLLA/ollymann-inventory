import {useContext, useEffect, useState} from 'react'
import {UserContext} from '../../../contexts/tabs/user/User'
import {notify} from '../../../components/popups'
import {api_routes} from '../../../config'
import {Button} from '../../../components/authentication'
import {GenerateUsername} from '../../../components/newuser'

export default () => {
	const [productsList, setProductsList] = useState([])
	const [savedStock, setSavedStock] = useState(false)
	const {newUser: {tab, usersList}} = useContext(UserContext)
	const [formData, setFormData] = useState({
		f_name: '',
		l_name: '',
		username: '',
		email: '',
		accountType: '',
		phone: '',
		status: 'active',
	})
	
	useEffect(async() => {
		if(!tab.open){
			setFormData({f_name: '', l_name: '', username: '', email: '', phone: '', status: ''})
		}
	}, [tab.open])

	return (
		<div className = {`${tab.open ? 'animated fadeIn' : 'd-none'} w-100 overflow-y-auto h-100 po-fixed top-0 left-0 p-5`} style = {{zIndex: 1000, background: 'rgba(0,0,0,.5)'}}>
			<div className = 'mx-auto p-5 bg-white my-5 rounded-2x' style = {{maxWidth: '750px'}}>
				<h5 className = 'bold text-capitalize text-muted'>add new user</h5>
				<div className = 'row mt-5'>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>First name *</p>
						<input value = {`${formData.f_name}`} onChange = {(e) => setFormData({...formData, f_name: e.target.value})} type = 'text' className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Last name *</p>
						<input value = {`${formData.l_name}`} onChange = {(e) => setFormData({...formData, l_name: e.target.value})} type = 'text' className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3' />
					</div>
				</div>
				<div className = 'row'>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Email Address *</p>
						<input size = '50' value = {formData.email} onChange = {(e) => setFormData({...formData, email: e.target.value})} type = 'email' className = 'bg-clear text-muted text-lowercase border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Phone Number *</p>
						<input size = '20' type = 'phone' value = {formData.phone} onChange = {(e) => setFormData({...formData, phone: e.target.value})} className = 'bg-clear text-muted border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Select category *</p>
						<select value = {formData.accountType} onChange = {(e) => setFormData({...formData, accountType: e.target.value})} className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3'>
							<option value = ''>--- select category ---</option>
							<option value = 'admin'>admin</option>
							<option value = 'user'>user</option>
						</select>
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Select status *</p>
						<select value = {formData.status} onChange = {(e) => setFormData({...formData, status: e.target.value})} className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3'>
							<option value = 'active'>active</option>
							<option value = 'inactive'>inactive</option>
						</select>
					</div>
					<GenerateUsername accountType = {formData.accountType} value = {formData.username} onChange = {(value) => setFormData({...formData, username: value})} />
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2 underline'>The default password for all newly created accounts is: 12345678. The password is subject to change by its user.</p>
					</div>
					<div className = 'col-12'>
						<div className = 'row mt-4'>
							<div className = 'col-6 mb-3'>
								<Button onClick = {() => AddNewUser(formData).then(({type, user_data, data}) => notify({
									message: data,
									type: type === 'success' ? type : 'error',
									callback: () => {
										if(type === 'success'){
											usersList.add(user_data)
											tab.toggle()
										}
									}
								}))} type = 'button' className = {`btn btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>save</Button>
							</div>
							<div className = 'col-6 mb-3'>
								<input onClick = {() => tab.toggle()} type = 'button' value = 'cancel' className = ' btn btn-secondary cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const AddNewUser = (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.admin.addNewUser, {method: 'POST', body: __formData__}).then(response => response.json())
}