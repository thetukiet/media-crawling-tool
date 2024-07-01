import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
}));

const LoadingOverlay: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.overlay}>
            <CircularProgress />
        </div>
    );
};

export default LoadingOverlay;