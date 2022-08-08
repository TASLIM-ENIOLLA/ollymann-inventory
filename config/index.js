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
	login: `${server.backend.url}php/processes/Login.php`,
	reset_password: `${server.backend.url}php/processes/ResetPassword.php`,
	admin: {
		dashboard: `${server.backend.url}php/processes/admin/Dashboard.php`,
		addNewUser: `${server.backend.url}php/processes/admin/AddNewUser.php`,
		addNewProduct: `${server.backend.url}php/processes/admin/AddNewProduct.php`,
		addNewCompany: `${server.backend.url}php/processes/admin/AddNewCompany.php`,
		updateCompany: `${server.backend.url}php/processes/admin/UpdateCompany.php`,
		deleteCompany: `${server.backend.url}php/processes/admin/DeleteCompany.php`,
		updateUser: `${server.backend.url}php/processes/admin/UpdateUser.php`,
		updateProduct: `${server.backend.url}php/processes/admin/UpdateProduct.php`,
		deleteProduct: `${server.backend.url}php/processes/admin/DeleteProduct.php`,
		deleteUser: `${server.backend.url}php/processes/admin/DeleteUser.php`,
		generateUsername: `${server.backend.url}php/processes/admin/GenerateUsername.php`,	
		getCompanyData: `${server.backend.url}php/processes/admin/GetCompanyData.php`,
		getProductsList: `${server.backend.url}php/processes/admin/GetProductsList.php`,
		getUsers: `${server.backend.url}php/processes/admin/GetUsers.php`,	
	},
	user: {
		getProductsList: `${server.backend.url}php/processes/user/GetProductsList.php`,
		getProductionList: `${server.backend.url}php/processes/user/GetProductionList.php`,
		getStocksList: `${server.backend.url}php/processes/user/GetStocksList.php`,
		addNewStock: `${server.backend.url}php/processes/user/AddNewStock.php`,
		updateStock: `${server.backend.url}php/processes/user/UpdateStock.php`,
		getUserData: `${server.backend.url}php/processes/user/GetUserData.php`,
		addNewProduction: `${server.backend.url}php/processes/user/AddNewProduction.php`,
	}
}