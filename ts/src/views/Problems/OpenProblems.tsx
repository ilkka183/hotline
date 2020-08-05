import React from 'react';
import ProblemsTable from './ProblemsTable';
import auth from '../../services/authService';

export default function OpenProblems() {
  const user = auth.getCurrentUser();

  const editable = true;
  const deletable = user && user.role <= 1;

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
