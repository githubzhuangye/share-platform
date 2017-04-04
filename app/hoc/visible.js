import React from 'react';
import store from 'config/store';

export default menuKey => Component => {
  return class VisibleComponent extends React.Component {
    render() {
      const { menu, submenus, menus } = store.getState().menu;
      const menuIndex = menus.findIndex(item => item === menu);
      const curMenu = submenus[menuIndex];
      if (menuKey === curMenu) {
        return (
          <div style={{display: 'block'}}><Component {...this.props}/></div>
        );
      } else {
        return (
          <div style={{display: 'none'}}><Component {...this.props}/></div>
        );
      }
    }
  };
}
