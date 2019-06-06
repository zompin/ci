import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Hider.less';

const Hider = ({ isShow, children }) => {
  const [height, setHeight] = useState(0);
  const inner = useRef(null);
  const outer = useRef(null);

  useEffect(() => {
    if (isShow) {
      const { clientHeight } = inner.current;
      setHeight(clientHeight);

      setTimeout(() => {
        outer.current.classList.add('hider_visible');
      }, 600);
    } else {
      outer.current.classList.remove('hider_visible');
      setTimeout(() => {
        setHeight(0);
      }, 50);
    }
  }, [isShow]);

  return (
    <div className="hider" style={{ maxHeight: height }} ref={outer}>
      <div className="hider__inner" ref={inner}>{children}</div>
    </div>
  );
};

Hider.propTypes = {
  isShow: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};

export default Hider;
