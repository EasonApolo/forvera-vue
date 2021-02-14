/*
 * @Author: your name
 * @Date: 2021-01-18 21:08:25
 * @LastEditTime: 2021-02-07 14:16:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /forvera/fe/src/shared/Request.js
 */
import { ip } from '@/shared/config'
import { store } from '@/store'

/**
 * @description: 
 * @param {*} url
 * @param {*} method default GET
 * @param {*} params String(stringified JSON)/FormData/Object. Object cannot handle multiple files with single key, use FormData in this case.
 * @return {*}
 */
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