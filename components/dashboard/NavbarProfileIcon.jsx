import {useContext} from 'react'
import {GlobalContext} from '../../contexts/Global'

export default () => {
	const {userData: {f_name, l_name}, accountType} = useContext(GlobalContext)
	
	return (
		<>
			<div className = 'flex-h a-i-c'>
                <div className = 'mx-2 shadow-sm rounded-circle shadow flex-h a-i-c j-c-c text-center border' id = 'user-image'>
                	<span className = 'bi bi-person-fill text-muted fa-3x'></span>
                </div>
                <div>
                    <h5 className = 'text-capitalize text-dark'>{f_name} {l_name}</h5>
                    <span className = 'text-muted text-capitalize'>{accountType.replace(/s$/, '')}</span>
                </div>
            </div>
            <style jsx>{`
	            #user-image{
	            	width: 50px;
	            	height: 50px;
	                background-size: cover;
	                background-position: center;
	                // background-image: url(/images/user_002.png);
	            }
            `}</style>
		</>
	)
}
