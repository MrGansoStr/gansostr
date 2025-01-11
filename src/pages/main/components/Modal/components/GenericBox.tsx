
type Props = {
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

const GenericBox = ({ children }: Props) => {
  return (
    <div style={{ overflow: "overlay", height: "100%" }}>
      {/* Renderizar children correctamente */}
      {typeof children === "function" ? children() : children}
    </div>
  );
}

export default GenericBox;
