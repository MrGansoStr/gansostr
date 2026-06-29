import { createContext, useContext, useState } from "react";

interface ContextType {
  modalOpen: boolean;
  setModalOpen: Function;
  idComponent: string;
  setIdComponent: Function;
}

const ContextMainPage = createContext<ContextType | undefined>(undefined);

export const ContextCompMainPage = ({ children }: { children: any }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [idComponent, setIdComponent] = useState("");

  return (
    <ContextMainPage.Provider
      value={{
        modalOpen,
        setModalOpen,
        idComponent,
        setIdComponent
      }}
    >
      {children}
    </ContextMainPage.Provider>
  );
};

export const UseContextMainPage = () => {
  const contextSymbol = useContext(ContextMainPage);
  if (contextSymbol === undefined) {
    throw new Error(
      "UseContextMainPage se debe usar con el MyContextMainPage"
    );
  } else {
    return contextSymbol;
  }
};
