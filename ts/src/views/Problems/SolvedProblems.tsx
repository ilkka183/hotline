import React from 'react';
import ProblemsTable from './ProblemsTable';
import auth, { User } from '../../services/authService';

const SolvedProblems: React.FC<{}> = () => {
  const user: User | null = auth.getCurrentUser();

  const editable: boolean = true;
  const deletable: boolean = (user !== null) && user.isPowerOrAdmin;

  if (!user)
    return null;

  return (
    <ProblemsTable
      title="Uusimmat ratkaisut"
      status={1}
      showSearchBox={true}
      paginate={false}
      creatable={false}
      editable={editable}
      deletable={deletable}
    />
  );
}

export default SolvedProblems;
