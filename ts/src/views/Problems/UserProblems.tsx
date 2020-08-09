import React from 'react';
import ProblemsTable from './ProblemsTable';
import auth, { User } from '../../services/authService';

const UserProblems: React.FC<{}> = () => {
  const user: User | null = auth.getCurrentUser();

  const editable: boolean = true;
  const deletable: boolean = (user !== null) && user.isPowerOrAdmin;

  if (!user)
    return null;

  return (
    <ProblemsTable
      title="Omat vikatapaukset"
      userId={user!.id}
      showSearchBox={true}
      paginate={true}
      creatable={false}
      editable={editable}
      deletable={deletable}
    />
  );
}

export default UserProblems;
