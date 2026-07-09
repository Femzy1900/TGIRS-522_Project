/**
 * Lightweight Relevance Scorer
 * 
 * This service implements a core Information Retrieval concept by evaluating how
 * well a document (gadget) matches a query, assigning a score, and ranking the results.
 */

export const scoreAndRankGadgets = (gadgets, query) => {
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  
  if (searchTerms.length === 0) return gadgets;

  const scoredGadgets = gadgets.map(gadget => {
    let score = 0;

    // We weight matches in different fields differently
    const fieldWeights = {
      productName: 10,
      brand: 8,
      category: 6,
      keywords: 5,
      description: 2,
      operatingSystem: 4,
      processor: 3,
      ram: 3,
      storage: 3,
      releaseYear: 1
    };

    searchTerms.forEach(term => {
      // 1. Check productName
      if (gadget.productName) {
        const nameLower = gadget.productName.toLowerCase();
        if (nameLower === term) score += fieldWeights.productName * 2; // Exact match bonus
        else if (nameLower.includes(term)) score += fieldWeights.productName;
      }

      // 2. Check brand
      if (gadget.brand && gadget.brand.toLowerCase().includes(term)) {
        score += fieldWeights.brand;
      }

      // 3. Check category
      if (gadget.category && gadget.category.toLowerCase().includes(term)) {
        score += fieldWeights.category;
      }

      // 4. Check keywords array
      if (gadget.keywords && gadget.keywords.length > 0) {
        const keywordMatch = gadget.keywords.some(k => k.toLowerCase().includes(term));
        if (keywordMatch) score += fieldWeights.keywords;
      }

      // 5. Check description
      if (gadget.description && gadget.description.toLowerCase().includes(term)) {
        score += fieldWeights.description;
      }

      // 6. Check specs
      if (gadget.operatingSystem && gadget.operatingSystem.toLowerCase().includes(term)) {
        score += fieldWeights.operatingSystem;
      }
      if (gadget.processor && gadget.processor.toLowerCase().includes(term)) {
        score += fieldWeights.processor;
      }
      if (gadget.ram && gadget.ram.toLowerCase().includes(term)) {
        score += fieldWeights.ram;
      }
      if (gadget.storage && gadget.storage.toLowerCase().includes(term)) {
        score += fieldWeights.storage;
      }
      if (gadget.releaseYear && gadget.releaseYear.toString() === term) {
        score += fieldWeights.releaseYear;
      }
    });

    return { ...gadget, _relevanceScore: score };
  });

  // Filter out items that scored 0 (if any snuck through) and sort by score descending
  return scoredGadgets
    .filter(g => g._relevanceScore > 0)
    .sort((a, b) => b._relevanceScore - a._relevanceScore);
};
