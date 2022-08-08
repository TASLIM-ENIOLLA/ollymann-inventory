import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString, UniqueSet} from '../../functions'
import {useContext, useState, useEffect} from 'react'
import {api_routes} from '../../config'

import {GlobalContext} from '../../contexts/Global'
import NewCompanyTab from '../../components/tabs/company/newCompany'
import EditCompanyTab from '../../components/tabs/company/editCompany'
import {CompanyContext} from '../../contexts/tabs/Company'
import Currency from '../../components/currency'

export default () => {
	const [companiesList, setCompaniesList] = useState()
	const [companiesListRoot, setCompaniesListRoot] = useState()
	const [newCompanyTab, setNewCompanyTab] = useState(false)
	const [editCompanyTab, setEditCompanyTab] = useState(false)
	const [companyID, setCompanyID] = useState()
	const [searchParams, setSearchParams] = useState({
		query: '',
		companyID: '',
	})
	const CompanyContextValue = {
		newCompany: {
			tab: {
				toggle: () => setNewCompanyTab(!newCompanyTab),
				open: newCompanyTab
			},
			companiesList: {
				add: (companyData) => (
					setCompaniesList([companyData, ...companiesListRoot]),
					setCompaniesListRoot([companyData, ...companiesListRoot])
				)
			}
		},
		editCompany: {
			tab: {
				toggle: (id) => (
					setCompanyID(id),
					setEditCompanyTab(!editCompanyTab)
				),
				open: editCompanyTab,
				companyID
			},
			companiesList: {
				update: (companyData) => (
					setCompaniesList([...companiesListRoot.map((each) => each.id !== companyData.id ? each : companyData)]),
					setCompaniesListRoot([...companiesListRoot.map((each) => each.id !== companyData.id ? each : companyData)])
				),
				remove: (companyID) => (
					setCompaniesList([...companiesListRoot.filter((each) => each.id !== companyID)]),
					setCompaniesListRoot([...companiesListRoot.filter((each) => each.id !== companyID)])
				)
			}
		}
	}

	useEffect(async() => {
		const req = await fetch(api_routes.admin.getCompanyData)
		const {data} = await req.json()

		setCompaniesList(data)
		setCompaniesListRoot(data)
	}, [])

	useEffect(async() => {
		if(companiesListRoot){
			setCompaniesList(
				companiesListRoot
				.filter(
					({id}) => (
						(searchParams.companyID !== '')
						? id === searchParams.companyID
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
			<CompanyContext.Provider value = {CompanyContextValue}>
				<NewCompanyTab />
				<EditCompanyTab />
				<div>
					<div className = 'mb-4 text-left text-md-right'>
						<button onClick = {() => setNewCompanyTab(true)} className = 'px-5 py-3 text-capitalize btn btn-success border-0 shadow rounded'>add new company</button>
					</div>
					<div className = 'row mb-5'>
						<div className = 'col-lg-3 mb-3'>
							<p className = 'bold text-muted mb-2'>Select company</p>
							<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
								<span className = 'bi bi-view-list fo-s-18 text-muted ml-4'></span>
								<select value = {searchParams.companyID} onChange = {(e) => setSearchParams({...searchParams, companyID: e.target.value})} className = 'text-capitalize flex-1 bg-clear d-block w-100 p-3 border-0 outline-0'>
									<option value = ''>all</option>{
										companiesListRoot && companiesListRoot.map(({id, name}) => (
											<option value = {id} key = {id}>{name}</option>
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
									<td className = 'p-4 bold text-muted'>company name</td>
									<td className = 'p-4 bold text-muted'>date created</td>
									<td className = 'p-4 bold text-muted'>edit</td>
								</tr>
							</thead>
							<tbody className = 'border-bottom text-capitalize'>{
								(companiesList)
								? (
									(companiesList.length > 0)
									? companiesList.map(({id, name, timestamp}, index) => (
										<tr key = {`${id}-${index}`} className = {`animated fadeIn ${index === companiesList.length - 1 ? '' : 'border-bottom'}`}>
											<td className = 'p-4 text-muted'>
												<span className = 'bi bi-check-square cursor-pointer'></span>
											</td>
											<td className = 'p-4 text-muted'>{name}</td>
											<td className = 'p-4 text-muted'>
												{new Date(timestamp).toLocaleDateString()}&nbsp;
												{new Date(timestamp).toLocaleTimeString()}
											</td>
											<td className = 'p-4'>
												<button className = 'border-0 bg-clear' onClick = {() => CompanyContextValue.editCompany.tab.toggle(id)}>
													<span title = 'Edit company data?' className = 'bi bi-pencil-square text-success cursor-pointer fo-s-15'></span>
												</button>
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
									(companiesList === undefined)
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
			</CompanyContext.Provider>
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