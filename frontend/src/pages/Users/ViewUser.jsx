import { React, useState, useEffect } from "react";
import { useParams } from 'react-router';
import { USER_URL } from "helpers/url_helper";
import { GET } from "helpers/api_helper";
import CustomToast from "components/Common/Toast";
import { ToastContainer } from "react-toastify";
import Breadcrumb from "components/Common/Breadcrumb";
import classnames from "classnames";
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Row, CardBody, Card, Col, Container, Label, CardText, Badge, CardHeader } from "reactstrap";
import "../../assets/scss/_listview.scss";
import avatar from '../../assets/images/users/avatar-1.jpg';
import { ProductService } from "./data";
function ViewUser() {


    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        //  fetchUser();
        // ProductService.getProductsData().then((data)=>setData(data));
    }, []);
    const values = [
        { name: "Ramprasath M", Label: "Name" },
        { name: "Father", Label: "father_or_husband" },
        { name: "6382679574", Label: "mobile_number" },
        { name: "ERT-12345", Label: "receipt_no" },

    ]

    const fetchUser = async () => {
        let url = USER_URL + id + '/';
        const response = await GET(url);
        if (response.status === 200) {
            console.log(response)
            // setData(response.data.data);
        }
        else {
            CustomToast(response.data.message, "error");
        }
    }
    // setData(data);


    return (
        <>
            <div className="page-content">
                <Breadcrumb title="User" breadcrumbItem="Family Members" />
                <Container fluid>
                    <Card>
                        <CardHeader className="head-member border">
                            <h5 >உறுப்பினர் விபரங்கள்</h5>
                        </CardHeader>
                        <CardBody>
                            <div>

                                {/* உறுப்பினர் விபரங்கள் */}
                                <div className="row p-3 gap-5">
                                    <div className="col-md-4  p-3 member-details" >
                                        <div className="d-flex justify-content-center">
                                            {data?.profile_image ? (<img className="photo" src={"data:image/png;base64," + data?.profile_image} alt="User Avatar" />)
                                                : <img className="photo" src={avatar} alt="User Avatar" />}
                                                
                                        </div>
                                        <div className="mt-1 text-center">
                                                <Badge className="rounded-pill d-inlineflex p-2" color="secondary">Member ID<span>
                                                    <Badge color="success" className="rounded-pill ms-2 fs-7">403540</Badge></span></Badge>
                                            </div>




                                        <div className="profile-info">
                                            <div className="row text-center">
                                                <div className="col-5">
                                                    <label>Name:</label>
                                                </div>

                                                <div className="col-7">
                                                    <strong>Ramprasath M</strong>
                                                </div>
                                            </div>
                                            <div className="row text-center">
                                                <div className="col-5">
                                                    <label>Father/Husband</label>
                                                </div>

                                                <div className="col-7">
                                                    <strong>{data?.father_or_husband}</strong>
                                                </div>
                                            </div>
                                            <div className="row text-center">
                                                <div className="col-5">
                                                    <label>Mobile Number</label>
                                                </div>

                                                <div className="col-7">
                                                    <strong>{data?.mobile_number}</strong>
                                                </div>
                                            </div>
                                            <div className="row text-center">
                                                <div className="col-5">
                                                    <label>Receipt Number</label>
                                                </div>

                                                <div className="col-7">
                                                    <strong>{data?.receipt_no} / {data?.receipt_book_no}</strong>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                            <div className="mt-1 ">
                                                <Badge className="rounded-pill p-2 d-inline-flex align-items-center"  color="success">
                                                    <span className="mdi mdi-check fs-5"></span>Cardmapped
                                                </Badge>
                                            </div>
                                            <div className="mt-1 ">
                                                <Badge className="rounded-pill p-2 d-inline-flex align-items-center"  color="danger">
                                                    <span className="mdi mdi-close fs-5"></span>NotMapped
                                                </Badge>
                                            </div>
                                            </div>
                                            
                                            <div>
                                               
                                                {/* <span>Incompleted</span>
                                                <span>Mapped</span>
                                                <span>Not Mapped</span> */}

                                            </div>
                                            <span className="">Profile completed</span>
                                            <div class="progress bg-transparent progress-sm">
                                                
                                                <div class="progress-bar bg-success rounded" role="progressbar" style={{ width: "94%" }} aria-valuenow="94" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <span className="">Profile Not completed</span>
                                            <div class="progress bg-transparent progress-sm">
                                                
                                                <div class="progress-bar bg-danger rounded" role="progressbar" style={{ width: "54%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>

                                        </div>




                                    </div>
                                    <div className="col-md-7  p-3 member-details">
                                        <div className="row fs-5">
                                            <div className="col-md-6" key="இரசீது தேதி">
                                                <Label className="text-muted">இரசீது தேதி:</Label>
                                                <strong><p>{data?.receipt_date}</p></strong>
                                            </div>

                                            <div className="col-md-6" key="உறுப்பினர் பதிவு எண் ">
                                                <Label className="text-muted">உறுப்பினர் பதிவு எண்: </Label>
                                                <strong><p>{data?.charity_registration_number}</p></strong>
                                            </div>
                                            <div className="col-md-6" key="தற்போதைய முகவரி">
                                                <Label className="text-muted">தற்போதைய முகவரி:</Label>
                                                <strong><p>{data?.current_address}</p></strong>
                                            </div>
                                            <div className="col-md-6" key="பூர்விக முகவரி">
                                                <Label className="text-muted">பூர்விக முகவரி:</Label>
                                                <strong>
                                                    {data?.permanent_address ? (<p>{data?.permanent_address}</p>) : <p>---------------</p>}
                                                </strong>
                                            </div>
                                            <div className="col-md-6" key="மாற்று அலைபேசி எண்">
                                                <Label className="text-muted">மாற்று அலைபேசி எண்:</Label>
                                                <strong>
                                                    {data?.secondary_mobile_number ? (<p>{data?.secondary_mobile_number}</p>) : <p>---------------</p>}
                                                </strong>
                                            </div>
                                            <div className="col-md-6" key="நாடு">
                                                <Label className="text-muted">நாடு:</Label>
                                                <strong><p>{data?.country}</p></strong>
                                            </div>
                                            <div className="col-md-6" key="மாநிலம்">
                                                <Label className="text-muted">மாநிலம்:</Label>
                                                <strong><p>{data?.state}</p></strong>
                                            </div>
                                            <div className="col-md-6" key="மாவட்டம்">
                                                <Label className="text-muted">மாவட்டம்:</Label>
                                                <strong><p>{data?.district}</p></strong>
                                            </div>
                                            <div className="col-md-6" key="வட்டம்">
                                                <Label className="text-muted">வட்டம்:</Label>
                                                <strong>
                                                    {data?.taluk ? (<p>{data?.taluk}</p>) : <p>---------------</p>}
                                                </strong>
                                            </div>
                                            <div className="col-md-6" key="பஞ்சாயத்து">
                                                <Label className="text-muted">பஞ்சாயத்து:</Label>
                                                <strong>
                                                    {data?.panchayat ? (<p>{data?.panchayat}</p>) : <p>---------------</p>}
                                                </strong>
                                            </div>
                                            <div className="col-md-6" key="பஞ்சாயத்து">
                                                <Label className="text-muted">சிற்றூர் / கிராமம்:</Label>
                                                <strong>
                                                    {data?.village ? (<p>{data?.village}</p>) : <p>---------------</p>}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Accordion>
                                    <AccordionTab header="குடும்ப உறுப்பினர்களின் தகவல்கள் :- ">
                                        <Row>
                                            <Col lg="12">

                                                <div className="container">
                                                    {data?.family_members && data?.family_members.map((values, index) => (
                                                        <div class="col-md-6">
                                                            <div class="family-member">
                                                                <div className="row">

                                                                    <>

                                                                        <div key={index} className="member-profile col-md-12">
                                                                            <div class="col-md-5">
                                                                                <p className="text-muted">பெயர்<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7">
                                                                                <strong><p>{values.name}</p></strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile">
                                                                            <div class="col-md-5">
                                                                                <p className="text-muted">ஆதார் எண்<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7">
                                                                                <strong>
                                                                                    {values.aadhar_no ? (<p>{values.aadhar_no}</p>) : <p>---------------</p>}
                                                                                </strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile">
                                                                            <div class="col-md-5">
                                                                                <p className="text-muted">அலைபேசி எண்<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7">
                                                                                <strong>
                                                                                    {values.mobile_number ? (<p>{values.mobile_number}</p>) : <p>---------------</p>}
                                                                                </strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile">
                                                                            <div class="col-md-5">
                                                                                <p className="text-muted">பாலினம்<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7">
                                                                                <strong>
                                                                                    <strong><p>{values.gender}</p></strong>                                                                        </strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile">
                                                                            <div class="col-md-5">
                                                                                <p className="text-muted">பிறந்த தேதி<span>:</span></p>
                                                                            </div>
                                                                            <div class="col-md-7">
                                                                                <strong>
                                                                                    {values.date_of_birth ? (<p>{values.date_of_birth}</p>) : <p>---------------</p>}
                                                                                </strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="member-profile">
                                                                            <div class="col-md-5"> <p className="text-muted">உறவுமுறை<span>:</span></p></div>
                                                                            <div class="col-md-7"><strong><p>{values.relationship}</p></strong></div>
                                                                        </div>
                                                                        <div className="member-profile">
                                                                            <div class="col-md-5"> <p className="text-muted">திருமண நிலை<span>:</span></p></div>
                                                                            <div class="col-md-7">  <strong><p>{values.martial_status}</p></strong></div>
                                                                        </div>

                                                                        <div className="member-profile">
                                                                            <div class="col-md-5"><p className="text-muted">தொழில்<span>:</span></p></div>
                                                                            <div class="col-md-7"><strong>
                                                                                {values.occupation ? (<p>{values.occupation}</p>) : <p>---------------</p>}
                                                                            </strong></div>
                                                                        </div>
                                                                        <div className="member-profile">
                                                                            <div class="col-md-5"><p className="text-muted">இரத்தப் பிரிவு: <span>:</span></p></div>
                                                                            <div class="col-md-7"><strong>
                                                                                {values.blood_group ? (<p>{values.blood_group}</p>) : <p>---------------</p>}
                                                                            </strong></div>
                                                                        </div>

                                                                    </>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </Col>
                                        </Row>
                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </CardBody>
                    </Card>


                </Container>
            </div>
        </>
    )
}


export default ViewUser;