import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const JudgeMessage = (props) => {
    if (props.loading) {
        return (
            <div className="judge-box">
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className="judge-box">
            <p>{props.message}</p>
        </div>
    )
}

export default JudgeMessage;