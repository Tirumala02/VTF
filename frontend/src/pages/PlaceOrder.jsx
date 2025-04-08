// // import React, { useContext, useState } from 'react';
// // import Title from '../components/Title';
// // import CartTotal from '../components/CartTotal';
// // import { assets } from '../assets/assets';
// // import { ShopContext } from '../context/ShopContext';
// // import axios from 'axios';
// // import { toast } from 'react-toastify';

// // const PlaceOrder = () => {
// //     const [method, setMethod] = useState('cod');
// //     const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

// //     const [formData, setFormData] = useState({
// //         firstName: '',
// //         lastName: '',
// //         email: '',
// //         street: '',
// //         city: '',
// //         state: '',
// //         zipcode: '',
// //         country: '',
// //         phone: ''
// //     });

// //     const onChangeHandler = (event) => {
// //         const { name, value } = event.target;
// //         setFormData((data) => ({ ...data, [name]: value }));
// //     };

// //     const initPay = (order) => {
// //         const options = {
// //             key: import.meta.env.VITE_RAZORPAY_KEY_ID,
// //             amount: order.amount,
// //             currency: order.currency,
// //             name: 'Order Payment',
// //             description: 'Order Payment',
// //             order_id: order.id,
// //             receipt: order.receipt,
// //             handler: async (response) => {
// //                 try {
// //                     const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } });
// //                     if (data.success) {
// //                         navigate('/orders');
// //                         setCartItems({});
// //                         sendOrderConfirmationEmail();
// //                     }
// //                 } catch (error) {
// //                     console.log(error);
// //                     toast.error(error.message);
// //                 }
// //             }
// //         };
// //         const rzp = new window.Razorpay(options);
// //         rzp.open();
// //     };

// //     const sendOrderConfirmationEmail = async (orderData) => {
// //         try {
// //             await axios.post(backendUrl + '/api/order/send-email', { orderData }, { headers: { token } });
// //             toast.success("Order confirmation email sent!");
// //         } catch (error) {
// //             console.log(error);
// //             toast.error("Failed to send confirmation email.");
// //         }
// //     };

// //     const onSubmitHandler = async (event) => {
// //         event.preventDefault();
// //         try {
// //             let orderItems = [];

// //             for (const items in cartItems) {
// //                 for (const item in cartItems[items]) {
// //                     if (cartItems[items][item] > 0) {
// //                         const itemInfo = structuredClone(products.find(product => product._id === items));
// //                         if (itemInfo) {
// //                             itemInfo.size = item;
// //                             itemInfo.quantity = cartItems[items][item];
// //                             orderItems.push(itemInfo);
// //                         }
// //                     }
// //                 }
// //             }

// //             let orderData = {
// //                 address: formData,
// //                 items: orderItems,
// //                 amount: getCartAmount() + delivery_fee,
// //                 email: formData.email
// //             };

// //             switch (method) {
// //                 case 'cod':
// //                     const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
// //                     if (response.data.success) {
// //                         setCartItems({});
// //                         navigate('/orders');
// //                         sendOrderConfirmationEmail(orderData);
// //                     } else {
// //                         toast.error(response.data.message);
// //                     }
// //                     break;

// //                 case 'stripe':
// //                     const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
// //                     if (responseStripe.data.success) {
// //                         window.location.replace(responseStripe.data.session_url);
// //                     } else {
// //                         toast.error(responseStripe.data.message);
// //                     }
// //                     break;

// //                 case 'razorpay':
// //                     const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } });
// //                     if (responseRazorpay.data.success) {
// //                         initPay(responseRazorpay.data.order);
// //                     }
// //                     break;

// //                 default:
// //                     break;
// //             }

// //         } catch (error) {
// //             console.log(error);
// //             toast.error(error.message);
// //         }
// //     };

// //     return (
// //         <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
// //             <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

