import { createContext, useReducer } from 'react'
import githubReducer from './GithubReducer'

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({children}) => {
    const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false
    }

    const [state, dispatch] = useReducer(githubReducer, initialState)

    //Set loading
    const setLoading = () => {
        dispatch({ type: 'SET_LOADING'})
        console.log('SET_LOADING')
    }

    //Clear Users from state
    const clearUsers = () => {
        dispatch({type: 'CLEAR_USERS'})
    }

    //Search users
    const searchUsers = async (text) => {
        setLoading()

        const params = new URLSearchParams({
            q: text
        })

        const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        })

        const {items} = await response.json()
        console.log(items)
        dispatch({
            type: 'GET_USERS',
            payload: {
                users: items,
                loading: false
            }
        })
    }

    //Get a single user
    const getUser = async (login) => {
        setLoading()

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
            console.log(data)
        
            dispatch({
                type: 'GET_USER',
                payload: {
                    user: data,
                    loading: false
                }
            })    
        }
    }

    //Get a single user's repos
    const getUserRepos = async (login) => {
        setLoading()

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
        console.log(data)
    
        dispatch({
            type: 'GET_REPOS',
            payload: {
                repos: data,
                loading: false
            }
        })    
    }

    return <GithubContext.Provider value={{
            users: state.users,
            user: state.user,
            loading: state.loading,
            repos: state.repos,
            searchUsers,
            getUser,
            getUserRepos,
            clearUsers
        }}>
            {children}
        </GithubContext.Provider>
}

export default GithubContext