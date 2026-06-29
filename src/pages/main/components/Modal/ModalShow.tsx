import React, { useState } from "react";
import { Modal } from "antd";
import { UseContextMainPage } from "../../Context/ContextMainPage";
import "./ModalFix.css"
import { ListComponents } from "./components/ListComponents";
import AllTreeV2Json from "../../../../infoToShow/AllTreev2.json"
import { CompressOutlined, ExpandAltOutlined} from "@ant-design/icons";

const HelpHeaderControls = ({expanded, handleExpand} : {expanded: boolean, handleExpand: Function}) => {
  const style_icon = {
    fontSize: "15px"
  }

  return (
    <div style={{justifyContent: "space-between", display: "flex", margin: "0"}}>
      <div>
      {}
      </div>
      <div id="div-icon-fullscreen" style={{right: "20px",top: "45px", display: "", position: "absolute"}}>
        <span id="icon-fullscreen" style={{}} onClick={() => handleExpand()}>
          {expanded ?<CompressOutlined  style={style_icon}/> :  <ExpandAltOutlined  style={style_icon}/> }
           
        </span>
      </div>
    </div>
  );
}

const ModalShow: React.FC = () => {
  const { modalOpen, setModalOpen, idComponent } = UseContextMainPage();
  const [fullScreen ,setFullScreen] = useState(false);
  const dict_nodes_description: {[key:string] : {summary: string, all_info: string, more_info?: boolean}} = AllTreeV2Json.NodesDescription;
  const handleFullScreen = () => {
    setFullScreen(!fullScreen);

  }
  
  return (
    <>
      <Modal
        title={dict_nodes_description[idComponent] ? dict_nodes_description[idComponent].summary : "Default Title"}
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer=""
        className={fullScreen ? "modalFullScreen": ""}
      >
        <div className={fullScreen ? "modal-content-FullScreen" : ""} >
          <HelpHeaderControls expanded={fullScreen} handleExpand={handleFullScreen}/>
          {ListComponents[idComponent]}
        </div>
      </Modal>
    </>
  );
};

export default ModalShow;
