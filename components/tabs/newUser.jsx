import {useContext, useEffect, useState} from 'react'
import {NewUserContext} from '../../contexts/tabs/newUser'
import {notify} from '../../components/popups'
import {api_routes} from '../../config'
import {Button} from '../../components/authentication'

export default () => {
	const [productsList, setProductsList] = useState([])
	const [savedStock, setSavedStock] = useState(false)
	const {tab, usersList} = useContext(NewUserContext)
	const [formData, setFormData] = useState({
		productID: '',
		productQuantity: '',
		productBulkUnit: '',
		customerName: '',
		customerEmail: '',
		customerPhone: '',
		deliveryAddress: '',
		notes: ''
	})

	useEffect(async() => {
		const req = await fetch(api_routes.user.getProductsList)
		const {data} = await req.json()

		setProductsList(data)
	}, [])
	
	useEffect(async() => {
		if(!tab.open){
			setFormData({productID: '', productQuantity: '', productBulkUnit: '', customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: '', notes: ''})
		}
	}, [tab.open])

	return (
		<div className = {`${tab.open ? 'animated fadeIn' : 'd-none'} w-100 overflow-y-auto h-100 po-fixed top-0 left-0 p-5`} style = {{zIndex: 1000, background: 'rgba(0,0,0,.5)'}}>
			<div className = 'mx-auto p-5 bg-white my-5 rounded-2x' style = {{maxWidth: '750px'}}>
				<h5 className = 'bold text-capitalize text-muted'>add new stock</h5>
				<div className = 'row mt-5'>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>First name *</p>
						<input value = {`${formData.productQuantity}`} onChange = {(e) => setFormData({...formData, productQuantity: e.target.value})} type = 'number' min = '1' step = '.5' placeholder = 'select quantity *' className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Last name *</p>
						<input value = {`${formData.productQuantity}`} onChange = {(e) => setFormData({...formData, productQuantity: e.target.value})} type = 'number' min = '1' step = '.5' placeholder = 'select quantity *' className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3' />
					</div>
				</div>
				<div className = 'row'>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Email Address *</p>
						<input size = '50' value = {formData.customerName} onChange = {(e) => setFormData({...formData, customerName: e.target.value})} placeholder = 'Customer name *' type = 'text' className = 'bg-clear text-capitalize border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Phone Number *</p>
						<input size = '20' type = 'phone' value = {formData.customerPhone} onChange = {(e) => setFormData({...formData, customerPhone: e.target.value})} placeholder = 'Phone number *' type = 'text' className = 'bg-clear border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Customer email</p>
						<input size = '255' type = 'email' value = {formData.customerEmail} onChange = {(e) => setFormData({...formData, customerEmail: e.target.value})} placeholder = 'Email address' type = 'text' className = 'bg-clear border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Notes</p>
						<textarea size = '255' value = {formData.notes} onChange = {(e) => setFormData({...formData, notes: e.target.value})} rows = '5' placeholder = 'Notes' type = 'text' className = 'bg-clear text-capitalize resize-0 border d-block w-100 rounded p-3'></textarea>
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Delivery address</p>
						<textarea size = '255' value = {formData.deliveryAddress} onChange = {(e) => setFormData({...formData, deliveryAddress: e.target.value})} rows = '5' placeholder = 'Enter delivery address' type = 'text' className = 'bg-clear text-capitalize resize-0 border d-block w-100 rounded p-3'></textarea>
					</div>
					<div className = 'col-12'>
						<div className = 'row mt-4'>
							<div className = 'col-6 mb-3'>
								<Button onClick = {() => AddNewStock(formData).then(({type, stock_data, data}) => notify({
									message: data,
									type: type !== 'error' ? type : 'danger',
									callback: () => {
										if(type === 'success'){
											setFormData({productID: '', productQuantity: '', productBulkUnit: '', customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: '', notes: ''})
											updateStocksList([stock_data, ...stocksList])
											setSavedStock(true)
										}
									}
								}))} type = 'button' className = {`${(
										(![formData.productID, formData.productQuantity, formData.customerName, formData.customerPhone].includes(''))
										? ''
										: 'disabled'
									)} btn btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>save</Button>
							</div>
							<div className = 'col-6 mb-3'>
								<input onClick = {() => tab.toggle()} type = 'button' value = 'cancel' className = ' btn btn-danger cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const AddNewStock = (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.user.addNewStock, {method: 'POST', body: __formData__}).then(response => response.json())
}