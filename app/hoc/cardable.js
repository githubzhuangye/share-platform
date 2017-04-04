import React, { Component } from 'react';
import classnames from 'classnames';
import store from 'config/store';
import globalStyles from 'sharedStyles/global.css';

import { HLink, HCard } from 'components/admin';
import { HMenuContainer } from 'containers/admin';

function getMoreMenus(tabKey, nav) {
  const [ coupon, manage, analysis, live ] = nav;
  switch (tabKey) {
    case 'coupon': return coupon;
    case 'manage': return manage;
    case 'analysis': return analysis;
    case 'live': return live;
    default: return [];
  }
}

function showTitle(tabKey) {
  return ['coupon', 'manage', 'analysis', 'live'].includes(tabKey);
}

// 二级导航
function SecondMenus({tabKey, nav}) {
  const menus = getMoreMenus(tabKey, nav);
  const currentUrl = location.hash.slice(1);
  return (
    <div>
      {menus.map(menu =>
        <HLink
          key={menu.url}
          to={menu.url}
          className={classnames(globalStyles.hLink, {[globalStyles.hLinkActive]: currentUrl.includes(menu.url)})}>
          {menu.name}
        </HLink>
      )}
    </div>
  );
}

export default (breadMenus) => Component => class extends Component {
  render() {
    const { tab, menu } = store.getState();
    const tabKey = tab.get('tabKey');
    const nav = menu.nav;
    return (
      <HCard
        title={showTitle(tabKey) ? <SecondMenus tabKey={tabKey} nav={nav}/> : null}>
        <Component {...this.props}/>
      </HCard>
    );
  }
}
