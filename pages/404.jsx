import {useRouter} from 'next/router'

export default () => {
	const {back: goBack} = useRouter()
	return (
		<>
			<div className = 'overflow-y-auto py-5 vh100 vw100 bg-white'>
				<div className = 'text-center h-100 flex-v j-c-c'>
					<div>
		        		<h1 className = 'fa-5x'>404</h1>
		        		<p>The page you requested does not exist.</p>
		        		<button onClick = {() => goBack()} className = 'mt-4 btn btn-dark text-capitalize px-5 shadow py-3'>go back</button>
					</div>					
				</div>
		    </div>
		    <style jsx>{`
		    	.background{
		    		background-image: url();
		    		background-size: cover;
		    		background-position: center;
		    	}
		    `}</style>
		</>	
	)
}