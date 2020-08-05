import React from 'react';
import ProblemsTable from './ProblemsTable';
import auth from '../../services/authService';

export default function SolvedProblems() {
  const user = auth.getCurrentUser();

  const editable = true;
  const deletable = user && user.role <= 1;

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
