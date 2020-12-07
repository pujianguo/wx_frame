/*
 * @Descripttion:
 * @Author: pujianguo
 * @Date: 2020-12-07 13:52:51
 */
import { _get, _post, _put, _delete } from '../request'

// eg: task
export const listTask = () => _get(`oa/task`, {}, false)
export const addTask = params => _post('oa/task', params)
export const updateTask = (id, params) => _put(`oa/task/${id}`, params)
export const deleteTask = (id) => _delete(`oa/task/${id}`, params)
