import axios from 'axios';
import { URL } from '../consts/firebase';
import { circuralProgress } from './fullScreenCircuralProgress';
import { addSnackbar } from './snackbars';
import mapObjectToArray from '../utils/mapObjectToArray';
import {authRequest} from './auth'

const SAVE_RECIPES = 'recipes/SAVE_RECIPES';
const ERROR_ON_GET = 'recipes/ERROR_ON_GET';

export const addRecipeAsyncActionCreator = form => (dispatch, getState) => {

    const userId = getState().auth.userID
    console.log(userId)
    
    dispatch(circuralProgress.add())
    return dispatch(authRequest(URL + 'users/' + userId + '/recipes.json','post', form))
        .then(() => {
            dispatch(circuralProgress.remove())
            dispatch(addSnackbar('Przepis dodano prawidłowo'))
        })
        .catch(() => {
            dispatch(circuralProgress.remove())
            dispatch(addSnackbar('Dodawanie nie powiodło się. Spróbuj ponownie.', 'red'))
            return Promise.reject()
        })
}


export const getRecipesAsyncActionCreator = () => (dispatch, getState) => {
    const userId = getState().auth.userID
    dispatch(circuralProgress.add())
    dispatch(authRequest(URL + 'users/' + userId + '/recipes.json'))
        .then((res) => {
            const mappedData = mapObjectToArray(res.data)
            dispatch(saveRecipesActionCreator(mappedData))
            dispatch(circuralProgress.remove())
        })
        .catch(() => {
            dispatch(circuralProgress.remove())
            dispatch(errorOnGetRecipesActionCreator())
        })
}

export const deleteRecipeAsyncActionCreator = (key, success, error) => (dispatch, getState) => {
    const userId = getState().auth.userID
    dispatch(circuralProgress.add())
    dispatch(authRequest(URL + 'users/' + userId + '/recipes/' + key + '.json', 'delete'))
        .then(() => {
            const recipes = getState().recipes.recipes;
            const recipesAfterDelete = recipes.filter(el => el.key !== key)
            dispatch(saveRecipesActionCreator(recipesAfterDelete))
            dispatch(circuralProgress.remove())
            dispatch(addSnackbar('Przepis usunięto prawidłowo'))
            success()
        })
        .catch(() => {
            dispatch(circuralProgress.remove())
            dispatch(addSnackbar('Błąd podczas usuwania. Spróbuj ponownie.', 'red'))
            error()
        })
}

export const editRecipeAsyncActionCreator = (form, key, succes, error) => (dispatch, getState) => {
    const userId = getState().auth.userID
    dispatch(circuralProgress.add())
    dispatch(authRequest(URL + 'users/' + userId + '/recipes/' + key + '.json', 'patch', form))
        .then(() => {
            const recipes = getState().recipes.recipes;
            const recipesAfterEdit = recipes.map(el => {
                if (el.key === key) {
                    return form
                }
                return el
            })
            dispatch(saveRecipesActionCreator(recipesAfterEdit))
            dispatch(circuralProgress.remove())
            dispatch(addSnackbar('Przepis edytowano prawidłowo'))
            succes()
        })
        .catch(() => {
            dispatch(circuralProgress.remove())
            dispatch(addSnackbar('Błąd podczas edytowania. Spróbuj ponownie.', 'red'))
            error()
        })
}

const saveRecipesActionCreator = recipes => ({
    type: SAVE_RECIPES,
    recipes
})

const errorOnGetRecipesActionCreator = () => ({
    type: ERROR_ON_GET
})



const initialState = {
    recipes: [],
    isError: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SAVE_RECIPES:
            return {
                ...state,
                recipes: action.recipes,
                isError: false
            }
        case ERROR_ON_GET:
            return {
                ...state,
                isError: true
            }
        default:
            return state
    }
}