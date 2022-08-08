import {useRouter} from 'next/router'
import {useState, useContext, createContext} from 'react'
import SideBar from './SideBar'
import Head from 'next/head'
import NavBarProfileIcon from './NavBarProfileIcon'
import {GlobalContext} from '../../contexts/Global'

const SideBarContext = createContext()


const firstLetterToUpperCase = (str) => {
    str = str.split('')
    str[0] = str[0].toString().toUpperCase()

    return str.join('')
}


export default ({children, title}) => {
    const {userData: {f_name, l_name}, accountType} = useContext(GlobalContext)
    const [sideBarState, setSideBarState] = useState(false)
    const {asPath} = useRouter()

    return (
        <>
            <div className="po-rel vh100 bg-light flex-h vw100">
                <SideBarContext.Provider value = {{value: sideBarState, updater: setSideBarState}}>
                    <SideBarContext.Consumer>{
                        ({value, updater}) => (
                            <SideBar sideBarState = {value} setSideBarState = {updater} />
                        )
                    }</SideBarContext.Consumer>
                </SideBarContext.Provider>
                <div className = 'flex-1 po-rel py-4 px-4 px-md-5 h-100 overflow-y-auto'>
                    <div>
                        <div className="flex-h py-3 a-i-c">
                            <div className = 'col-d-block col-md-d-none'>
                                <div className = 'py-3' onClick = {() => setSideBarState(true)}>
                                    <span className = 'fa-3x bi bi-filter-left'></span>
                                </div>
                            </div>
                            <div className = 'ml-auto'>
                                <NavBarProfileIcon />
                            </div>
                        </div>
                    </div>
                    <div className = 'mb-5 bold fo-s-15 text-capitalize theme-color'>{title ? title : asPath.match(/(\w+\-)*\w+$/)[0].replace(/\-/g, ' ')}</div>
                    <div>
                        {children}
                    </div>
                </div>
                <style>{`
                    .active-menu{
                        background: rgba(255,255,255,.3)
                    }
                    .fa-3x{
                        font-size: 3rem;
                    }
                    .translate-negative-100{
                        transform: translateX(-100%);
                    }
                    .translate-0{
                        transform: translateX(0%);
                    }
                `}</style>
            </div>
        </>
    )
}