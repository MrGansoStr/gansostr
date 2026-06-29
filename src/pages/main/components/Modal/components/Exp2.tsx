import { Carousel } from "antd";
import {
  CustomFlaskIcon,
  CustomMysqlIcon,
  CustomPythonIcon,
  CustomPytorchIcon,
  CustomReactIcon,
  CustomTypescriptIcon,
} from "../../../icons/IconsAll";
import { stylesAllMoreInfo } from "./MeComponent";
import Img1 from "./exp2_assets/login.png"
import Img2 from "./exp2_assets/take_photo.png"
import Img3 from "./exp2_assets/verify.png"
import Img4 from "./exp2_assets/admin.png"

import "./FixImages.css"

const Exp2 = () => {
  return (
    <div>
      <h1 style={stylesAllMoreInfo.name}>Voluntariado en OTI</h1>
      <div style={stylesAllMoreInfo.description}>
        <h3>Volunteer Project Lead Developer</h3>
        <p>
          <strong>OTI - UNAP</strong> <span>Julio 2023 - Julio 2024</span>
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
            <div>
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
            </div>
          </Carousel>
        </div>

        <ul>
          <li>
            Lideré el desarrollo integral del proyecto{" "}
            <strong>FINESI Photo Administrator</strong>, un sistema innovador
            diseñado para optimizar la toma y procesamiento de carnets
            universitarios, reduciendo significativamente el tiempo requerido
            por procesos manuales y aumentando la precisión gracias a la
            integración de modelos de Inteligencia Artificial.
          </li>
          <li>
            Diseñé la arquitectura de la API REST, asegurando escalabilidad y
            eficiencia en las comunicaciones entre los diferentes módulos del
            sistema.
          </li>
          <li>
            Implementé un sistema automatizado de procesamiento de imágenes
            utilizando <strong>Python, PyTorch y Flask</strong>, capaz de
            identificar y corregir errores comunes en las fotos de los
            estudiantes, como ajustes de orientación y mejora de calidad.
          </li>
          <li>
            Desarrollé una interfaz de usuario intuitiva y funcional utilizando{" "}
            <strong>ReactJS</strong>, destinada al personal encargado de la
            captura de fotografías, logrando una adopción rápida del sistema y
            reduciendo la curva de aprendizaje.
          </li>
          <li>
            Realicé pruebas exhaustivas de calidad y optimización del flujo de
            trabajo, lo que resultó en un sistema robusto capaz de manejar un
            alto volumen de usuarios simultáneamente.
          </li>
          <li>
            Brindé capacitaciones al personal administrativo para garantizar una
            correcta operación del sistema y documenté todos los procesos
            técnicos para facilitar futuras actualizaciones y mantenimiento.
          </li>
          <li>
            Gestioné la colaboración entre diferentes equipos dentro del
            proyecto, coordinando tareas con diseñadores, desarrolladores y
            usuarios finales para alinear las funcionalidades del sistema con
            los objetivos de la universidad.
          </li>
          <li>
            Logré que el sistema automatizado sea adoptado por el comedor
            universitario, extendiendo su uso más allá del ámbito original del
            proyecto.
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
            <CustomReactIcon style={{ fontSize: "40px" }} />
            <CustomTypescriptIcon style={{ fontSize: "40px" }} />
            <CustomFlaskIcon style={{ fontSize: "40px" }} />
            <CustomPytorchIcon style={{ fontSize: "40px" }} />
            <CustomMysqlIcon style={{ fontSize: "40px" }} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Exp2;
