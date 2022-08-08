import ReactDOM from 'react-dom'
import {useState, useEffect} from 'react'

let Z_INDEX = 1000

export const alert = (message) => {
    const id = `_alert_${new Date().getTime()}`
    
    const App = () => (
        <div id = {id} className = {`po-fixed top-0 left-0 p-5 w-100`} style = {{zIndex: Z_INDEX += 10}}>
            <div style = {{maxWidth: '500px'}} className = 'mx-auto rounded-2x bg-white p-5 shadow animated slideInDown'>
                <p>{message || ''}</p>
                <div className = 'mt-5 row'>
                    <div className = 'col-6 ml-auto'>
                        <button onClick = {() => {ReactDOM.unmountComponentAtNode(document.querySelector(`#__popup`))}} className = 'btn d-block btn-primary text-capitalize fo-s-15 p-3'>close</button>
                    </div>
                </div>
            </div>
        </div>
    )
    
    ReactDOM.render(
        <App />,
        document.querySelector('#__popup')
    )
}

export const notify = ({message = '', callback, type = 'light', duration = 3000}) => {
    const Notify = () => {
        const [doubleLine, setDoubleLine] = useState(true)
        const id = `_notify_${new Date().getTime()}`

        useEffect(() => {
            setTimeout(() => {
                typeof callback === 'function' ? (
                    callback(type)
                ) : false
                ReactDOM.unmountComponentAtNode(
                    document.querySelector(`#__popup`)
                )
            }, duration);
        }, [])
        
        return (
            <div id = {id} className = 'p-5 po-fixed top-0 left-0 w-100' style = {{zIndex: Z_INDEX += 10}}>
                <div className = {`animated bg-${type}-light slideInRight a-i-c px-2 rounded-1x shadow ml-auto flex-h`} style = {{maxWidth: '500px'}}>
                    <div className = {`px-4 py-3 border-${type} h-100 border-right`}>
                        <span className = {`bi fo-s-16 bi-${type === 'success' ? 'check-circle-fill' : type === 'danger' ? 'exclamation-triangle-fill' : 'exclamation-circle-fill'} text-${type}-dark`}></span>
                    </div>
                    <div className="flex-1 py-4">
                        <div onClick = {() => setDoubleLine(!doubleLine)} className={`${!doubleLine ? '' : 'double-line'} my-2 text-${type}-dark h-100 flex-v j-c-c px-4`}>
                            {message}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .bg-danger-light{
                        background: #f77d89;
                    }
                    .text-danger-dark{
                        color: #be0f0f;
                    }
                    .bg-success-light{
                        background: #77efa6;
                    }
                    .text-success-dark{
                        color: #0fbe2b;
                    }
                    .bg-notify-light{
                        background: #f8f9fa;
                    }
                    .text-notify-dark{
                        color: #343a40;
                    }
                `}</style>
            </div>
        )
    }
    
    if(document.querySelector('#__popup').children.length < 1){
        ReactDOM.render(
            <Notify />,
            document.querySelector('#__popup')
        )
    }
}