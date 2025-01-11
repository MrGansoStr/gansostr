import { Carousel } from "antd";
import { CustomCupyIcon, CustomFlaskIcon, CustomGithubIcon, CustomNumpyIcon, CustomOpenCVIcon, CustomPythonIcon, CustomPytorchIcon, CustomReactIcon, CustomRedisIcon, CustomTornadoIcon } from "../../../icons/IconsAll";
import { stylesAllMoreInfo } from "./MeComponent";
import Img1 from "./exp1_assets/Login.png"
import Img2 from "./exp1_assets/Dashboard.png"
import Img3 from "./exp1_assets/FacialRecognition.png"


const Exp1 = () => {
  return (
    <div>
      <h1 style={stylesAllMoreInfo.name}>Practicante Pre Profesional en OTI</h1>

      <div style={stylesAllMoreInfo.description}>
        <p>
          Mis funciones en estas prácticas fueron desde el mantenimiento de
          aplicaciones web hasta la creación de sistemas de Inteligencia
          Artificial
        </p>
        <p>
          <strong>OTI - UNAP</strong> <span>Agosto 2024 - Diciembre 2024</span>
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
                alt="Dashboard"
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
                alt="Reconcimiento Facial"
              />
            </div>
          </Carousel>
        </div>
        <ul>
          <li>
            Desarrollé un sistema avanzado de{" "}
            <strong>detección e identificación facial</strong> utilizando{" "}
            <strong>PyTorch</strong> y <strong>Python</strong>, diseñado para
            optimizar procesos de autenticación en la Universidad Nacional del
            Altiplano.
          </li>
          <li>
            Implementé y entrené modelos de reconocimiento facial, logrando un
            alto nivel de precisión incluso en entornos con iluminación variable
            y fondos complejos.
          </li>
          <li>
            Diseñé flujos de procesamiento para la integración del sistema con
            el comedor universitario, permitiendo la identificación automatizada
            de estudiantes al ingresar, mejorando la seguridad y la eficiencia
            del servicio.
          </li>
          <li>
            Realicé pruebas exhaustivas del sistema en escenarios reales,
            identificando y solucionando problemas relacionados con la calidad
            de las imágenes y el tiempo de respuesta.
          </li>
          <li>
            Documenté todo el proceso técnico, incluyendo la preparación de
            datos, entrenamiento de modelos, implementación y pruebas, para
            garantizar que el sistema pueda ser replicado o actualizado en el
            futuro.
          </li>
          <li>
            Brindé soporte técnico al personal administrativo del comedor
            universitario, asegurando la correcta operación del sistema durante
            el período de prueba.
          </li>
          <li>
            Colaboré con otros miembros del equipo de la OTI para identificar
            oportunidades de mejora e implementar optimizaciones basadas en el
            feedback recibido durante el período de prueba.
          </li>
        </ul>
        <section id="technologies">
          <h2 style={{textAlign: "center", color: "white"}}>Tecnologias</h2>
          <div style={{paddingBottom: "20px", alignItems: "center", display: "flex", justifyContent: "space-around"}}>
            <CustomPythonIcon style={{fontSize: "40px"}}/>
            <CustomReactIcon style={{fontSize: "40px"}}/>
            <CustomFlaskIcon style={{fontSize: "40px"}}/>
            <CustomPytorchIcon style={{fontSize: "40px"}}/>
            <CustomTornadoIcon style={{fontSize: "40px"}}/>
          </div>
          <div style={{paddingBottom: "20px", alignItems: "center", display: "flex", justifyContent: "space-around"}}>
            <CustomOpenCVIcon style={{fontSize: "60px"}}/>
            <CustomCupyIcon style={{fontSize: "40px"}}/>
            <CustomNumpyIcon style={{fontSize: "60px"}}/>
            <CustomRedisIcon style={{fontSize: "40px"}}/>
            <CustomGithubIcon style={{fontSize: "40px"}}/>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Exp1;
