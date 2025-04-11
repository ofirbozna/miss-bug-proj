const { Link } = ReactRouterDOM

export function UsersList({ users, onRemoveUser }) {

    if (!users) return <div>Loading...</div>
    return <ul className="users- list">
        {users.map(user => (
            <li key={user._id}>
                <p>_id: <span>{user._id}</span></p>
                <p>Fullname <span>{user.fullname}</span></p>
                <p>Username <span>{user.username}</span></p>
                <section className="actions">
                    <button onClick={() => onRemoveUser(user._id)}>x</button>
                </section>
            </li>
        ))}
    </ul >
}
