import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import hotWaterImg from '../images/hot-water-img.png';
import coldWaterImg from '../images/cold-water-img.png';
import deleteBtnImg from '../images/delete-btn.png';

interface TableRowProps {
  meter: any;
  index: number;
}

const TableRow: React.FC<TableRowProps> = observer(({ meter, index }) => {
  const { addressStore, metersStore } = useStores();
  const [address, setAddress] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meter.area?.id) {
      const fetchedAddress = addressStore.getAddressById(meter.area.id);
      if (fetchedAddress) {
        setAddress(fetchedAddress.address);
      } else {
        addressStore.fetchAddressById(meter.area.id).then((newAddress) => {
          if (newAddress) {
            setAddress(newAddress.address);
          }
        });
      }
    }
  }, [meter.area?.id, addressStore]);

  const handleDelete = async () => {
    await metersStore.deleteMeter(meter.id);
    const remainingItems = metersStore.meters.length;
    if (remainingItems < 20 && metersStore.next) {
      await metersStore.fetchMeters(metersStore.limit, metersStore.offset);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  return (
    <StyledRow
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StyledTd>{index}</StyledTd>
      <StyledTd>
        {meter._type.includes('ColdWaterAreaMeter') ? (
          <>
            <StyledImage src={coldWaterImg} alt="ХВС" />
            ХВС
          </>
        ) : (
          <>
            <StyledImage src={hotWaterImg} alt="ГВС" />
            ГВС
          </>
        )}
      </StyledTd>
      <StyledTd>{formatDate(meter.installation_date)}</StyledTd>
      <StyledTd>{meter.is_automatic ? 'Да' : 'Нет'}</StyledTd>
      <StyledTd>{meter.initial_values}</StyledTd>
      <StyledTd>{address || 'Загрузка...'}</StyledTd>
      <StyledTd>{meter.description}</StyledTd>
      <StyledTdEnd>
        {hovered && (
          <DeleteButton onClick={handleDelete}>
            <StyledButtonImage src={deleteBtnImg} alt="Удалить" />
          </DeleteButton>
        )}
      </StyledTdEnd>
    </StyledRow>
  );
});

const StyledRow = styled.tr`
  &:hover {
    background-color: rgba(224, 229, 235, 1);
  }
`;

const StyledTd = styled.td`
  padding: 16px 10px;
  white-space: nowrap;
  border-bottom: 1px solid rgba(224, 229, 235, 1);

  color: rgba(31, 41, 57, 1);
  font-size: 14px;
`;

const StyledTdEnd = styled.td`
  border-bottom: 1px solid rgba(224, 229, 235, 1);
  text-align: end;
  padding-right: 20px;
`;

const StyledImage = styled.img`
  margin-right: 5px;
  width: 9.33px;
  object-fit: contain;
`;

const StyledButtonImage = styled.img`
  background-color: rgba(254, 227, 227, 1);
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const DeleteButton = styled.button`
  background-color: rgba(254, 227, 227, 1);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 50%;
  }
`;

export default TableRow;
