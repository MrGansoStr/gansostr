import { stylesAllMoreInfo } from "./MeComponent";

import Img1 from "./proy3_assets/Home.png";
import Img2 from "./proy3_assets/Contactos.png";
import Img3 from "./proy3_assets/Dashboard.png";
import Img4 from "./proy3_assets/Receipts.png";
import Img5 from "./proy3_assets/PayPal.png";
import { Carousel } from "antd";
import {
  CustomGithubIcon,
  CustomMaterialUIIcon,
  CustomMysqlIcon,
  CustomNodeJSIcon,
  CustomReactIcon,
} from "../../../icons/IconsAll";

const Proy3 = () => {
  return (
    <div>
      <h1 style={stylesAllMoreInfo.name}>React Vite Ugass</h1>
      <div style={stylesAllMoreInfo.description}>
        <p>
          <strong>Stack:</strong> React, Vite
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
                alt="Contactos"
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
                alt="Dashboard"
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
                alt="Recibos"
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
                alt="Paypal"
              />
            </div>
          </Carousel>
        </div>
        <section id="links">
          <span>
            <a href="">React vite Ugass</a>
          </span>
        </section>
        <ul>
          <li>
            Desarrollé un <strong>sistema web</strong> para una empresa local de
            servicios de agua, permitiendo a los usuarios consultar recibos de
            pago y realizar pagos en línea de forma segura y eficiente.
          </li>
          <li>
            Utilicé <strong>React</strong> con <strong>Vite</strong> para
            construir una interfaz rápida, ligera y responsiva, asegurando una
            experiencia de usuario optimizada en diferentes dispositivos.
          </li>
          <li>
            Implementé una integración segura para procesar pagos en línea,
            cumpliendo con estándares de seguridad y protección de datos.
          </li>
          <li>
            Diseñé una funcionalidad intuitiva para la visualización de recibos
            históricos, facilitando a los usuarios la gestión de sus pagos.
          </li>
          <li>
            Colaboré con el equipo local para adaptar el sistema a los
            requerimientos específicos de la empresa, asegurando una solución
            personalizada y escalable.
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
            <CustomNodeJSIcon style={{ fontSize: "40px" }} />
            <CustomMysqlIcon style={{ fontSize: "40px" }} />
            <CustomMaterialUIIcon style={{ fontSize: "20px" }} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Proy3;
