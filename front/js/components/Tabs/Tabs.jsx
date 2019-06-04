import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import './Tabs.less';

const Tabs = ({
  tabs, className, onChange, currentTab,
}) => {
  if (!tabs.length) {
    return null;
  }

  return (
    <div className={`tabs ${className}`}>
      {
        tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t)}
            className={cs('tabs__item', {
              tabs__item_current: currentTab && currentTab.id === t.id,
            })}
          >
            {t.name}
          </button>
        ))
      }
    </div>
  );
};

Tabs.propTypes = {
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onChange: PropTypes.func.isRequired,
  currentTab: PropTypes.shape().isRequired,
};

Tabs.defaultProps = {
  className: '',
};

export default Tabs;
