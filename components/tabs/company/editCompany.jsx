import {useContext, useEffect, useState} from 'react'
import {CompanyContext} from '../../../contexts/tabs/Company'
import {notify} from '../../../components/popups'
import {api_routes} from '../../../config'
import {Button} from '../../../components/authentication'
import Currency from '../../../components/currency'

export default () => {
	const {editCompany: {tab, companiesList}} = useContext(CompanyContext)
	const [formData, setFormData] = useState()
	const [editable, setEditable] = useState(0)
	
	useEffect(async() => {
		if(tab.open){
			const req = await fetch(`${api_routes.admin.getCompanyData}?companyID=${tab.companyID}`)
			const {data} = await req.json()

			setFormData(data)
		}
		else{
			setFormData()
		}
	}, [tab.open])

	useEffect(() => {
		if(editable === 1){
			setEditable(2)
		}
	}, [formData])

	if(!formData){
		return (<></>)
	}

	return (
		<div className = {`${tab.open ? 'animated fadeIn' : 'd-none'} w-100 overflow-y-auto h-100 po-fixed top-0 left-0 p-5`} style = {{zIndex: 1000, background: 'rgba(0,0,0,.5)'}}>
			<div className = 'mx-auto p-5 bg-white my-5 rounded-2x' style = {{maxWidth: '750px'}}>
				<h5 className = 'bold text-capitalize text-muted'>edit company</h5>
				<div className = 'row mt-5'>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Company name *</p>
						<input size = '50' value = {`${formData.name}`} onChange = {(e) => setFormData({...formData, name: e.target.value})} type = 'text' className = {`${editable ? '' : 'bg-light disabled'} transit bg-clear text-muted text-capitalize border d-block w-100 rounded p-3`} />
					</div>
				</div>
				<div className = 'row'>
					<div className = 'col-12'>
						<div className = 'row mt-4'>
							<div className = 'col-6 mb-3'>{
								(!editable)
								? (
									<button onClick = {() => setEditable(1)} type = 'button' className = {`btn btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>edit</button>
								)
								: (
									<Button onClick = {() => UpdateCompany(formData).then(({type, company_data, data}) => notify({
											message: data,
											type: type !== 'error' ? type : 'danger',
											callback: () => (
												(type === 'success')
												? (
													companiesList.update(company_data),
													setFormData(),
													setEditable(0),
													tab.toggle()
												)
												: undefined
											)
										}))} type = 'button' className = {`${editable === 2 ? '' : 'disabled'} btn btn-success transit user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>update</Button>
								)
							}
								
							</div>
							<div className = 'col-6 mb-3'>
								<input onClick = {() => tab.toggle()} type = 'button' value = 'cancel' className = ' btn btn-secondary cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
							</div>
							<div className = 'col-12 mb-3'>
								<input onClick = {() => !confirm('Do you really want to delete company? Action is irreversible!') ? false : DeleteCompany(formData).then(({type, data}) => notify({
											message: data,
											type: type !== 'error' ? type : 'danger',
											callback: () => (
												(type === 'success')
												? (
													companiesList.remove(formData.id),
													setFormData(),
													setEditable(0),
													tab.toggle()
												)
												: undefined
											)
										}))} type = 'button' value = 'delete company' className = ' btn btn-danger cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const UpdateCompany = (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.admin.updateCompany, {method: 'POST', body: __formData__}).then(response => response.json())
}

const DeleteCompany = (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.admin.deleteCompany, {method: 'POST', body: __formData__}).then(response => response.json())
}