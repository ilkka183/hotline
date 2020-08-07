import React from 'react';
import ProblemsTable from './ProblemsTable';
import auth from '../../services/authService';

const SolvedProblems: React.FC<{}> = () => {
  const user: any = auth.getCurrentUser();

  const editable: boolean = true;
  const deletable: boolean = user && user.role <= 1;

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
