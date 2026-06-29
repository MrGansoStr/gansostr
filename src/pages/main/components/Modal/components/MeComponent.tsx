import { LinkedinOutlined } from "@ant-design/icons";
import { CustomGithubIcon } from "../../../icons/IconsAll";
import GenericBox from "./GenericBox";

const MeComponent = () => {
  return (
    <GenericBox>
      <div style={stylesAllMoreInfo.container}>
        <h1 style={stylesAllMoreInfo.name}>Soy Carlos Huanca</h1>
        <img
          src="/yodx1.jpg"
          alt="Foto de Carlos Huanca"
          style={stylesAllMoreInfo.image}
        />
        <p style={stylesAllMoreInfo.description}>

          Simple and gentle, I thrive on solving problems. Whether it’s a
          challenge that requires logical reasoning or creative thinking, I
          approach each task with a structured, functional, and efficient
          mindset. Every problem has a solution, and if it hasn’t been found
          yet, it’s an opportunity to innovate and grow.
        </p>
      </div>
      <div style={stylesAllMoreInfo.socialContainer}>
        <span>
          <LinkedinOutlined/>
        <a
          href="https://www.linkedin.com/in/carlos-huanca-newstr/"
          target="_blank"
          style={stylesAllMoreInfo.socialLink}
        >
          LinkedIn
        </a>
          </span>
        <span>
          <CustomGithubIcon />
        <a
          href="https://github.com/MrGansoStr/"
          target="_blank"
          style={stylesAllMoreInfo.socialLink}
          >
          GitHub
        </a>
          </span>
      </div>
      <div style={stylesAllMoreInfo.socialContainer}>
        <a href="/CV_DEV.pdf" target="_blank" style={stylesAllMoreInfo.socialLink}>Curriculum Vitae</a>
      </div>
    </GenericBox>
  );
};

export const stylesAllMoreInfo: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    margin: "auto",
    maxWidth: "800px",
    textAlign: "center" as const,
    color: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  name: {
    fontSize: "2rem",
    color: "white",
  },
  description: {
    fontSize: "1rem",
    color: "#888",
    lineHeight: "1.6",
    marginTop: "10px",
  },
  socialContainer: {
    marginTop: "20px",
  },
  socialLink: {
    margin: "0 10px",
    textDecoration: "none",
    color: "#0077b5",
    fontWeight: "bold",
  },
  image: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    margin: "20px auto",
    display: "block",
    objectFit: "cover",
  },
};

export default MeComponent;
