import {ProductionContext} from '../../../contexts/tabs/production'
import {useContext} from 'react'

export default () => {
	const {editProduction: {open, toggle}} = useContext(ProductionContext)

	return (
		<div style = {{background: 'rgba(0,0,0,.5)'}} className = {`${open ? '' : 'd-none'} animated fadeIn top-0 left-0 vh100 vw100 po-fixed overflow-y-auto`}>
			<div style = {{maxWidth: '500px'}} className = 'p-4 mx-auto rounded-1x bg-white'>
				<div className = 'row'>
					<p>select product</p>
					<input type = 'text' className = 'd-block w-100 p-3 border' />
				</div>
			</div>
		</div>
	)
}