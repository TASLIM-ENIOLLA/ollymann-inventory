import DashBoardTemplate from '../../components/dashboard/Template'
import NewStockTab from '../../components/tabs/newStock'
import Currency from '../../components/currency'
import {decryptString} from '../../functions'
import {useState, useEffect} from 'react'
import {api_routes} from '../../config'
import {NewStockContext} from '../../contexts/tabs/newStock'

export default () => {
	const [newStockTab, setNewStockTab] = useState(false)
	const [stocksList, updateStocksList] = useState()
	const [stocksListRoot, updateStocksListRoot] = useState()
	const [searchParams, setSearchParams] = useState({
		query: '',
		filter: ''
	})

	useEffect(async() => {
		const req = await fetch(api_routes.user.getStocksList)
		const {data} = await req.json()

		updateStocksList(data)
		updateStocksListRoot(data)
	}, [])

	useEffect(() => {
		if(searchParams.query.length > 0){
			updateStocksList(
				stocksListRoot.filter((stocksData) => (
					(searchParams.filter !== '')
					? new RegExp(searchParams.query, 'i').test(stocksData[searchParams.filter])
					: true
				))
			)
		}
		else{
			updateStocksList(stocksListRoot)
		}
	}, [searchParams])

	return (
		<DashBoardTemplate>
			<div className = 'print vh100 vw100 bg-primary po-fixed top-0 left-0'>
				
			</div>
			<div className = 'screen'>
				<NewStockContext.Provider value = {{newStockTab, stocksList, updateStocksList, setNewStockTab}}>
					<NewStockTab />
					<div className = 'mb-4 text-left text-md-right'>
						<button onClick = {() => setNewStockTab(true)} className = 'px-5 py-3 text-capitalize btn btn-success border-0 shadow rounded'>new stock</button>
					</div>
				</NewStockContext.Provider>
				<div className = 'row mb-5'>
					<div className = 'col-lg-9 mb-3'>
						<p className = 'bold text-muted mb-2'>Seach stock</p>
						<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
							<span className = 'bi bi-search fo-s-18 text-muted ml-4'></span>
							<input value = {searchParams.query} onChange = {(e) => setSearchParams({...searchParams, query: e.target.value})} className = 'flex-1 bg-clear p-3 border-0 outline-0' type = 'text' />
						</div>
					</div>
					<div className = 'col-lg-3 mb-3'>
						<p className = 'bold text-muted mb-2'>Filter by</p>
						<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
							<span className = 'bi bi-filter fo-s-18 text-muted ml-4'></span>
							<select value = {searchParams.filter} onChange = {(e) => setSearchParams({...searchParams, filter: e.target.value})} className = 'text-capitalize flex-1 bg-clear p-3 border-0 outline-0'>
								<option value = ''>---</option>
								<option value = 'productName'>product name</option>
								<option value = 'customerName'>customer name</option>
								<option value = 'customerPhone'>phone number</option>
							</select>
						</div>
					</div>
				</div>
				<div className = 'table-responsive'>
					<table className = 'table table-hover rounded-1x shadow-sm bg-white table-borderless'>
						<thead className = 'border-bottom'>
							<tr>
								<td className = 'p-4 bold text-center text-muted'>
									<span className = 'bi bi-check-square fo-s-15 cursor-pointer'></span>
								</td>
								<td className = 'p-4 bold text-center text-muted'>Product</td>
								<td className = 'p-4 bold text-center text-muted'>Price</td>
								<td className = 'p-4 bold text-center text-muted'>Quantity</td>
								<td className = 'p-4 bold text-center text-muted'>Price Total</td>
								<td className = 'p-4 bold text-center text-muted'>Customer Name</td>
								<td className = 'p-4 bold text-center text-muted'>Phone</td>
								<td className = 'p-4 bold text-center text-muted'>Timestamp</td>
								<td className = 'p-4 bold text-center text-muted'>More</td>
							</tr>
						</thead>
						<tbody>{
							(stocksList)
							? (
								(stocksList.length > 0)
								? stocksList.map(({id, productName, productBulkUnit, productPrice, productQuantity, customerName, customerPhone, timestamp}, index) => (
									<tr key = {id} className = {index === stocksList.length - 1 ? '' : 'border-bottom'}>
										<td className = 'p-4 text-c text-muted'>
											<span className = 'bi bi-check-square fo-s-15 cursor-pointer'></span>
										</td>
										<td className = 'p-4 text-center text-muted text-capitalize'>{productName}</td>
										<td className = 'p-4 text-center text-muted'>{Currency}{new Intl.NumberFormat().format(productPrice)}</td>
										<td className = 'p-4 text-center text-muted'>{new Intl.NumberFormat().format(productQuantity)} {productBulkUnit}{productQuantity > 1 ? 's' : ''}</td>
										<td className = 'p-4 text-center text-muted'>{Currency}{new Intl.NumberFormat().format(productQuantity * productPrice)}</td>
										<td className = 'p-4 text-center text-muted text-capitalize'>{customerName}</td>
										<td className = 'p-4 text-center text-muted'>
											<a className = 'theme-color underline' href ={`tel://${customerPhone}`}>{customerPhone}</a>
										</td>
										<td className = 'p-4 text-center text-muted'>{new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString()}</td>
										<td className = 'p-4 text-center text-muted'>
											<a href = {`./all-stock/${id}`} className = 'theme-color bi bi-box-arrow-up-right fo-s-15'></a>
										</td>
									</tr>
								))
								: (
									<tr>
										<td colSpan = '9'>
											<div className = 'text-center p-5 text-muted'>
												<span className = 'bi bi-robot fa-2x'></span>
												<p>Oops, empty rows returned!</p>
											</div>
										</td>
									</tr>
								)
							)
							: (
								(stocksList === undefined)
								? (
									<tr>
										<td colSpan = '9'>
											<div className = 'text-center p-5 text-muted'>
												<span className = 'bi bi-arrow-clockwise fa-2x fa-spin'></span>
												<p>Loading...</p>
											</div>
										</td>
									</tr>
								)
								: (
									<tr>
										<td colSpan = '9'>
											<div className = 'text-center p-5 text-muted'>
												<p>Empty rows returned!</p>
											</div>
										</td>
									</tr>
								)
							)
						}</tbody>
					</table>
				</div>
				<div className = 'row a-i-c j-c-space-between bold text-muted px-4 my-4'>
					<div className = 'col-sm-4 col-md-auto mb-3 text-center'>
						Page 1 of 34
					</div>
					<div className = 'col-sm-4 col-md-auto flex-h a-i-c mb-3 text-center'>
						<a href = '' className = 'theme-color'>Previous</a>
						<span className = 'bi bi-usb-c-fill mx-4'></span>
						<a href = '' className = 'theme-color'>Next</a>
					</div>
					<div className = 'col-sm-4 col-md-auto mb-3 text-center'>
						{stocksList?.length} rows returned
					</div>
				</div>
			</div>
			<style jsx>{`
				@media print {
					.screen{
						display: none;
					}
				}
				@media screen {
					.print{
						display: none;
					}
				}
			`}</style>
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
	else if(cookie.account_type === 'admins'){
		return {
			redirect: {
				destination: '../admin/dashboard'
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