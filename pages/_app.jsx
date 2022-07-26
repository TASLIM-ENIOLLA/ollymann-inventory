import Head from 'next/head'

import '../public/b-icon/font/bootstrap-icons.css'
import '../public/font-awesome/font-awesome/font-awesome.css'
import '../public/font-awesome/animate.css'
import '../public/css/bootstrap.min.css'
import '../public/css/common.css'

import {GlobalContext} from '../contexts/Global'

export default ({Component, pageProps: {userData, accountType, ...otherProps}}) => {
    return (
        <GlobalContext.Provider value = {{userData, accountType}}>
            <Head>
                <link href = '../public/font-awesome/font-awesome/font-awesome.css' />
            </Head>
            <Component {...otherProps} />
            <div id = '__popup'></div>
        </GlobalContext.Provider>
    )
}