import express from 'express'
import { bugService } from './services/bug.service.js'

const app = express()
app.get('/', (req, res) => res.send('Hello there!'))

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('err', err)
            res.status(500).send('Cannot load bugs')
        })
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity,
        createdAt: +req.query.createdAt
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('err', err)
            res.status(500).send('Cannot save bug')
        })

})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getBugById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('err', err)
            res.status(500).send('Cannot load bug')
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('Bug removed'))
        .catch(err => {
            console.log('err', err)
            res.status(500).send('Cannot remove bug')
        })
})

app.listen(3030, () => console.log('Server ready at port 3030'))