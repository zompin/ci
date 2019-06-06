import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Hider } from '../index';
import getBranchName from '../../utils/getBranchName';
import getUser from '../../utils/getUser';
import './Event.less';

const Event = ({ data }) => {
  const [show, toggle] = useState(false);
  const branch = getBranchName(data);
  const user = getUser(data);

  const toggleEvent = () => {
    toggle(!show);
  };

  return (
    <div className="event">
      <div className="event__title" onClick={toggleEvent}>
        <div className="event__repository">{data.payload.repository.name}</div>
        <div className="event__branch">{`branch: ${branch}`}</div>
        <div className="event__user">{`user: ${user}`}</div>
      </div>
      <div className="event__content">
        <Hider isShow={show}>
          <pre>{JSON.stringify(data, null, '\t')}</pre>
        </Hider>
      </div>
    </div>
  );
};

Event.propTypes = {
  data: PropTypes.string.isRequired,
};

export default Event;
