import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString, UniqueSet} from '../../functions'
import {useContext, useState, useEffect} from 'react'
import {api_routes} from '../../config'

import {GlobalContext} from '../../contexts/Global'
import NewProductTab from '../../components/tabs/product/newProduct'
import ViewProductTab from '../../components/tabs/product/viewProduct'
import {ProductContext} from '../../contexts/tabs/Product'
import Currency from '../../components/currency'

export default () => {
	const [productsList, setProductsList] = useState()
	const [productsListRoot, setProductsListRoot] = useState()
	const [newProductTab, setNewProductTab] = useState(false)
	const [viewProductTab, setViewProductTab] = useState(false)
	const [productID, setProductID] = useState()
	const [companyData, setCompanyData] = useState([])
	const [searchParams, setSearchParams] = useState({
		query: '',
		companyID: '',
	})
	const ProductContextValue = {
		newProduct: {
			tab: {
				toggle: () => setNewProductTab(!newProductTab),
				open: newProductTab,
			},
			productsList: {
				add: (productData) => (
					setProductsList([productData, ...productsListRoot]),
					setProductsListRoot([productData, ...productsListRoot])
				)
			}
		},
		viewProduct: {
			tab: {
				toggle: (id) => (
					setProductID(id),
					setViewProductTab(!viewProductTab)
				),
				productID,
				open: viewProductTab
			},
			productsList: {
				update: (productData) => (
					setProductsList([
						...productsListRoot.map((each) => each.id !== productData.id ? each : productData)
					]),
					setProductsListRoot([
						...productsListRoot.map((each) => each.id !== productData.id ? each : productData)
					]),
				),
				remove: (productID) => (
					setProductsList([...productsListRoot.filter((each) => each.id !== productID)]),
					setProductsListRoot([...productsListRoot.filter((each) => each.id !== productID)])
				),
			}
		},
	}

	useEffect(async() => {
		const req1 = await fetch(api_routes.admin.getProductsList)
		const req2 = await fetch(api_routes.admin.getCompanyData)
		const {data: data1} = await req1.json()
		const {data: data2} = await req2.json()

		setProductsList(data1)
		setProductsListRoot(data1)
		setCompanyData(data2)
	}, [])

	useEffect(async() => {
		if(productsListRoot){
			setProductsList(
				productsListRoot
				.filter(
					({companyID}) => (
						(searchParams.companyID !== '')
						? companyID === searchParams.companyID
						: true
					)
				)
				.filter(
					({name}) => (
						(searchParams.query !== '')
						? new RegExp(searchParams.query, 'i').test(name)
						: true
					)
				)
			)
		}
	}, [searchParams])

	return (
		<DashBoardTemplate>
			<ProductContext.Provider value = {ProductContextValue}>
				<NewProductTab />
				<ViewProductTab />
				<div>
					<div className = 'mb-4 text-left text-md-right'>
						<button onClick = {() => setNewProductTab(true)} className = 'px-5 py-3 text-capitalize btn btn-success border-0 shadow rounded'>add new product</button>
					</div>
					<div className = 'row mb-5'>
						<div className = 'col-lg-9 mb-3'>
							<p className = 'bold text-muted mb-2'>Seach products</p>
							<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
								<span className = 'bi bi-search fo-s-15 text-muted ml-4'></span>
								<input value = {searchParams.query} onChange = {(e) => setSearchParams({...searchParams, query: e.target.value})} className = 'flex-1 bg-clear p-3 border-0 outline-0' type = 'text' />
							</div>
						</div>
						<div className = 'col-lg-3 mb-3'>
							<p className = 'bold text-muted mb-2'>Select company</p>
							<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
								<span className = 'bi bi-view-list fo-s-18 text-muted ml-4'></span>
								<select value = {searchParams.companyID} onChange = {(e) => setSearchParams({...searchParams, companyID: e.target.value})} className = 'text-capitalize flex-1 bg-clear p-3 border-0 outline-0'>
									<option value = ''>all</option>{
										companyData.map(({name, id}) => (
											<option key = {id} value = {id}>{name}</option>
										))
									}
								</select>
							</div>
						</div>
					</div>
					<div className = 'table-responsive'>
						<table className = 'text-center table bg-white rounded-1x table-borderless table-hover'>
							<thead className = 'border-bottom text-capitalize'>
								<tr>
									<td className = 'bold p-4 text-muted'>
										<span className = 'bi bi-check-square cursor-pointer'></span>
									</td>
									<td className = 'p-4 bold text-muted'>product name</td>
									<td className = 'p-4 bold text-muted'>company name</td>
									<td className = 'p-4 bold text-muted'>price</td>
									<td className = 'p-4 bold text-muted'>bulk unit</td>
									<td className = 'p-4 bold text-muted text-primary'>More</td>
								</tr>
							</thead>
							<tbody className = 'border-bottom text-capitalize'>{
								(productsList)
								? (
									(productsList.length > 0)
									? productsList.map(({id, name, companyName, bulk_unit, price}, index) => (
										<tr key = {`${id}-${index}`} className = {`animated fadeIn ${index === productsList.length - 1 ? '' : 'border-bottom'}`}>
											<td className = 'p-4 text-muted'>
												<span className = 'bi bi-check-square cursor-pointer'></span>
											</td>
											<td className = 'p-4 text-muted'>{name}</td>
											<td className = 'p-4 text-muted'>{companyName}</td>
											<td className = 'p-4 text-muted'>{Currency}{new Intl.NumberFormat().format(price)}</td>
											<td className = 'p-4 text-muted'>{bulk_unit}</td>
											<td className = 'p-4 text-muted text-primary'>
												<button onClick = {() => ProductContextValue.viewProduct.tab.toggle(id)} className = 'bg-clear theme-color bi bi-box-arrow-up-right border-0 fo-s-15'></button>
											</td>
										</tr>
									))
									: (
										<tr>
											<td colSpan = '9'>
												<div className = 'animated fadeIn text-center p-5 text-muted'>
													<span className = 'bi bi-robot fa-2x'></span>
													<p>Oops, empty rows returned!</p>
												</div>
											</td>
										</tr>
									)
								)
								: (
									(productsList === undefined)
									? (
										<tr>
											<td colSpan = '7'>
												<div className = 'animated fadeIn text-center p-5 text-muted'>
													<span className = 'fa bi-arrow-clockwise fa-2x fa-spin'></span>
													<p>Loading...</p>
												</div>
											</td>
										</tr>
									)
									: (
										<tr>
											<td colSpan = '7'>
												<div className = 'animated fadeIn text-center p-5 text-muted'>
													<p>Empty rows returned!</p>
												</div>
											</td>
										</tr>
									)
								)
							}
								
							</tbody>
						</table>
					</div>
				</div>
			</ProductContext.Provider>
		</DashBoardTemplate>		
	)
}

export const getServerSideProps = (context) => {
	const {req: {cookies}} = context
	const cookie = cookies['OLLYMANN_INVENTORY'] ? JSON.parse(decryptString(cookies['OLLYMANN_INVENTORY'])) : undefined

	if(!cookie){
		return {
			redirect: {
				destination: '/login'
			}
		}
	}
	else if(cookie.account_type === 'users'){
		return {
			redirect: {
				destination: '../user/dashboard'
			}
		}	
	}

	return {
		props: {
			userData: cookie,
			accountType: cookie.account_type
		}
	}
}