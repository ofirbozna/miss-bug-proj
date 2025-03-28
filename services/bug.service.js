import { utilService } from "./util.service.js"
import fs from 'fs'


const bugs = utilService.readJsonFile('data/bug.json')
const PAGE_SIZE = 5

export const bugService = {
    query,
    getBugById,
    remove,
    save
}

function query(filterBy) {
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }
            if (filterBy.pageIdx !== undefined && filterBy.pageIdx !== '' && filterBy.pageIdx !== null) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return bugs
        })
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