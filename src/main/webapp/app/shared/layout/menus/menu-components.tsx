import React from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Nav } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NavDropdown = props => (
  <Dropdown as={Nav.Item} id={props.id} data-cy={props['data-cy']} className={`relative ${props.className || ''}`} autoClose="outside">
    <DropdownToggle
      as={Nav.Link}
      className={`d-flex align-items-center gap-2 border-0 ${props.toggleClassName || 'text-white hover:bg-white/10 px-3 py-2 rounded-lg'}`}
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
