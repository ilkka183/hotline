import React from 'react';
import ProblemsTable from './ProblemsTable';
import auth, { User } from '../../services/authService';

const OpenProblems: React.FC<{}> = () => {
  const user: User | null = auth.getCurrentUser();

  const editable: boolean = true;
  const deletable: boolean = (user !== null) && user.isPowerOrAdmin;

  if (!user)
    return null;

  return (
    <ProblemsTable
      title="Avoimet vikatapaukset"
      status={0}
      newButtonAsLink={true}
      newButtonText="Lisää uusi vikatapaus"
      showSearchBox={true}
      paginate={false}
      creatable={true}
      editable={editable}
      deletable={deletable}
    />
  );
}

export default OpenProblems;
