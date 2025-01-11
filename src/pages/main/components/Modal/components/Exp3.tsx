import { Carousel } from "antd";
import { stylesAllMoreInfo } from "./MeComponent";
import Img1 from "./exp3_assets/main.png"
import { CustomGithubIcon, CustomNodeJSIcon, CustomPostgreSqlIcon, CustomReactIcon, CustomTypescriptIcon } from "../../../icons/IconsAll";


const Exp3 = () => {
  return (
    <div style={stylesAllMoreInfo.name}>
      <h1>Desarrollador Full Stack</h1>
      <div style={stylesAllMoreInfo.description}>
        <p>
          <strong>Catastro Web, UNAP</strong>{" "}
          <span>Agosto 2023 - Noviembre 2023</span>
        </p>

        <div >
          <Carousel autoplay arrows >

            <div >
              <img 
                src={Img1} 
                style={{
                  maxWidth: "100%", 
                  maxHeight: "600px", 
                  margin: "0 auto", 
                  display: "block"
                }} 
                alt="Login"
              />
            </div>
            {/* <div>
              <img 
                src={Img2} 
                style={{
                  maxWidth: "100%", 
                  maxHeight: "600px", 
                  margin: "0 auto", 
                  display: "block"
                }} 
                alt="Tomar fotos"
              />
            </div>
            <div>
              <img 
                src={Img3} 
                style={{
                  maxWidth: "100%", 
                  maxHeight: "600px", 
                  margin: "0 auto", 
                  display: "block"
                }} 
                alt="Verificar Identidad"
              />
            </div>
            <div>
              <img 
                src={Img4} 
                style={{
                  maxWidth: "100%", 
                  maxHeight: "600px", 
                  margin: "0 auto", 
                  display: "block"
                }} 
                alt="Administrar Imagenes"
              />
            </div> */}
          </Carousel>
        </div>
        <a href="https://qmap.vercel.app/" >Ir a sitio</a>
        <ul>
          <li>
            Diseñé y desarrollé una aplicación web completa desde cero para la
            visualización interactiva de <strong>catastros</strong> en la
            Universidad Nacional del Altiplano, optimizando la accesibilidad y
            gestión de datos geoespaciales (GIS).
          </li>
          <li>
            Implementé una base de datos robusta utilizando{" "}
            <strong>PostgreSQL</strong> con extensiones GIS (PostGIS) para
            almacenar, consultar y procesar datos geoespaciales de forma
            eficiente.
          </li>
          <li>
            Construí un backend escalable utilizando <strong>Express.js</strong>{" "}
            para gestionar la API RESTful, permitiendo una comunicación rápida y
            segura entre el cliente y el servidor.
          </li>
          <li>
            Desarrollé una interfaz de usuario moderna e intuitiva con{" "}
            <strong>React</strong>, asegurando una experiencia de usuario fluida
            y optimizada para distintos dispositivos.
          </li>
          <li>
            Implementé funcionalidades avanzadas como la visualización dinámica
            de mapas, búsqueda de catastros por ubicación y la interacción en
            tiempo real con datos geoespaciales.
          </li>
          <li>
            Aseguré la seguridad y el rendimiento de la aplicación mediante el
            uso de técnicas de optimización y pruebas exhaustivas en todas las
            capas del sistema.
          </li>
          <li>
            Documenté el proyecto detalladamente para facilitar su mantenimiento
            y futuras actualizaciones, asegurando su usabilidad a largo plazo
            por parte de la universidad.
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
            {/* <CustomPythonIcon style={{ fontSize: "40px" }} /> */}
            <CustomReactIcon style={{ fontSize: "40px" }} />
            <CustomTypescriptIcon style={{ fontSize: "40px" }} />
            {/* <FlaskIconWithProps style={{fontSize: "35px"}}/> */}
            {/* <CustomFlaskIcon style={{ fontSize: "40px" }} /> */}
            {/* <CustomPytorchIcon style={{ fontSize: "40px" }} /> */}
            {/* <CustomMysqlIcon style={{ fontSize: "40px" }} /> */}
            <CustomGithubIcon style={{fontSize: "40px"}}/>
            <CustomPostgreSqlIcon style={{fontSize: "40px"}}/>
            <CustomNodeJSIcon style={{fontSize: "40px"}}/>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Exp3;
