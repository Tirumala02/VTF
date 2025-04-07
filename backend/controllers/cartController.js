// import userModel from "../models/userModel.js"
// import mongoose from "mongoose"
// // const generateGuestId = () => `guest_${crypto.randomBytes(8).toString('hex')}`;

// // add products to user cart
// // addToCart function (Backend)
// const addToCart = async (req, res) => {
//     try {
//         const { itemId, size } = req.body;
//         let userId = req.body.userId;
//         console.log("Received userId: add to cart", userId);  // ✅ Debugging

//         let query = mongoose.Types.ObjectId.isValid(userId) ? { _id: userId } : { guestId: userId };

//         let user = await userModel.findOne(query);

//         if (!user) {
//             if (!userId.startsWith("guest_")) {
//                 return res.status(404).json({ message: "User not found" });
//             }
//             user = await userModel.create({ guestId: userId, name: `Guest_${userId}`, email:`${userId}@guestmail.com`, userType: "guest" });        }

//         let cartData = user.cartData || {};

//         if (!cartData[itemId]) {
//             cartData[itemId] = {};
//         }
//         cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

//         await userModel.findOneAndUpdate(query, { cartData });

//         res.status(200).json({ message: "Item added to cart!", guestId: userId });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // updateCart function (Backend)
// const updateCart = async (req, res) => {
//     try {
//         const { userId, itemId, size, quantity } = req.body;

//         let query = mongoose.Types.ObjectId.isValid(userId) ? { _id: userId } : { guestId: userId };

//         let user = await userModel.findOne(query);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         let cartData = user.cartData || {};
//         if (cartData[itemId] && cartData[itemId][size] !== undefined) {
//             cartData[itemId][size] = quantity;
//         }

//         await userModel.findOneAndUpdate(query, { cartData });

//         res.json({ success: true, message: "Cart Updated" });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // getUserCart function (Backend)
// const getUserCart = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         console.log("Received userId: get cart", userId);  // ✅ Debugging

//         if (!userId) return res.status(400).json({ message: "Missing userId" });

//         let query = mongoose.Types.ObjectId.isValid(userId)
//             ? { _id: userId }
//             : { guestId: userId };

//         let user = await userModel.findOne(query);
//         if (!user) return res.status(404).json({ message: "User not found using as guest" });
//         console.log("User cart:", user.cartData);  // ✅ Debugging
//         res.json({ success: true, cartData: user.cartData });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };



// export { addToCart, updateCart, getUserCart }
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Authentication Middleware
const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token && !req.headers["temp-user"]) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id; // Extract userId from token
    } else {
      req.userId = req.headers["temp-user"]; // Use tempUser for guests
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Add products to user cart
const addToCart = async (req, res) => {
    console.log("Received request to add to cart:", req.body); // Debugging log
  try {
    const { itemId, size } = req.body;
    const userId = req.userId; // From authUser middleware
    console.log("Received userId (addToCart):", userId);

    if (!itemId || !size) {
      return res.status(400).json({ success: false, message: "Item ID and size are required" });
    }

    let query = mongoose.Types.ObjectId.isValid(userId)
      ? { _id: userId }
      : { guestId: userId };

    let user = await userModel.findOne(query);

    if (!user) {
      if (!userId.startsWith("guest_")) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      user = await userModel.create({
        guestId: userId,
        name: `Guest_${userId}`,
        email: `${userId}@guestmail.com`,
        userType: "guest",
      });
    }

    let cartData = user.cartData || {};
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findOneAndUpdate(query, { cartData });

    res.status(200).json({ success: true, message: "Item added to cart!", cartData });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId; // From authUser middleware
    console.log("Received userId (updateCart):", userId);

    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Item ID, size, and quantity are required" });
    }

    let query = mongoose.Types.ObjectId.isValid(userId)
      ? { _id: userId }
      : { guestId: userId };

    let user = await userModel.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};
    if (quantity <= 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    await userModel.findOneAndUpdate(query, { cartData });

    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId; // From authUser middleware
    console.log("Received userId (getUserCart):", userId);

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    let query = mongoose.Types.ObjectId.isValid(userId)
      ? { _id: userId }
      : { guestId: userId };

    let user = await userModel.findOne(query);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    console.log("User cart:", user.cartData);
    res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, authUser };