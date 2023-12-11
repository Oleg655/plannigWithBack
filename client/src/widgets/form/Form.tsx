import React from 'react';

interface FormI {
  children: JSX.Element[];
  formData: any;
  setFormData: (newFormData: any) => void;
}

export const Form = ({ children, formData, setFormData }: FormI) => {
  const handleInputChange = (key: string, text: string) => {
    const newFormData = { ...formData };
    newFormData[key] = text;
    setFormData(newFormData);
  };

  const mappedChildren = children.map((child: any) => {
    return {
      ...child,
      props: {
        ...child.props,
        onChange: (event: any) => handleInputChange(child.name, event.target.value),
        value: formData ? formData[child.name] : '',
      },
    };
  });

  return <section>{mappedChildren}</section>;
};
