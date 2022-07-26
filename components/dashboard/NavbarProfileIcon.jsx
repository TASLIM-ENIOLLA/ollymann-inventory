import {useContext} from 'react'
import {GlobalContext} from '../../contexts/Global'

export default () => {
	const {userData: {f_name, l_name}, accountType} = useContext(GlobalContext)
	
	return (
		<>
			<div className = 'flex-h a-i-c'>
                <div style = {{width: '50px', height: '50px'}} className = 'mx-2 shadow-sm rounded-circle shadow border user-image'></div>
                <div>
                    <h5 className = 'text-capitalize text-dark'>{f_name} {l_name}</h5>
                    <span className = 'text-muted text-capitalize'>{accountType.replace(/s$/, '')}</span>
                </div>
            </div>
		</>
	)
}
