import React, { useState, useRef } from 'react';
import './Event.less';

const Event = ({ data }) => {
  const [show, toggle] = useState(false);
  const [height, setHeight] = useState(0);
  const inner = useRef(null);

  const toggleEvent = () => {
    const { clientHeight } = inner.current;

    toggle(!show);

    if (show) {
      setHeight(0);
    } else {
      setHeight(clientHeight);
    }
  };

  return (
    <div className="event">
      <div className="event__title" onClick={toggleEvent}>Push</div>
      <div className="event__content" style={{ maxHeight: height }}>
        <div className="event__inner" ref={inner}>
          <pre>{JSON.stringify(data, null, '\t')}</pre>
        </div>
      </div>
    </div>
  );
};

export default Event;
