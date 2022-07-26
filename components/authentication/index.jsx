import {useState, useEffect} from 'react'

export const UsernameField = ({onChange, otherProps}) => {
	const [username, setUsername] = useState('')

	useEffect(() => {
		typeof onChange === 'function' ? onChange(username) : undefined
	}, [username])

	return (
		<div className = 'border flex-h a-i-c py-1 rounded overflow-0'>
			<div className = 'pl-3'>
				<span className = {`text-${username.length > 0 ? 'primary' : 'muted'} bi bi-person-badge transit fa-2x`}></span>
			</div>
			<input name = 'username' value = {username} onChange = {(e) => setUsername(e.target.value)} type = 'text' size = '255' className = 'd-block fo-s-16 outline-0 w-100 border-0 p-3' {...otherProps} />
		</div>
	)
}

export const PasswordField = ({onChange, otherProps}) => {
	const [password, setPassword] = useState('')
	const [seePassword, setSeePassword] = useState(false)

	useEffect(() => {
		typeof onChange === 'function' ? onChange(password) : undefined
	}, [password])

	return (
		<div className = 'border flex-h a-i-c py-1 rounded overflow-0'>
			<div className = 'pl-3'>
				<span className = {`bi text-${password.length > 0 ? 'primary' : 'muted'} bi-lock-fill fa-2x`}></span>
			</div>
			<input name = 'password' value = {password} onChange = {(e) => setPassword(e.target.value)} type = {seePassword ? 'text' : 'password'} className = 'd-block fo-s-16 outline-0 w-100 border-0 p-3' {...otherProps} />
			<div className = 'pr-3' onClick = {() => setSeePassword(!seePassword)}>
				<span className = {`bi bi-${!seePassword ? 'eye-slash-fill text-muted' : 'eye-fill text-primary'} fa-2x`}></span>
			</div>
		</div>
	)
}

export const Button = ({children, onClick, className, ...buttonProps}) => {
	const LoadingComponent = () => <span className = 'fa bi-arrow-clockwise fo-s-22 fa-spin'></span>
	const [defaultChildren, setDefaultChildren] = useState(children)
	const [buttonClicked, setButtonClicked] = useState(false)


	return (
		<button className = {`${buttonClicked ? 'disabled' : ''} ${className}`} onClick = {(e) => new Promise(
			resolved => {
				setButtonClicked(true)
				setDefaultChildren(<LoadingComponent />)
				typeof onClick === 'function' ? resolved(onClick(e)) : resolved()
			}
		).then(e => {
			setTimeout(() => {
				setButtonClicked(false)
				setDefaultChildren(children)
			}, 500)
		})} {...buttonProps}>
			{defaultChildren}
		</button>
	)
}