import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'; // Ensure you install `uuid` package
import mongoose from "mongoose";
import crypto from 'crypto';
// global variables
const currency = 'INR'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// const razorpayInstance = new razorpay({
//     key_id : process.env.RAZORPAY_KEY_ID,
//     key_secret : process.env.RAZORPAY_KEY_SECRET,
// })

const razorpayVal = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// const placeOrder = async (req, res) => {
//     try {
//         let { userId, items, amount, address } = req.body;
//         let user;
//         console.log("userId:", userId); // ✅ Debugging
//         console.log("items:", items); // ✅ Debugging
//         if (!userId.startsWith("guest_")) {
//             // 🔍 Regular user → Find by `_id`
//             if (!mongoose.Types.ObjectId.isValid(userId)) {
//                 return res.status(400).json({ success: false, message: "Invalid User ID" });
//             }
//             user = await userModel.findById(userId);
//         } else {
//             // 🛒 Guest user → Find by `guestId`
//             user = await userModel.findOne({ guestId: userId });
//         }

//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         const orderData = {
//             userId: user._id, // ✅ Always use `_id` (MongoDB ObjectId)
//             items,
//             address,
//             amount,
//             paymentMethod: "COD",
//             payment: false,
//             status: "Order Placed",
//             date: Date.now(),
//         };

//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

//         // 🧹 Clear cart after order
//         await userModel.findByIdAndUpdate(user._id, { cartData: {} });

