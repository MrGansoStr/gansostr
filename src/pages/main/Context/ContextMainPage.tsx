import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";

interface ContextType {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  idComponent: string;
  setIdComponent: Dispatch<SetStateAction<string>>;
}

const ContextMainPage = createContext<ContextType | undefined>(undefined);

export const ContextCompMainPage = ({ children }: { children: ReactNode }) => {
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
