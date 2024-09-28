import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from './hooks/useStores.ts';
import Table from './components/Table';
import styled from 'styled-components';

const App: React.FC = observer(() => {
  const { metersStore } = useStores();

  useEffect(() => {
    metersStore.fetchMeters();
  }, [metersStore]);

  return (
    <Container>
      <Header>Список счётчиков</Header>

      <Table />
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: rgba(248, 249, 250, 1);
`;

const Header = styled.h1`
  text-align: start;
  font-size: 24px;
  font-weight: 500px;
  line-height: 32px;
`;

export default App;
