import React, { Component } from 'react';
import ChangePasswordForm from '../forms/ChangePasswordForm';
import ProfileForm from '../forms/ProfileForm';

export default class Profile extends Component {
  render() { 
    return (
      <>
        <ProfileForm />
        <br />
        <ChangePasswordForm />
      </>
    );
  }
}
