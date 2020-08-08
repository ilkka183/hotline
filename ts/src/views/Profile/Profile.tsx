import React from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import UserComponent from '../UserComponent';
import http from '../../services/httpService';

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

  private get userId(): number | undefined {
    return this.user !== null ? this.user.id : undefined;
  }

  async componentDidMount() {
    const { data: user } = await http.get('/users/' + this.userId);

    this.setState({ user });
  }

  private showModal = () => {
    this.setState({ showModal: true });
  }

  private hideModal = () => {
    this.setState({ showModal: false });
  }

  private handleSubmit = async () => {
    const { data: user } = await http.get('/users/' + this.userId);

    this.setState({ user, showModal: false });
  }

  private showChangePasswordModal = () => {
    this.setState({ showChangePasswordModal: true, passwordChanged: false });
  }

  private hideChangePasswordModal = () => {
    this.setState({ showChangePasswordModal: false, passwordChanged: false });
  }

  private handleChangePasswordSubmit = async () => {
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
          action="edit"
          userId={this.userId}
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
