import { React, useState, useEffect, Fragment } from "react";
import { useParams } from 'react-router';
import { CASES_URL } from "helpers/url_helper";
import { GET } from "helpers/api_helper";
import CustomToast from "components/Common/Toast";
import { ToastContainer } from "react-toastify";
import Breadcrumb from "components/Common/Breadcrumb";
import classnames from "classnames";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Label,
     TabPane, NavItem, NavLink, CardText, Nav, TabContent
} from "reactstrap";

import ModalPopUp from "components/ModalPopUp/Modal";
import "../../assets/scss/_case.scss";


function ViewCase() {


    const { id } = useParams();
    const [data, setData] = useState({});
    const [usertype, setype] = useState('');
    const [selectedfiles, setselectedfiles] = useState([]);
    const [modal, setmodal] = useState(false);
    const [customActiveTab, setcustomActiveTab] = useState("1");
    const toggleCustom = tab => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };
    const userInfo = [
        { label: "Name", info: "Ramprasath M" },
        { label: "Email-Id", info: "ramprasathraj.nec@gmail.com" },
        { label: "Phone Number", info: "6382679574" },
        { label: "Additional Phone Number", info: "9095047355" },
        {
            label: "Address",
            info: [
                "1/57, south street",
                "Sevaloor",
                "Tenkasi Dist-627860, Tamilnadu",
            ].join("/n"),
        },
    ];
    const fetchCase = async () => {
        let url = CASES_URL + id;
        const response = await GET(url);
        if (response.status === 200) {
            console.log(response)
            setData(response.data.data);
        }
        else {
            CustomToast(response.data.message, "error");
        }
    }

    //Modal pop up 
    const uploadfiles = () => {
        console.log('ram');
        setmodal(true);
    }
    const toggle = () => {
        setmodal(!modal);
    };

    const test = "ram";


    //File upload
    const handlefilechange = (event) => {

        setselectedfiles([...selectedfiles, ...event.target.files]);
    }
    //File deletion
    const handleFileDelete = (index) => {
        const updatedFiles = [...selectedfiles];
        updatedFiles.splice(index, 1);
        setselectedfiles(updatedFiles);
    }

    // useEffect(() => {
    //     fetchCase();
    // }, []);

    return (
        <>
            <div className="page-content">
                <Container fluid>
                  
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {/* <CardTitle className="h4"></CardTitle> */}
                                    <div className="d-flex">
                                    <div>
                                        <h4>View Case</h4>
                                        <p>active</p>
                                    </div>
                                    <div className="ms-auto">
                                     <div className="d-flex gap-3">
                                    <button type="button" class="btn btn-secondary "><i className="mdi mdi-lead-pencil font-size-16 align-middle"></i> Edit</button>
                                    <button type="button" className="btn btn-danger"><i className="mdi mdi-delete-empty font-size-16 align-middle"></i>Delete</button>
                                    </div>
                                    </div>
                                    </div>
                                    {/* <p className="card-title-desc">Example of custom tabs</p> */}
                                  
                                    <Nav tabs className="nav-tabs-custom nav-justified">
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "1",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("1");
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="fas fa-home"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Petitoner Details </span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "2",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("2");
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="far fa-user"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Case details</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "3",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("3");
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="far fa-envelope"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Summary</span>
                                            </NavLink>
                                        </NavItem>
                                        {/* <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "4",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("4");
                                                }}
                                            >
                                                <span className="d-block d-sm-none">
                                                    <i className="fas fa-cog"></i>
                                                </span>
                                                <span className="d-none d-sm-block">Settings</span>
                                            </NavLink>
                                        </NavItem> */}
                                    </Nav>

                                    <TabContent
                                        activeTab={customActiveTab}
                                        className="p-3 text-muted"
                                    >
                                        <TabPane tabId="1">
                                            <Row>
                                                <Col sm="12">
                                                    <CardText className="mb-0">
                                                        <div className="form-group row align-items-center p-2">
                                                            <div className="col-md-3">
                                                                <Label className="form-label userview-label">Name</Label>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <p className="userview-info">Ramprasath M</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <Label className="form-label userview-label">Email-Id</Label>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <p className="userview-info">ramprasathraj.nec@gmail.com</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <Label className="form-label userview-label">Phone Number</Label>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <p className="userview-info">6382679574</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <Label className="form-label userview-label">Additional Phone Number</Label>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <p className="userview-info">9095047355</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <Label className="form-label userview-label">Address</Label>
                                                            </div>
                                                            <div className="col-md-9">
                                                                <p className="userview-info">1/57, south street</p>
                                                                <p className="userview-info">Sevaloor</p>
                                                                <p className="userview-info">Tenkasi Dist-627860, Tamilnadu</p>

                                                            </div>
                                                        </div>
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <Row>
                                                <Col sm="12">
                                                    <CardText className="mb-0">
                                                    <div className="form-group row align-items-center p-2">
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Court Name</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">Govt Hight Court</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Court Complex</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">A1-Complex</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">District</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">Madurai</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">State</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">Tamilnadu</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Case Type</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">Criminal</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Registration Number</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">123456</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Registration Year</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">2016</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Registration Date</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">12-03-1999</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Section</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">U-B12</p>
                                                </div>


                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Filling Number</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">7895959</p>
                                                </div>
                                                <div className="col-md-4">
                                                    <Label className="form-label userview-label">Filling Date</Label>
                                                </div>
                                                <div className="col-md-8">
                                                    <p className="userview-info">12-03-1999</p>
                                                </div>
                                                   </div>
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <Row>
                                                <Col sm="12">
                                                    <CardText className="mb-0">
                                                        Etsy mixtape wayfarers, ethical wes anderson tofu
                                                        before they sold out mcsweeney&apos;s organic lomo retro
                                                        fanny pack lo-fi farm-to-table readymade. Messenger
                                                        bag gentrify pitchfork tattooed craft beer, iphone
                                                        skateboard locavore carles etsy salvia banksy hoodie
                                                        helvetica. DIY synth PBR banksy irony. Leggings
                                                        gentrify squid 8-bit cred pitchfork. Williamsburg
                                                        banh mi whatever gluten-free, carles pitchfork
                                                        biodiesel fixie etsy retro mlkshk vice blog.
                                                        Scenester cred you probably haven&apos;t heard of them,
                                                        vinyl craft beer blog stumptown. Pitchfork
                                                        sustainable tofu synth chambray yr.
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="4">
                                            <Row>
                                                <Col sm="12">
                                                    <CardText className="mb-0">
                                                        Trust fund seitan letterpress, keytar raw denim
                                                        keffiyeh etsy art party before they sold out master
                                                        cleanse gluten-free squid scenester freegan cosby
                                                        sweater. Fanny pack portland seitan DIY, art party
                                                        locavore wolf cliche high life echo park Austin.
                                                        Cred vinyl keffiyeh DIY salvia PBR, banh mi before
                                                        they sold out farm-to-table VHS viral locavore cosby
                                                        sweater. Lomo wolf viral, mustache readymade
                                                        thundercats keffiyeh craft beer marfa ethical. Wolf
                                                        salvia freegan, sartorial keffiyeh echo park vegan.
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}


export default ViewCase;