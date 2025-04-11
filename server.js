import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => res.send('Hello there!'))

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: req.query.pageIdx
    }
    const sortBy = {
        sortField: req.query.sortField,
        sortDir: +req.query.sortDir
    }


    bugService.query(filterBy, sortBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot load bugs')
        })
})

app.post('/api/bug', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot add bug', err)
            res.status(500).send('Cannot add bug')
        })

})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send(`Can't remove car`)

    const bugToSave = req.body

    bugService.save(bugToSave, loggedInUser)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot update bug', err)
            res.status(500).send('Cannot update bug')
        })

})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })

    bugService.getBugById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot load bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send(`Can't remove car`)

    const { bugId } = req.params
    bugService.remove(bugId, loggedInUser)
        .then(() => res.send('Bug removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(500).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(500).send('Cannot load user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    console.log(userId)
    userService.remove(userId)
        .then(() => res.send('User removed'))
        .catch(err => {
            loggerService.error('Cannot remove user', err)
            res.status(500).send('Cannot remove user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch((err) => {
            console.log('err:', err)
            res.status(404).send('Invalid Credentials')
        })
})

app.post('api/user/signup', (req, res) => {
    const credential = req.body

    userService.add(credential)
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot sign up')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


app.listen(3030, () => loggerService.info('Server ready at port 3030'))