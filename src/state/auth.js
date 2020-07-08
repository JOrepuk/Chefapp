import axios from 'axios'
import { SIGN_UP_URL, SIGN_IN_URL, RESET_PASSWORD_URL, REFRESH_TOKEN_URL } from '../consts/firebase'
import { circuralProgress } from './fullScreenCircuralProgress'
import { addSnackbar } from './snackbars'

const SAVE_USER = 'auth/SAVE_USER'
const LOG_OUT = 'auth/LOG_OUT'
const getSnackbarText = (string) => {
    switch (string) {
        case 'EMAIL_EXISTS':
            return 'Do tego maila jest już przypisany użytkownik'
        case 'OPERATION_NOT_ALLOWED':
            return 'To hasło jest niedozwolone'
        case 'EMAIL_NOT_FOUND':
            return 'Złe hasło lub email'
        case 'INVALID_PASSWORD':
            return 'Złe hasło lub email'
        case 'USER_DISABLED':
            return 'To konto jest zablokowane'
        default:
            return 'Coś poszło nie tak, spróbuj ponownie'
    }
}

export const authRequest = (url, method = 'get', data = {}) => (dispatch, getState) => {

    const getUrlWithToken = () => {
        const idToken = getState().auth.idToken
        if (idToken) {
            return url.includes('?') ? url + '&auth=' + idToken : url + '?auth=' + idToken
        }
        return url
    }


    return axios({
        url: getUrlWithToken(),
        method,
        data
    })
    .catch(err => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken && err.response.status.text === 'Unauthorized')
            return dispatch(useRefreshTokenAsyncActionCreator(refreshToken))
            .then(()=> {
                return axios({
                    url: getUrlWithToken(),
                    method,
                    data
                })
            })
            .catch((err)=> {
                dispatch(logOutActionCreator())
                dispatch(addSnackbar('Twoja sesja wygasła, zaloguj się ponownie', 'red'))
                return Promise.reject(err)
            })
            else {
                return Promise.reject(err)
            }
    })
}

export const registerAsyncActionCreator = (email, password) => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    axios.post(SIGN_UP_URL, {
        email,
        password
    })
        .then(res => {
            const { idToken, refreshToken, localId } = res.data
            dispatch(saveUserActionCreator(idToken, refreshToken, localId))
        })
        .catch(error => {
            const text = getSnackbarText(
                error.response.data &&
                error.response.data.error &&
                error.response.data.error.message
            )
            dispatch(addSnackbar(text, 'red'))
        })
        .finally(() => dispatch(circuralProgress.remove()))
}



export const logInAsyncActionCreator = (email, password) => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    axios.post(SIGN_IN_URL, {
        email,
        password,
        returnSecureToken: true
    })
        .then(res => {
            const { idToken, refreshToken, localId } = res.data
            dispatch(saveUserActionCreator(idToken, refreshToken, localId))
        })
        .catch(error => {
            const text = getSnackbarText(
                error.response.data &&
                error.response.data.error &&
                error.response.data.error.message
            )
            dispatch(addSnackbar(text, 'red'))
        })
        .finally(() => dispatch(circuralProgress.remove()))
}



const saveUserActionCreator = (idToken, refreshToken, userID) => {
    localStorage.setItem('refreshToken', refreshToken)
    return {
        type: SAVE_USER,
        idToken,
        userID
    }
}


export const resetPasswordAsyncActiobCreator = (email, success) => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    axios.post(RESET_PASSWORD_URL, {
        email,
        requestType: 'PASSWORD_RESET'
    })
        .then(() => {
            dispatch(addSnackbar('Kliknij link wysłany w mailu aby utworzyć nowe hasło.'))
            success()
        })
        .catch(error => {
            dispatch(addSnackbar('Użytkownik z tym emailem nie istnieje', 'red'))
        })
        .finally(() => dispatch(circuralProgress.remove()))
}


export const logOutActionCreator = () => {
    localStorage.removeItem('refreshToken')
    return {
        type: LOG_OUT
    }
}

export const autoLogInAsyncActionCreator = () => (dispatch, getState) => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (refreshToken) {
        dispatch(useRefreshTokenAsyncActionCreator(refreshToken))
    }
}

const useRefreshTokenAsyncActionCreator = refreshToken => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    return axios.post(REFRESH_TOKEN_URL, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    })
        .then(res => {
            const { id_token, refresh_token, user_id } = res.data
            dispatch(saveUserActionCreator(id_token, refresh_token, user_id))
            return res
        })
        .finally(() => dispatch(circuralProgress.remove()))
}



const initialState = {
    isLogged: false,
    idToken: null,
    userID: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USER:
            return {
                ...state,
                isLogged: true,
                idToken: action.idToken,
                userID: action.userID
            }
        case LOG_OUT:
            return {
                ...state,
                isLogged: false,
                idToken: null,
                userID: null
            }
        default:
            return state
    }
}