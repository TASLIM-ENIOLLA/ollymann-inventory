import DashBoardTemplate from '../../components/dashboard/Template'
import {decryptString} from '../../functions'
import {useContext, useState, useEffect} from 'react'
import {api_routes} from '../../config'

import {GlobalContext} from '../../contexts/Global'
import NewUserTab from '../../components/tabs/newUser'
import {NewUserContext} from '../../contexts/tabs/newUser'

export default () => {
	const [usersList, setUsersList] = useState()
	const [usersListsRoot, setUsersListRoot] = useState()
	const [newUserTab, setNewUserTab] = useState(!false)
	const [searchParams, setSearchParams] = useState({
		query: '',
		filter: '',
		category: ''
	})
	const NewUserContextValue = {
		tab: {
			toggle: () => setNewUserTab(!newUserTab),
			open: newUserTab
		},
		usersList: {
			add: (userData) => (setUsersList([userData, ...usersListsRoot]), setUsersListRoot([userData, ...usersListsRoot]))
		}
	}

	useEffect(async() => {
		const req = await fetch(api_routes.admin.users)
		const {data} = await req.json()

		setUsersList(data)
	}, [])

	return (
		<DashBoardTemplate>
			<div>
				<NewUserContext.Provider value = {NewUserContextValue}>
					<NewUserTab />
					<div className = 'mb-4 text-left text-md-right'>
						<button onClick = {() => setNewUserTab(true)} className = 'px-5 py-3 text-capitalize btn btn-success border-0 shadow rounded'>add new user</button>
					</div>
				</NewUserContext.Provider>
				<div className = 'row mb-5'>
					<div className = 'col-lg-6 mb-3'>
						<p className = 'bold text-muted mb-2'>Seach user</p>
						<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
							<span className = 'bi bi-search fo-s-15 text-muted ml-4'></span>
							<input className = 'flex-1 bg-clear p-3 border-0 outline-0' type = 'text' />
						</div>
					</div>
					<div className = 'col-lg-3 mb-3'>
						<p className = 'bold text-muted mb-2'>Filter by</p>
						<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
							<span className = 'bi bi-filter fo-s-18 text-muted ml-4'></span>
							<select className = 'text-capitalize flex-1 bg-clear p-3 border-0 outline-0'>
								<option value = 'name'>name</option>
								<option value = 'email'>email</option>
								<option value = 'phone'>phone</option>
								<option value = 'status'>status</option>
							</select>
						</div>
					</div>
					<div className = 'col-lg-3 mb-3'>
						<p className = 'bold text-muted mb-2'>Select category</p>
						<div className = 'flex-h a-i-c bg-white rounded-1x py-1 shadow'>
							<span className = 'bi bi-view-list fo-s-18 text-muted ml-4'></span>
							<select className = 'text-capitalize flex-1 bg-clear p-3 border-0 outline-0'>
								<option value = ''>all</option>
								<option value = 'user'>user</option>
								<option value = 'admin'>admin</option>
							</select>
						</div>
					</div>
				</div>
				<div className = 'table-responsive'>
					<table className = 'table bg-white rounded-1x table-borderless table-hover'>
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
									<tr key = {id} className = {index === usersList.length - 1 ? '' : 'border-bottom'}>
										<td className = 'bold p-4 text-muted'>
											<span className = 'bi bi-check-square cursor-pointer'></span>
										</td>
										<td className = 'p-4 bold text-muted'>{f_name} {l_name}</td>
										<td className = 'p-4 bold text-muted'>{phone}</td>
										<td className = 'p-4 bold text-lowercase text-muted'>{email}</td>
										<td className = 'p-4 bold text-muted'>{priviledge}</td>
										<td className = 'p-4 bold text-muted'>{status}</td>
										<td className = 'p-4 bold text-muted text-primary'>More</td>
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
								(usersList === undefined)
								? (
									<tr>
										<td colSpan = '7'>
											<div className = 'text-center p-5 text-muted'>
												<span className = 'bi bi-arrow-clockwise fa-2x fa-spin'></span>
												<p>Loading...</p>
											</div>
										</td>
									</tr>
								)
								: (
									<tr>
										<td colSpan = '7'>
											<div className = 'text-center p-5 text-muted'>
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