import React from 'react';

import { RenderTable } from 'components/table/RenderTable';

// const Button = () => {
//   const [disable, setDisable] = useState(false);
//   const [count, setCount] = useState(5);

//   useEffect(() => {
//     if (disable && count > 0) {
//       setTimeout(() => {
//         setCount(count => (count -= 1));
//       }, 1000);
//     }
//     if (count === 0) {
//       setDisable(false);
//       setCount(5);
//     }
//   }, [disable, count]);
//   console.log(count);

//   return (
//     <div>
//       {count}
//       <button disabled={disable} onClick={() => setDisable(true)}>
//         click me
//       </button>
//     </div>
//   );
// };

export const App = () => {
  return (
    <>
      {/* <CompoundTableRender />; */}
      {/* <Button /> */}
      <RenderTable />
    </>
  );
};
