import React, { useEffect, useState } from 'react';

import './pagination.css';
import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';

import { PageSize } from './PageSize';

type UsePaginationPropsT = {
  pageNumberLimit: number;
};

export const Pagination = observer(({ pageNumberLimit }: UsePaginationPropsT) => {
  const { tableStore } = rootStore;

  // const pageCount = Math.ceil(tableStore.data.length / tableStore.contentPerPage);

  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState<number>(pageNumberLimit);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState<number>(1);

  useEffect(() => {
    if (tableStore.currentPage > tableStore.pageCount) {
      tableStore.currentPage = tableStore.pageCount;
    }
  }, [tableStore.pageCount, tableStore.currentPage]);

  const nextPage = () => {
    tableStore.currentPage += 1;
    if (tableStore.currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const prevPage = () => {
    tableStore.currentPage -= 1;
    if ((tableStore.currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  const onSetPageHandler = (pageNumber: number) => {
    tableStore.currentPage = pageNumber;
  };

  const arrayFromPage: Array<number> = [];

  for (let index = 1; index <= tableStore.pageCount; index += 1) {
    arrayFromPage.push(index);
  }

  const renderPageNumbers = arrayFromPage.map(page => {
    if (page < maxPageNumberLimit + 1 && page >= minPageNumberLimit) {
      return (
        <button
          className={tableStore.currentPage === page ? 'btn-active' : 'btn'}
          type="button"
          onClick={() => onSetPageHandler(page)}
          key={page}
        >
          {page}
        </button>
      );
    }
    return null;
  });

  const leftIArrow = (
    <button
      disabled={tableStore.currentPage === arrayFromPage[0]}
      onClick={prevPage}
      type="button"
      className={tableStore.currentPage === arrayFromPage[0] ? 'btn-disabled' : 'btn'}
    >
      {/* <Left className="btnIcon" /> */}
      &#9001;
    </button>
  );

  const rightArrow = (
    <button
      disabled={tableStore.currentPage === arrayFromPage[arrayFromPage.length - 1]}
      onClick={nextPage}
      type="button"
      className={
        tableStore.currentPage === arrayFromPage[arrayFromPage.length - 1] ? 'btn-disabled' : 'btn'
      }
    >
      {/* <Right className="btnIcon" /> */}
      &#9002;
    </button>
  );

  let pageIncrementBtn: null | JSX.Element = null;
  if (arrayFromPage.length > maxPageNumberLimit) {
    pageIncrementBtn = (
      <button
        className="btn"
        type="button"
        onClick={() => {
          setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
          setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }}
      >
        &hellip;
      </button>
    );
  }

  let pageDecrementBtn: null | JSX.Element = null;
  if (minPageNumberLimit > 1) {
    pageDecrementBtn = (
      <button
        className="btn"
        type="button"
        onClick={() => {
          setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
          setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }}
      >
        &hellip;
      </button>
    );
  }

  return (
    <div className="pagination">
      <p>
        {tableStore.currentPage}/{tableStore.pageCount}
      </p>
      {leftIArrow}
      {pageDecrementBtn}
      {renderPageNumbers}
      {pageIncrementBtn}
      {rightArrow}
      <PageSize />
    </div>
  );
});
