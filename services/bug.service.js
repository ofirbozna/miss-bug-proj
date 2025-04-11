import { loggerService } from "./logger.service.js"
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

function query(filterBy, sortBy) {
    return Promise.resolve(bugs)
        .then(bugs => {
            console.log('filter', filterBy)
            console.log('sort', sortBy)

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

            if (sortBy.sortField === 'severity' || sortBy.sortField === 'createdAt') {
                if (sortBy.sortDir === 1) {
                    bugs.sort((bug1, bug2) => bug1[sortBy.sortField] - bug2[sortBy.sortField])
                } else {
                    bugs.sort((bug1, bug2) => bug2[sortBy.sortField] - bug1[sortBy.sortField])
                }
            } else if (sortBy.sortField === 'title') {
                if (sortBy.sortDir === 1) {
                    bugs.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title))
                } else {
                    bugs.sort((bug1, bug2) => bug2.title.localeCompare(bug1.title))
                }
            }
            return bugs
        })
}

function getBugById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug-' + bugId)
    return Promise.resolve(bug)
}

function save(bugToSave, loggedInUser) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave.id)
        if (bugs[bugIdx].creator._id !== loggedInUser._id) {
            return Promise.reject('Not your car')
        }
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function remove(bugId, loggedInUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Cannot remove bug -' + bugId)

    if (bugs[bugIdx].creator._id !== loggedInUser._id) {
        return Promise.reject('Not your car')
    }
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