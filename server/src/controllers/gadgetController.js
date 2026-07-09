import Gadget from '../models/Gadget.js';
import { scoreAndRankGadgets } from '../services/relevanceScorer.js';

// Helper to build filter query from req.query
const buildFilterQuery = (query) => {
  const filter = {};
  if (query.brand) filter.brand = query.brand;
  if (query.category) filter.category = query.category;
  if (query.operatingSystem) filter.operatingSystem = query.operatingSystem;
  if (query.ram) filter.ram = query.ram;
  if (query.storage) filter.storage = query.storage;
  if (query.releaseYear) filter.releaseYear = Number(query.releaseYear);
  if (query.availability) filter.availability = query.availability;
  
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  return filter;
};

// Helper for sorting
const getSortCriteria = (sortBy) => {
  switch (sortBy) {
    case 'newest': return { releaseYear: -1, createdAt: -1 };
    case 'oldest': return { releaseYear: 1, createdAt: 1 };
    case 'priceLowHigh': return { price: 1 };
    case 'priceHighLow': return { price: -1 };
    case 'alphabetical': return { productName: 1 };
    case 'highestRated': return { rating: -1 };
    default: return { createdAt: -1 }; // newest by default
  }
};

// @desc    Get all gadgets (browse mode)
// @route   GET /gadgets
export const getGadgets = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = buildFilterQuery(req.query);
    const sort = getSortCriteria(req.query.sortBy);

    const gadgets = await Gadget.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Gadget.countDocuments(filter);

    res.json({
      gadgets,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search gadgets with relevance scoring
// @route   GET /gadgets/search
export const searchGadgets = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return getGadgets(req, res); // fallback to browse if no query
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const filter = buildFilterQuery(req.query);

    // Initial fetch of candidates using MongoDB text search and filter
    const candidates = await Gadget.find({
      ...filter,
      $text: { $search: q }
    }).lean();

    // If text index doesn't catch everything, we could also do a regex fallback
    // But text index is better for performance. For this IR demo, we'll run 
    // the relevance scorer on the candidates to demonstrate ranking.
    const rankedResults = scoreAndRankGadgets(candidates, q);

    // Apply sorting if a specific sort is requested, otherwise sort by relevance score
    if (req.query.sortBy) {
      const sortMap = getSortCriteria(req.query.sortBy);
      const sortKey = Object.keys(sortMap)[0];
      const sortDir = sortMap[sortKey];
      rankedResults.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortDir === 1 ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortDir === 1 ? 1 : -1;
        return 0;
      });
    }

    // Paginate in memory since we scored all candidates
    const paginatedResults = rankedResults.slice(skip, skip + limit);

    res.json({
      gadgets: paginatedResults,
      page,
      pages: Math.ceil(rankedResults.length / limit),
      total: rankedResults.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single gadget
// @route   GET /gadgets/:id
export const getGadgetById = async (req, res) => {
  try {
    const gadget = await Gadget.findById(req.params.id);
    if (gadget) {
      res.json(gadget);
    } else {
      res.status(404).json({ message: 'Gadget not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a gadget
// @route   POST /gadgets
export const createGadget = async (req, res) => {
  try {
    const gadget = new Gadget(req.body);
    const createdGadget = await gadget.save();
    res.status(201).json(createdGadget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a gadget
// @route   PUT /gadgets/:id
export const updateGadget = async (req, res) => {
  try {
    const gadget = await Gadget.findById(req.params.id);
    if (gadget) {
      Object.assign(gadget, req.body);
      const updatedGadget = await gadget.save();
      res.json(updatedGadget);
    } else {
      res.status(404).json({ message: 'Gadget not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a gadget
// @route   DELETE /gadgets/:id
export const deleteGadget = async (req, res) => {
  try {
    const gadget = await Gadget.findById(req.params.id);
    if (gadget) {
      await Gadget.deleteOne({ _id: req.params.id });
      res.json({ message: 'Gadget removed' });
    } else {
      res.status(404).json({ message: 'Gadget not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique brands
// @route   GET /gadgets/brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Gadget.distinct('brand');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique categories
// @route   GET /gadgets/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Gadget.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
