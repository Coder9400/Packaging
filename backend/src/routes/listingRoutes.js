import { Router } from 'express';
import {
  getListings,
  getMyListings,
  getListingById,
  createListing,
  updateListing,
  updateListingStatus,
  deleteListing,
  uploadListingImage,
} from '../controllers/listingController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/', getListings);
router.get('/mine', requireAuth, getMyListings);
router.get('/:id', getListingById);

// Protected routes
router.post('/', requireAuth, upload.single('image'), createListing);
router.put('/:id', requireAuth, updateListing);
router.patch('/:id', requireAuth, updateListing);
router.patch('/:id/status', requireAuth, updateListingStatus);
router.delete('/:id', requireAuth, deleteListing);
router.post('/:id/images', requireAuth, upload.single('image'), uploadListingImage);

export default router;
