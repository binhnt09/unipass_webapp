import 'react-toastify/dist/ReactToastify.css';
// import './app.scss';
import './styles/index.css';
import 'app/config/dayjs';

import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import { router } from 'app/routes';

// const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || '';

export const App = () => {
  return (
    <>
      <ToastContainer position="top-left" className="toastify-container" toastClassName="toastify-toast" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
