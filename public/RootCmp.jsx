const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM

import { UserMsg } from './cmps/UserMsg.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { authService } from './services/auth.service.js'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { UserIndex } from './pages/UserIndex.jsx'


const { useState} = React
export function App() {
    const [loggedInUser, setLoggedInUser] = useState(authService.getLoggedInUser())
    console.log(loggedInUser)

    return <Router>
        <div className="app-wrapper">
            <UserMsg />
            <AppHeader loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bug" element={<BugIndex loggedInUser={loggedInUser} />} />
                    <Route path="/bug/:bugId" element={<BugDetails />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/auth" element={<LoginSignup setLoggedInUser={setLoggedInUser} />} />
                    <Route path="/user/:userId" element={<UserDetails />} />
                    <Route path="user" element={<UserIndex />}></Route>
                </Routes>
            </main>
            <AppFooter />
        </div>
    </Router>
}
