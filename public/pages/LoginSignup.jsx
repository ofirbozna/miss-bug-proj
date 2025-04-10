import { authService } from "../services/auth.service.js"
import { userService } from "../services/user.service.js"

const { useState } = React
const { useNavigate } = ReactRouter

export function LoginSignup({ setLoggedInUser }) {

    const [isSignup, setIsSignup] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    const navigate = useNavigate()

    function handleChange({ target }) {
        console.log(target.value)
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleSubmit(ev) {
        console.log('sub')
        ev.preventDefault()
        isSignup ? signup(credentials) : login(credentials)
    }

    function signup() {
        authService.signup(credentials)
            .then(user => {
                setLoggedInUser(user)
                navigate('/bug')
            })
            .catch(err => {
                console.log(err)
            })
    }

    function login() {
        authService.login(credentials)
        .then(user => {
                console.log('succsess')
                setLoggedInUser(user)
                navigate('/bug')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return <section className="login-page">
        <form className="login-form" onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" value={credentials.username} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required autoComplete="off" />
            {isSignup && <input type="text" name="fullname" placeholder="fullname" value={credentials.fullname} onChange={handleChange} required />}
            <button>{isSignup ? 'Signup' : 'Login'}</button>
        </form>
        <section className="sign btns">
            <button onClick={() => setIsSignup(!isSignup)}>
                {isSignup ?
                    'Already a member? Login' :
                    'New user? Signup here'}

            </button>
        </section>
    </section>
}