import express from 'express';
import orderController from '../controllers/orderController';

const 
router = express.Router();



router.get('/', async (req, res, next) => {
    try {
        await orderController.getAllOrders(req, res)
    } catch (e) {
        console.log(e)
        next(e)
    }
});

// TODO: Bring in same form as in buyerRoutes.ts
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export default router;
