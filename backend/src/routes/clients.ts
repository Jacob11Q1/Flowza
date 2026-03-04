import { Router } from 'express';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController';
import { protect } from '../middleware/auth';

const router = Router();

// All client routes require auth
router.use(protect);

router.route('/').get(getClients).post(createClient);
router.route('/:id').get(getClient).put(updateClient).delete(deleteClient);

export default router;
