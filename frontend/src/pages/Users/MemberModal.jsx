import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { POST } from 'helpers/api_helper';
import { CARD_MAP } from 'helpers/url_helper';
import CustomToast from "components/Common/Toast";

function MemberModal(props) {
  const {trustid}=props;
  const {data}=props;
  console.log("ener",trustid); 
  const [modal, setModal] = useState(false);
  const [cardvalue, setCardvalue] = useState('');
  const toggle = () => setModal(!modal);
  
  const handleChange = (event) => {
    setCardvalue(event.target.value);
  }

  const handleSubmit = async () => {
    let url = CARD_MAP.replace(":slug", data.props)
    var res = await POST(url, {"card_no": cardvalue});
    if (res.status === 200) {
        CustomToast(res.data.message, "success");
        toggle();
        window.location.reload();
    }
    else {
        CustomToast(res.data.message, "error");
    }
  }

  return (
    <div>

      <Link onClick={toggle}><i className="mdi mdi-plus-circle fs-1 text-primary" />
      </Link>

      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Card Mapping</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <Label>ID Card No  </Label>
            <Input
              id="name"
              name="name"
              className="form-control"
              placeholder="Enter Id Card Number"
              type="password"
              onChange={handleChange}
              value={cardvalue}

            />

          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type='button' onClick={handleSubmit}>
            Add
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default MemberModal;