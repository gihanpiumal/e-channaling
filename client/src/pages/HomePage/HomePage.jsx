import React, { Component } from "react";
import axios from "axios"

import {
  Col,
  Row,
  Button,
  Space,
  Avatar,
  Modal,
  DatePicker,
  Select,
  Input,
  Table,
} from "antd";
import {
  PlayCircleOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import {HomePage as home} from "../../services"
import "./HomePage.css";

import headerCardImage from "../../images/1.jpg";
import headerChartImage from "../../images/chart2.png";
import headerPcrImage from "../../images/pcr.png";
import headerDoctorImage from "../../images/doctor.png";
import headerMedicineImage from "../../images/medicine.png";

const { Option } = Select;
const { Search } = Input;

export class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPcrModalVisible: false,
      isFindDoctorsModalVisible: false,
      isFindMedicineModalVisible: false,
      isChannelSpecializeModalVisible: false,
      posts:[]
    };
  }

  componentDidMount = () =>{
    this.testAPI()
  }

  testAPI = async () =>{
    // axios.get("http://localhost:8000/all_users").then(res=>{
    //   if(res.data.success){
    //     this.setState({posts: res.data.allUsers})
    //   }
    //   console.log(this.state.posts);
    // })
    let data = await home.getAllUsers()
    if(data){
      console.log(data);
    }
  }

  ////////////////////////////////// modal controls //////////////////////////////

  showPcrModal = () => {
    this.setState({ isPcrModalVisible: true });
  };
  showFindDoctorModal = () => {
    this.setState({ isFindDoctorsModalVisible: true });
  };
  showFindMedicineModal = () => {
    this.setState({ isFindMedicineModalVisible: true });
  };
  showChannelSpecializeModal = () => {
    this.setState({ isChannelSpecializeModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isPcrModalVisible: false });
    this.setState({ isFindDoctorsModalVisible: false });
    this.setState({ isFindMedicineModalVisible: false });
    this.setState({ isChannelSpecializeModalVisible: false });
  };

  ////////////////////////////////// modal controls //////////////////////////////

  showActions = (record) => {
    return (
      <EyeOutlined
        className="action-icons"
        // onClick={() => this.showEditModal(record)}
      />
    );
  };

  /////////////////////// tempory data  //////////////////////////
  columns = [
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctor_name",
      key: "doctor_name",
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => this.showActions(record),
    },
  ];

  data = [
    {
      key: "1",
      specialization: "Physiologist",
      doctor_name: "John Brown",
      tags: ["nice", "developer"],
    },
  ];

  /////////////////////// tempory data  //////////////////////////

  test = () =>{
    console.log(this.state.posts)
  }

  render() {
    const {
      isPcrModalVisible,
      isFindDoctorsModalVisible,
      isFindMedicineModalVisible,
      isChannelSpecializeModalVisible,
    } = this.state;
    return (
      <div className="homepage-wrapper">
        {/* Modal for PCR apoiment */}
        <Modal
          title="PCR Apoiment"
          visible={isPcrModalVisible}
          footer={null}
          onCancel={this.handleCancel}
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
        {/* Modal for PCR apoiment */}

        {/* Modal for find doctor apoiment */}

        <Modal
          title="Find Doctor"
          visible={isFindDoctorsModalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Row>
            <Col span={10}>
              <p>Search</p>
            </Col>
            <Col span={14}>
              <Search placeholder="search by name" style={{ width: 200 }} />
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <p>Filter by specialization :</p>
            </Col>
            <Col span={14}>
              <Select
                defaultValue=""
                style={{ width: 120 }}
                // onChange={handleChange}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Button>Filter</Button>
            </Col>
            <Col span={12}>
              <Button>Clear Filter</Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table columns={this.columns} dataSource={this.data} />
            </Col>
          </Row>
        </Modal>

        {/* Modal for find doctor apoiment */}

        {/* Modal for find medicine */}

        <Modal
          title="Find Medicine"
          visible={isFindMedicineModalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Row>
            <Col span={10}>
              <p>Search</p>
            </Col>
            <Col span={14}>
              <Search placeholder="search by name" style={{ width: 200 }} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Button>Filter</Button>
            </Col>
            <Col span={12}>
              <Button>Clear Filter</Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table columns={this.columns} dataSource={this.data} />
            </Col>
          </Row>
        </Modal>
        {/* Modal for find medicine */}

        {/* Modal for Channnel Specialize */}

        <Modal
          title="Channel Specialize"
          visible={isChannelSpecializeModalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Row>
            <h3>Physician</h3>
          </Row>
          <Row>
            <h1>IMAGE</h1>
          </Row>
          <Row>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est quasi
              dolore obcaecati placeat beatae, laborum eos molestias quidem
              similique voluptate veritatis atque consequatur maiores corporis?
              Temporibus earum voluptas dignissimos dolorum.
            </p>
          </Row>
          <Row>
            <h2>Available Doctors</h2>
          </Row>
          <Row>
            <Col span={24}>
              <Table columns={this.columns} dataSource={this.data} />
            </Col>
          </Row>
        </Modal>
        {/* Modal for Channnel Specialize */}
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
                onClick={this.testAPI}
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
                <div className="pcr-card" onClick={this.showPcrModal}>
                  <div
                    className="pcr-card-img"
                    style={{ backgroundImage: `url(${headerPcrImage})` }}
                  >
                    <h1>PCR</h1>
                  </div>
                </div>
              </Row>
              <Row span={8}>
                <div
                  className="find-doctor-card"
                  onClick={this.showFindDoctorModal}
                >
                  <div
                    className="find-doctor-card-img"
                    style={{ backgroundImage: `url(${headerDoctorImage})` }}
                  >
                    <h1>Find Doctors</h1>
                  </div>
                </div>
              </Row>
              <Row span={8}>
                <div
                  className="find-medicine-card"
                  onClick={this.showFindMedicineModal}
                >
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
        <div className="homepage-footer">
          <div className="homepage-footer-top-specialis">
            <Row span={24}>
              <h2>
                <Space>Top Specialities</Space>
              </h2>
            </Row>
          </div>

          <Row span={24}>
            <Row span={8}>
              <div
                className="top-specialist-card-1"
                onClick={this.showChannelSpecializeModal}
              >
                <div className="top-specialist-card-avatar">
                  <Avatar
                    size={64}
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                </div>
                <div className="top-specialist-card-text">
                  <h1>Channel a Physician</h1>
                </div>
              </div>
            </Row>
            <Row span={8}>
              <div
                className="top-specialist-card-2"
                onClick={this.showChannelSpecializeModal}
              >
                <div className="top-specialist-card-avatar">
                  <Avatar
                    size={64}
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                </div>
                <div className="top-specialist-card-text">
                  <h1>Channel a Yourologist</h1>
                </div>
              </div>
            </Row>
            <Row span={8}>
              <div
                className="top-specialist-card-3"
                onClick={this.showChannelSpecializeModal}
              >
                <div className="top-specialist-card-avatar">
                  <Avatar
                    size={64}
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />
                </div>
                <div className="top-specialist-card-text">
                  <h1>Channel a Niurologist</h1>
                </div>
              </div>
            </Row>
          </Row>
        </div>
      </div>
    );
  }
}

export default HomePage;
