import React from 'react';
// import { DropdownItem } from 'react-bootstrap';

import { languages, locales } from 'app/config/translation';

import { NavDropdown } from './menu-components';
import { Dropdown } from 'react-bootstrap';

export const LocaleMenu = ({ currentLocale, onClick }: { currentLocale: string; onClick: (locale: string) => void }) =>
  Object.keys(languages).length > 1 && (
    <NavDropdown icon="globe" name={currentLocale ? languages[currentLocale].name : undefined} menuClassName="min-w-[180px]">
      {locales.map(locale => (
        <Dropdown.Item
          key={locale}
          onClick={() => onClick(locale)}
          className="flex w-full items-center px-4 py-2 text-sm text-[#075071] hover:bg-[#075071]/10 hover:text-[#075071] border-0"
        >
          {languages[locale].name}
        </Dropdown.Item>
      ))}
    </NavDropdown>
  );
