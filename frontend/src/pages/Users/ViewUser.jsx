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
import avatar1 from '../../assets/images/users/avatar-2.jpg'

function ViewCase() {


    const { id } = useParams();
    const [data, setData] = useState({});


    const userInfo = [
        { label: "இரசீது தேதி", info: "12-03-1999" },
        { label: "இரசீது புத்தக எண் ", info: "ET-1250" },
        { label: "உறுப்பினர் பதிவு எண்", info: "1615040" },
        { label: "தபால் குறியீடு எண்", info: "GT-1250" },
        { label: "அலைபேசி எண் ", info: "9095047355" },
        { label: "மாற்று அலைபேசி எண்", info: "6382679574" },
        { label: "சர்வதேச அலைபேசி எண்", info: "9095047355" },
        { label: "சதரைவழி STD Code", info: "04188" },
        { label: "தரைவழி தொலைபேசி எண்", info: "(800) 555‑0199" },
        {label:"முகவரி",info:"1/57 South street , Sevaloor , Tenkasi Dist"},
        {label:"நாடு",info:"India"},
        {label:"மாநிலம்",info:"Tamilnadu"},
        {label:"மாவட்டம்",info:"Tenkasi"},
        {label:"வட்டம்",info:"Uthumalai"},
        {label:"பஞ்சாயத்து",info:"RKPuram"},
        {label:"சிற்றூர் / கிராமம்",info:"Sevaloor"},
    ];
    const userone=[
        {name:"John Doe",gender:"ஆண்",relationship:"மனைவி",profession:"விவசாயம்",maritialstatus:"தனியர்",dob:"12-03-1999"},
        {name:"John Doe",gender:"ஆண்",relationship:"மனைவி",profession:"விவசாயம்",maritialstatus:"தனியர்",dob:"12-03-1999"},
        {name:"Doe",gender:"பெண்",profession:"சுய தொழில்",relationship:"கணவர்",maritialstatus:"திருமணமானவர்",dob:"12-03-1999"},
        {name:"JohnDoe",gender:"மூன்றாம் பாலினத்தவர்",profession:"நிறுவன பணியாளர்",relationship:"மகள்",maritialstatus:"விதவை",dob:"12-03-1999"},
        {name:"Marry",gender:"பெண்",profession:"இல்லம்சார்ந்தவர்",maritialstatus:"தனியர்",dob:"12-03-1999",relationship:"தாய்"},
    ]
    const fetchCase = async () => {
        let url = USER_URL + id;
        const response = await GET(url);
        if (response.status === 200) {
            console.log(response)
            setData(response.data.data);
        }
        else {
            CustomToast(response.data.message, "error");
        }
    }



    // useEffect(() => {
    //     fetchCase();
    // }, []);

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
                                            <div className="col-md-4  p-3 member-details" style={{maxHeight:"300px"}}>
                                                <div className="d-flex justify-content-center">
                                                    <img className="photo" src={avatar} alt="User Avatar" />
                                                </div>
                                               <div className="text-center">
                                                    <h5>Ramprasath Muthuraj</h5>
                                                    <p className="mb-0">6382679544</p>
                                                    <small>Engineer</small>
                                                    <div className="mt-1">
                                                        <Badge className="rounded-pill d-inlineflex p-1"  color="secondary">இரசீது எண்<span>
                                                            <Badge color="success" className="rounded-pill">403540</Badge></span></Badge>
                                                    </div>
                                                </div>
                                            </div>
                                          <div className="col-md-7  p-3 member-details">
                                                <div className="row fs-5">
                                                    {userInfo.map(values=>(
                                                       <div className="col-md-6" key={values.label}>
                                                            <Label className="text-muted">{values.label}</Label>
                                                            <p>{values.info}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                    </div>
                                   <Accordion>
                                    <AccordionTab header="குடும்ப விபரங்கள் ">
                                        <Row>
                                            <Col lg="12">
                                            
                                                <div className="container">
                                                {userone.map((values,index)=>(
                                                    <div class="family-member">
                                                        {/* <img class="photo" src={avatar} alt="Family Member 1"></img> */}
                                                            <div className="row">                                                    
                                                            
                                                            <>
                                                            
                                                            <div key ={index} className="member-profile col-md-12">
                                                                <h3>Name:</h3>
                                                                <h3>{values.name}</h3>
                                                            </div>
                                                            <div className="member-profile">
                                                                <p>Gender</p>
                                                                <p>{values.gender}</p>
                                                            </div>
                                                            <div className="member-profile">
                                                                <p>Relationship : </p>
                                                                <p>{values.relationship}</p>
                                                            </div>
                                                            <div className="member-profile">
                                                                <p>Profession <span>:</span></p>
                                                                <p>{values.profession}</p>
                                                            </div>
                                                            <div className="member-profile">
                                                                <p>Maritial Status <span>:</span></p>
                                                                <p>{values.maritialstatus}</p>
                                                            </div>

                                                            <div className=" member-profile">
                                                                <p>DOB<span>:</span></p>
                                                                <p>{values.dob}</p>
                                                            </div>



                                                        
                                                            </>
                                                        
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


export default ViewCase;