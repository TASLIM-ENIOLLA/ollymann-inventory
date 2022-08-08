import Currency from '../currency'

export default ({dataColumns = [], dataProperties = [], data = []}) => {
		
	return  (
		<>
			<div className = 'table-responsive'>
				<table className = 'table table-hover rounded-1x shadow-sm bg-white table-borderless'>
					<thead className = 'border-bottom'>
						<tr>
							<td className = 'p-4 bold text-center text-muted'>
								<span className = 'bi bi-check-square fo-s-15 cursor-pointer'></span>
							</td>{
								dataColumns && dataColumns.map((each, key) => {
									<td key = {key} className = 'p-4 bold text-center text-muted'>{each}</td>
								})
							}
						</tr>
					</thead>
					<tbody>{
						(data)
						? (
							(data.length > 0)
							? true
							// dataColumns.map((each, index) => (
							// 	<tr key = {data[index].id} className = {index === data.length - 1 ? '' : 'border-bottom'}>
							// 		<td className = 'p-4 text-c text-muted'>
							// 			<span className = 'bi bi-check-square fo-s-15 cursor-pointer'></span>
							// 		</td>
							// 		<td className = 'p-4 text-center text-muted text-capitalize'>{data[index].productName}</td>
							// 		<td className = 'p-4 text-center text-muted'>{Currency}{new Intl.NumberFormat().format(data[index].productPrice)}</td>
							// 		<td className = 'p-4 text-center text-muted'>{new Intl.NumberFormat().format(data[index].productQuantity)} {data[index].productBulkUnit}{data[index].productQuantity > 1 ? 's' : ''}</td>
							// 		<td className = 'p-4 text-center text-muted'>{Currency}{new Intl.NumberFormat().format(data[index].productQuantity * data[index].productPrice)}</td>
							// 		<td className = 'p-4 text-center text-muted text-capitalize'>{data[index].customerName}</td>
							// 		<td className = 'p-4 text-center text-muted'>
							// 			<a className = 'theme-color underline' href ={`tel://${data[index].customerPhone}`}>{data[index].customerPhone}</a>
							// 		</td>
							// 		<td className = 'p-4 text-center text-muted'>{new Date(data[index].timestamp).toLocaleDateString()} {new Date(data[index].timestamp).toLocaleTimeString()}</td>
							// 		<td className = 'p-4 text-center text-muted'>
							// 			<a href = {`./stock/${data[index].id}`} className = 'theme-color bi bi-box-arrow-up-right fo-s-15'></a>
							// 		</td>
							// 	</tr>
							// ))
							// data.map(({id, productName, productBulkUnit, productPrice, productQuantity, customerName, customerPhone, timestamp}, index) => (
								// <tr key = {id} className = {index === data.length - 1 ? '' : 'border-bottom'}>
								// 	<td className = 'p-4 text-c text-muted'>
								// 		<span className = 'bi bi-check-square fo-s-15 cursor-pointer'></span>
								// 	</td>
								// 	<td className = 'p-4 text-center text-muted text-capitalize'>{productName}</td>
								// 	<td className = 'p-4 text-center text-muted'>{Currency}{new Intl.NumberFormat().format(productPrice)}</td>
								// 	<td className = 'p-4 text-center text-muted'>{new Intl.NumberFormat().format(productQuantity)} {productBulkUnit}{productQuantity > 1 ? 's' : ''}</td>
								// 	<td className = 'p-4 text-center text-muted'>{Currency}{new Intl.NumberFormat().format(productQuantity * productPrice)}</td>
								// 	<td className = 'p-4 text-center text-muted text-capitalize'>{customerName}</td>
								// 	<td className = 'p-4 text-center text-muted'>
								// 		<a className = 'theme-color underline' href ={`tel://${customerPhone}`}>{customerPhone}</a>
								// 	</td>
								// 	<td className = 'p-4 text-center text-muted'>{new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString()}</td>
								// 	<td className = 'p-4 text-center text-muted'>
								// 		<a href = {`./stock/${id}`} className = 'theme-color bi bi-box-arrow-up-right fo-s-15'></a>
								// 	</td>
								// </tr>
							// ))
							: (
								<tr>
									<td colSpan = '9'>
										<div className = 'text-center p-5 text-muted'>
											<span className = 'bi bi-robot fa-2x'></span>
											<p>Oops, empty rows returned!</p>
										</div>
									</td>
								</tr>
							)
						)
						: (
							(data === undefined)
							? (
								<tr>
									<td colSpan = '9'>
										<div className = 'text-center p-5 text-muted'>
											<span className = 'bi bi-arrow-clockwise fa-2x fa-spin'></span>
											<p>Loading...</p>
										</div>
									</td>
								</tr>
							)
							: (
								<tr>
									<td colSpan = '9'>
										<div className = 'text-center p-5 text-muted'>
											<p>Empty rows returned!</p>
										</div>
									</td>
								</tr>
							)
						)
					}</tbody>
				</table>
			</div>
			{/*<div className = 'row a-i-c j-c-space-between bold text-muted px-4 my-4'>
				<div className = 'col-sm-4 col-md-auto mb-3 text-center'>
					Page {tablePageData?.pageNumber} of {tablePageData?.maxPages}
				</div>
				<div className = 'col-sm-4 col-md-auto flex-h a-i-c mb-3 text-center'>
					<button onClick = {() => (
						(tablePageData.pageNumber > 1)
						? setDataRows({...dataRows, pageNumber: dataRows.pageNumber - 1})
						: undefined
					)} className = 'cursor-pointer bg-clear border-0 p-1 theme-color'>Previous</button>
					<span className = 'bi bi-usb-c-fill mx-4'></span>
					<button onClick = {() => (
						(tablePageData.pageNumber < tablePageData.maxPages)
						? setDataRows({...dataRows, pageNumber: dataRows.pageNumber + 1})
						: undefined
					)} className = 'cursor-pointer bg-clear border-0 p-1 theme-color'>Next</button>
				</div>
				<div className = 'col-sm-4 col-md-auto mb-3 text-center'>
					{data?.length} rows returned
				</div>
			</div>*/}
		</>
	)
}