// //                 <div className='text-xl sm:text-2xl my-3'>
// //                     <Title text1={'DELIVERY'} text2={'INFORMATION'} />
// //                 </div>
// //                 <div className='flex gap-3'>
// //                     <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
// //                     <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
// //                 </div>
// //                 <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
// //                 <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
// //                 <div className='flex gap-3'>
// //                     <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
// //                     <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
// //                 </div>
// //                 <div className='flex gap-3'>
// //                     <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
// //                     <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
// //                 </div>
// //                 <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
// //             </div>

// //             <div className='mt-8'>
// //                 <CartTotal />
// //                 <div className='mt-12'>
// //                     <Title text1={'PAYMENT'} text2={'METHOD'} />
// //                     <div className='flex gap-3 flex-col lg:flex-row'>
// //                         <label className='flex items-center gap-2 cursor-pointer'>
// //                             <input type="radio" name="payment" value="stripe" checked={method === 'stripe'} onChange={() => setMethod('stripe')} />
// //                             <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
// //                         </label>
// //                         <label className='flex items-center gap-2 cursor-pointer'>
// //                             <input type="radio" name="payment" value="razorpay" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} />
// //                             <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
// //                         </label>
// //                         <label className='flex items-center gap-2 cursor-pointer'>
// //                             <input type="radio" name="payment" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} />
// //                             <span>Cash on Delivery</span>
// //                         </label>
// //                     </div>
// //                     <button type='submit' className='bg-black text-white px-16 py-3 text-sm mt-8'>PLACE ORDER</button>
// //                 </div>
// //             </div>
// //         </form>
// //     );
// // };

// // export default PlaceOrder;
// import React, { useContext, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import Title from '../components/Title';
// import { assets } from '../assets/assets';
// import { ShopContext } from '../context/ShopContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Loading from '../components/Loading';
// import CartTotal from '../components/CartTotal';

// const PlaceOrder = () => {
//     const [method, setMethod] = useState('cod');
//     const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, tempUser  } = useContext(ShopContext);
//     const location = useLocation();
//     const [isLoading, setIsLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         street: '',
//         city: '',
//         state: '',
//         zipcode: '',
//         country: '',
//         phone: ''
//     });

//     const headers = token ? {headers:{ token }} : {headers:{ "temp-user": tempUser }};
// // const headers = token ? { headers: { token } } : {};

//     // Buy Now item from navigation state
//     const buyNowItem = location.state?.buyNowItem;
//     const isBuyNow = !!buyNowItem;
//     const buyNowProduct = buyNowItem ? products.find(p => p._id === buyNowItem._id) : null;
//     const [buyNowQuantity, setBuyNowQuantity] = useState(buyNowItem?.quantity || 1); // Track Buy Now quantity

//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setFormData((data) => ({ ...data, [name]: value }));
//     };

//     // Quantity update functions
//     const increaseQuantity = () => {
//         setBuyNowQuantity(prev => prev + 1);
//     };

//     const decreaseQuantity = () => {
//         if (buyNowQuantity > 1) {
//             setBuyNowQuantity(prev => prev - 1);
//         }
//     };

    
//     const initPay = (order) => {
//         const options = {
//             key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//             amount: order.amount,
//             currency: 'INR',
//             name: 'VT Fashions',
//             description: 'Order Payment',
//             order_id: order.id,
//             receipt: order.receipt,
//             handler: async (response) => {
//                 try {
//                     const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, headers);
//                     if (data.success) {
//                         navigate('/orders');
//                         setCartItems({});
//                         sendOrderConfirmationEmail();
//                     }
//                 } catch (error) {
//                     console.log(error);
//                     toast.error(error.message);
//                 }
//             }
//         };
//         const rzp = new window.Razorpay(options);
//         rzp.open();
//     };

//     const sendOrderConfirmationEmail = async (orderData) => {
//         try {
//             await axios.post(backendUrl + '/api/order/send-email', { orderData }, headers);
//             toast.success("Order confirmation email sent!");
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to send confirmation email.");
//         } finally {
//             setIsLoading(false); // Stop loading only after email is sent (success or fail)
//         }
//     };

//     const onSubmitHandler = async (event) => {
//         event.preventDefault();
//         setIsLoading(true);
//         try {
//             let orderItems = [];

