import React, { PropTypes, Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { Link } from 'react-router';
import styles from './styles.css';

const MenuItem = ({url, name, onLinkClick}) => (
  <li>
    <span className={styles.item} onClick={() => onLinkClick(url)}>
      {name}
    </span>
  </li>
);

export default class HMenu extends Component {
  static propTypes = {
    menu: PropTypes.array.isRequired,
    onLinkClick: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
  }
  render() {
    const { menu, children, onLinkClick } = this.props;
    const menuContent = menu.map(item =>
      <Menu.Item key={item.url}>
        <Link to={item.url} onClick={() => onLinkClick(item.url)}>{item.name}</Link>
      </Menu.Item>
    );
    const overlay =  (
      <Menu>
        {menuContent}
      </Menu>
    );
    // const overlay = (
    //   <ul className={styles.list}>
    //     {menu.map((item, index) => <MenuItem {...item} key={index} onLinkClick={onLinkClick}/>)}
    //   </ul>
    // );
    return (
      <Dropdown overlay={overlay} trigger={['hover']}>
        <a className="ant-dropdown-link">
          {children}
        </a>
      </Dropdown>
    );
  }
}