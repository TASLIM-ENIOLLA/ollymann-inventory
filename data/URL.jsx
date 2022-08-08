import {useRouter} from 'next/router'

export const useURL = (prefix) => {
	const userURL = [
		{name: 'dashboard', href: `./dashboard`, icon: <span className = 'bi bi-house fo-s-18'></span>},
		{name: 'production', href: `./production`, icon: <span className = 'bi bi-bank fo-s-18'></span>},
		{name: 'stock', href: `./stock`, icon: <span className = 'bi bi-journal-text fo-s-18'></span>},
		{name: 'settings', href: `./settings`, icon: <span className = 'bi bi-gear fo-s-18'></span>},
		{name: 'logout', href: `./logout`, icon: <span className = 'bi bi-door-open fo-s-18'></span>},
	]

	const adminURL = [
		{name: 'dashboard', href: `./dashboard`, icon: <span className = 'bi bi-house fo-s-18'></span>},
		{name: 'production', href: `./production`, icon: <span className = 'bi bi-bank fo-s-18'></span>},
		// {name: 'sales', href: `./sales`, icon: <span className = 'bi bi-shop fo-s-18'></span>},
		{name: 'users', href: `./users`, icon: <span className = 'bi bi-person-fill fo-s-18'></span>},
		{name: 'stock', href: `./stock`, icon: <span className = 'bi bi-journal-text fo-s-18'></span>},
		{name: 'products', href: `./products`, icon: <span className = 'bi bi-box-seam fo-s-18'></span>},
		{name: 'companies', href: `./companies`, icon: <span className = 'bi bi-bank2 fo-s-18'></span>},
		{name: 'settings', href: `./settings`, icon: <span className = 'bi bi-gear fo-s-18'></span>},
		{name: 'logout', href: `./logout`, icon: <span className = 'bi bi-door-open fo-s-18'></span>},
	]

	return (
		(typeof prefix === 'undefined')
		? []
		: (
			(prefix === 'user')
			? userURL
			: (
				(prefix === 'admin')
				? adminURL
				: []
			)
		)
	)
}