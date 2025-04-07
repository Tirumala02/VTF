// // import React, { useContext, useEffect, useState } from 'react';
// // import { ShopContext } from '../context/ShopContext';
// // import Title from '../components/Title';
// // import axios from 'axios';
// // import { assets } from '../assets/assets'; // Import assets for empty state images

// // const Orders = () => {
// //   const { backendUrl, token, currency,navigate, tempUser } = useContext(ShopContext);
// //   const [orderData, setOrderData] = useState([]);

// //   const loadOrderData = async () => {
// //     try {
// //         if (!token && !tempUser) return; // ✅ Prevent empty requests

// //         const headers = token 
// //             ? { Authorization: `Bearer ${token}` } // 🔐 Authenticated User
// //             : { "temp-user": tempUser }; // 🛒 Guest User

// //         console.log("Fetching orders with headers:", headers);

// //         const response = await axios.post(
// //             backendUrl + "/api/order/userorders",
// //             { userId: token ? userId : tempUser },  // ✅ Send correct userId
// //             { headers }
// //         );

// //         if (response.data.success) {
// //             let allOrdersItem = [];
// //             response.data.orders.forEach((order) => {
// //                 order.items.forEach((item) => {
// //                     allOrdersItem.push({
// //                         ...item,
// //                         status: order.status,
// //                         payment: order.payment,
// //                         paymentMethod: order.paymentMethod,
// //                         date: order.date,
// //                     });
// //                 });
// //             });
// //             setOrderData(allOrdersItem.reverse());
// //         } else {
// //             console.warn("Order fetch failed:", response.data.message);
// //         }
// //     } catch (error) {
// //         console.error("Error loading orders", error);
// //     }
// // };


// //   useEffect(() => {
// //     loadOrderData();
// //   }, [token || tempUser]);

// //   return (
// //     <div className='border-t pt-16'>
// //       <div className='text-2xl'>
// //         <Title text1={'MY'} text2={'ORDERS'} />
// //       </div>

// //       {orderData.length > 0 ? (
// //         <div>
// //           {orderData.map((item, index) => (
// //             <div
// //               key={index}
// //               className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
// //             >
// //               <div className='flex items-start gap-6 text-sm'>
// //                 <img className='w-16 sm:w-20' src={item.image[0]} alt={item.name} />
// //                 <div>
// //                   <p className='sm:text-base font-medium'>{item.name}</p>
// //                   <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
// //                     <p>{currency}{item.price}</p>
// //                     <p>Quantity: {item.quantity}</p>
// //                     <p>Size: {item.size}</p>
// //                   </div>
// //                   <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
// //                   <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
// //                 </div>
// //               </div>
// //               <div className='md:w-1/2 flex justify-between'>
// //                 <div className='flex items-center gap-2'>
// //                   <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
// //                   <p className='text-sm md:text-base'>{item.status}</p>
// //                 </div>
// //                 <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         <div className='text-center py-20'>
// //           <p className='text-xl text-gray-700 mb-4'>You have no orders yet</p>
// //           <img src={assets.no_orders} alt='Empty Orders' className='w-32 mx-auto mb-6' />
// //           <button
// //             onClick={() => navigate('/collection')}
// //             className='bg-black text-white text-sm px-6 py-3'
// //           >
// //             CONTINUE SHOPPING
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Orders;
// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import axios from 'axios';
// import { assets } from '../assets/assets'; // Import assets for empty state images

// const Orders = () => {
//   const { backendUrl, token, currency, navigate, tempUser } = useContext(ShopContext);
//   const [orderData, setOrderData] = useState([]);

//   const loadOrderData = async () => {
//     try {
//       if (!token && !tempUser) return; // Prevent empty requests

//       // Prepare headers based on authentication type
//       const headers = token
//         ? { Authorization: `Bearer ${token}` } // Authenticated user
//         : { 'temp-user': tempUser }; // Guest user

//       console.log('Fetching orders with headers:', headers);

//       // Send request without userId in body; backend will extract it from headers
//       const response = await axios.post(`${backendUrl}/api/order/userorders`, { headers });

//       if (response.data.success) {
//         let allOrdersItem = [];
//         response.data.orders.forEach((order) => {
//           order.items.forEach((item) => {
//             allOrdersItem.push({
//               ...item,
//               status: order.status,
//               payment: order.payment,
//               paymentMethod: order.paymentMethod,
//               date: order.date,
//             });
//           });
//         });
//         setOrderData(allOrdersItem.reverse()); // Latest orders first
//       } else {
//         console.warn('Order fetch failed:', response.data.message);
//       }
//     } catch (error) {
//       console.error('Error loading orders:', error);
//     }
//   };

//   useEffect(() => {
//     loadOrderData();
//   }, [token, tempUser]); // Re-fetch if token or tempUser changes

//   return (
//     <div className="border-t pt-16">
//       <div className="text-2xl">
//         <Title text1={'MY'} text2={'ORDERS'} />
//       </div>

//       {orderData.length > 0 ? (
//         <div>
//           {orderData.map((item, index) => (
//             <div
//               key={index}
//               className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//             >
//               <div className="flex items-start gap-6 text-sm">
//                 <img className="w-16 sm:w-20" src={item.image[0]} alt={item.name} />
//                 <div>
//                   <p className="sm:text-base font-medium">{item.name}</p>
//                   <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
//                     <p>
//                       {currency}
//                       {item.price}
//                     </p>
//                     <p>Quantity: {item.quantity}</p>
//                     <p>Size: {item.size}</p>
//                   </div>
//                   <p className="mt-1">
//                     Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
//                   </p>
//                   <p className="mt-1">
//                     Payment: <span className="text-gray-400">{item.paymentMethod}</span>
//                   </p>
//                 </div>
//               </div>
//               <div className="md:w-1/2 flex justify-between">
//                 <div className="flex items-center gap-2">
//                   <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
//                   <p className="text-sm md:text-base">{item.status}</p>
//                 </div>
//                 <button
//                   onClick={loadOrderData}
//                   className="border px-4 py-2 text-sm font-medium rounded-sm"
//                 >
//                   Track Order
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-20">
//           <p className="text-xl text-gray-700 mb-4">You have no orders yet</p>
//           <img src={assets.no_orders} alt="Empty Orders" className="w-32 mx-auto mb-6" />
//           <button
//             onClick={() => navigate('/collection')}
//             className="bg-black text-white text-sm px-6 py-3"
//           >
//             CONTINUE SHOPPING
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const Orders = () => {
  const { backendUrl, token, currency, navigate, tempUser } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token && !tempUser) {
        toast.error('Please log in or continue as a guest');
        navigate('/login');
        return;
      }

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { 'temp-user': tempUser };

      console.log('Fetching orders with headers:', headers);

      // Use POST and send userId in the body
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: token ? undefined : tempUser }, // For authenticated users, userId comes from token; for guests, use tempUser
        { headers }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      } else {
        console.warn('Order fetch failed:', response.data.message);
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('An error occurred while fetching orders');
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, tempUser]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {orderData.length > 0 ? (
        <div>
          {orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={item.image[0]} alt={item.name} />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                  </p>
                  <p className="mt-1">
                    Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-700 mb- sava4">You have no orders yet</p>
          <img src={assets.no_orders} alt="Empty Orders" className="w-32 mx-auto mb-6" />
          <button
            onClick={() => navigate('/collection')}
            className="bg-black text-white text-sm px-6 py-3"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;