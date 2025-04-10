import fs from 'fs'

import { utilService } from './util.service.js'

const users = utilService.readJsonFile('data/users.json')
export const userService = {
    add,
    query,
    remove,
    getById,
    getByUserName
}

function query() {
    const userToReturn = users.map(user => ({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
    }))
    return Promise.resolve(userToReturn)
}

function getByUserName(username) {
    let user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function getById(userId) {
    let user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found!')
    user = { ...user }
    delete user.password
    return Promise.resolve(user)
}

function remove(userId) {
    users = users.filter(user => user.userId !== userId)
    return _saveUsersToFile
}

function add(user) {

    return getByUserName(user.username)
        .then(existingUser => {
            if (existingUser) return Promise.reject('Username taken')

            user.id = utilService.makeId()
            users.push(user)

            return _saveUsersToFile()
                .then(() => {
                    user = { ...user }
                    delete user.password
                    return user
                })
        })
}
function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(users, null, 2)
        fs.writeFile('./data/users.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}