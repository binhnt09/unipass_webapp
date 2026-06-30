import React from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Nav } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NavDropdown = props => {
  const isActive = props.isActive;
  const activeStyle = isActive
    ? {
        border: '1px solid rgba(0, 245, 255, 0.3)',
        background: 'rgba(0, 245, 255, 0.1)',
        textDecoration: 'none',
      }
    : {
        border: '1px solid transparent',
        background: 'transparent',
        textDecoration: 'none',
      };

  return (
    <Dropdown as={Nav.Item} id={props.id} data-cy={props['data-cy']} className={`relative ${props.className || ''}`} autoClose="outside">
      <DropdownToggle
        as={Nav.Link}
        className={`d-flex align-items-center gap-2 border-0 ${props.toggleClassName || 'text-[#075071] hover:bg-[#075071]/10 px-3 py-2 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:-translate-y-0.5 text-sm'}`}
        style={activeStyle}
      >
        <FontAwesomeIcon icon={props.icon} />
        <span className="font-medium">{props.name}</span>
      </DropdownToggle>
      <DropdownMenu
        // renderOnMount
        align="end"
        className={`absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-2xl ${props.menuClassName || ''}`}
        style={{ ...props.style, border: 'none' }} // Ghi đè border mặc định của Bootstrap
      >
        {props.children}
      </DropdownMenu>
    </Dropdown>
  );
};
