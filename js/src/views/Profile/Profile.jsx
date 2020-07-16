import React, { Component } from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import ProfileForm from './ProfileForm';

export default class Profile extends Component {
  render() { 
    return (
      <>
        <ProfileForm dataId={user.id} autoBack={false} />
        <br />
        <ChangePasswordForm />
      </>
    );
  }
}
