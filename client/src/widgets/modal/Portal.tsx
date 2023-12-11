import { ReactNode, useLayoutEffect, useState } from 'react';

import { createPortal } from 'react-dom';
import { createPortalElement } from 'utils';

interface PortalI {
  children: ReactNode;
  wrapperId: string;
}

export const Portal = ({ children, wrapperId = 'react-portal-wrapper' }: PortalI) => {
  const [wrapperElement, setWrapperElement] = useState(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true;
      element = createPortalElement(wrapperId);
    }
    setWrapperElement(element);

    return () => {
      // delete the programatically created element
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  // wrapperElement state will be null on the very first render.
  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};
