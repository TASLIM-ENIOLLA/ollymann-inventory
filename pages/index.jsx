export default () => {
	return (
		<h1 className = 'bg-danger'>Index</h1>
	)
}

export const getServerSideProps = () => {
	return {
		redirect: {
			destination: '/login'
		}
	}
}