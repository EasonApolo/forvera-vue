import { ip } from '@/shared/config'
import { store } from '@/vuex/main'

export async function request(url, method, params) {
    let options = {
        withCredentials: true,
        mode: 'cors',
        headers: {}
    }
    // set authorization
    const bearer = store.state.token
    if (bearer) {
        options.headers['Authorization'] = bearer
    }
    // set method
    options.method = method || 'GET'
    // set body
    if (params) {
        if (typeof params == 'string') {
            options.body = params
            options.headers['Content-Type'] = 'application/json'
        } else if (params instanceof FormData) {
            options.body = params
        } else {
            let formData = new FormData()
            for (let key in params) {
                formData.append(key, params[key])
            }
            options.body = formData
        }
    }
    return await fetch(`${ip + url}`, options).then(res => res.json())
}