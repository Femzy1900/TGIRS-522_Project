import React from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Database, Search, Cpu, ListFilter, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Information Retrieval Concepts & Evaluation</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A deep dive into the architecture and performance of the Tech Gadget Information Retrieval System (TGIRS).
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="text-primary-600" /> Core IR Concepts Implemented
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-2 text-primary-600">1. Collection</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              The corpus of the system is the MongoDB `gadgets` collection, currently seeded with a diverse dataset of tech products spanning multiple categories and brands.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-2 text-primary-600">2. Document</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Each gadget record represents a single document in our IR system. It contains structured fields (specs) and unstructured text (description, keywords) that are indexed.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-2 text-primary-600">3. Indexing</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We leverage a MongoDB Text Index across `productName`, `brand`, `category`, `keywords`, and `description` to allow for rapid text matching without full-table scans.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-2 text-primary-600">4. Querying</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Users can issue free-text queries. The system supports partial matching, case-insensitive searches, and multi-keyword queries (e.g., "16GB RAM Android").
            </p>
          </Card>
          <Card className="p-6 sm:col-span-2">
            <h3 className="text-lg font-bold mb-2 text-primary-600">5. Retrieval & Ranking (Relevance Scoring)</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Retrieval is handled via a lightweight custom relevance scorer. Candidate documents are fetched via the database index, then passed through a Node.js scoring function. The function assigns specific weights to different fields:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300 grid grid-cols-2 md:grid-cols-4">
              <li className="flex items-center gap-2"><Badge variant="primary">Product Name: 10</Badge></li>
              <li className="flex items-center gap-2"><Badge variant="success">Brand: 8</Badge></li>
              <li className="flex items-center gap-2"><Badge variant="warning">Category: 6</Badge></li>
              <li className="flex items-center gap-2"><Badge variant="default">Keywords: 5</Badge></li>
              <li className="flex items-center gap-2"><Badge variant="default">Specs: 3-4</Badge></li>
              <li className="flex items-center gap-2"><Badge variant="default">Description: 2</Badge></li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ListFilter className="text-primary-600" /> System Evaluation
        </h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Purpose of the System</h3>
            <p className="text-gray-600 dark:text-gray-300">
              The Tech Gadget Information Retrieval System (TGIRS) was developed as an academic demonstration for CSC 522. 
              Its primary purpose is to illustrate how an unstructured and semi-structured dataset can be indexed and searched using modern web technologies, 
              moving beyond simple exact-match queries to feature a ranking system based on term frequency and field importance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-green-500">
              <h3 className="font-bold flex items-center gap-2 mb-2"><Zap className="text-green-500" size={20} /> Strengths</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li><strong>Hybrid Filtering:</strong> Combines Boolean logic (filters) with vector-like text ranking (search query).</li>
                <li><strong>Weighted Scoring:</strong> Ensures a query for "Apple" prioritizes Apple brand gadgets over gadgets simply mentioning Apple in the description.</li>
                <li><strong>Performance:</strong> Initial candidate reduction via MongoDB text indexes ensures the Node.js memory scorer only evaluates relevant documents.</li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500">
              <h3 className="font-bold flex items-center gap-2 mb-2"><Search className="text-red-500" size={20} /> Weaknesses</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li><strong>Synonym Handling:</strong> Does not currently support stemming, lemmatization, or synonym mapping (e.g., "cellphone" vs "smartphone").</li>
                <li><strong>In-Memory Ranking limit:</strong> If the dataset grows to millions of records, pulling all candidates into Node.js for relevance scoring will cause a bottleneck.</li>
              </ul>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Future Improvements</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Elasticsearch Integration:</strong> Migrate from MongoDB text indexes to a dedicated search engine like Elasticsearch to utilize TF-IDF or BM25 ranking algorithms out-of-the-box.</li>
              <li><strong>Natural Language Processing (NLP):</strong> Add query expansion and spelling correction (e.g., "did you mean?") to improve recall on misspelled queries.</li>
              <li><strong>Personalized Search:</strong> Factor in user click-through rates and viewing history into the relevance scorer to provide a personalized ranking model.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