//         res.json({ success: true, message: "Order Placed" });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body; // Remove userId from body
        const userId = req.userId; // Use from authUser middleware
        console.log(userId, amount, address);

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        let user;
        if (!userId.startsWith("guest_")) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ success: false, message: "Invalid User ID" });
            }
            user = await userModel.findById(userId);
        } else {
            user = await userModel.findOne({ guestId: userId });
        }

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const orderData = {
            userId: user._id,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(user._id, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error("Place order error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// Placing orders using Stripe Method


// // Placing orders using Razorpay Method
// const placeOrderRazorpay = async (req, res) => {
//     try {
//         const { userId, items, amount, address, currency } = req.body;
//         let user;

//         if (!userId.startsWith("guest_")) {
//             // 🔍 Regular user → Find by _id
//             if (!mongoose.Types.ObjectId.isValid(userId)) {
//                 return res.status(400).json({ success: false, message: "Invalid User ID" });
//             }
//             user = await userModel.findById(userId);
//         } else {
//             // 🛒 Guest user → Find by guestId
//             user = await userModel.findOne({ guestId: userId });
//         }

//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         const orderData = {
//             userId: user._id, // ✅ Always use _id (MongoDB ObjectId)
//             items,
//             address,
//             amount,
//             paymentMethod: "Razorpay",
//             payment: false,
//             status: "Pending Payment",
//             date: Date.now(),
//         };

//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

//         const options = {
//             amount: amount * 100, // Razorpay expects amount in paise
//             currency: currency?.toUpperCase() || "INR",
//             receipt: newOrder._id.toString(),
//         };

//         // Assuming you have a Razorpay instance configured as `razorpay`
//         const razorpayOrder = await razorpay.orders.create(options);

//         res.json({
//             success: true,
//             message: "Order initiated with Razorpay",
//             order: newOrder,
//             razorpayOrder,
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// const verifyRazorpay = async (req,res) => {
//     try {
        
//         const { userId, razorpay_order_id  } = req.body

//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
//         if (orderInfo.status === 'paid') {
//             await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
//             await userModel.findByIdAndUpdate(userId,{cartData:{}})
//             res.json({ success: true, message: "Payment Successful" })
//         } else {
//              res.json({ success: false, message: 'Payment Failed' });
//         }

//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }

// const sendEmail = async (req, res) =>{
//     const { orderData } = req.body;

//     if (!orderData || !orderData.email) {
//         return res.status(400).json({ success: false, message: "Invalid order data" });
//     }

//     // Define email content
//     const { address, items, amount } = orderData;
//     const customerEmail = orderData.email;
//     const adminEmail = "anub0709@gmail.com"; // Replace with actual admin email

//     // Order Summary HTML Template
//     const emailTemplate = `
//     <html>
//     <body style="font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
//             <h2 style="color: #333; text-align: center;">Thank You for Your Order!</h2>
//             <p>Hello <strong>${address.firstName} ${address.lastName}</strong>,</p>
//             <p>We have received your order and it is now being processed. Here are your order details:</p>
            
//             <table style="width: 100%; border-collapse: collapse;">
//                 <thead>
//                     <tr>
//                         <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 10px;">Item</th>
//                         <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Quantity</th>
//                         <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Price</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${items.map(item => `
//                     <tr>
//                         <td style="border-bottom: 1px solid #ddd; padding: 10px;">${item.name} (${item.size})</td>
//                         <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">${item.quantity}</td>
//                         <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">$${(item.price * item.quantity).toFixed(2)}</td>
//                     </tr>`).join('')}
//                 </tbody>
//             </table>

//             <h3 style="text-align: right; color: #333;">Total: $${amount.toFixed(2)}</h3>

//             <h4>Shipping Address:</h4>
//             <p>${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}</p>

//             <p>If you have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
            
//             <p style="text-align: center; color: #777;">Thank you for shopping with us!</p>
//         </div>
//     </body>
//     </html>
//     `;

//     try {
//         // Configure nodemailer transporter
//         const transporter = nodemailer.createTransport({
//             service: "Gmail",
//             auth: {
//                 user: process.env.EMAIL_USER, // Your Gmail address
//                 pass: process.env.EMAIL_PASS  // Your Gmail App Password
//             }
//         });

//         // Send email to customer
//         await transporter.sendMail({
//             from: `"Shop Name" <${process.env.EMAIL_USER}>`,
//             to: customerEmail,
//             subject: "Your Order Confirmation",
//             html: emailTemplate
//         });

//         // Send email to admin
//         await transporter.sendMail({
//             from: `"Shop Name" <${process.env.EMAIL_USER}>`,
//             to: adminEmail,
//             subject: "New Order Received",
//             html: emailTemplate
//         });

//         res.status(200).json({ success: true, message: "Email sent successfully" });

//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.status(500).json({ success: false, message: "Failed to send email" });
//     }
// };
// Initialize Razorpay instance


// Placing orders using Razorpay Method
// const placeOrderRazorpay = async (req, res) => {
//     try {
//         const { userId, items, amount, address, currency } = req.body;
//         console.log({ userId, items, amount, address, currency }); // ✅ Debugging
        
//         if (!userId || !items || !amount || !address) {
//             return res.status(400).json({ success: false, message: "Missing required fields" });
//         }

//         let user;
//         if (!userId.startsWith("guest_")) {
//             if (!mongoose.Types.ObjectId.isValid(userId)) {
//                 return res.status(400).json({ success: false, message: "Invalid User ID" });
//             }
//             user = await userModel.findById(userId);
//         } else {
//             user = await userModel.findOne({ guestId: userId });
//         }

//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         const orderData = {
//             userId: user._id,
//             items,
//             address,
//             amount,
//             paymentMethod: "Razorpay",
//             payment: false,
//             status: "Pending Payment",
//             date: Date.now(),
//         };

//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

//         const options = {
//             amount: Math.round(amount * 100), // Convert to paise, ensure no decimals
//             currency: currency?.toUpperCase() || "INR",
//             receipt: newOrder._id.toString(),
//         };

//         const razorpayOrder = await razorpayVal.orders.create(options);

//         res.json({
//             success: true,
//             message: "Order initiated with Razorpay",
//             order: {
//                 id: razorpayOrder.id,
//                 amount: razorpayOrder.amount,
//                 currency: razorpayOrder.currency,
//                 receipt: razorpayOrder.receipt,
//             },
//         });
//     } catch (error) {
//         console.error("Razorpay order creation error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, amount, address, currency } = req.body; // Remove userId from body
        const userId = req.userId; // Use from authUser middleware
        console.log({ userId, items, amount, address, currency }); // Debugging

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let user;
        if (!userId.startsWith("guest_")) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ success: false, message: "Invalid User ID" });
            }
            user = await userModel.findById(userId);
        } else {
            user = await userModel.findOne({ guestId: userId });
        }

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const orderData = {
            userId: user._id,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            status: "Pending Payment",
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: currency?.toUpperCase() || "INR",
            receipt: newOrder._id.toString(),
        };

        const razorpayOrder = await razorpayVal.orders.create(options);

        res.json({
            success: true,
            message: "Order initiated with Razorpay",
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                receipt: razorpayOrder.receipt,
            },
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Razorpay Payment
// const verifyRazorpay = async (req, res) => {
//     try {
//         const { userId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         // Validation
//         if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//             return res.status(400).json({ success: false, message: "Missing payment details" });
//         }

//         // Verify payment signature
        
//         const generatedSignature = crypto
//             .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//             .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//             .digest('hex');

//         if (generatedSignature !== razorpay_signature) {
//             return res.status(400).json({ success: false, message: "Invalid payment signature" });
//         }

//         // Fetch order to confirm payment
//         const orderInfo = await razorpayVal.orders.fetch(razorpay_order_id);
//         if (orderInfo.status === 'paid') {
//             await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true, status: "Order Placed" });
//             if (!userId.startsWith("guest_")) {
//                 await userModel.findByIdAndUpdate(userId, { cartData: {} });
//             }
//             res.json({ success: true, message: "Payment successful" });
//         } else {
//             res.json({ success: false, message: "Payment not completed" });
//         }
//     } catch (error) {
//         console.error("Razorpay verification error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.userId; // Use from authUser middleware
        console.log("verifyRazorpay - userId:", userId); // Debugging

        // Validation
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        // Verify payment signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // Fetch order to confirm payment
        const orderInfo = await razorpayVal.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true, status: "Order Placed" });
            if (!userId.startsWith("guest_")) {
                if (!mongoose.Types.ObjectId.isValid(userId)) {
                    return res.status(400).json({ success: false, message: "Invalid User ID" });
                }
                await userModel.findByIdAndUpdate(userId, { cartData: {} });
            }
            res.json({ success: true, message: "Payment successful" });
        } else {
            res.json({ success: false, message: "Payment not completed" });
        }
    } catch (error) {
        console.error("Razorpay verification error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send Order Confirmation Email
const sendEmail = async (req, res) => {
    const { order,orderData } = req.body;

    if (!orderData || !orderData.email) {
        return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    const { address, items, amount, paymentMethod } = orderData;
    const customerEmail = orderData.email;
    const adminEmail = "anub0709@gmail.com"; // Replace with your admin email

    // Determine currency symbol
    const currencySymbol = paymentMethod === "Razorpay" ? "₹" : "₹"; // Adjust based on your needs

    // Order Summary HTML Template with Payment Method
    const emailTemplate = `
    <html>
    <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Thank You for Your Order!</h2>
            <p>Hello <strong>${address.firstName} ${address.lastName}</strong>,</p>
            <p>We have received your order and it is now being processed. Here are your order details:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border-bottom: 1px solid #ddd; text-align: left; padding: 10px;">Item</th>
                        <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Quantity</th>
                        <th style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${items
                        .map(
                            (item) => `
                    <tr>
                        <td style="border-bottom: 1px solid #ddd; padding: 10px;">${item.name} (${item.size})</td>
                        <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">${item.quantity}</td>
                        <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 10px;">${currencySymbol}${((item.offerPrice || item.price) * item.quantity).toFixed(2)}</td>
                    </tr>`
                        )
                        .join('')}
                </tbody>
            </table>

            <h3 style="text-align: right; color: #333;">Total: ${currencySymbol}${amount.toFixed(2)}</h3>

            <h4>Shipping Address:</h4>
            <p>${address.street}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.country}</p>

            <h4>Payment Method:</h4>
            <p>${paymentMethod.toUpperCase()}${paymentMethod === "Razorpay" ? " (Paid)" : paymentMethod === "COD" ? " (Pay on Delivery)" : " (Payment Done ✔️)"}</p>
            ${
                paymentMethod === "Razorpay" && order && order.id ? `
                <h4>Razorpay order Id:</h4>
                <p>Order ID: ${order.id}</p>
                <br/>
                <br/>
                ` : ''
            }

            <p>If you have any questions, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
            
            <p style="text-align: center; color: #777;">Thank you for shopping with us!</p>
        </div>
    </body>
    </html>
    `;
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email to customer
        await transporter.sendMail({
            from: `"VT Fashions" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: "VT FAS Order Confirmation",
            html: emailTemplate,
        });

        // Send email to admin
        await transporter.sendMail({
            from: `"VT Fashions" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: "New Order Received",
            html: emailTemplate,
        });

        res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
};
// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}



// const userOrders = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         let user;
//         console.log("user order:");  // ✅ Debugging

//         if (!userId) {
//             return res.status(400).json({ success: false, message: "User ID is required" });
//         }

//         if (!userId.startsWith("guest_")) {
//             // 🔍 Logged-in user → Find by `_id`
//             if (!mongoose.Types.ObjectId.isValid(userId)) {
//                 return res.status(400).json({ success: false, message: "Invalid User ID" });
//             }
//             user = await userModel.findById(userId);
//         } else {
//             // 🛒 Guest user → Find by `guestId`
//             user = await userModel.findOne({ guestId: userId });
//         }

//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         // Fetch orders using the actual MongoDB `_id`
//         const orders = await orderModel.find({ userId: user._id });

//         res.json({ success: true, orders });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const userOrders = async (req, res) => {
    try {
      const userId = req.userId; // Get userId from authUser middleware
      let user;
  
      console.log('Fetching orders for userId:', userId);
  
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }
  
      if (!userId.startsWith('guest_')) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ success: false, message: 'Invalid User ID' });
        }
        user = await userModel.findById(userId);
      } else {
        user = await userModel.findOne({ guestId: userId });
      }
  
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
      const orders = await orderModel.find({ userId: user._id }).sort({ date: -1 });
      res.json({ success: true, orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {verifyRazorpay ,placeOrder,  placeOrderRazorpay, sendEmail, allOrders, userOrders, updateStatus}