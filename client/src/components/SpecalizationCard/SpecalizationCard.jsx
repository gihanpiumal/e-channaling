import React, { useState } from "react";

import { Card, Avatar, Row, Col, Button, Image, Modal, Table,  } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Box from "@mui/material/Box";

import "./SpecalizationCard.css";

import avatarImg from "../../images/avatar.webp";

const SpecalizationCard = ({ record, colomn, data }) => {
  const [isSpecialModalVisible, setIsSpecialModalVisible] = useState(false);
  const [isAvailableDoctorsModalVisible, setisAvailableDoctorsModalVisible] =
    useState(false);

  ///////////////////////// Modal control start ///////////////////////
  const showSpecialModal = () => {
    setIsSpecialModalVisible(true);
  };

  const showAvailableDoctorsModal = () => {
    setisAvailableDoctorsModalVisible(true);
  };

  const handleOk = () => {
    setIsSpecialModalVisible(false);
    setisAvailableDoctorsModalVisible(false);
  };

  const handleCancel = () => {
    setIsSpecialModalVisible(false);
    setisAvailableDoctorsModalVisible(false);
  };

  ///////////////////////// Modal control end ///////////////////////

  return (
    <>
      {/* available doctors Modal start */}
      <Modal
        title={record.specialization}
        visible={isAvailableDoctorsModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={900}
      >
        <div className="available-doctors-modal">
          <Row>
            <Box sx={{ flexGrow: 1 }}>
              <Table
                pagination={false}
                dataSource={data}
                columns={colomn}
                style={{width:800}}
              />
            </Box>
          </Row>
        </div>
      </Modal>
      {/* available doctors Modal end */}

      {/* view profile Modal start */}
      <Modal
        title={record.specialization}
        visible={isSpecialModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        // style={{borderRadius: 15}}
      >
        <div className="specialization-detail-modal">
          <Row>
            <img
              style={{ width: 300 }}
              src={record.image}
              alt="specialization image"
            />
          </Row>
          <Row span={24}>
            <Col span={10}>
              <h3>Description :</h3>
            </Col>
            <Col span={14}>
              <h4>{record.Description}</h4>
            </Col>
          </Row>
          <Row style={{ paddingTop: 20 }}>
            <Col span={10}>
              <Button>Cancel</Button>
            </Col>
            <Col span={14}>
              <Button>Make Apoiment</Button>
            </Col>
          </Row>
        </div>
      </Modal>
      {/* view profile Modal end */}
      <div>
        <Card
          className="special-card-wrapper"
          bordered={false}
          style={{
            width: 350,
            borderRadius: 15,

            background:
              "radial-gradient(97.45% 305.73% at 98.29% 2.62%, #541690 0%, #FF4949 100%)",
          }}
        >
          <Row className="sppecial-delail" span={24}>
            <Col span={12}>
              <img style={{ width: 130 }} src={record.image} alt="" />
            </Col>
            <Col style={{ paddingTop: 35 }} span={12}>
              <h2 style={{ color: "#fff", fontSize: 24 }}>
                {record.specialization}
              </h2>
            </Col>
          </Row>

          <Row>
            <Row span={12}>
              <Button
                style={{
                  background: "#FFCA03",
                  borderRadius: 10,
                  border: "none",
                  color: "#fff",
                }}
                className="special-card-book"
                onClick={showAvailableDoctorsModal}
              >
                Available Doctors
              </Button>
            </Row>
            <Row span={12}>
              <Button
                style={{
                  background: "#FF1700",
                  borderRadius: 10,
                  border: "none",
                  color: "#fff",
                }}
                className="special-card-view"
                onClick={showSpecialModal}
              >
                View Details
              </Button>
            </Row>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default SpecalizationCard;
