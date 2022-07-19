import React, { Component } from "react";

import { Col, Row, Table, Input, Button, Select } from "antd";
import { EyeOutlined, FilterOutlined } from "@ant-design/icons";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { Doctors_api } from "../../services";
import { Specialization_api } from "../../services";
import { DoctorCard, SpecalizationCard } from "../../components";
import "./Doctors.css";

import avatar from "../../images/avatar.webp";
import specialImage from "../../images/physiologist.png";

const { Search } = Input;
const { Option } = Select;

export class Doctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableList: [],
      specializationList: [],
      populorDoctorsList: [],
      populorScpecializationList: [],
      filterExpand: "",
      loading: true,

      form: {
        _id: "",
        firstName: "",
        specializationId: "",
        gender: "",
      },
    };
  }

  /////////////////////// tempory data  //////////////////////////
  columns = [
    {
      title: "Doctor Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "High Education",
      dataIndex: "highEducation",
      key: "highEducation",
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
      gender: "Male",
      high_education: "MBBS(Lon)",
      tags: ["nice", "developer"],
    },
  ];

  /////////////////////// tempory data  //////////////////////////

  showActions = (record) => {
    return (
      <EyeOutlined
        className="action-icons"
        // onClick={() => this.showEditModal(record)}
      />
    );
  };

  componentDidMount = async () => {
    await this.loadAllDoctors();
    await this.getMOstPopulorDoctors();
    // let tempDoctorsData = [
    //   {
    //     avatar: avatar,
    //     name: "Gihan Piumal MBBS(Lon)",
    //     specialization: "Pysiology",
    //   },
    // ];

    let tempSpecializationData = [
      {
        image: specialImage,
        specialization: "Pysiology",
        Description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti beatae error totam eaque, ad saepe, sequi dolorum commodi voluptatum minima qui facilis exercitationem cupiditate dolores. Commodi quod in autem nulla?",
      },
    ];

    this.setState({
      // populorDoctorsList: tempDoctorsData,
      populorScpecializationList: tempSpecializationData,
    });
  };

  getSpecializationList = async () => {
    let data = await Specialization_api.getAllSpecializations();
    if (data) {
      this.setState({ specializationList: data });
    }
  };

  loadAllDoctors = async () => {
    const form = this.state;

    let objdata = {
      _id: form._id,
      firstName: form.firstName,
      specializationId: form.specializationId,
      gender: form.gender,
    };

    let data = await Doctors_api.getAllDoctors(objdata);

    if (data) {
      this.setState({ tableList: data.allDoctors });
    } else {
      console.log("errr");
    }

    await this.getSpecializationList();
  };

  getMOstPopulorDoctors = async () => {
    let data = await Doctors_api.getPopulorDoctorsId();
    console.log(data.users);
    if (data) {
      this.setState({populorDoctorsList: data.users})
      // data.users.map((val) => {
      //   console.log(val);
      // });
    }
  };

  toggleFilter = () => {
    this.getMOstPopulorDoctors();
    const { filterExpand } = this.state;
    let styleName = "";

    switch (filterExpand) {
      case "":
        styleName = "show";
        break;
      case "show":
        styleName = "";
        break;
    }
    this.setState({ filterExpand: styleName });
  };
  render() {
    const { populorDoctorsList, populorScpecializationList, filterExpand } =
      this.state;
    return (
      <div className="doctors-wrapper">
        <div className="doctors-header">
          <div className="doctors-header-title">
            <Row>
              <h1>Most Populor Doctors</h1>
            </Row>
          </div>
          <div className="doctors-header-cards">
            <Row>
              {/* <Box sx={{ flexGrow: 1 }}> */}
                <Grid
                  container
                  justifyContent="center" 
                  spacing={3}
                  // columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {populorDoctorsList.map((val, index) => (
                    <Grid container  key={index}>
                      <DoctorCard className={"item-card"} record={val} />
                    </Grid>
                  ))}
                </Grid>
               {/* </Box> */}
            </Row>
          </div>
        </div>
        <div className="doctors-middle">
          <div className="doctors-middle-title">
            <Row>
              <h1>Most Populor Specializations</h1>
            </Row>
          </div>
          <div className="doctors-middle-cards">
            <Row>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {populorScpecializationList.map((val, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                      <SpecalizationCard
                        record={val}
                        colomn={this.columns}
                        data={this.data}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Row>
          </div>
        </div>
        <div className="doctors-footer">
          <div>
            <Row className="doctors-footer-title">
              <Col span={10}>
                <h1 style={{ marginLeft: 80 }}>All Doctors</h1>
              </Col>
              <Col span={10}>
                <Search
                  placeholder="Search Doctor's Name or Speciali"
                  style={{ width: 300, marginLeft: 220 }}
                />
              </Col>
              <Col style={{ paddingLeft: 10 }} span={4}>
                <Button
                  style={{ marginLeft: 80 }}
                  icon={<FilterOutlined />}
                  size="large"
                  onClick={this.toggleFilter}
                >
                  Filter
                </Button>
              </Col>
            </Row>
          </div>

          <div className={"filter-body " + filterExpand}>
            <Row className="filter_bar">
              <Col span={4}>
                <h3>Spacilization :</h3>
              </Col>
              <Col span={8}>
                <Select
                  defaultValue="lucy"
                  style={{ width: 200 }}
                  // onChange={handleChange}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>
              </Col>
              <Col span={4}>
                <h3>Gender :</h3>
              </Col>
              <Col span={8}>
                <Select
                  defaultValue="lucy"
                  style={{ width: 200 }}
                  // onChange={handleChange}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                </Select>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Box sx={{ flexGrow: 1 }}>
                <Table
                  key={"table-doctors"}
                  className="doctors-footer-table"
                  pagination={false}
                  dataSource={this.state.tableList}
                  columns={this.columns}
                />
              </Box>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default Doctors;
