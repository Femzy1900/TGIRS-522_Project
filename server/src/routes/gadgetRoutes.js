import express from 'express';
import {
  getGadgets,
  getGadgetById,
  searchGadgets,
  createGadget,
  updateGadget,
  deleteGadget,
  getBrands,
  getCategories
} from '../controllers/gadgetController.js';

const router = express.Router();

router.route('/').get(getGadgets).post(createGadget);
router.route('/search').get(searchGadgets);
router.route('/brands').get(getBrands);
router.route('/categories').get(getCategories);
router.route('/:id').get(getGadgetById).put(updateGadget).delete(deleteGadget);

export default router;
