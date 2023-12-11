import React, { useEffect } from 'react';

// import { ErrorScreen, ErrorScreenType } from 'k6-ui/v2';
import { observer } from 'mobx-react-lite';
import { rootStore } from 'store';

import { AddEvent } from './add-event/AddEvent';
import { ErrorScreen } from './error';
import { Header } from './header';
import { Pagination } from './pagination/Paginatioin';
import { Table } from './Table';

export const RenderTable = observer(() => {
  const { tableStore, userStore, errorStore } = rootStore;

  useEffect(() => {
    tableStore.generateSmartColumns();
    userStore.getUserInfo();
  }, [userStore, tableStore]);

  return (
    <>
      <Header />
      <AddEvent />
      <Table />
      {errorStore.errorStatus && <ErrorScreen />}
      {/* {errorStore.userErrors.status && (
        <ErrorScreen
          Icon={ErrorScreenType.standard}
          errorCode={errorStore.userErrors.body.statusCode}
          errorID={0}
          errorHeader={errorStore.userErrors.body.title}
          errorDescription={errorStore.userErrors.body.message}
          errorTitle=""
          errorInnerURL=""
          errorVersion=""
          errorFullDate={new Date()}
          // Icon={Icon}
          // errorCode={errorCode}
          // errorID={errorCode}
          // errorHeader={errorHeader}
          // errorDescription={errorDescription}
          // errorTitle={errorTitle}
          // errorInnerURL={errorInnerURL}
          // errorVersion={errorVersion}
          // errorFullDate={errorFullDate}
          // errorRegNum: number;
          // errorUser: string;
          // contactEmail: string;
          // contactPhone={serviceData.TELEPHON}
          // hasXML
          // hasSPP
          // hasSPP: boolean;
        />
      )} */}
      <Pagination pageNumberLimit={10} />
    </>
  );
});
