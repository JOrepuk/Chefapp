import React from 'react';
import { Paper, Typography, TextField, Button, Collapse } from '@material-ui/core'

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
    },
    forgotToggleButton: {
        margin: 10
    }
}

const LogInForm = props => {

    const [email, setEmail] = React.useState('')
    const [emailError, setEmailError] = React.useState(false)

    const emailValidate = value => {
        const isError = !value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

        setEmailError(isError)
        return isError
    }

    const [pwd, setPwd] = React.useState('')
    const [pwdError, setPwdError] = React.useState(false)

    const pwdValidate = value => {
        setPwdError(!value)
        return !value
    }

    const onSubmit = () => {
        const isEmailError = emailValidate(email)
        const isPwdError = pwdValidate(pwd)
        if (!isEmailError && !isPwdError) {
            props._logIn(email, pwd)
        }
    }

    const submitOnEnter = e => {
        if (e.key === 'Enter') {
            onSubmit()
        }
    }

    const [isForgotPanelOpen, setIsForgotPanelOpen] = React.useState(false)
    const [forgotEmail, setforgotEmail] = React.useState('')
    const [forgotEmailError, setforgotEmailError] = React.useState(false)

    const forgotEmailValidate = value => {
        const isError = !value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

        setforgotEmailError(isError)
        return isError
    }

    const forgotOnSubmit = () => {
        const isEmailError = forgotEmailValidate(forgotEmail)
        if (!isEmailError) {
            props._resetPassword(forgotEmail, () => setIsForgotPanelOpen(false))
        }
    }

    const forgotSubmitOnEnter = e => {
        if (e.key === 'Enter') {
            forgotOnSubmit()
        }
    }

    return (
        <div style={styles.container}>
            <Paper style={styles.paper}>
                <Typography
                    align='center'
                    variant='h4'
                    color='primary'
                >
                    Zaloguj się
                </Typography>
                <TextField
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value)
                        if (emailError) {
                            emailValidate(e.target.value)
                        }
                    }}
                    onBlur={() => emailValidate(email)}
                    onKeyPress={submitOnEnter}
                    fullWidth={true}
                    margin='normal'
                    label='email'
                    variant='outlined'
                    error={emailError}
                    helperText={emailError && 'Podaj prawidłowy email'}
                />
                <TextField
                    value={pwd}
                    onChange={e => {
                        setPwd(e.target.value)
                        if (pwdError) {
                            pwdValidate(e.target.value)
                        }
                    }}
                    onBlur={() => pwdValidate(pwd)}
                    onKeyPress={submitOnEnter}
                    fullWidth
                    margin='normal'
                    label='hasło'
                    variant='outlined'
                    type='password'
                    error={pwdError}
                    helperText={pwdError && 'Podaj hasło'}
                />
                <div style={styles.buttonDIV}>
                    <Button
                        color='primary'
                        variant='contained'
                        onClick={onSubmit}
                    >
                        Zaloguj
                    </Button>
                    <Button
                        color='secondary'
                        variant='contained'
                        onClick={props.toggleForm}
                    >
                        Rejestracja
                    </Button>
                    <Button
                        style={styles.forgotToggleButton}
                        onClick={() => setIsForgotPanelOpen(!isForgotPanelOpen)}
                    >
                        Przypomnienie hasła
                    </Button>
                </div>
                <Collapse
                    in={isForgotPanelOpen}
                >
                    <TextField
                        value={forgotEmail}
                        onChange={e => {
                            setforgotEmail(e.target.value)
                            if (emailError) {
                                forgotEmailValidate(e.target.value)
                            }
                        }}
                        onBlur={() => forgotEmailValidate(email)}
                        onKeyPress={forgotSubmitOnEnter}
                        fullWidth={true}
                        margin='normal'
                        label='email'
                        variant='outlined'
                        error={forgotEmailError}
                        helperText={forgotEmailError && 'Podaj prawidłowy email'}
                    />
                    <Button
                        color='primary'
                        variant='contained'
                        fullWidth
                        onClick={forgotOnSubmit}
                    >
                        Wyślij
                </Button>
                </Collapse>
            </Paper>
        </div>
    );
}

export default LogInForm