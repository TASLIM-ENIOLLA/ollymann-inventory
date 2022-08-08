import {useContext, useEffect, useState} from 'react'
import {StockContext} from '../../../contexts/tabs/stock'
import {notify} from '../../../components/popups'
import {api_routes} from '../../../config'
import {Button} from '../../../components/authentication'
import Currency from '../../currency'

export default () => {
	const {viewStock: {toggle, addNewStock, visible, stockID}} = useContext(StockContext)
	const [formData, setFormData] = useState()
	const [editable, setEditable] = useState(0)
	const [productsList, setProductsList] = useState([])

	useEffect(async() => {
		if(stockID && visible){
			const req = await fetch(`${api_routes.user.getStocksList}?stock_id=${stockID}`)
			const {data} = await req.json()

			setFormData(data)
		}
	}, [visible])


	useEffect(async() => {
		const req = await fetch(api_routes.user.getProductsList)
		const {data} = await req.json()

		setProductsList(data)
	}, [])

	useEffect(() => {
		if(editable === 1){
			setEditable(2)
		}
	}, [formData])

	return (
		(formData === undefined)
		? <></>
		: (
			<div className = {`${visible ? 'animated fadeIn' : 'd-none'} w-100 overflow-y-auto h-100 po-fixed top-0 left-0 p-5`} style = {{zIndex: 1000, background: 'rgba(0,0,0,.5)'}}>
				<div className = 'mx-auto p-5 bg-white overflow-0 my-5 rounded-2x po-rel' style = {{maxWidth: '750px'}}>
					<button onClick = {() => (setEditable(0), setFormData(), toggle())} className = 'po-abs border-0 flex-h btn btn-danger a-i-c j-c-c top-0 right-0 px-3 py-2'>
						<span className = 'bi bi-x fa-2x text-white'></span>
					</button>
					<h5 className = 'bold text-capitalize text-muted text-center'>view stock data</h5>
					<div className = 'row mt-5'>
						<div className = 'col-lg-6 col-md-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Select product *</p>
							<select value = {formData.productID} onChange = {(e) => setFormData({
								...formData,
								productID: e.target.value,
								productPrice: (
									(e.target.value !== '')
									? productsList.filter(({id}) => id === e.target.value)[0].price
									: ''
								),
								productBulkUnit: (
									(e.target.value !== '')
									? productsList.filter(({id}) => id === e.target.value)[0].bulk_unit
									: ''
								)
							})} disabled = {!editable} className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear text-muted text-capitalize border d-block w-100 rounded p-3`}>{
									productsList.map(({name, bulk_unit, id}) => (
										<option key = {id} value = {id}>{name}</option>
									))
								}
							</select>
						</div>
						<div className = 'col-lg-6 col-md-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Product quantity ({formData.productBulkUnit || ''}) *</p>
							<input value = {`${formData.productQuantity}`} onChange = {(e) => setFormData({...formData, productQuantity: e.target.value})} type = 'number' min = '1' step = '.5' placeholder = 'select quantity *' disabled = {!editable} className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear text-muted text-capitalize border d-block w-100 rounded p-3`} />
						</div>
						<div className = 'col-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Product price *</p>
							<input onChange = {() => true} value = {`${Currency} ${new Intl.NumberFormat().format(formData.productPrice)}`} type = 'text' placeholder = 'product price' className = {`${editable ? '' : 'disabled bg-light'} transit pointer-events-0 bg-light bg-clear text-muted text-capitalize bold disabled border d-block w-100 rounded p-3`} />
						</div>
						<div className = 'col-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Price total *</p>
							<input onChange = {() => true} value = {`${Currency} ${new Intl.NumberFormat().format(formData.productPrice * formData.productQuantity)}`} type = 'text' placeholder = 'product price' disabled = {!editable} className = {`${editable ? '' : 'disabled bg-light'} transit pointer-events-0 bg-light bg-clear text-muted text-capitalize bold disabled border d-block w-100 rounded p-3`} />
						</div>
					</div>
					<div className = 'row'>
						<div className = 'col-lg-6 col-md-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Customer name *</p>
							<input size = '50' value = {formData.customerName} onChange = {(e) => setFormData({...formData, customerName: e.target.value})} placeholder = 'Customer name *' type = 'text' disabled = {!editable} className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear text-capitalize border d-block w-100 rounded p-3`} />
						</div>
						<div className = 'col-lg-6 col-md-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Customer phone *</p>
							<input size = '20' type = 'phone' value = {formData.customerPhone} onChange = {(e) => setFormData({...formData, customerPhone: e.target.value})} placeholder = 'Phone number *' type = 'text' disabled = {!editable} className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear border d-block w-100 rounded p-3`} />
						</div>
						<div className = 'col-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Customer email</p>
							<input size = '255' type = 'email' value = {formData.customerEmail} onChange = {(e) => setFormData({...formData, customerEmail: e.target.value})} placeholder = 'Email address' type = 'text' disabled = {!editable} className ={ `${editable ? '' : 'disabled bg-light'} transit bg-clear border d-block w-100 rounded p-3`}/>
						</div>
						<div className = 'col-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Notes</p>
							<textarea size = '255' value = {formData.notes || ''} onChange = {(e) => setFormData({...formData, notes: e.target.value})} rows = '5' placeholder = 'Notes' type = 'text' disabled = {!editable} className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear text-capitalize resize-0 border d-block w-100 rounded p-3`}></textarea>
						</div>
						<div className = 'col-12 mb-4'>
							<p className = 'bold theme-color mb-2'>Delivery address</p>
							<textarea size = '255' value = {formData.deliveryAddress || ''} onChange = {(e) => setFormData({...formData, deliveryAddress: e.target.value})} rows = '5' placeholder = 'Enter delivery address' type = 'text' disabled = {!editable} className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear text-capitalize resize-0 border d-block w-100 rounded p-3`}></textarea>
						</div>
						<div className = 'col-12'>
							<div className = 'row mt-4'>{
								(!editable)
								? (
									<div className = 'col-6 mb-3'>
										<button onClick = {() => setEditable(1)} type = 'button' className = {`btn btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>edit</button>
									</div>
								)
								: (
									<div className = 'col-6 mb-3'>
										<Button onClick = {() => UpdateStock(formData).then(({type, stock_data, data}) => notify({
												message: data,
												type: type !== 'error' ? type : 'danger',
												callback: () => {
													if(type === 'success'){
														addNewStock(stock_data)
													}
												}
											}))} type = 'button' className = {`${(
												(![formData.productID, formData.productQuantity, formData.customerName, formData.customerPhone].includes(''))
												? ''
												: 'disabled'
											)} ${editable !== 2 ? 'disabled' : ''} btn btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>update</Button>
									</div>
								)
							}
								<div className = 'col-6 mb-3'>
									<input onClick = {() => (setEditable(0), setFormData(), toggle())} type = 'button' value = 'cancel' className = ' btn btn-secondary cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
								</div>
								<div className = 'transit col-12 mb-3'>
									<button onClick = {() => new Promise(resolved => {
										window.print()
										resolved({status: 'Printing...'})	
									})} type = 'button' className = ' btn theme-bg cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4'>print receipt</button>
								</div>
								<div className = 'col-12 mb-3'>
									<input onClick = {() => confirm('Are you sure you want to delete product? Action cannot be undone.') ? '' : ''} type = 'button' value = 'delete stock' className = ' btn btn-danger cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	)
}

const UpdateStock = async (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.user.updateStock, {method: 'POST', body: __formData__}).then(response => response.json())
}