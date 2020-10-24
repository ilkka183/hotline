import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import UserComponent from '../UserComponent';
import http from '../../services/httpService';
import { EditMode } from '../../components/common/FieldsForm';

interface State {
  user: any,
  showModal: boolean,
  showChangePasswordModal: boolean,
  passwordChanged: boolean
}

export default class Profile extends UserComponent<{}, State> {
  public state: State = {
    user: null,
    showModal: false,
    showChangePasswordModal: false,
    passwordChanged: false
  }

  async componentDidMount() {
    const { data: user } = await http.get('/users/' + this.userId);

    this.setState({ user });
  }

  private readonly showModal = () => {
    this.setState({ showModal: true });
  }

  private readonly hideModal = () => {
    this.setState({ showModal: false });
  }

  private readonly handleSubmit = async () => {
    const { data: user } = await http.get('/users/' + this.userId);

    this.setState({ user, showModal: false });
  }

  private readonly showChangePasswordModal = () => {
    this.setState({ showChangePasswordModal: true, passwordChanged: false });
  }

  private readonly hideChangePasswordModal = () => {
    this.setState({ showChangePasswordModal: false, passwordChanged: false });
  }

  private readonly handleChangePasswordSubmit = async () => {
    this.setState({ showChangePasswordModal: false, passwordChanged: true });
  }

  public render(): JSX.Element {
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
          editMode={EditMode.Update}
          userId={this.userId}
          showModal={true}
          onModalSubmitted={this.handleSubmit}
          onHideModal={this.hideModal}
        />}
        {showChangePasswordModal && <ChangePasswordForm
          variant="modal"
          submitButtonText="Vaihda salasana"
          user={this.user}
          showModal={true}
          onModalSubmitted={this.handleChangePasswordSubmit}
          onHideModal={this.hideChangePasswordModal}
        />}
      </Container>
    );
  }
}
