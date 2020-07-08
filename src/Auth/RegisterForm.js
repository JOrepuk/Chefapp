import React from 'react';

import { Paper, TextField, Button, Typography } from '@material-ui/core';

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0
    },
    paper: {
        maxWidth: 320,
        padding: 20
    },
    buttonDIV: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: 16,
        flexWrap: 'wrap'
    }
}

const RegisterForm = props => {

    const [email, setEmail] = React.useState('')
    const [emailError, setEmailError] = React.useState(false)
    const emailValidate = (value) => {
        const isError = !value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

        setEmailError(isError)
        return isError
    }

    const [pwd, setPwd] = React.useState('')
    const [pwdError, setPwdError] = React.useState(false)
    const pwdValidate = value => {
        const isError = (value.length < 8)
        setPwdError(isError)
        return isError
    }

    const [pwd2, setPwd2] = React.useState('')
    const [pwd2Error, setPwd2Error] = React.useState(false)
    const pwd2Validate = value => {
        const isError = (pwd !== value)
        setPwd2Error(isError)
        return isError
    }

    const onSubmit = () => {
        const isEmailError = emailValidate(email)
        const isPwdError = pwdValidate(pwd)
        const isPwd2Error = pwd2Validate(pwd2)
        if (!isEmailError && !isPwdError && !isPwd2Error) {
            props._register(email, pwd)
        }
    }

    const submitOnEnter = e => {
        if (e.key === 'Enter') {
            onSubmit()
        }
    }

    return (
        <div style={styles.container}>
            <Paper style={styles.paper}>
                <Typography
                    align='center'
                    variant='h4'
                    color='secondary'
                >
                    Zarejestruj się
                </Typography>
                <TextField
                    value={email}
                    onKeyPress={submitOnEnter}
                    onChange={e => {
                        setEmail(e.target.value)
                        if (emailError) {
                            emailValidate(e.target.value)
                        }
                    }}
                    label='email'
                    variant='outlined'
                    margin='normal'
                    error={emailError}
                    fullWidth
                    helperText={emailError && 'Podaj prawidłowy email'}
                    onBlur={() => emailValidate(email)}
                />
                <TextField
                    value={pwd}
                    type='password'
                    onKeyPress={submitOnEnter}
                    onChange={e => {
                        setPwd(e.target.value)
                        if (pwdError) {
                            pwdValidate(e.target.value)
                            if (pwd2Error) {
                                setPwd2Error(e.target.value !== pwd2)
                            }
                        }
                    }}
                    label='hasło'
                    variant='outlined'
                    margin='normal'
                    error={pwdError}
                    fullWidth
                    helperText={pwdError && 'Hasło musi zawierać co najmniej 8 znaków'}
                    onBlur={() => {
                        pwdValidate(pwd)
                        if (pwd2Error) {
                            pwd2Validate(pwd2)
                        }
                    }}
                />
                <TextField
                    value={pwd2}
                    type='password'
                    onKeyPress={submitOnEnter}
                    onChange={e => {
                        setPwd2(e.target.value)
                        if (pwd2Error) {
                            pwd2Validate(e.target.value)
                        }
                    }}
                    label='powtórz hasło'
                    variant='outlined'
                    margin='normal'
                    error={pwd2Error}
                    fullWidth
                    helperText={pwd2Error && 'Hasła muszą być takie same'}
                    onBlur={() => pwd2Validate(pwd2)}
                />
                <div style={styles.buttonDIV}>
                    <Button
                    color='primary'
                    variant='outlined'
                    onClick={onSubmit}
                    margin='normal'
                    >
                        Zarejestruj
                    </Button>
                    <Button
                    color='secondary'
                    variant='contained'
                    onClick={props.toggleForm}
                    >
                        powrót
                    </Button>
                </div>
            </Paper>
        </div>
    )
}

export default RegisterForm