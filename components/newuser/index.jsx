import {useState, useEffect} from 'react'
import {api_routes} from '../../config'

export const GenerateUsername = ({value, onChange, accountType}) => {
	const [username, setUsername] = useState(value)

	useEffect(() => typeof onChange === 'function' ? onChange(username) : undefined, [username])

	return (
		<div className = 'col-12 mb-4'>
			<p className = 'bold theme-color mb-2'>Username</p>
			<div className = 'flex-h a-i-c bg-light border overflow-0 rounded'>
				<input type = 'text' value = {username} onChange = {(e) => setUsername(e.target.value)} className = 'border-0 d-block w-100 rounded bg-clear pointer-events-0 user-select-0 bold letter-spacing-1 text-muted p-3' />
				<button onClick = {() => generateUsername(accountType).then(({data}) => setUsername(data))} title = 'Generate username' className = 'py-1 border-0 theme-bg py-3 px-4'>
					<span className = 'cursor-pointer fa bi-arrow-clockwise text-white bold fo-s-20'></span>
				</button>
			</div>
		</div>
	)
}

const generateUsername = (accountType) => fetch(`${api_routes.admin.generateUsername}?accountType=${accountType}`).then(response => response.json())