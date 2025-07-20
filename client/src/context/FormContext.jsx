// FormContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("multiFormData");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
    setFormReady(true); 
  }, []);

  useEffect(() => {
    if (formReady) {
      localStorage.setItem("multiFormData", JSON.stringify(formData));
    }
  }, [formData, formReady]);

  const updateFormData = (formName, data) => {
    if (!formReady) return;
    setFormData((prev) => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        ...data,
      },
    }));
  };

  const getFormData = (formName) => {
    return formData[formName] || {};
  };

  const resetFormData = (formName) => {
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData[formName];
      localStorage.setItem("multiFormData", JSON.stringify(newData));
      return newData;
    });
  };

  return (
    <FormContext.Provider
      value={{ formData, formReady, updateFormData, getFormData, resetFormData }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
