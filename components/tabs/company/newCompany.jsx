import {useContext, useEffect, useState} from 'react'
import {CompanyContext} from '../../../contexts/tabs/Company'
import {notify} from '../../../components/popups'
import {api_routes} from '../../../config'
import {Button} from '../../../components/authentication'
import Currency from '../../../components/currency'

export default () => {
	const {newCompany: {tab, companiesList}} = useContext(CompanyContext)
	const [formData, setFormData] = useState({
		name: '',
	})
	
	useEffect(() => {
		if(!tab.open){
			setFormData({name: ''})
		}
	}, [tab.open])

	return (
		<div className = {`${tab.open ? 'animated fadeIn' : 'd-none'} w-100 overflow-y-auto h-100 po-fixed top-0 left-0 p-5`} style = {{zIndex: 1000, background: 'rgba(0,0,0,.5)'}}>
			<div className = 'mx-auto p-5 bg-white my-5 rounded-2x' style = {{maxWidth: '750px'}}>
				<h5 className = 'bold text-capitalize text-muted'>add new company</h5>
				<div className = 'row mt-5'>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Company name *</p>
						<input size = '50' value = {`${formData.name}`} onChange = {(e) => setFormData({...formData, name: e.target.value})} type = 'text' className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3' />
					</div>
				</div>
				<div className = 'row'>
					<div className = 'col-12'>
						<div className = 'row mt-4'>
							<div className = 'col-6 mb-3'>
								<Button onClick = {() => AddNewCompany(formData).then(({type, company_data, data}) => notify({
									message: data,
									type: type !== 'error' ? type : 'danger',
									callback: () => (
										(type === 'success')
										? (
											companiesList.add(company_data),
											setFormData({name: '', companyID: '', bulk_unit: '', price: ''}),
											tab.toggle()
										)
										: undefined
									)
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

const AddNewCompany = (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.admin.addNewCompany, {method: 'POST', body: __formData__}).then(response => response.json())
}