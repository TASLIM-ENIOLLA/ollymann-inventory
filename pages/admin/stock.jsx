import DashBoardTemplate from '../../components/dashboard/Template'
import NewStockTab from '../../components/tabs/stock/newStock'
import ViewStockTab from '../../components/tabs/stock/viewStock'
import Currency from '../../components/currency'
import {decryptString} from '../../functions'
import {useState, useEffect} from 'react'
import {api_routes} from '../../config'
import {StockContext} from '../../contexts/tabs/stock'
import {NewStockContext} from '../../contexts/tabs/stock/newStock'
import {ViewStockContext} from '../../contexts/tabs/stock/viewStock'

class TablePageData{
	constructor({rows, pageNumber, pageRowsLength}){
		this.rows = rows
		this.pageNumber = pageNumber
		this.pageRowsLength = pageRowsLength
		this.maxPages = Math.ceil(this.rows.length / this.pageRowsLength)
	}
	getPagesTableRows = () => this.rows.filter((each, index) => (
		(index >= ((this.pageNumber - 1) * this.pageRowsLength) && index < (this.pageNumber * this.pageRowsLength))
		? true
		: false
	))
}

export default () => {
	const [tablePageData, setTablePageData] = useState()
	const [dataRows, setDataRows] = useState({
		pageNumber: 1,
		pageRowsLength: 5,
		data: []
	})
	const [newStockTab, setNewStockTab] = useState(false)
	const [viewStockTab, setViewStockTab] = useState(false)
	const [stocksList, updateStocksList] = useState()
	const [viewStockID, setViewStockID] = useState()
	const [stocksListRoot, updateStocksListRoot] = useState()
	const [searchParams, setSearchParams] = useState({
		query: '',
		filter: ''
	})

	const StockTabContextValue = {
		viewStock: {
			visible: viewStockTab,
			stockID: viewStockID,
			toggle: (stockID) => {
				setViewStockID(stockID)
				setViewStockTab(!viewStockTab)
			},
			addNewStock: (stockData) => {
				updateStocksList([stockData, ...stocksList])
				updateStocksListRoot([stockData, ...stocksListRoot])
			},
		},
		newStock: {
			visible: newStockTab,
			toggle: () => setNewStockTab(!newStockTab),
			addNewStock: (stockData) => {
				updateStocksList([stockData, ...stocksList])
				updateStocksListRoot([stockData, ...stocksListRoot])
			},
		}
	}

	useEffect(async() => {
		const req = await fetch(api_routes.user.getStocksList)
		const {data} = await req.json()

		setDataRows({...dataRows, data})
	}, [])

	useEffect(() => {
		setTablePageData(
			new TablePageData({
				rows: dataRows.data,
				pageNumber: dataRows.pageNumber,
				pageRowsLength: dataRows.pageRowsLength
			})
		)
	}, [dataRows])

	useEffect(() => {
		updateStocksList(tablePageData?.getPagesTableRows())
		updateStocksListRoot(tablePageData?.getPagesTableRows())
	}, [tablePageData])

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
			<StockContext.Provider value = {StockTabContextValue}>
				<ViewStockTab />
				<NewStockTab />
				<div className = 'screen'>
					<div className = 'mb-4 text-left text-md-right'>
						<button onClick = {() => StockTabContextValue.newStock.toggle()} className = 'px-5 py-3 text-capitalize btn btn-success border-0 shadow rounded'>new stock</button>
					</div>
					<div className = 'row mb-5'>
						<div className = 'col-lg-9 mb-3'>
							<p className = 'bold text-muted mb-2'>Search stock</p>
							<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
								<span className = 'bi bi-search fo-s-18 text-muted ml-4'></span>
								<input value = {searchParams.query} onChange = {(e) => setSearchParams({...searchParams, query: e.target.value})} className = 'flex-1 bg-clear p-3 border-0 outline-0' type = 'text' />
							</div>
						</div>
						<div className = 'col-lg-3 mb-3'>
							<p className = 'bold text-muted mb-2'>Search by</p>
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
						<table className = 'table table-hover rounded-1x overflow-0 shadow-sm bg-white table-borderless'>
							<thead className = 'border-bottom bg-secondary-light'>
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
												<button onClick = {() => StockTabContextValue.viewStock.toggle(id)} className = 'theme-color bg-clear border-0 bi bi-box-arrow-up-right fo-s-15'></button>
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
					<div className = 'row a-i-c j-c-space-between bold text-muted my-4'>
						<div className = 'col-sm-auto col-12 mb-4 text-center'>
							<div>
								<button onClick = {() => (
									(tablePageData.pageNumber > 1)
									? setDataRows({...dataRows, pageNumber: dataRows.pageNumber - 1})
									: undefined
								)} className = {`${tablePageData?.pageNumber > 1 ? '' : 'disabled'} rounded btn btn-primary py-2 px-3 text-capitalize`}>previous</button>
							</div>
						</div>
						<div className = 'col-sm-auto col-12 mb-4 text-center'>
							<div className = ''>
								Page {tablePageData?.pageNumber} of {tablePageData?.maxPages}
							</div>
						</div>
						<div className = 'col-sm-auto col-12 mb-4 text-center'>
							<div>
								<button onClick = {() => (
									(tablePageData.pageNumber < tablePageData.maxPages)
									? setDataRows({...dataRows, pageNumber: dataRows.pageNumber + 1})
									: undefined
								)} className = {`${tablePageData?.pageNumber < tablePageData?.maxPages ? '' : 'disabled'} rounded btn btn-primary py-2 px-3 text-capitalize`}>next</button>
							</div>
						</div>
					</div>
				</div>
				<style jsx>{`
					// @media print {
					// 	.screen{
					// 		display: none;
					// 	}
					// }
					// @media screen {
					// 	.print{
					// 		display: none;
					// 	}
					// }
					.bg-secondary-light{
						background: #dfdfdf;
					}
				`}</style>
			</StockContext.Provider>
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