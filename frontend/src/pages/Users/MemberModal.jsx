import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
function MemberModal() {
  const [modal, setModal] = useState(false);
  const [cardvalue, setCardvalue] = useState('');
  const toggle = () => setModal(!modal);
  
  const handleChange = (event) => {
    setCardvalue(event.target.value);
    console.log(cardvalue);
  }
  return (
    <div>

      <Link onClick={toggle}><i className="mdi mdi-plus-circle fs-1 text-primary" />
      </Link>

      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Card Mapping</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <Label>Member ID  </Label>
            <Input
              id="name"
              name="name"
              className="form-control"
              placeholder="குடும்பத் தலைவரின் பெயரை உள்ளிடவும்                                                                        "
              type="text"
              onChange={handleChange}

            />

          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type='submit'>
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