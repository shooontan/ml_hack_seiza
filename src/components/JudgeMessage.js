// @flow
import * as React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

type PropsType = {
  loading: boolean,
  message: string,
};

function JudgeMessage(props: PropsType) {
  if (props.loading) {
    return (
      <div className="judge-box">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="judge-box">
      <p>{props.message}</p>
    </div>
  );
}

export default JudgeMessage;
