import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString} from '../../functions'
import {ProductionContext} from '../../contexts/tabs/production'
import NewProductionTab from '../../components/tabs/production/newProduction'
import EditProductionTab from '../../components/tabs/production/editProduction'
import {useState, useEffect} from 'react'
import {api_routes} from '../../config'

const todaysData = (data) => data.filter(
	({timestamp}) => new RegExp(`^${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`).test(timestamp)
)

const otherData = (data) => data.filter(
	({timestamp}) => !new RegExp(`^${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`).test(timestamp)
)

export default () => {
	const [productionListRoot, setProductionListRoot] = useState()
	const [productionList, setProductionList] = useState()
	const [tableTitle, setTableTitle] = useState(`today's`)
	const [tabStates, setTabStates] = useState({
		newProduction: false,
		editProduction: false,
	})
	const ProductionContextValue = {
		newProduction: {
			open: tabStates.newProduction,
			toggle: () => setTabStates({...tabStates, newProduction: !tabStates.newProduction}),
			addProductionData: (productionData) => setProductionList([
				productionData,
				...productionList
			])
		},
		editProduction: {
			open: tabStates.editProduction,
			toggle: () => setTabStates({...tabStates, editProduction: !tabStates.editProduction})
		},
	}

	useEffect(async() => {
		const req = await fetch(api_routes.user.getProductionList)
		const {data} = await req.json()

		setProductionListRoot(data)
		setProductionList(todaysData(data))
	}, [])

	return (
		<DashBoardTemplate>
			<ProductionContext.Provider value = {ProductionContextValue}>
				<NewProductionTab />
				<EditProductionTab />
				<div className = 'mb-5 po-rel'>
					<div className = 'row j-c-space-between'>
						<div className = 'col-12 mb-4 col-md-auto'>
							<div className = 'row'>
								<div className = 'col-auto'>
									<button title = {`today\'s`} onClick = {(e) => (
											setProductionList(todaysData(productionListRoot)),
											setTableTitle(e.target.title)
										)} className = {`text-capitalize bold letter-spacing-1 outline-0 transit px-4 py-3 ${tableTitle === `today\'s` ? 'rounded-lg shadow-sm bg-white border theme-color' : 'border-0 text-muted bg-clear'}`}>
										today
									</button>
								</div>
								<div className = 'col-auto'>
									<button title = {`previous days'`} onClick = {(e) => (
											setProductionList(otherData(productionListRoot)),
											setTableTitle(e.target.title)
										)} className = {`text-capitalize bold letter-spacing-1 outline-0 transit px-4 py-3 ${tableTitle === `previous days'` ? 'rounded-lg shadow-sm bg-white border theme-color' : 'border-0 text-muted bg-clear'}`}>
										previous days
									</button>
								</div>
							</div>
						</div>{
							(tableTitle === `today's`)
							? (
								<div className = 'col-12 col-md-auto'>
									<button onClick = {() => ProductionContextValue.newProduction.toggle()} className = 'btn btn-success text-uppercase py-3 px-4 bold'>
										add new production
									</button>
								</div>
							)
							: <></>
						}
						
					</div>
				</div>
				<div className = 'mb-5'>
					<div className = 'mb-3'>
						<p className = 'text-uppercase letter-spacing-1 bold text-muted'>{tableTitle} production</p>
					</div>
					<div className = 'table-responsive'>
						<table className = 'table table-hover table-borderless rounded-1x overflow-0'>
							<thead className = 'theme-bg-light text-white'>
								<tr>
									<td className = 'bold letter-spacing-1 text-center'>S/N</td>
									<td>Product</td>
									<td>Quantity</td>
									<td>Timestamp</td>
									<td className = 'text-center'>More</td>
								</tr>
							</thead>
							<tbody className = 'bg-white'>{
								(productionList)
								? (
									(productionList.length > 0)
									? productionList.map(({id, productName, productBulkUnit, productPrice, productQuantity, timestamp}, index) => (
										<tr key = {id}>
											<td className = 'bold letter-spacing-1 text-center'>{++index}</td>
											<td className = 'text-capitalize'>{productName}</td>
											<td className = 'text-capitalize'>{`
												${new Intl.NumberFormat().format(productQuantity)}
												${(productQuantity > 1) ? `${productBulkUnit}s` : productBulkUnit}
											`}</td>
											<td className = 'text-capitalize'>{new Date(timestamp).toDateString()}, {new Date(timestamp).toLocaleTimeString()}</td>
											<td className = 'text-capitalize text-center'>
												<button className = 'bg-clear border-0'>
													<span className = 'fo-s-15 bi bi-box-arrow-up-right'></span>
												</button>
											</td>
										</tr>
									))
									: (
										<tr>
											<td colSpan = '5'>
												<div className = 'col-12'>
													<div className = 'text-center bold letter-spacing-1 text-muted p-5'>
														<span className = 'fa bi-info-square-fill fo-s-22'></span>
														<p>No production made today!</p>
													</div>
												</div>
											</td>
										</tr>
									)
								)
								: (
									(productionList === undefined)
									? (
										<tr>
											<td colSpan = '5'>
												<div className = 'col-12'>
													<div className = 'text-center bold letter-spacing-1 text-muted p-5'>
														<span className = 'fa fa-spin bi-arrow-clockwise fo-s-22'></span>
														<p>Loading</p>
													</div>
												</div>
											</td>
										</tr>
									)
									: <></>
								)
							}</tbody>
						</table>
					</div>
				</div>
				{/*<div className = 'mb-5'>
					<div className = 'mb-3'>
						<p className = 'text-uppercase letter-spacing-1 bold text-muted'>previous production</p>
					</div>
					<div className = 'table-responsive'>
						<table className = 'table table-hover table-borderless rounded-1x overflow-0'>
							<thead className = 'theme-bg-light text-white'>
								<tr>
									<td className = 'bold letter-spacing-1 text-center'>S/N</td>
									<td>Product</td>
									<td>Quantity</td>
									<td>Timestamp</td>
									<td className = 'text-center'>More</td>
								</tr>
							</thead>
							<tbody className = 'bg-white'>{
								(productionList)
								? (
									(productionList.others.length > 0)
									? productionList.others.map(({id, productName, productBulkUnit, productPrice, productQuantity, timestamp}, index) => (
										<tr key = {id}>
											<td className = 'bold letter-spacing-1 text-center'>{++index}</td>
											<td className = 'text-capitalize'>{productName}</td>
											<td className = 'text-capitalize'>{`
												${new Intl.NumberFormat().format(productQuantity)}
												${(productQuantity > 1) ? `${productBulkUnit}s` : productBulkUnit}
											`}</td>
											<td className = 'text-capitalize'>{new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString()}</td>
											<td className = 'text-capitalize text-center'>
												<button className = 'bg-clear border-0'>
													<span className = 'fo-s-15 bi bi-box-arrow-up-right'></span>
												</button>
											</td>
										</tr>
									))
									: (
										<tr>
											<td colSpan = '5'>
												<div className = 'col-12'>
													<div className = 'text-center bold letter-spacing-1 text-muted p-5'>
														<span className = 'fa bi-info-square-fill fo-s-22'></span>
														<p>Empty rows returned!</p>
													</div>
												</div>
											</td>
										</tr>
									)
								)
								: (
									(productionList === undefined)
									? (
										<tr>
											<td colSpan = '5'>
												<div className = 'col-12'>
													<div className = 'text-center bold letter-spacing-1 text-muted p-5'>
														<span className = 'fa fa-spin bi-arrow-clockwise fo-s-22'></span>
														<p>Loading</p>
													</div>
												</div>
											</td>
										</tr>
									)
									: <></>
								)
							}</tbody>
						</table>
					</div>
				</div>*/}
				<style>{`
					.theme-bg-light{
						background: #5161ceaa;
					}
					.flex-nowrap{
						flex-wrap: nowrap;
					}
					td{
						padding: 15px !important;
					}
				`}</style>
			</ProductionContext.Provider>
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