const dev = process.env.NODE_ENV !== 'production'

export const server = {
	frontend: {
		url: (
			(dev)
			? 'http://localhost:3000/'
			: ''
		)
	},
	backend: {
		url: (
			(dev)
			? 'http://localhost:80/ollymann-inventory/'
			: ''
		)
	}
}

export const api_routes = {
	login: `${server.backend.url}php/processes/login.php`,
	admin: {
		users: `${server.backend.url}php/processes/admin/users.php`,	
	},
	user: {
		getProductsList: `${server.backend.url}php/processes/user/GetProductsList.php`,
		getStocksList: `${server.backend.url}php/processes/user/GetStocksList.php`,
		addNewStock: `${server.backend.url}php/processes/user/AddNewStock.php`,
		getUserData: `${server.backend.url}php/processes/user/GetUserData.php`,
	}
}