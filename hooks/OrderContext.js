// // contexts/OrderContext.js
// "use client";
// import { createContext, useContext, useState } from 'react';

// const OrderContext = createContext();

// export const OrderProvider = ({ children }) => {
//     const [selectedStatus, setSelectedStatus] = useState("Total");

//     return (
//         <OrderContext.Provider value={{ selectedStatus, setSelectedStatus }}>
//             {children}
//         </OrderContext.Provider>
//     );
// };

// export const useOrder = () => useContext(OrderContext);
// contexts/OrderContext.js
"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [selectedStatus, setSelectedStatus] = useState("Total");

  // نحفظ الـ selectedStatus في localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem('selectedOrderStatus');
    if (savedStatus) {
      setSelectedStatus(savedStatus);
    }
  }, []);

  const setAndSaveStatus = (status) => {
    setSelectedStatus(status);
    localStorage.setItem('selectedOrderStatus', status);
  };

  return (
    <OrderContext.Provider value={{ selectedStatus, setSelectedStatus: setAndSaveStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);