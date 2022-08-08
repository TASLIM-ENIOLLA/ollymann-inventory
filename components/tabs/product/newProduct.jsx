import {useContext, useEffect, useState} from 'react'
import {ProductContext} from '../../../contexts/tabs/Product'
import {notify} from '../../../components/popups'
import {api_routes} from '../../../config'
import {Button} from '../../../components/authentication'
import Currency from '../../../components/currency'

export default () => {
	const {newProduct: {tab, productsList}} = useContext(ProductContext)
	const [companyData, setCompanyData] = useState([])
	const [formData, setFormData] = useState({
		name: '',
		companyID: '',
		companyName: '',
		bulk_unit: '',
		price: '',
	})
	
	useEffect(async() => {
		const req = await fetch(api_routes.admin.getCompanyData)
		const {data} = await req.json()

		setCompanyData(data)
	}, [])

	useEffect(() => {
		if(!tab.open){
			setFormData({name: '', companyID: '', bulk_unit: '', price: ''})
		}
	}, [tab.open])

	return (
		<div className = {`${tab.open ? 'animated fadeIn' : 'd-none'} w-100 overflow-y-auto h-100 po-fixed top-0 left-0 p-5`} style = {{zIndex: 1000, background: 'rgba(0,0,0,.5)'}}>
			<div className = 'mx-auto p-5 bg-white my-5 rounded-2x' style = {{maxWidth: '750px'}}>
				<h5 className = 'bold text-capitalize text-muted'>add new product</h5>
				<div className = 'row mt-5'>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Product name *</p>
						<input size = '50' value = {`${formData.name}`} onChange = {(e) => setFormData({...formData, name: e.target.value})} type = 'text' className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Product company *</p>
						<select value = {formData.companyID} onChange = {(e) => setFormData({...formData, companyID: e.target.value})} className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3'>
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
						<input size = '20' value = {formData.bulk_unit} onChange = {(e) => setFormData({...formData, bulk_unit: e.target.value})} type = 'text' className = 'bg-clear text-muted text-capitalize border d-block w-100 rounded p-3' />
					</div>
					<div className = 'col-lg-6 col-md-12 mb-4'>
						<p className = 'bold theme-color mb-2'>Price ({Currency}) *</p>
						<input type = 'text' value = {new Intl.NumberFormat().format(formData.price)} onKeyPress = {(e) => ((e.key !== 0 || Number(e.key)) ? true : e.preventDefault())} onChange = {(e) => (e.target.value.length > 14) ? e.preventDefault() : setFormData({...formData, price: e.target.value.replace(/\,/g, '')})} className = 'bg-clear text-muted border d-block w-100 rounded p-3' />
					</div>
					{/**/}
					<div className = 'col-12'>
						<div className = 'row mt-4'>
							<div className = 'col-6 mb-3'>
								<Button onClick = {() => AddNewProduct(formData).then(({type, product_data, data}) => notify({
									message: data,
									type: type !== 'error' ? type : 'danger',
									callback: () => (
										(type === 'success')
										? (
											tab.toggle(),
											setFormData({name: '', companyID: '', bulk_unit: '', price: ''}),
											productsList.add(product_data)
										)
										: undefined
									)
								}))} type = 'button' className = {`btn btn-success user-select-0 cursor-pointer text-capitalize bold letter-spacing-1 border d-block w-100 text-white rounded-1x p-4`}>save</Button>
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

/**
 * 
 *
 * 
 */

const AddNewProduct = (formData) => {
	const __formData__ = new FormData()

	for(let prop in formData){
		__formData__.append(prop, formData[prop])
	}

	return fetch(api_routes.admin.addNewProduct, {method: 'POST', body: __formData__}).then(response => response.json())
}