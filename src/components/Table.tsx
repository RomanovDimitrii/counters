import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import TableRow from './TableRow';
import styled from 'styled-components';

const Table: React.FC = observer(() => {
  const { metersStore, addressStore } = useStores();
  const [currentPage, setCurrentPage] = useState(1);
  const metersPerPage = 20;
  const totalPages = Math.ceil(metersStore.count / metersPerPage);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const [theadHeight, setTheadHeight] = useState(60);

  useLayoutEffect(() => {
    if (theadRef.current) {
      const calculatedHeight = theadRef.current.offsetHeight;
      if (calculatedHeight) {
        setTheadHeight(calculatedHeight);
      }
    }
  }, [metersStore.meters, metersStore.loading]);

  const updateThumbPosition = () => {
    if (scrollContainerRef.current && thumbRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;

      if (scrollHeight > clientHeight) {
        const maxScrollTop = scrollHeight - clientHeight;
        const maxThumbTop = clientHeight - 200;
        const thumbTop = (scrollTop / maxScrollTop) * maxThumbTop;

        thumbRef.current.style.transform = `translateY(${thumbTop}px)`;
      }
    } else {
      console.log('scrollContainerRef or thumbRef is null');
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateThumbPosition);
      updateThumbPosition();
    } else {
      console.log('scrollContainerRef is not set');
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateThumbPosition);
      }
    };
  }, [theadHeight, metersStore.meters, metersStore.loading]);

  useEffect(() => {
    const handleResize = () => {
      updateThumbPosition();
    };

    window.addEventListener('resize', handleResize);

    // Удаляем обработчик при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (currentPage >= 4) {
      pages.push(-1);
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(currentPage + 1, totalPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage <= totalPages - 4) {
      pages.push(-2);
    }

    pages.push(totalPages);

    return pages;
  };

  if (metersStore.loading) {
    return <div>Загрузка...</div>;
  }

  if (!metersStore.meters || metersStore.meters.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <StyledWrapper ref={scrollContainerRef}>
      <StyledTable>
        <StyledThead ref={theadRef}>
          <tr>
            <StyledTh>№</StyledTh>
            <StyledTh>Тип</StyledTh>
            <StyledTh>Дата установки</StyledTh>
            <StyledTh>Автоматический</StyledTh>
            <StyledTh>Текущие показания</StyledTh>
            <StyledTh>Адрес</StyledTh>
            <StyledTh>Примечание</StyledTh>
            <StyledTh></StyledTh>
          </tr>
        </StyledThead>

        <StyledTbody>
          {metersStore.meters.map((meter, index) => (
            <TableRow key={meter.id} meter={meter} index={index + 1} />
          ))}
        </StyledTbody>
      </StyledTable>
      <CustomScrollbar top={theadHeight}>
        <Thumb ref={thumbRef} />
      </CustomScrollbar>

      <Pagination>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          &lt;
        </button>
        {getPageNumbers().map((page, index) => {
          if (page === -1 || page === -2) {
            return <span key={`ellipsis-${index}`}>...</span>;
          }
          return (
            <button
              key={`page-${page}-${index}`}
              onClick={() => handlePageChange(page)}
              disabled={currentPage === page}
              style={currentPage === page ? { backgroundColor: '#ccc' } : {}}
            >
              {page}
            </button>
          );
        })}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </Pagination>
    </StyledWrapper>
  );
});

const StyledWrapper = styled.div`
  position: relative;
  max-height: 944px;
  overflow-y: scroll;
  border-radius: 10px;
  border: 1px solid rgba(224, 229, 235, 1);

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CustomScrollbar = styled.div<{ top: number }>`
  position: absolute;
  top: ${(props) => `${props.top}px`};
  right: 2px;
  width: 6px;
  height: calc(
    100% - ${(props) => props.top}px
  ); /* Скроллбар на высоту всего контейнера, кроме высоты thead */
  background-color: rgba(0, 0, 0, 0);
  border-radius: 3px;

  opacity: 1;
`;

const Thumb = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 300px; /* Высота ползунка */
  background-color: rgba(94, 102, 116, 0.5);
  border-radius: 4px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledThead = styled.thead`
  background-color: rgba(240, 243, 247, 1);
  position: sticky;
  top: 0;
`;

const StyledTh = styled.th`
  padding: 8.5px 15px;
  margin: 0;
  color: rgba(105, 113, 128, 1);
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;

  &:nth-child(1) {
    padding: 5px 50px 5px 15px;
  }

  &:nth-child(6) {
    min-width: 400px;
  }

  &:nth-child(8) {
    min-width: 70px;
  }
`;

const StyledTbody = styled.tbody`
  display: table-row-group;
  background-color: rgba(255, 255, 255, 1);
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: #fff;

  button {
    margin: 8px 8px;
    padding: 8px 12px;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(206, 213, 222, 1);
    color: rgba(31, 41, 57, 1);
    border-radius: 6px;

    &:hover {
      cursor: pointer;
      opacity: 0.5;
    }

    &:disabled {
      background-color: rgba(242, 245, 248, 1);
      cursor: not-allowed;
    }
  }

  span {
    margin: 0 5px;
    padding: 8px 12px;
  }
`;
export default Table;
