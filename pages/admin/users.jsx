import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString} from '../../functions'
import {useContext, useState, useEffect} from 'react'
import {api_routes} from '../../config'

import {GlobalContext} from '../../contexts/Global'
import NewUserTab from '../../components/tabs/user/newUser'
import ViewUserTab from '../../components/tabs/user/viewUser'
import {UserContext} from '../../contexts/tabs/user/User'

export default () => {
	const [usersList, setUsersList] = useState()
	const [usersListsRoot, setUsersListRoot] = useState()
	const [newUserTab, setNewUserTab] = useState(false)
	const [viewUserTab, setViewUserTab] = useState(false)
	const [userID, setUserID] = useState()
	const [searchParams, setSearchParams] = useState({
		query: '',
		filter: '',
		category: '',
		status: '',
	})
	const UserContextValue = {
		newUser: {
			tab: {
				toggle: () => setNewUserTab(!newUserTab),
				open: newUserTab
			},
			usersList: {
				add: (userData) => (
					setUsersList([userData, ...usersListsRoot]),
					setUsersListRoot([userData, ...usersListsRoot])
				)
			}
		},
		viewUser: {
			tab: {
				toggle: function(id){
					setViewUserTab(!viewUserTab)
					setUserID(id)
				},
				userID: userID,
				open: viewUserTab,
			},
			usersList: {
				remove: (userID) => (
					setUsersList([...usersListsRoot.filter((each) => each.id !== userID)]),
					setUsersListRoot([...usersListsRoot.filter((each) => each.id !== userID)])
				),
				update: (userData) => (
					setUsersList([userData, ...usersListsRoot.filter((each) => each.id !== userData.id)]),
					setUsersListRoot([userData, ...usersListsRoot.filter((each) => each.id !== userData.id)])
				)
			}
		}
	}

	useEffect(async() => {
		const req = await fetch(api_routes.admin.getUsers)
		const {data} = await req.json()

		setUsersList(data)
		setUsersListRoot(data)
	}, [])

	useEffect(async() => {
		if(usersListsRoot){
			setUsersList(
				usersListsRoot
				.filter(
					({priviledge}) => (
						(searchParams.category !== '')
						? priviledge === searchParams.category
						: true
					)
				)
				.filter(
					({status}) => (
						(searchParams.status !== '')
						? status === searchParams.status
						: true
					)
				)
				.filter(
					(usersData) => (
						(searchParams.query !== '' && searchParams.filter !== '')
						? new RegExp(searchParams.query, 'i').test(
							(searchParams.filter === name)
							? `${usersData.f_name} ${usersData.l_name}`
							: usersData[searchParams.filter]
						)
						: true
					)
				)
			)
		}
	}, [searchParams])

	return (
		<DashBoardTemplate>
			<UserContext.Provider value = {UserContextValue}>
				<NewUserTab />
				<ViewUserTab />
				<div>
					<div className = 'mb-4 text-left text-md-right'>
						<button onClick = {() => setNewUserTab(true)} className = 'px-5 py-3 text-capitalize btn btn-success border-0 shadow rounded'>add new user</button>
					</div>
					<div className = 'row mb-5'>
						<div className = 'col-lg-6 mb-3'>
							<p className = 'bold text-muted mb-2'>Search user{(
								(searchParams.filter !== '')
								? ` by ${searchParams.filter}`
								: ''
							)}</p>
							<div className = 'flex-h a-i-c bg-white rounded-1x shadow'>
								<span className = 'bi bi-search fo-s-15 text-muted ml-4'></span>
								<input value = {searchParams.query} onChange = {(e) => setSearchParams({...searchParams, query: e.target.value})} className = 'flex-1 bg-clear p-2 border-0 outline-0' type = 'text' />
								<div className = 'border-left'>
									<select style = {{minWidth: '10px'}} value = {searchParams.filter} onChange = {(e) => setSearchParams({...searchParams, filter: e.target.value})} className = 'text-capitalize bg-clear d-block w-100 p-3 border-0 outline-0'>
										<option value = ''>--- search by ---</option>
										<option value = 'name'>name</option>
										<option value = 'email'>email</option>
										<option value = 'phone'>phone</option>
									</select>
								</div>
							</div>
						</div>
						<div className = 'col-lg-3 mb-3'>
							<p className = 'bold text-muted mb-2'>Select category</p>
							<select value = {searchParams.category} onChange = {(e) => setSearchParams({...searchParams, category: e.target.value})} className = 'text-capitalize d-block w-100 bg-clear p-3 bg-white shadow rounded-1x border-0 outline-0'>
								<option value = ''>all</option>
								<option value = 'administrator'>administrator</option>
								<option value = 'user'>user</option>
							</select>
						</div>
						<div className = 'col-lg-3 mb-3'>
							<p className = 'bold text-muted mb-2'>Status</p>
							<select value = {searchParams.status} onChange = {(e) => setSearchParams({...searchParams, status: e.target.value})} className = 'text-capitalize d-block w-100 bg-clear p-3 bg-white shadow rounded-1x border-0 outline-0'>
								<option value = ''>all</option>
								<option value = 'active'>active</option>
								<option value = 'inactive'>inactive</option>
							</select>
						</div>
					</div>
					<div className = 'table-responsive'>
						<table className = 'text-center table bg-white rounded-1x table-borderless table-hover'>
							<thead className = 'border-bottom text-capitalize'>
								<tr>
									<td className = 'bold p-4 text-muted'>
										<span className = 'bi bi-check-square cursor-pointer'></span>
									</td>
									<td className = 'p-4 bold text-muted'>name</td>
									<td className = 'p-4 bold text-muted'>phone</td>
									<td className = 'p-4 bold text-muted'>email</td>
									<td className = 'p-4 bold text-muted'>priviledge</td>
									<td className = 'p-4 bold text-muted'>status</td>
									<td className = 'p-4 bold text-muted text-primary'>More</td>
								</tr>
							</thead>
							<tbody className = 'border-bottom text-capitalize'>{
								(usersList)
								? (
									(usersList.length > 0)
									? usersList.map(({id, f_name, l_name, phone, email, status, priviledge}, index) => (
										<tr key = {`${id}-${index}`} className = {`animated fadeIn ${index === usersList.length - 1 ? '' : 'border-bottom'}`}>
											<td className = 'p-4 text-muted'>
												<span className = 'bi bi-check-square cursor-pointer'></span>
											</td>
											<td className = 'p-4 text-muted'>{f_name} {l_name}</td>
											<td className = 'p-4 text-muted'>{phone}</td>
											<td className = 'p-4 text-lowercase text-muted'>
												<a className = 'theme-color underline' href = {`mailto://${email}`}>{email}</a>
											</td>
											<td className = 'p-4 text-muted'>{priviledge}</td>
											<td className = 'p-4 text-muted'>
												<span className = {`text-${status === 'active' ? 'success' : 'danger'}`}>{status}</span>
											</td>
											<td className = 'p-4 text-muted text-primary'>
												<button onClick = {() => UserContextValue.viewUser.tab.toggle(id)} className = 'theme-color bg-clear border-0 bi bi-box-arrow-up-right fo-s-15'></button>
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
									(usersList === undefined)
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
			</UserContext.Provider>
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