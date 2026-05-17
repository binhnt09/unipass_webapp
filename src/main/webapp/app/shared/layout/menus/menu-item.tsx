import React from 'react';
import { DropdownItem } from 'react-bootstrap';
import { NavLink as Link } from 'react-router';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IMenuItem {
  children: React.ReactNode;
  icon: IconProp;
  to: string;
  id?: string;
  'data-cy'?: string;
}

const MenuItem = (props: IMenuItem) => {
  const { to, icon, id, children } = props;

  return (
    <DropdownItem
      as={Link as any}
      to={to}
      id={id}
      data-cy={props['data-cy']}
      className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <FontAwesomeIcon icon={icon} className="text-slate-500" />
      <span>{children}</span>
    </DropdownItem>
  );
};

export default MenuItem;
