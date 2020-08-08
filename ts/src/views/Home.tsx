import React from 'react';
import ProblemsTable from './Problems/ProblemsTable';
import auth, { User } from '../services/authService';

const Home: React.FC<{}> = () => {
  const user: User | null = auth.getCurrentUser();

  const editable: boolean = true;
  const deletable: boolean = (user !== null) && user.isPowerOrAdmin;

  if (!user)
    return null;

  return (
    <ProblemsTable
      newButtonAsLink={true}
      newButtonText="Lisää uusi vikatapaus"
      paginate={false}
      creatable={true}
      editable={editable}
      deletable={deletable}
    />
  );
}

export default Home;
