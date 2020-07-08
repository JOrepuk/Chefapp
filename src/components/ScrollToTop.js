import React from 'react';

import { useScrollTrigger, Zoom, Fab } from '@material-ui/core';
import { KeyboardArrowUp } from '@material-ui/icons'

const styles = {
    div: {position: 'fixed', bottom: 20, right: 20}
}

const onClick = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

const ScrollToTop = (props) => {

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 70
    })

    return (
        <Zoom
            in={trigger}
        >
            <div
                style={styles.div}
                onClick={onClick}
            >
                <Fab
                    color= 'secondary'
                    size= 'small'
                >
                    <KeyboardArrowUp />
                </Fab>
            </div>
        </Zoom>
    );
}

export default ScrollToTop;