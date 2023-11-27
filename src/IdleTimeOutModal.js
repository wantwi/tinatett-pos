import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

export const IdleTimeOutModal = ({
  showModal,
  handleContinue,
  handleLogout,
  timer
}) => {


  return (
    <Modal isOpen={showModal} onHide={stay}>
      <ModalHeader>You Have Been Idle!</ModalHeader>
      <ModalBody>
        Your session has been timed Out. Do you want to stay? You have <span style={{fontSize:30, fontWeight:600}}>{timer}</span> seconds left...
      </ModalBody>
      <ModalFooter>
        <Button variant='danger' onClick={handleLogout}>
          {' '}
          Logout
        </Button>{' '}
        <Button variant='primary' onClick={handleContinue}>
          Continue Session
        </Button>
      </ModalFooter>
    </Modal>
  )
}
