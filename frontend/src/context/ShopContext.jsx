// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from 'axios'
// import Cookies from "js-cookie"; // Import js-cookie


// export const ShopContext = createContext();

// const ShopContextProvider = (props) => {

//     const currency = '₹';
//     const delivery_fee = 100;
//     const backendUrl = import.meta.env.VITE_BACKEND_URL
//     const [search, setSearch] = useState('');
//     const [showSearch, setShowSearch] = useState(false);
//     const [cartItems, setCartItems] = useState({});
//     const [products, setProducts] = useState([]);
//     const [token, setToken] = useState('')
//     const [tempUser, setTempUser] = useState(""); // Temporary user ID
//     const navigate = useNavigate();

//     const generateTempUser = () => {
//         const array = new Uint8Array(8);
//         window.crypto.getRandomValues(array);
//         const guestId = `guest_${Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')}`;

//         Cookies.set("tempUser", guestId, { expires: 30 }); // Store in cookies for 30 days
//         setTempUser(guestId);
//     };

//     console.log("Token:", token);
//     console.log("TempUser:", tempUser);


//     const addToCart = async (itemId, size) => {
//         if (!size) {
//             toast.error("Select Product Size");
//             return;
//         }

//         let cartData = structuredClone(cartItems);
//         cartData[itemId] = cartData[itemId] || {};
//         cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
//         setCartItems(cartData);

//         try {
//             const headers = token ? { token } : { "temp-user": tempUser };
//             await axios.post(backendUrl + "/api/cart/add", { itemId, size, userId: token || tempUser }, { headers });
//         } catch (error) {
//             console.log(error);
//             toast.error(error.message);
//         }
//     };

//     const getCartCount = () => {
//         let totalCount = 0;
//         for (const items in cartItems) {
//             for (const item in cartItems[items]) {
//                 try {
//                     if (cartItems[items][item] > 0) {
//                         totalCount += cartItems[items][item];
//                     }
//                 } catch (error) {

//                 }
//             }
//         }
//         return totalCount;
//     }

//     const updateQuantity = async (itemId, size, quantity) => {
//         let cartData = structuredClone(cartItems);
//         cartData[itemId][size] = quantity;
//         setCartItems(cartData);

//         try {
//             const headers = token ? { token } : { "temp-user": tempUser };
//             await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity, userId: token || tempUser }, { headers });
//         } catch (error) {
//             console.log(error);
//             toast.error(error.message);
//         }
//     };

//     const getCartAmount = () => {
//         let totalAmount = 0;
//         for (const items in cartItems) {
//             let itemInfo = products.find((product) => product._id === items);
//             for (const item in cartItems[items]) {
//                 try {
//                     if (cartItems[items][item] > 0) {
//                         totalAmount += (itemInfo.offerPrice || itemInfo.price) * cartItems[items][item];
//                     }
//                 } catch (error) {

//                 }
//             }
//         }
//         return totalAmount;
//     }

//     const getProductsData = async () => {
//         try {

//             const response = await axios.get(backendUrl + '/api/product/list')
//             if (response.data.success) {
//                 setProducts(response.data.products.reverse())
//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }

   
//     const getUserCart = async () => {
//         if (!token && !tempUser) return;  
//         try {
//             const userId = token ? token : tempUser;  
    
//             const headers = token
//                 ? { Authorization: `Bearer ${token}` }
//                 : { "temp-user": tempUser };
    
//             console.log("Fetching cart with:", { userId, headers });
    
//             const response = await axios.post(backendUrl + "/api/cart/get", { userId }, { headers });
//             console.log("Cart response:", response.data);
//             if (response.data.success) {
//                 setCartItems(response.data.cartData);
//             } else {
//                 console.warn("Cart fetch failed:", response.data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching cart:", error);
//             toast.error(response.message);
//         }
//     };    
    


//     useEffect(() => {
//         getProductsData()
//     }, [])


//     useEffect(() => {
//         const storedToken = localStorage.getItem("token");
    
//         if (storedToken) {
//             setToken(storedToken);
//             getUserCart(); // ✅ Fetch user cart
//         } else {
//             const storedTempUser = Cookies.get("tempUser");
    
//             if (!storedTempUser) {
//                 generateTempUser(); // ✅ Create a guest ID if not found
//             } else {
//                 setTempUser(storedTempUser);
//                 getUserCart(); // ✅ Fetch guest cart
//             }
//         }
//     }, [tempUser]);
    
//     useEffect(() => {
//         const headers = token ? { token } : { "temp-user": tempUser };
    
//         if (token || tempUser) {  // ✅ Run only when either is available
//             console.log("Fetching cart with headers:", headers);
//             getUserCart(token || tempUser);
//         }
//     }, [token, tempUser]);  // ✅ Runs when token or guest ID is set
    

//     const value = {
//         products, currency, delivery_fee,
//         search, setSearch, showSearch, setShowSearch,
//         cartItems, addToCart, setCartItems,
//         getCartCount, updateQuantity,
//         getCartAmount, navigate, backendUrl,
//         setToken, token, tempUser, setTempUser
//     }

//     return (
//         <ShopContext.Provider value={value}>
//             {props.children}
//         </ShopContext.Provider>
//     )

// }

// export default ShopContextProvider;




import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 100;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [tempUser, setTempUser] = useState("");
  const navigate = useNavigate();

  const generateTempUser = () => {
    const array = new Uint8Array(8);
    window.crypto.getRandomValues(array);
    const guestId = `guest_${Array.from(array, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("")}`;

    Cookies.set("tempUser", guestId, { expires: 30 });
    setTempUser(guestId);
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    if (!token && !tempUser) {
      generateTempUser(); // Generate tempUser if neither exists
    }

    let cartData = structuredClone(cartItems);
    cartData[itemId] = cartData[itemId] || {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { "temp-user": tempUser };
      const response = await axios.post(
        `${backendUrl}/api/cart/addtocart`,
        { itemId, size },
        { headers }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || cartData); // Sync with backend
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    } else {
      cartData[itemId][size] = quantity;
    }
    setCartItems(cartData);

    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { "temp-user": tempUser };
      const response = await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData); // Sync with backend
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalAmount += (itemInfo?.offerPrice || itemInfo?.price || 0) * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Get products error:", error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    if (!token && !tempUser) return;

    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { "temp-user": tempUser };
      console.log("Fetching cart with headers:", headers);

      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers });
      console.log("Cart response:", response.data);
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        console.warn("Cart fetch failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error(error.response?.data?.message || "Failed to fetch cart");
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedTempUser = Cookies.get("tempUser");

    if (storedToken) {
      setToken(storedToken);
    } else if (storedTempUser) {
      setTempUser(storedTempUser);
    } else {
      generateTempUser();
    }
  }, []);

  useEffect(() => {
    if (token || tempUser) {
      getUserCart();
    }
  }, [token, tempUser]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    tempUser,
    setTempUser,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;