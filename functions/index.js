export const parseObjectToFormData = (objectFormData) => {
	const formData = new FormData()

	for(let props in objectFormData){
		formData.append(props, objectFormData[props])
	}

	return formData
}

export const cookieStore = {
	getCookie: () => new Promise(
        (res) => {
            decodeURIComponent(document.cookie).split(/\;\s?/)
            .forEach(
                (eachCookie) => {
                    const [cookieName, cookieValue] = eachCookie.split('=')
                    if(cookieName === name){
                        res({value: cookieValue})
                    }
                }
            )

            res()
        }
    ),
	setCookie: ({name, value, expires, path}) => new Promise((res) => {
        res(document.cookie = `${name}=${value};expires=${new Date(expires)};path=${path}`)
    })
}

export const encryptString = (string) => {
    string = encodeURIComponent(string).split('')
    string = string.map((char, index) => index % 2 ? char.charCodeAt() - 5 : char.charCodeAt() + 5)
    string = String.fromCharCode(...string)
    string = encodeURIComponent(string)
    return string
}

export const decryptString = (string) => {
    string = decodeURIComponent(string)
    string = string.split('')
    string = string.map((char, index) => index % 2 ? char.charCodeAt() + 5 : char.charCodeAt() - 5)
    string = String.fromCharCode(...string)
    string = decodeURIComponent(string)
    return string
}

export class UniqueSet{
    constructor(object1, object2){
        const object1Length = Object.keys(object1).length
        const object2Length = Object.keys(object2).length

        return (
            (object1Length === object2Length)
            ? Object.keys(object1).every(key => object2.hasOwnProperty(key) && object2[key] === object1[key])
            : false
        )
    }
}