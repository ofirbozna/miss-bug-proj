import http from 'http'
import https from 'https'
import fs from 'fs'

export const utilService = {
    httpGet,
    readJsonFile,
    download,
    writeJsonFile
}



function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function writeJsonFile(path, json) {
    const data = JSON.stringify(json, null, 4)

    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, content => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}


function httpGet(url) {
    const protocol = url.startsWith('https') ? https : http
    const options = {
        method: 'GET',
    }
    return new Promise((resolve, reject) => {
        const req = protocol.request(url, options, res => {
            let data = ''

            res.on('data', chunk => {
                data += chunk
            })

            res.on('end', () => {
                resolve(data)
            })
        })
        req.on('error', err => {
            reject(err)
        })
        req.end()
    })
}