//             if (isBuyNow) {
//                 const itemInfo = structuredClone(products.find(product => product._id === buyNowItem._id));
//                 if (itemInfo) {
//                     itemInfo.size = buyNowItem.size;
//                     itemInfo.quantity = buyNowQuantity; // Use updated quantity
//                     orderItems.push(itemInfo);
//                 }
//             } else {
//                 for (const items in cartItems) {
//                     for (const item in cartItems[items]) {
//                         if (cartItems[items][item] > 0) {
//                             const itemInfo = structuredClone(products.find(product => product._id === items));
//                             if (itemInfo) {
//                                 itemInfo.size = item;
//                                 itemInfo.quantity = cartItems[items][item];
//                                 orderItems.push(itemInfo);
//                             }
//                         }
//                     }
//                 }
//             }

//             const orderAmount = isBuyNow
//                 ? (buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity + delivery_fee
//                 : getCartAmount() + delivery_fee;

//             let orderData = {
//                 address: formData,
//                 items: orderItems,
//                 amount: orderAmount,
//                 email: formData.email
//             };

//             switch (method) {
//                 case 'cod':
//                     // const headers = token ? { headers: { token } } : {};
//                     const response = await axios.post(backendUrl + '/api/order/place', orderData, headers);
//                     if (response.data.success) {
//                         setCartItems({});
//                         navigate('/orders');
//                         sendOrderConfirmationEmail(orderData);
//                     } else {
//                         toast.error(response.data.message);
//                     }
//                     break;

//                 case 'stripe':
//                     const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData,headers);
//                     if (responseStripe.data.success) {
//                         window.location.replace(responseStripe.data.session_url);
//                     } else {
//                         toast.error(responseStripe.data.message);
//                     }
//                     break;

//                 case 'razorpay':
//                     const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData,headers);
//                     if (responseRazorpay.data.success) {
//                         initPay(responseRazorpay.data.order);
//                     }
//                     break;

//                 default:
//                     break;
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Calculate totals for Buy Now
//     const itemTotal = buyNowProduct ? (buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity : 0;
//     const orderTotal = itemTotal + delivery_fee;

