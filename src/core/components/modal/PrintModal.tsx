import React from 'react';
import PrintImg from "../../../assets/pdfprint.png"

class ComponentToPrint extends React.Component {
  render( ) {
    return (
      <>
        <img src={PrintImg} height={"1090px"} width={"100%"} ></img>
      </>
    );
  }
}

export default ComponentToPrint;
