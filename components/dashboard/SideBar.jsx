import {useRouter} from 'next/router'
import {useContext} from 'react'
import {useURL} from '../../data/URL'
import {GlobalContext} from '../../contexts/Global'

export default ({sideBarState, setSideBarState}) => {
	const {asPath} = useRouter()
	const {accountType} = useContext(GlobalContext)
	const URL = useURL(accountType.replace(/s$/, ''))

	return (
		<>
            <div className = {`${(sideBarState) ? 'translate-0' : 'translate-negative-100'} transit po-abs top-0 left-0 theme-bg h-100 overflow-y-auto`} style = {{zIndex: '1000', minWidth: '220px'}}>
                <div className = 'py-3 px-4 mt-4 flex-h a-i-c j-c-space-between'>
                    <div>
                        <img src="/images/Ollymann table water.jpg" width = '60' alt=""/>
                        <span className = 'fa-2x bi bi-user text-white'></span>
                    </div>
                    <div className = 'py-3' onClick = {() => setSideBarState(false)}>
                        <span className = 'fa-3x bi bi-x text-white'></span>
                    </div>
                </div>
                <div className="py-5 side-bar-links overflow-x-0">{
                    URL.map(
                        ({href, name, icon}, key) => (
                            <a key = {key} href = {`./${href}`} className = {`flex-h transit a-i-c px-4 underline-0 py-4 text-white ${(
                                (asPath === href || new RegExp(`^${href}`, 'i').test(asPath))
                                ? 'active-menu'
                                : ''
                            )}`}>
                                {icon}
                                <span className = 'text-capitalize mx-3'>{name}</span>
                            </a>
                        )
                    )
                }</div>
            </div>
            <div className = 'theme-bg col-d-none col-md-d-block h-100 overflow-y-auto' style = {{minWidth: '220px'}}>
                <div className = 'py-3 px-4 mt-4'>
                	<span className = 'fa-2x bi bi-user text-white'></span>
                    <img src="/images/Ollymann table water.jpg" width = '60' alt=""/>
                </div>
                <div className="py-5 side-bar-links overflow-x-0">{
                    URL.map(
                        ({icon, name, href}, key) => (
                            <a key = {key} href = {`./${href}`} className = {`flex-h transit a-i-c px-4 underline-0 py-4 text-white ${(
                                (asPath === href || new RegExp(href).test(asPath))
                                ? 'active-menu'
                                : ''
                            )}`}>
                                {icon}
                                <span className = 'text-capitalize mx-3'>{name}</span>
                            </a>
                        )
                    )
                }</div>
            </div>
            <style jsx>{`
                .side-bar-links > a:hover{
                    transform: translateX(5%);
                }
            `}</style>
        </>
	)
}