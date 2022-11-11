async function getUser(email) {
    if (email) {
        let userJSON = await fetch(`http://localhost:3000/api/users/${email}`)
        let user = await userJSON.json()
        return user
    }
}

export default getUser