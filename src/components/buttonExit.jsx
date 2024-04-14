import React from "react";
import { Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";

const ExitButton = ({ onClick }) => {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '120px', zIndex: 999 }}>
    <Button type="primary" onClick={onClick}>
        Salir
    </Button>
</div>
);
}
export default ExitButton;

