import { Carousel } from "antd";
import { stylesAllMoreInfo } from "./MeComponent.tsx";
import Img1 from "./proy1_assets/Home.png";
import Img2 from "./proy1_assets/Login.png";
import Img3 from "./proy1_assets/Registro.png";
import Img4 from "./proy1_assets/private.png";
import Img5 from "./proy1_assets/recoveryPass.png";
import { CustomGithubIcon, CustomMaterialUIIcon, CustomMongoIcon, CustomNodeJSIcon, CustomReactIcon } from "../../../icons/IconsAll";

const Proy1 = () => {
  return (
    <div>
      <h3 style={stylesAllMoreInfo.name}>STATCJ</h3>
      <div style={stylesAllMoreInfo.description}>
        <p>
          <strong>Stack:</strong> React, MongoDB, Express, Redux, DevOps Tooling
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
                alt="Login"
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
                alt="Registro"
              />
            </div>
            <div>
              <img
                src={Img3}
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  margin: "0 auto",
                  display: "block",
                }}
                alt="Registro"
              />
            </div>
            <div>
              <img
                src={Img4}
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  margin: "0 auto",
                  display: "block",
                }}
                alt="Private"
              />
            </div>
            <div>
              <img
                src={Img5}
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  margin: "0 auto",
                  display: "block",
                }}
                alt="Recovery"
              />
            </div>
          </Carousel>
        </div>

        <p>
          <span>
            <a href="https://github.com/MrGansoStr/statcj" target="_blank">
            <CustomGithubIcon style={{ fontSize: "15px" }} />
              &nbsp; GitHub Repository &nbsp; &nbsp;
            </a>
          </span>
          <span>
            <a href="https://statcj.vercel.app" target="_blank">
              StatCJ
            </a>
          </span>
        </p>

        <ul>
          <li>
            Diseñado y desarrollado como una herramienta interactiva para el
            aprendizaje de <strong>estadística</strong>, facilitando a los
            usuarios explorar conceptos clave a través de una interfaz amigable.
          </li>
          <li>
            Creación de una <strong>API RESTful</strong> que permite el manejo
            eficiente de usuarios y comentarios, con conexión segura a una base
            de datos <strong>MongoDB Atlas</strong>.
          </li>
          <li>
            Desarrollo del <strong>front-end</strong> con <strong>React</strong>
            , asegurando una experiencia de usuario responsiva e intuitiva, y
            gestión de estado implementada con <strong>Redux</strong>.
          </li>
          <li>
            Construcción del <strong>backend</strong> con{" "}
            <strong>Express</strong>, utilizando middleware y endpoints
            optimizados para la comunicación entre cliente y servidor.
          </li>
          <li>
            Implementación de buenas prácticas de <strong>DevOps</strong> para
            despliegue y mantenimiento, integrando herramientas modernas para la
            gestión de infraestructura y despliegues continuos.
          </li>
          <li>
            Enfoque en el rendimiento y seguridad del sistema, asegurando una
            experiencia confiable para los usuarios finales.
          </li>
        </ul>
        <section id="technologies">
          <h2 style={{textAlign: "center", color: "white"}}>Tecnologias</h2>
          <div style={{paddingBottom: "20px", alignItems: "center", display: "flex", justifyContent: "space-around"}}>
            {/* <CustomPythonIcon style={{fontSize: "40px"}}/> */}
            <CustomReactIcon style={{fontSize: "40px"}} />
            <CustomNodeJSIcon style={{fontSize: "40px"}} />
            <CustomMongoIcon style={{fontSize: "40px"}}/>
            <CustomMaterialUIIcon style={{fontSize: "20px"}}/>
          </div>
          <div style={{paddingBottom: "20px", alignItems: "center", display: "flex", justifyContent: "space-around"}}>
            {/* <CustomOpenCVIcon style={{fontSize: "60px"}}/> */}
            {/* <CustomCupyIcon style={{fontSize: "40px"}}/> */}
            {/* <CustomNumpyIcon style={{fontSize: "60px"}}/> */}
            {/* <CustomRedisIcon style={{fontSize: "40px"}}/> */}
            <CustomGithubIcon style={{fontSize: "40px"}} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Proy1;
