import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js";

export const getOrder = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.params.uid });
        if (orders) {
            console.log(orders)
            return res.status(200).send({
                orders
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'error getting orders',
            error
        })
    }
}

export const updateOrder = async (req, resp) => {

    try {
        const key = req.params.key
        let status;
        console.log("requestting")
        console.log(req.params.key)
        if (key == 1) {
            status = "Shipped"
        }
        else if (key == 2) {
            status = "Delivered"
        }
        else if (key == 3) {
            status = "Cancelled"
        }
        const product = await orderModel.findByIdAndUpdate(req.params.oid, { status },);
        await product.save();
        resp.status(201).send({
            success: true,
            message: 'order updated',
            product
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: 'Error updating product',
            error
        })
    }
}

export const deleteOrderController = async (req, resp) => {
    try {
        const product = await orderModel.findByIdAndUpdate(req.params.oid, { status: "Cancelled" },);
        await product.save();
        resp.status(201).send({
            success: true,
            message: 'order cancelled',
            product
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: 'Error deleting product',
            error
        })
    }
}

export const placeOrder = async (req, resp) => {
    try {
        const { userDetail, cartitems, paymentoption, price } = req.body;
        console.log(paymentoption);
        const user = await userModel.findByIdAndUpdate(req.params.uid, { name: userDetail.fname, lname: userDetail.lname, address: userDetail.address, phone: userDetail.phone },);
        await user.save();
        const o = await new orderModel({ cart: cartitems, buyer: req.params.uid, payment: { paymentoption, price } }).save()
        if (o) {
            resp.status(200).send({
                success: true,
            })
        } else {
            resp.status(500).send({
                success: false,
            })
        }

    } catch (err) {
        console.log(err)
    }
}