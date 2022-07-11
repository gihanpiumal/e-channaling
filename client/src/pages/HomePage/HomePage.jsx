import React, { Component } from "react";

import { Card, Col, Row, Button, Space } from "antd";
import { PlayCircleOutlined, DoubleRightOutlined } from "@ant-design/icons";

import "./HomePage.css";

import headerCardImage from "../../images/1.jpg";
import headerChartImage from "../../images/chart2.png";
import headerPcrImage from "../../images/pcr.png";
import headerDoctorImage from "../../images/doctor.png";
import headerMedicineImage from "../../images/medicine.png";

export class HomePage extends Component {
  aaa = () => {
    console.log(">>>>>>>>");
  };
  render() {
    return (
      <div className="homepage-wrapper">
        <div className="homepage-header">
          <Row>
            <Col span={12}>
              <div className="homepage-header-text">
                <div className="hompage-header-title">
                  <h1>
                    E-Channeling and <br />
                    Pharmacy Service
                  </h1>
                </div>
                <div className="homepagev-subtitle">
                  <p>
                    Get your nearest and best doctor from here.
                    <br />
                    Order your pharmacy things on here.
                  </p>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="homepage-header-card">
                <img
                  src={headerCardImage}
                  style={{ width: 300 }}
                  alt="doctors"
                />
              </div>
            </Col>
          </Row>
          <div className="homepage-header-button">
            <Row span={24}>
              <Button
                className="homepage-header-button-btn"
                style={{
                  background: "blue",
                  border: "none",
                  borderRadius: 15,
                  color: "#fff",
                  fontSize: 18,
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <Space>
                  <PlayCircleOutlined />
                  Let's Get Started
                </Space>
              </Button>
            </Row>
          </div>
          <div className="homepage-header-chart">
            <Row span={24}>
              <img
                src={headerChartImage}
                style={{ width: 500, height: 250 }}
                alt="chart"
              />
            </Row>
          </div>
        </div>
        <div className="homepage-middle">
          <div className="homepage-middle-access">
            <Row span={24}>
              <h2>
                <Space>Quick Access</Space>
              </h2>
            </Row>
          </div>
          <div className="homepage-middle-qucikaccess-cards">
            <Row span={24}>
              <Row span={8}>
                <div className="pcr-card" onClick={this.aaa}>
                  <div
                    className="pcr-card-img"
                    style={{ backgroundImage: `url(${headerPcrImage})` }}
                  >
                    <h1>PCR</h1>
                  </div>
                </div>
              </Row>
              <Row span={8}>
                <div className="find-doctor-card" onClick={this.aaa}>
                  <div
                    className="find-doctor-card-img"
                    style={{ backgroundImage: `url(${headerDoctorImage})` }}
                  >
                    <h1>Find Doctors</h1>
                  </div>
                </div>
              </Row>
              <Row span={8}>
                <div className="find-medicine-card" onClick={this.aaa}>
                  <div
                    className="find-medicine-card-img"
                    style={{ backgroundImage: `url(${headerMedicineImage})` }}
                  >
                    <div className="find-medicine-card-text">
                      <h1>Find Medicine</h1>
                    </div>
                  </div>
                </div>
              </Row>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
