const { useState, useEffect } = React


import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { UsersList } from '../cmps/UserList.jsx'

export function UserIndex({ loggedInUser }) {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => showErrorMsg(`Couldn't load users - ${err}`))
    }

    function onRemoveUser(userId) {
        console.log(userId)
        userService.remove(userId)
        .then(() => {
                const usersToEdit = users.filter(user => user._id !== userId)
                setUsers(usersToEdit)
                showSuccessMsg('user removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove user`, err))
    }

    return <section className="bug-index main-content">
        <UsersList
            users={users}
            onRemoveUser={onRemoveUser}
        />
    </section>
}
