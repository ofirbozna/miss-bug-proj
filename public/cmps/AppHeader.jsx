import { authService } from "../services/auth.service.js"

const { NavLink , Link} = ReactRouterDOM
const { useNavigate } = ReactRouter


export function AppHeader({ loggedInUser, setLoggedInUser}) {

    const navigate = useNavigate()

    function onLogout(){
        authService.logout()
        .then(()=>{
            setLoggedInUser(null)
            navigate('/auth')
        })
    }
    return <header className="app-header main-content single-row">
        <h1>Miss Bug</h1>
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
            {!loggedInUser ?
                <NavLink to="/auth" >Login</NavLink> :
                <div>
                 <Link to={"/user/" + loggedInUser._id} >{loggedInUser.fullname}</Link> 
                <button onClick={onLogout}>Logout</button>
                </div>
            }
        </nav>
    </header>
}