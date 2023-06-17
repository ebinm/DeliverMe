import express from 'express';
import orderController from '../controllers/orderController';

const 
router = express.Router();

// TODO: Bring in same form as in buyerRoutes.ts

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export default router;
