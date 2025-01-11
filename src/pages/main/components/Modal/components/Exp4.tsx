import { stylesAllMoreInfo } from "./MeComponent";

const Exp4 = () => {
  return (
    <div>
      <h1 style={stylesAllMoreInfo.name}>Ayudante de Cátedra</h1>
      <div style={stylesAllMoreInfo.description}>
        <p>
          <strong>UNAP</strong> <span>Junio 2023 - Agosto 2023</span>
        </p>

        <ul>  
          <li>
            Brindé apoyo al docente en la planificación y desarrollo del curso
            de <strong>Muestreo Estadístico</strong>, asegurando una estructura
            clara y alineada con los objetivos académicos para estudiantes de
            tercer semestre.
          </li>
          <li>
            Diseñé y elaboré material académico complementario, como guías
            prácticas, presentaciones y ejemplos aplicados, facilitando la
            comprensión de conceptos estadísticos clave.
          </li>
          <li>
            Impartí clases libres para reforzar conocimientos y resolver dudas
            específicas de los estudiantes, promoviendo un ambiente de
            aprendizaje colaborativo y dinámico.
          </li>
          <li>
            Asistí en la creación y evaluación de ejercicios prácticos y
            exámenes, garantizando la alineación con los temas tratados en clase
            y el desarrollo de habilidades analíticas.
          </li>
          <li>
            Actué como mentor para los estudiantes, orientándolos en la
            resolución de problemas y la aplicación de métodos de muestreo a
            proyectos del mundo real.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Exp4;
