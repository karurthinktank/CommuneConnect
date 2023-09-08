import { useState, useEffect } from "react";
import Breadcrumb from "components/Common/Breadcrumb";
import {  CardBody, Card,  Input, Label, Form,  CardHeader, Button } from "reactstrap";
import ModalPopUp from "components/ModalPopUp/Modal";


function AddSummary() {
    const [selectedfiles, setSelectedfiles] = useState([]);
    const handlefilechange = (event) => {
        // setSelectedfiles([...selectedfiles,...event.target.files]);
        setSelectedfiles([...selectedfiles, ...event.target.files]);
    }

    const handleFileDelete = (index) => {
        const updatedFiles = [...selectedfiles];
        updatedFiles.splice(index, 1);
        setSelectedfiles(updatedFiles);
    };
    // const renderFileList = () => {
    //     return selectedfiles.map((file, index) => (
    //       <div key={index}>
    //         <span>{file.name}</span>
    //         <button onClick={() => handleFileDelete(index)}>Delete</button>
    //       </div>
    //     ));
    //   };
    return (
        <>
            <div className="page-content">
                <div className="row">
                    <Breadcrumb title="Home" breadcrumbItem="Add Summary" />
                    <div className="col-md-12">
                        <Card className="usercard">
                            <CardHeader>
                                <h5>Case details</h5>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Label className="form-label">CNR Number</Label>
                                            <Input
                                                id="cnr"
                                                name="cnr-number"
                                                className="form-control"
                                               
                                                type="text"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <Label className="form-label">Case Type</Label>
                                            <Input
                                                id="case-type"
                                                name="case-type"
                                                className="form-control"
                                                
                                                type="text"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                             <Label className="form-label">Court Name</Label>
                                            <Input
                                                id="court-name"
                                                name="court-name"
                                                className="form-control"
                                              
                                                type="text"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                           <Label className="form-label">Court Complex</Label>
                                            <Input
                                                id="cnr"
                                                name="cnr-complex"
                                                className="form-control"
                                              
                                                type="text"
                                                disabled
                                            />  
                                        </div>
                                        <div className="col-md-6">
                                              <Label className="form-label">Petitioner Name</Label>
                                            <Input
                                                id="petitioner-name"
                                                name="petitioner-name"
                                                className="form-control"
                                                
                                                type="text"
                                                disabled
                                            />  
                                        </div>
                                        <div className="col-md-6">
                                                  <Label className="form-label">Petitioner Contact Number</Label>
                                            <Input
                                                id="Petit-contact-no"
                                                name="Petit-contact-no"
                                                className="form-control"
                                               
                                                type="number"
                                                disabled
                                            />  
                                        </div>
                                    </div>
                                </form>
                            </CardBody>

                            <CardHeader>
                                <h5>Add Summary</h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Label className="form-label">Date of Business<span className="text-danger">*</span></Label>
                                            <Input
                                                id="dob"
                                                name="date of business"
                                                className="form-control"
                                                placeholder="Enter date of Business"
                                                type="date"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <Label className="form-label">Next Hearing Date<span className="text-danger">*</span></Label>
                                                <Input id="next-hearing-date"
                                                    name="next hearing"
                                                    className="form-control"
                                                    placeholder="Enter Next hearing date"
                                                    type="date"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <Label className="form-label">Description<span className="text-danger">*</span></Label>
                                            <Input id="descr"
                                                name="description"
                                                className="form-control"
                                                placeholder="Enter Description"
                                                type="textarea"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <Label className="form-label">Purpose of Hearing<span className="text-danger">*</span></Label>
                                            <Input id="purpose-hearing"
                                                name="purposehearing"
                                                className="form-control"
                                                placeholder="Enter the purpose of Hearing"
                                                type="textarea"
                                            />
                                        </div>
                                        <div className="mt-4 text-center">
                                            <button type="button" className="btn btn-secondary me-2">Cancel</button>
                                            
                                            <button className="btn btn-primary btn-block " type="submit">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddSummary;