import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import auth from '../../services/authService';
import http from '../../services/httpService';

export default class Profile extends Component {
  user = auth.getCurrentUser();

  state = {
    user: null,
    showModal: false,
    showChangePasswordModal: false,
    passwordChanged: false
  }

  async componentDidMount() {
    const { data: user } = await http.get('/users/' + this.user.id);

    this.setState({ user });
  }

  showModal = () => {
    this.setState({ showModal: true });
  }

  hideModal = () => {
    this.setState({ showModal: false });
  }

  handleSubmit = async () => {
    const { data: user } = await http.get('/users/' + this.user.id);

    this.setState({ user, showModal: false });
  }

  showChangePasswordModal = () => {
    this.setState({ showChangePasswordModal: true, passwordChanged: false });
  }

  hideChangePasswordModal = () => {
    this.setState({ showChangePasswordModal: false, passwordChanged: false });
  }

  handleChangePasswordSubmit = async () => {
    this.setState({ showChangePasswordModal: false, passwordChanged: true });
  }

  render() {
    const { user, showModal, showChangePasswordModal, passwordChanged } = this.state;

    return (
      <Container>
        <h2>Omat tiedot</h2>
        <Button className="mb-3" onClick={this.showModal}>Muokkaa tietoja</Button>
        <ProfileForm
          variant="table"
          data={user}
          showTitle={false}
        />
        <Button className="mb-2" onClick={this.showChangePasswordModal}>Vaihda salasana</Button>
        {passwordChanged && <Alert variant="success">Salasana vaihdettu.</Alert>}
        {showModal && <ProfileForm
          variant="modal"
          action="edit"
          userId={this.user.id}
          showModal={true}
          onSubmitModal={this.handleSubmit}
          onHideModal={this.hideModal}
        />}
        {showChangePasswordModal && <ChangePasswordForm
          variant="modal"
          submitButtonText="Vaihda salasana"
          user={this.user}
          showModal={true}
          onSubmitModal={this.handleChangePasswordSubmit}
          onHideModal={this.hideChangePasswordModal}
        />}
      </Container>
    );
  }
}
