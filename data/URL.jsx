import {useRouter} from 'next/router'

export const useURL = (prefix) => {
	const userURL = [
		{name: 'dashboard', href: `./dashboard`, icon: <span className = 'bi bi-house fo-s-18'></span>},
		{name: 'all stock', href: `./all-stock`, icon: <span className = 'bi bi-journal-text fo-s-18'></span>},
		// {name: 'new stock', href: `./new-stock`, icon: <span className = 'bi bi-journal-plus fo-s-18'></span>},
		{name: 'settings', href: `./settings`, icon: <span className = 'bi bi-gear fo-s-18'></span>},
		{name: 'logout', href: `./logout`, icon: <span className = 'bi bi-door-open fo-s-18'></span>},
	]

	const adminURL = [
		{name: 'dashboard', href: `./dashboard`, icon: <span className = 'bi bi-house fo-s-18'></span>},
		{name: 'all users', href: `./all-users`, icon: <span className = 'bi bi-person-fill fo-s-18'></span>},
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