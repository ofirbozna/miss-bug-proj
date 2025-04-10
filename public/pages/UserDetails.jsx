import { bugService } from "../services/bug.service.local.js"
import { userService } from "../services/user.service.js"
import { BugPreview } from "../cmps/BugPreview.jsx"

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    useEffect(()=>{
        loadBugs()
    },[user])
    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function loadBugs() {
        bugService.query()
            .then((bugs) => {
                if(user){
                    const userBugs = bugs.filter(bug => bug.creator._id === user._id)
                    setBugs(userBugs)
                }
            })
    }
    return <section className="user-details">
        {user && <h1>User {user.fullname}</h1>}
        <h2>Your bugs</h2>
        {bugs && bugs.map(bug=><li key={bug._id}><BugPreview bug={bug} /></li> )}
    </section>
}