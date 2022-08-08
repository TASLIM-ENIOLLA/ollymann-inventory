import {useContext, useEffect, useState} from 'react'
import {StockContext} from '../../../contexts/tabs/stock'
import {notify} from '../../../components/popups'
import {api_routes} from '../../../config'
import {Button} from '../../../components/authentication'
import Currency from '../../../components/currency'

export default () => {
	const [productsList, setProductsList] = useState([])
	const [savedStock, setSavedStock] = useState(false)
	const {newStock: {visible, toggle, addNewStock}} = useContext(StockContext)
	const [formData, setFormData] = useState({
		productID: '',
		productQuantity: '',
		productName: '',
		productPrice: '',
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
		if(!visible){
			setFormData({productID: '', productName: '', productPrice: '0', productQuantity: '', productBulkUnit: '', customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: '', notes: ''})
		}
	}, [visible])

	useEffect(async () => {
		if(formData.productID !== ''){
			const req = await fetch(`${api_routes.user.getProductsList}?productID=${formData.productID}`)
			const {data} = await req.json()

			setFormData({
				...formData,
				productPrice: data.price,
				productName: data.name
			})
		}
		else{
			setFormData({
				...formData,
				productPrice: '',
				productName: ''
			})
		}
	}, [formData.productID])

	return (
		<div className = {`${visible ? 'animated fadeIn' : 'd-none'} w-100 overflow-y-auto h-100 po-fixed top-0 left-0 p-5`} style = {{zIndex: 1000, background: 'rgba(0,0,0,.5)'}}>
			<div className = 'mx-auto p-5 bg-white overflow-0 my-5 rounded-2x po-rel' style = {{maxWidth: '750px'}}>
				<button onClick = {() => toggle()} className = 'po-abs border-0 flex-h btn btn-danger a-i-c j-c-c top-0 right-0 px-3 py-2'>
					<span className = 'bi bi-x fa-2x text-white'></span>
				</button>
				<h5 className = 'bold text-capitalize text-center text-muted'>add new stock</h5>
				<div className = 'row mt-5'>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Select product *</p>
						<select onChange = {(e) => setFormData({
							...formData,
							productID: e.target.value,
							productBulkUnit: (
								(e.target.value !== '')
								? productsList.filter(({id}) => id === e.target.value)[0].bulk_unit
								: ''
							)
						})} className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3'>
							<option value = ''>--- select product * ---</option>{
								productsList.map(({name, bulk_unit, id}) => (
									<option key = {id} value = {id}>{name}</option>
								))
							}
						</select>
					</div>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Product quantity {formData.productBulkUnit !== '' ? `(${formData.productBulkUnit})` : ''} *</p>
						<input value = {`${formData.productQuantity}`} onChange = {(e) => setFormData({...formData, productQuantity: e.target.value})} type = 'number' min = '1' step = '.5' placeholder = 'select quantity *' className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Product price</p>
						<input value = {`${Currency} ${new Intl.NumberFormat().format(formData.productPrice)}`} onChange = {() => false} disabled = {true} type = 'text' placeholder = 'Product price' className = 'bg-light text-muted text-capitalize disabled border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Price total</p>
						<input value = {`${Currency} ${new Intl.NumberFormat().format(formData.productPrice * formData.productQuantity)}`} onChange = {() => false} disabled = {true} type = 'text' placeholder = 'Product price' className = 'bg-light text-muted text-capitalize disabled border d-block w-100 rounded p-3' />
					</div>
				</div>
				<div className = 'row'>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Customer name *</p>
						<input size = '50' value = {formData.customerName} onChange = {(e) => setFormData({...formData, customerName: e.target.value})} placeholder = 'Customer name *' type = 'text' className = 'bg-clear text-capitalize border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Customer phone *</p>
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
											// setFormData({productID: '', productQuantity: '', productBulkUnit: '', customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: '', notes: ''})
											addNewStock(stock_data)
											setSavedStock(true)
										}
									}
								}))} type = 'button' className = {`${(
										(![formData.productID, formData.productQuantity, formData.customerName, formData.customerPhone].includes('') && !savedStock)
										? ''
										: 'disabled'
									)} btn btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>save</Button>
							</div>
							<div className = 'col-6 mb-3'>
								<input onClick = {() => toggle()} type = 'button' value = 'cancel' className = ' btn btn-secondary cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
							</div>
							<div className = {`${savedStock ? '' : 'disabled transit'} col-12`}>
								<button onClick = {() => new Promise(resolved => {
									window.print()
									resolved({status: 'Printing...'})
								})} type = 'button' className = ' btn theme-bg cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4'>print receipt</button>
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