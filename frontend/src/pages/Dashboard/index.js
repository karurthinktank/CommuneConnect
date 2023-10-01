import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";
const Dashboard = props => {

  //meta title
  document.title = "Home | ElawFirm";
  const reports = [
    { title: "குடும்பங்கள்", iconClass: "mdi-family-tree", description: "100" },
    { title: "குடிப்பாடுக்காரர்கள் ", iconClass: "mdi-timelapse", description: "40" },
    { title: "ஆண்கள்", iconClass: "mdi-human-male", description: "30" },
    { title: "பெண்கள் ", iconClass: "mdi-human-female", description: "30" },
    { title: "மணியன்  ", iconClass: "mdi-human-male", description: "30" },
    { title: "கண்ணந்தை  ", iconClass: "mdi-human-female", description: "30" },
    { title: "அடையாள அட்டை  ", iconClass: "mdi-card-account-details", description: "30" },
   
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Home")}
            breadcrumbItem={props.t("Home")}
          />
          <div>
          <Row>
                {/* Reports Render */}
                {reports.map((report, key) => (
                  <Col md="3" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-success">
                              <i
                                className={
                                  "mdi " + report.iconClass + " font-size-24"
                                }
                              ></i>
                              
                            </span>
                          </div>
                          <div className="ms-3">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
            </Row>
            <Row>
            </Row>
          </div>
          </Container>
          </div>
    </React.Fragment>
  );
};


export default withTranslation()(Dashboard);
