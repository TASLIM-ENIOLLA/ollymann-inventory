import {useContext, useEffect, useState} from 'react'
import {ProductContext} from '../../../contexts/tabs/Product'
import {notify} from '../../../components/popups'
import {api_routes} from '../../../config'
import {Button} from '../../../components/authentication'
import Currency from '../../../components/currency'

export default () => {
	const {viewProduct: {tab, productsList}} = useContext(ProductContext)
	const [companyData, setCompanyData] = useState([])
	const [formData, setFormData] = useState()
	const [editable, setEditable] = useState(0)

	useEffect(async() => {
		if(tab.open){
			const req1 = await fetch(api_routes.admin.getCompanyData)
			const {data: companyData} = await req1.json()

			const req2 = await fetch(`${api_routes.admin.getProductsList}?productID=${tab.productID}`)
			const {data: productData} = await req2.json()

			setFormData(productData)
			setCompanyData(companyData)
		}
		else{
			setFormData()
			setEditable(0)
		}
	}, [tab.open])

	useEffect(() => {
		if(formData && editable === 1){
			setEditable(2)
		}
	}, [formData])

	if(!formData){
		return (<></>)
	}

	return (
		<div className = {`${tab.open ? 'animated fadeIn' : 'd-none'} w-100 overflow-y-auto h-100 po-fixed top-0 left-0 p-5`} style = {{zIndex: 1000, background: 'rgba(0,0,0,.5)'}}>
			<div className = 'mx-auto p-5 bg-white my-5 rounded-2x' style = {{maxWidth: '750px'}}>
				<h5 className = 'bold text-capitalize text-muted'>update product</h5>
				<div className = 'row mt-5'>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Product name *</p>
						<input size = '50' value = {`${formData.name}`} onChange = {(e) => setFormData({...formData, name: e.target.value})} type = 'text' className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear text-muted text-capitalize border d-block w-100 rounded p-3`} />
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Product company *</p>
						<select value = {formData.companyID} onChange = {(e) => setFormData({...formData, companyID: e.target.value})} className = {`${editable ? '' : 'disabled bg-light'} transit text-muted disabled bg-light text-capitalize border d-block w-100 rounded p-3`}>
							<option value = ''>--- select company ---</option>{
								companyData.map(({id, name}) => (
									<option key = {id} value = {id}>{name}</option>
								))
							}
						</select>
					</div>
				</div>
				<div className = 'row'>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Bulk unit *</p>
						<input size = '20' value = {formData.bulk_unit} onChange = {(e) => setFormData({...formData, bulk_unit: e.target.value})} type = 'text' className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear text-muted text-capitalize border d-block w-100 rounded p-3`} />
					</div>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Price ({Currency}) *</p>
						<input type = 'text' value = {new Intl.NumberFormat().format(formData.price)} onKeyPress = {(e) => ((e.key !== 0 || Number(e.key)) ? true : e.preventDefault())} onChange = {(e) => (e.target.value.length > 14) ? e.preventDefault() : setFormData({...formData, price: e.target.value.replace(/\,/g, '')})} className = {`${editable ? '' : 'disabled bg-light'} transit bg-clear text-muted border d-block w-100 rounded p-3`} />
					</div>
					{/**/}
					<div className = 'col-12'>
						<div className = 'row mt-4'>
							<div className = 'col-6 mb-3'>{
								(!editable)
								? (
									<button onClick = {() => setEditable(1)} type = 'button' className = {`btn btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>edit</button>
								)
								: (
									<Button onClick = {() => UpdateProduct(formData).then(({type, product_data, data}) => notify({
											message: data,
											type: type !== 'error' ? type : 'danger',
											callback: () => (
												(type === 'success')
												? (
													setFormData(),
													productsList.update(product_data),
													tab.toggle()
												)
												: undefined
											)
										}))} type = 'button' className = {`${editable === 2 ? '' : 'disabled'} btn transit btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>update</Button>
								)
							}</div>
							<div className = 'col-6 mb-3'>
								<input onClick = {() => tab.toggle()} type = 'button' value = 'cancel' className = ' btn btn-secondary cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
							</div>
							<div className = 'col-12 mb-3'>
								<input onClick = {() => !confirm('Do you really want to delete product? Action is irreversible!') ? false : (
									DeleteProduct(formData).then(({type, data}) => notify({
										message: data,
										type: type !== 'error' ? type : 'danger',
										callback: () => (
											(type === 'success')
											? (
												productsList.remove(formData.id),
												tab.toggle(),
											)
											: undefined
										)
									})
								))} type = 'button' value = 'delete product' className = ' btn btn-danger cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4' />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

/**
 * 
 *
 * 
 */

const UpdateProduct = (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.admin.updateProduct, {method: 'POST', body: __formData__}).then(response => response.json())
}

const DeleteProduct = (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.admin.deleteProduct, {method: 'POST', body: __formData__}).then(response => response.json())
}