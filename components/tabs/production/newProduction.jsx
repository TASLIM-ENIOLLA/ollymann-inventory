import {ProductionContext} from '../../../contexts/tabs/production'
import {useContext, useState, useEffect} from 'react'
import {api_routes} from '../../../config'
import {Button} from '../../../components/authentication'
import {notify} from '../../../components/popups'
import {parseObjectToFormData} from '../../../functions'

export default () => {
	const {newProduction: {open, addProductionData, toggle}} = useContext(ProductionContext)
	const [productsList, setProductsList] = useState([])
	const [formData, setFormData] = useState({
		productID: '',
		productQuantity: '',
		notes: ''
	})

	useEffect(async() => {
		const req = await fetch(api_routes.user.getProductsList)
		const {data} = await req.json()

		setProductsList(data)
	}, [])

	useEffect(() => {
		if(formData.productID !== ''){
			const [{id, timestamp, ...otherProductData}] = productsList.filter(({id}) => id === formData.productID)
			
			setFormData({
				...formData,
				...otherProductData
			})
		}
	}, [formData.productID])

	useEffect(() => (
		(open)
		? undefined
		: setFormData({productID: '',productQuantity: '', notes: ''})
	), [open])

	if(!open){
		return (<></>)
	}

	return (
		<div style = {{background: 'rgba(0,0,0,.5)', zIndex: 1000}} className = {`${open ? '' : 'd-none'} animated fadeIn px-3 top-0 left-0 vh100 vw100 po-fixed overflow-y-auto`}>
			<div style = {{maxWidth: '500px'}} className = 'container-fluid px-5 mt-5 py-5 mx-auto rounded-1x bg-white po-rel overflow-0'>
				<button onClick = {() => toggle()} className = 'bg-danger border-0 px-3 py-2 rounded outline-0 po-abs right-0 top-0 text-white'>
					<span className = 'bi fo-s-20 bi-x'></span>
				</button>
				<div className = 'row'>
					<div className = 'col-12 mb-5'>
						<div className = 'fo-s-15 text-capitalize bold text-muted text-center'>new production</div>
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'mb-2 text-capitalize bold text-muted'>select product *</p>
						<select value = {formData.productID} onChange = {(e) => setFormData({...formData, productID: e.target.value})} className = 'd-block text-capitalize w-100 p-3 overflow-0 rounded border'>
							<option value = ''>--- select product ---</option>{
								productsList.map(({id, name}) => (
									<option key = {id} value = {id}>{name}</option>
								))
							}
						</select>
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'mb-2 text-capitalize bold text-muted'>select quantity{(
							(formData?.bulk_unit)
							? ` (${formData?.bulk_unit})`
							: ''
						)} *</p>
						<input onKeyPress = {(e) => (
							(e.target.value.length < 14 && /\d/.test(e.key))
							? true
							: e.preventDefault()
						)} value = {new Intl.NumberFormat().format(formData.productQuantity)} onChange = {(e) => setFormData({...formData, productQuantity: e.target.value.replace(/,/g, '')})} type = 'text' className = 'd-block w-100 p-3 overflow-0 rounded border' />
					</div>
					<div className = 'col-12 mb-4'>
						<p className = 'mb-2 text-capitalize bold text-muted'>notes ({255 - formData.notes.length} letters remaining)</p>
						<textarea size = '255' onKeyPress = {(e) => (
							(e.target.value.length < 255)
							? true
							: e.preventDefault()
						)} value = {formData.notes} onPaste = {(e) => e.preventDefault()} onChange = {(e) => setFormData({...formData, notes: e.target.value})} rows = '5' type = 'text' className = 'd-block w-100 p-3 overflow-0 rounded border resize-0'></textarea>
					</div>
					<div className = 'col-12 mb-4'>
						<Button onClick = {() => AddNewProduction(formData).then(({data, type, production_data}) => {
							notify({
								type: type === 'success' ? type : 'danger',
								message: data,
								callback: () => (
									(type === 'success')
									? (
										setFormData({productID: '',productQuantity: '', notes: ''}),
										addProductionData(production_data),
									)
									: undefined
								)
							})
						})} className = 'btn text-uppercase bold letter-spacing-1 btn-success d-block w-100 p-4 overflow-0 rounded border'>
							save
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

const AddNewProduction = (formData) => fetch(api_routes.user.addNewProduction, {method: 'POST', body: parseObjectToFormData(formData)}).then(e => e.json())