import { Carousel } from "antd";
import { stylesAllMoreInfo } from "./MeComponent";

import Img1 from "./proy2_assets/home.png";
import Img2 from "./proy2_assets/Ejemplo.png";
import { CustomGithubIcon, CustomReactIcon } from "../../../icons/IconsAll";

const Proy2 = () => {
  return (
    <div>
      <h1 style={stylesAllMoreInfo.name}>Blog C++ </h1>
      <div style={stylesAllMoreInfo.description}>
        <p>
          <strong>Stack:</strong> React
        </p>
        <div>
          <Carousel autoplay arrows>
            <div>
              <img
                src={Img1}
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  margin: "0 auto",
                  display: "block",
                }}
                alt="Home"
              />
            </div>
            <div>
              <img
                src={Img2}
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  margin: "0 auto",
                  display: "block",
                }}
                alt="Ejemplo"
              />
            </div>
          </Carousel>
        </div>
        <section id="links">
          <span>
            <a
              href="https://github.com/MrGansoStr/reactiw-blognoob"
              target="_blank"
            >
              <CustomGithubIcon style={{ fontSize: "15px" }} />
              &nbsp; GitHub Repository &nbsp; &nbsp;
            </a>
          </span>
          <span>
            <a
              href="https://https://reactiw-blognoob.vercel.app/"
              target="_blank"
            >
              Blog C++
            </a>
          </span>
        </section>

        <ul>
          <li>
            Diseñé y desarrollé una <strong>plataforma educativa</strong>{" "}
            centrada en la enseñanza de C++, ofreciendo contenido estructurado y
            accesible para aprender este lenguaje de programación.
          </li>
          <li>
            Utilicé <strong>React</strong> como biblioteca principal para crear
            una interfaz interactiva, responsiva y de fácil navegación,
            optimizada para dispositivos móviles y de escritorio.
          </li>
          <li>
            Incorporé características como navegación intuitiva, búsqueda de
            contenido y secciones organizadas para abordar conceptos básicos y
            avanzados de C++.
          </li>
          <li>
            Enfocado en brindar una experiencia de usuario fluida y atractiva,
            integrando diseño visual moderno y prácticas de desarrollo frontend
            eficientes.
          </li>
          <li>
            Proporcioné una base escalable para incluir futuras funcionalidades
            como interacción de usuarios, comentarios y ejercicios prácticos.
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
            {/* <CustomPythonIcon style={{fontSize: "40px"}}/> */}
            <CustomReactIcon style={{ fontSize: "40px" }} />
            <CustomGithubIcon style={{ fontSize: "40px" }} />
            {/* <CustomNodeJSIcon style={{fontSize: "40px"}} /> */}
            {/* <CustomMongoIcon style={{fontSize: "40px"}}/> */}
            {/* <CustomMaterialUIIcon style={{fontSize: "20px"}}/> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Proy2;
