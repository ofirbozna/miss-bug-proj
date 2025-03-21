import { utilService } from "./util.service.js"
import fs from 'fs'


const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getBugById,
    remove,
    save
}

function query() {
    return Promise.resolve(bugs)
}

function getBugById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug-' + bugId)
    return Promise.resolve(bug)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave.id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Cannot remove bug -' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}