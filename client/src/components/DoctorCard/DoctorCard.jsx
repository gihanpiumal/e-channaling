import React, { useState } from "react";

import {
  Card,
  Avatar,
  Row,
  Col,
  Button,
  Image,
  Modal,
  DatePicker,
  Select,
  Input,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

import "./DoctorCard.css";

import avatarImg from "../../images/avatar.webp";

const { Option } = Select;
const { Search } = Input;

const DoctorCard = ({ record }) => {
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);
  const [isApoimentModalVisible, setIsApoimentModalVisible] = useState(false);

  ///////////////////////// Modal control start ///////////////////////
  const showDoctorModal = () => {
    setIsDoctorModalVisible(true);
  };

  const showApoimentModal = () => {
    setIsApoimentModalVisible(true);
  };

  const handleOk = () => {
    setIsDoctorModalVisible(false);
    setIsApoimentModalVisible(false);
  };

  const handleCancel = () => {
    setIsDoctorModalVisible(false);
    setIsApoimentModalVisible(false);
  };

  ///////////////////////// Modal control end ///////////////////////

  /////////////////////// tempory data start //////////////////////////

  const data = {
    avatar: avatarImg,
    name: "Gihan Piumal MBBS(Lon)",
    specialization: "Pysiology",
    gender: "Male",
    Description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti beatae error totam eaque, ad saepe, sequi dolorum commodi voluptatum minima qui facilis exercitationem cupiditate dolores. Commodi quod in autem nulla?",
  };

  /////////////////////// tempory data end //////////////////////////

  return (
    <>
      {/* view profile Modal start */}
      <Modal
        title="Doctor Details"
        visible={isDoctorModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        // style={{borderRadius: 15}}
      >
        <Row>
          <Avatar
            className="doctorcard-avatar"
            size="large"
            src={<Image src={data.avatar} style={{ width: 32 }} />}
          />
        </Row>
        <Row span={24}>
          <Col span={10}>
            <h3>Name :</h3>
          </Col>
          <Col span={14}>
            <h3>{data.name}</h3>
          </Col>
        </Row>
        <Row span={24}>
          <Col span={10}>
            <h3>Specialization :</h3>
          </Col>
          <Col span={14}>
            <h3>{data.specialization}</h3>
          </Col>
        </Row>
        <Row span={24}>
          <Col span={10}>
            <h3>Gender :</h3>
          </Col>
          <Col span={14}>
            <h3>{data.gender}</h3>
          </Col>
        </Row>
        <Row span={24}>
          <Col span={10}>
            <h3>Description :</h3>
          </Col>
          <Col span={14}>
            <h4>{data.Description}</h4>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Button>Cancel</Button>
          </Col>
          <Col span={14}>
            <Button>Make Apoiment</Button>
          </Col>
        </Row>
      </Modal>
      {/* view profile Modal end */}

      {/* Modal for Apoiment apoiment  start*/}
      <Modal
        title="PCR Apoiment"
        visible={isApoimentModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        {/* <Space direction="vertical"> */}
        <Row>
          <Col span={10}>
            <p>Date :</p>
          </Col>
          <Col span={14}>
            <DatePicker />
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <p>Doctor Name :</p>
          </Col>
          <Col span={14}>
            <p>Jack Don</p>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <p>Specialization :</p>
          </Col>
          <Col span={14}>
            <p>Nirologist</p>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <p>Available Times :</p>
          </Col>
          <Col span={14}>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              // onChange={handleChange}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <p>Price :</p>
          </Col>
          <Col span={14}>
            <h3>Rs. 6500.00</h3>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <p>Your Token is :</p>
          </Col>
          <Col span={14}>
            <h3>12</h3>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Button>Cancel</Button>
          </Col>
          <Col span={14}>
            <Button>Save and Genarate PDF</Button>
          </Col>
        </Row>
      </Modal>
      {/* Modal for Apoiment apoiment  end */}

      <div>
        <Card
          className="doctorcard-wrapper"
          bordered={false}
          style={{
            width: 350,
            borderRadius: 15,
            background: "linear-gradient(180deg, #FF06B7 0%, #3C2C3E 100%",
          }}
        >
          <div className="aa">
            <div>
              <Row>
                <Avatar
                  className="doctorcard-avatar"
                  size="large"
                  src={<Image src={record.avatar} style={{ width: 32 }} />}
                />
              </Row>
            </div>
            <div>
              <Row>
                <h2 className="doctor-name">{record.name}</h2>
              </Row>
            </div>
            <div className="ab">
              <Row>
                <h3 className="doctor-position">{record.specialization}</h3>
              </Row>
            </div>
            <div className="as">
              <Row>
                <Row span={12}>
                  <Button
                    style={{
                      background: "#3B44F6",
                      borderRadius: 10,
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={showApoimentModal}
                    className="doctor-card-book"
                  >
                    Make Apoiment
                  </Button>
                </Row>
                <Row span={12}>
                  <Button
                    style={{
                      background: "#FFCD38",
                      borderRadius: 10,
                      border: "none",
                      color: "#fff",
                    }}
                    className="doctor-card-view"
                    onClick={showDoctorModal}
                  >
                    View Profile
                  </Button>
                </Row>
              </Row>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default DoctorCard;
