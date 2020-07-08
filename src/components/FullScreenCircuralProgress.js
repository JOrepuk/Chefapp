import React from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

const styles = {
    div: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw', 
        height: '100vh',
        backgroundColor: 'rgba(36, 41, 41, 0.8)',
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 900000

    }
}


const FullScreenCircuralProgress = (props) => {
    return (
        props._isOpen.length > 0 ?
        <div style={styles.div}>
            <CircularProgress
                size={100}
            />
        </div>
        : null
    )
}

const mapStateToProps = state => ({
    _isOpen: state.fullScreenCircuralProgress.circurals
})

const mapDispatchToProps = dispatch => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FullScreenCircuralProgress)