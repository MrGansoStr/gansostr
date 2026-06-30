import { stylesAllMoreInfo } from "./MeComponent";
import {
  CustomGithubIcon,
  CustomPythonIcon,
  CustomPytorchIcon,
  CustomReactIcon,
  CustomScikitlearnIcon,
  CustomTornadoIcon,
} from "../../../icons/IconsAll";

const Exp6 = () => {
  return (
    <div>
      <h1 style={stylesAllMoreInfo.name}>Desarrollador - Dirección de Admisión UNAP</h1>
      <div style={stylesAllMoreInfo.description}>
        <p>
          <strong>Dirección de Admisión - UNAP</strong>{" "}
          <span>Enero 2025 - Julio 2025</span>
        </p>

        <ul>
          <li>
            Mantenimiento de <strong>sistemas biométricos</strong> faciales
            (VGGFace2) y de sistemas de Inteligencia Artificial con inferencia
            de modelos optimizados con <strong>TensorRT</strong> en tiempo real
            sobre un servidor con <strong>WEBRTC</strong>.
          </li>
          <li>
            Generación de reportes de <strong>similitud facial</strong> general
            con <strong>PyTorch, Pandas y Seaborn</strong>.
          </li>
          <li>
            Ejecución de <strong>ETL facial y ETL dactilar</strong> con{" "}
            <strong>PyTorch</strong> y Griaule para alimentar los procesos de
            identificación.
          </li>
          <li>
            Implementé y desplegué un sistema de <strong>detección e
            identificación facial en tiempo real</strong> utilizando PyTorch,
            Python, React y <strong>WebSockets</strong>.
          </li>
          <li>
            La solución fue probada y utilizada durante la fase de
            inscripciones e ingreso al examen de admisión de la UNAP para
            verificar la identidad de <strong>13 mil postulantes</strong>.
          </li>
        </ul>
        <section id="technologies">
          <h2 style={{ textAlign: "center", color: "white" }}>Tecnologias</h2>
          <div
            style={{
              paddingBottom: "20px",
              alignItems: "center",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <CustomPythonIcon style={{ fontSize: "40px" }} />
            <CustomPytorchIcon style={{ fontSize: "40px" }} />
            <CustomReactIcon style={{ fontSize: "40px" }} />
            <CustomScikitlearnIcon style={{ fontSize: "40px" }} />
            <CustomTornadoIcon style={{ fontSize: "40px" }} />
            <CustomGithubIcon style={{ fontSize: "40px" }} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Exp6;
