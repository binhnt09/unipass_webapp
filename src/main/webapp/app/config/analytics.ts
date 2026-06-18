import ReactGA from 'react-ga4';

export const GA_MEASUREMENT_ID = 'G-PKR0ETJ0PF';

let isInitialized = false;

export const initGA = () => {
  if (!isInitialized && typeof window !== 'undefined') {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    isInitialized = true;
  }
};

export const logPageView = (pathname: string, search: string = '') => {
  if (isInitialized) {
    ReactGA.send({ hitType: 'pageview', page: pathname + search });
  }
};
