import { stylesAllMoreInfo } from "./MeComponent";
import {
  CustomGithubIcon,
  CustomNodeJSIcon,
  CustomReactIcon,
  CustomTypescriptIcon,
} from "../../../icons/IconsAll";

const Exp5 = () => {
  return (
    <div>
      <h1 style={stylesAllMoreInfo.name}>Desarrollador Front-end</h1>
      <div style={stylesAllMoreInfo.description}>
        <p>
          <strong>Asociación Cultural Mendel</strong>{" "}
          <span>Setiembre 2025 - Actualidad</span>
        </p>
        <p>
          <em>Presencial (Set 2025 - May 2026) · Remoto (Jun 2026 - actualidad)</em>
        </p>

        <ul>
          <li>
            Construí <strong>módulos internos para un sistema escolar</strong>:
            asistencia, roles, dashboards, agendas, calificaciones y flujos
            administrativos.
          </li>
          <li>
            Construí <strong>módulos internos de formularios de RRHH</strong>{" "}
            para la gestión de procesos internos.
          </li>
          <li>
            Desarrollo con componentes <strong>NextJS, RSC y API routes</strong>,
            usando <strong>R2</strong> para el almacenamiento de archivos.
          </li>
          <li>
            Construcción de un <strong>dashboard financiero en tiempo real</strong>{" "}
            con <strong>Nivo</strong> mediante polling, escenas <strong>3D con
            ThreeJS</strong> y formularios validados con <strong>zod</strong>.
          </li>
          <li>
            Flujo de trabajo con Slack, Jira y Pull Requests con Coderabbit,
            aplicando principios <strong>YAGNI, KISS y Atomic Design</strong>,
            usando Vim y <strong>git worktree</strong>.
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
            <CustomReactIcon style={{ fontSize: "40px" }} />
            <CustomTypescriptIcon style={{ fontSize: "40px" }} />
            <CustomNodeJSIcon style={{ fontSize: "40px" }} />
            <CustomGithubIcon style={{ fontSize: "40px" }} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Exp5;