//     return (
//         <form onSubmit={onSubmitHandler} className='pt-5 sm:pt-14 min-h-[80vh] border-t relative'>
//             <Loading isLoading={isLoading} />
//             <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
//                 {/* Product Card */}
//                 {isBuyNow && buyNowProduct && (
//                     <div className='border p-6 rounded-lg shadow-md bg-white'>
//                         <h2 className='text-xl font-semibold mb-4'>Product</h2>
//                         <div className='flex flex-col sm:flex-row items-start gap-4'>
//                             {/* Larger Product Image */}
//                             <img
//                                 className='w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg'
//                                 src={buyNowProduct.image[0]}
//                                 alt={buyNowProduct.name}
//                             />
//                             <div className='flex-1'>
//                                 <p className='font-medium text-lg'>{buyNowProduct.name}</p>
//                                 <p className='text-gray-600 text-sm mt-2 line-clamp-3'>{buyNowProduct.description}...</p>
//                                 {/* Quantity & Price */}
//                                 <div className='flex items-center justify-between mt-4'>
//                                     <div className='flex items-center gap-2'>
//                                         <span className='text-sm text-gray-500'>Size: {buyNowItem.size}</span>
//                                         <div className='flex items-center gap-1'>
//                                             <button
//                                                 onClick={decreaseQuantity}
//                                                 className='w-6 h-6 flex items-center justify-center bg-blue-300 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
//                                                 disabled={buyNowQuantity <= 1 || isLoading}
//                                                 type='button'
//                                             >
//                                                 -
//                                             </button>
//                                             <span className='text-base font-semibold w-8 text-center'>{buyNowQuantity}</span>
//                                             <button
//                                                 onClick={increaseQuantity}
//                                                 className='w-6 h-6 flex items-center justify-center bg-blue-300 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
//                                                 disabled={isLoading}
//                                                 type='button'
//                                             >
//                                                 +
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <p className='text-lg font-semibold text-gray-900'>₹{(buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}


//                 {/* Address Card */}
//                 <div className='border p-4 rounded'>
//                     <h2 className='text-xl font-medium mb-4'>Delivery Information</h2>
//                     <div className='flex flex-col gap-3'>
//                         <div className='flex gap-3'>
//                             <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' disabled={isLoading} />
//                             <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' disabled={isLoading} />
//                         </div>
//                         <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' disabled={isLoading} />
//                         <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' disabled={isLoading} />
//                         <div className='flex gap-3'>
//                             <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' disabled={isLoading} />
//                             <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' disabled={isLoading} />
//                         </div>
//                         <div className='flex gap-3'>
//                             <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' disabled={isLoading} />
//                             <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' disabled={isLoading} />
//                         </div>
//                         <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' disabled={isLoading} />
//                     </div>
//                 </div>

//                 {/* Payment Methods Card */}
//                 {isBuyNow && buyNowProduct && (
//                 <div className='border p-4 rounded'>
//                     <h2 className='text-xl font-medium mb-4'>Payment Method</h2>
//                     <div className='flex flex-col gap-3'>
//                         <label className='flex items-center gap-2 cursor-pointer'>
//                             <input type="radio" name="payment" value="stripe" checked={method === 'stripe'} onChange={() => setMethod('stripe')} disabled={isLoading} />
//                             <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
//                         </label>
//                         <label className='flex items-center gap-2 cursor-pointer'>
//                             <input type="radio" name="payment" value="razorpay" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} disabled={isLoading} />
//                             <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
//                         </label>
//                         <label className='flex items-center gap-2 cursor-pointer'>
//                             <input type="radio" name="payment" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} disabled={isLoading} />
//                             <span>Cash on Delivery</span>
//                         </label>
//                     </div>
//                     {isBuyNow && (
//                         <div className='mt-4 text-sm text-gray-700'>
//                             <div className='flex justify-between'>
//                                 <span>Items:</span>
//                                 <span>₹{itemTotal.toFixed(2)}</span>
//                             </div>
//                             <div className='flex justify-between'>
//                                 <span>Delivery:</span>
//                                 <span>₹{delivery_fee.toFixed(2)}</span>
//                             </div>
//                             <div className='flex justify-between font-semibold mt-2'>
//                                 <span>Order Total:</span>
//                                 <span>₹{orderTotal.toFixed(2)}</span>
//                             </div>
//                         </div>
//                     )}
//                     <button type='submit' className='bg-black text-white px-8 py-3 text-sm mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed' disabled={isLoading}>
//                         PLACE ORDER
//                     </button>
//                 </div>)}
//             </div>

//             {/* Regular Cart Flow */}
//             {!isBuyNow && (
//                 <div className='mt-8'>
//                     <CartTotal />
//                     <div className='mt-12'>
//                         <Title text1={'PAYMENT'} text2={'METHOD'} />
//                         <div className='flex gap-3 flex-col lg:flex-row'>
//                             <label className='flex items-center gap-2 cursor-pointer'>
//                                 <input type="radio" name="payment" value="stripe" checked={method === 'stripe'} onChange={() => setMethod('stripe')} disabled={isLoading} />
//                                 <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
//                             </label>
//                             <label className='flex items-center gap-2 cursor-pointer'>
//                                 <input type="radio" name="payment" value="razorpay" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} disabled={isLoading} />
//                                 <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
//                             </label>
//                             <label className='flex items-center gap-2 cursor-pointer'>
//                                 <input type="radio" name="payment" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} disabled={isLoading} />
//                                 <span>Cash on Delivery</span>
//                             </label>
//                         </div>
//                         <button type='submit' className='bg-black text-white px-16 py-3 text-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed' disabled={isLoading}>
//                             PLACE ORDER
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </form>
//     );
// };

// export default PlaceOrder;
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import CartTotal from '../components/CartTotal';

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, tempUser } = useContext(ShopContext);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const headers = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : { headers: { "temp-user": tempUser } };

    // Buy Now item from navigation state
    const buyNowItem = location.state?.buyNowItem;
    const isBuyNow = !!buyNowItem;
    const buyNowProduct = buyNowItem ? products.find(p => p._id === buyNowItem._id) : null;
    const [buyNowQuantity, setBuyNowQuantity] = useState(buyNowItem?.quantity || 1);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    // Quantity update functions
    const increaseQuantity = () => setBuyNowQuantity(prev => prev + 1);
    const decreaseQuantity = () => {
        if (buyNowQuantity > 1) setBuyNowQuantity(prev => prev - 1);
    };

    const initPay = (order,{orderData}) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: 'INR',
            name: 'VT Fashions',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        backendUrl + '/api/order/verifyRazorpay',
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            // userId is no longer needed here since backend uses req.userId
                        },
                        token ? { headers: { Authorization: `Bearer ${token}` } } : { headers: { "temp-user": tempUser } }
                    );
                    if (data.success) {
                        navigate('/orders');
                        if (!isBuyNow) setCartItems({});
                        await sendOrderConfirmationEmail(order, orderData);
                        toast.success('Payment successful!');
                    } else {
                        toast.error('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Razorpay verification error:', error);
                    toast.error(error.response?.data?.message || 'Payment verification failed');
                } finally {
                    setIsLoading(false);
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: '#000000'
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
            toast.error(`Payment failed: ${response.error.description}`);
            setIsLoading(false);
        });
        rzp.open();
    };

    const sendOrderConfirmationEmail = async (order, orderData ) => {
        try {
            await axios.post(backendUrl + '/api/order/send-email', { order, orderData }, headers);
            toast.success("Order confirmation email sent!");
        } catch (error) {
            console.error('Email error:', error);
            toast.error("Failed to send confirmation email.");
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            let orderItems = [];

            if (isBuyNow) {
                const itemInfo = structuredClone(products.find(product => product._id === buyNowItem._id));
                if (itemInfo) {
                    itemInfo.size = buyNowItem.size;
                    itemInfo.quantity = buyNowQuantity;
                    orderItems.push(itemInfo);
                }
            } else {
                for (const items in cartItems) {
                    for (const item in cartItems[items]) {
                        if (cartItems[items][item] > 0) {
                            const itemInfo = structuredClone(products.find(product => product._id === items));
                            if (itemInfo) {
                                itemInfo.size = item;
                                itemInfo.quantity = cartItems[items][item];
                                orderItems.push(itemInfo);
                            }
                        }
                    }
                }
            }

            const orderAmount = isBuyNow
                ? (buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity + delivery_fee
                : getCartAmount() + delivery_fee;

            let orderData = {
                userId: token ? undefined : tempUser,
                address: formData,
                items: orderItems,
                amount: orderAmount,
                email: formData.email,
                paymentMethod: method,
                currency: 'INR'
            };

            switch (method) {
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, headers);
                    if (response.data.success) {
                        if (!isBuyNow) setCartItems({});
                        navigate('/orders');
                        await sendOrderConfirmationEmail(orderData);
                    } else {
                        toast.error(response.data.message);
                    }
                    setIsLoading(false);
                    break;

                case 'razorpay':
                    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, headers);
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order, {orderData});
                    } else {
                        toast.error(responseRazorpay.data.message);
                        setIsLoading(false);
                    }
                    break;
            
                case 'stripe':
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, headers);
                    if (responseStripe.data.success) {
                        window.location.replace(responseStripe.data.session_url);
                    } else {
                        toast.error(responseStripe.data.message);
                        setIsLoading(false);
                    }
                    break;


                default:
                    setIsLoading(false);
                    break;
            }
        } catch (error) {
            console.error('Order submission error:', error);
            toast.error(error.response?.data?.message || 'An error occurred while placing the order');
            setIsLoading(false);
        }
    };

    // Calculate totals for Buy Now
    const itemTotal = buyNowProduct ? (buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity : 0;
    const orderTotal = itemTotal + delivery_fee;

    return (
        <form onSubmit={onSubmitHandler} className='pt-5 sm:pt-14 min-h-[80vh] border-t relative'>
            <Loading isLoading={isLoading} />
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Product Card */}
                {isBuyNow && buyNowProduct && (
                    <div className='border p-6 rounded-lg shadow-md bg-white'>
                        <h2 className='text-xl font-semibold mb-4'>Product</h2>
                        <div className='flex flex-col sm:flex-row items-start gap-4'>
                            <img
                                className='w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg'
                                src={buyNowProduct.image[0]}
                                alt={buyNowProduct.name}
                            />
                            <div className='flex-1'>
                                <p className='font-medium text-lg'>{buyNowProduct.name}</p>
                                <p className='text-gray-600 text-sm mt-2 line-clamp-3'>{buyNowProduct.description}...</p>
                                <div className='flex items-center justify-between mt-4'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm text-gray-500'>Size: {buyNowItem.size}</span>
                                        <div className='flex items-center gap-1'>
                                            <button
                                                onClick={decreaseQuantity}
                                                className='w-6 h-6 flex items-center justify-center bg-blue-300 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                                                disabled={buyNowQuantity <= 1 || isLoading}
                                                type='button'
                                            >
                                                -
                                            </button>
                                            <span className='text-base font-semibold w-8 text-center'>{buyNowQuantity}</span>
                                            <button
                                                onClick={increaseQuantity}
                                                className='w-6 h-6 flex items-center justify-center bg-blue-300 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
                                                disabled={isLoading}
                                                type='button'
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <p className='text-lg font-semibold text-gray-900'>₹{(buyNowProduct.offerPrice || buyNowProduct.price) * buyNowQuantity}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Address Card */}
                <div className='border p-4 rounded'>
                    <h2 className='text-xl font-medium mb-4'>Delivery Information</h2>
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' disabled={isLoading} />
                            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' disabled={isLoading} />
                        </div>
                        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' disabled={isLoading} />
                        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded pyCropData-1.5 px-3.5 w-full' type="text" placeholder='Street' disabled={isLoading} />
                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' disabled={isLoading} />
                            <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' disabled={isLoading} />
                        </div>
                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='pincode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Pincode' disabled={isLoading} />
                            <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' disabled={isLoading} />
                        </div>
                        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' disabled={isLoading} />
                    </div>
                </div>

                {/* Payment Methods Card */}
                {isBuyNow && buyNowProduct && (
                    <div className='border p-4 rounded'>
                        <h2 className='text-xl font-medium mb-4'>Payment Method</h2>
                        <div className='flex flex-col gap-3'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="payment" value="stripe" checked={method === 'stripe'} onChange={() => setMethod('stripe')} disabled={isLoading} />
                                <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="payment" value="razorpay" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} disabled={isLoading} />
                                <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="payment" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} disabled={isLoading} />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                        {isBuyNow && (
                            <div className='mt-4 text-sm text-gray-700'>
                                <div className='flex justify-between'>
                                    <span>Items:</span>
                                    <span>₹{itemTotal.toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Delivery:</span>
                                    <span>₹{delivery_fee.toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between font-semibold mt-2'>
                                    <span>Order Total:</span>
                                    <span>₹{orderTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                        <button type='submit' className='bg-black text-white px-8 py-3 text-sm mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed' disabled={isLoading}>
                            PLACE ORDER
                        </button>
                    </div>
                )}
            </div>

            {/* Regular Cart Flow */}
            {!isBuyNow && (
                <div className='mt-8'>
                    <CartTotal />
                    <div className='mt-12'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                        <div className='flex gap-3 flex-col lg:flex-row'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="payment" value="stripe" checked={method === 'stripe'} onChange={() => setMethod('stripe')} disabled={isLoading} />
                                <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="payment" value="razorpay" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} disabled={isLoading} />
                                <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type="radio" name="payment" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} disabled={isLoading} />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed' disabled={isLoading}>
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
};

export default PlaceOrder;