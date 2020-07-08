import React from 'react';
import { TextField, Fab, Paper, Typography, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'

const MAX_INGREDIENT_LENGTH = 30;
const MIN_INGREDIENT_LENGTH = 3;

const styles = {
    container: {
        maxWidth: 380
    },
    inputsDiv: {
        display: 'flex',
        justifyContent: 'center'
    },
    input: {
        margin: '10px 20px 10px 0',
        maxWidth: 150
    },
    addButton: {
        marginTop: 18
    },
    paper: {
        maxWidth: 380,
        padding: 10,
        marginTop: 10,
        marginBottom: 10
    },
    singleIngredient: {
        display: 'flex'
    },
    singleIngredientTypography: {
        flexGrow: 1
    },
    singleIngredientButton: {
        width: 30,
        height: 30,
        alignSelf: 'center'
    }
}

const Ingredients = (props) => {

    const [ingredient, setIngredient] = React.useState('');
    const [ingredientError, setIngredientError] = React.useState(false);
    const ingredientValidate = (value) => {
        const validValue = value && value.replace(/\s{2,}/g, ' ')
        if (value !== validValue) {
            setIngredient(validValue)
        }
        const isError = !validValue || validValue.length < MIN_INGREDIENT_LENGTH
        setIngredientError(isError)
        return isError
    }

    const setValidIngredients = (string) => {
        if (string.length < MAX_INGREDIENT_LENGTH) {
            setIngredient(string)
        }
    }


    const focusTo = React.useRef(null)

    const [quantity, setQuantity] = React.useState('')
    const [quantityError, setQuantityError] = React.useState(false)
    const quantityValidate = (value) => {
        const validValue = value && value.replace(/\s{2,}/g, ' ')
        if (value !== validValue) {
            setQuantity(validValue)
        }
        const isError = !validValue
        setQuantityError(isError)
        return isError
    }

    const setValidQuantity = (string) => {
        if (string.length < MAX_INGREDIENT_LENGTH) {
            setQuantity(string)
        }
    }


    const onSubmit = () => {
        const isIgredientError = ingredientValidate(ingredient)
        const isQuantityError = quantityValidate(quantity)

        if (!isIgredientError && !isQuantityError) {
            props.setIngredients([
                ...props.ingredients,
                {
                    ingredient: ingredient.toLowerCase(),
                    quantity
                }
            ])
            setIngredient('')
            setQuantity('')
            focusTo.current.focus()
        }
    }

    const submitOnEnter = (e) => {
        if (e.key === "Enter") {
            onSubmit()
        }
    }

    const removeIngredient = (index) => {
        props.setIngredients(props.ingredients.filter((el, i) => index !== i))
    }


    const inputs = [
        {
            label: 'Składnik',
            value: ingredient,
            error: ingredientError,
            helperText: 'Min 3 znaki',
            onChange: setValidIngredients,
            validate: ingredientValidate,
            inputRef: focusTo
        },
        {
            label: 'Ilość',
            value: quantity,
            error: quantityError,
            helperText: 'Wpisz ilość',
            onChange: setValidQuantity,
            validate: quantityValidate
        }
    ]
    return (
        <div style={styles.container}>
            <div style={styles.inputsDiv}>
                {inputs.map(input =>
                    <TextField
                        key={input.label}
                        style={styles.input}
                        variant={'outlined'}
                        fullWidth
                        label={input.label}
                        value={input.value}
                        error={input.error}
                        helperText={input.error && input.helperText}
                        onChange={e => {
                            input.onChange(e.target.value)
                            if (input.error) {
                                input.validate(e.target.value)
                            }
                        }}
                        onKeyPress={submitOnEnter}
                        inputRef={input.inputRef}
                    />
                )}
                <Fab
                    style={styles.addButton}
                    size='small'
                    color='primary'
                    onClick={onSubmit}
                >
                    <AddIcon />
                </Fab>
            </div>
            {
                props.ingredients.length > 0 &&

                <Paper style={styles.paper}>
                    <Typography
                        align='center'
                    >
                        Składniki:
                </Typography>
                    {props.ingredients.map((ingredient, index) => (
                        <div style={styles.singleIngredient} key={ingredient.ingredient + ingredient.quantity + index}>
                            <Typography style={styles.singleIngredientTypography}>
                                {index + 1}. {ingredient.ingredient} - {ingredient.quantity}
                            </Typography>
                            <IconButton
                                style={styles.singleIngredientButton}
                                size='small'
                                onClick={() => removeIngredient(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))}
                </Paper>
            }
        </div>
    );
}

export default Ingredients;