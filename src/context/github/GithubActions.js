
const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

//Search users
export const searchUsers = async (text) => {
    const params = new URLSearchParams({
        q: text
    })

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`
        }
    })

    const {items} = await response.json()
    return items
}

//Get a single user
export const getUser = async (login) => {
    const response = await fetch(`${GITHUB_URL}/users/${login}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`
        }
    })
    console.log(response.status)
    if(response.status === 404) {
        window.location = '/notfound'
    } else {
        const data = await response.json()
        return data
    }
}

//Get repos for a single user
export const getUserRepos = async (login) => {
    const params = new URLSearchParams({
        sort: 'created_at',
        per_page: 10
    })

    const response = await fetch(`${GITHUB_URL}/users/${login}/repos?${params}`, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`
        }
    })
    const data = await response.json()
    return data 
}
