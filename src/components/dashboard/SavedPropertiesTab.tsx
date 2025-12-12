import { useState } from 'react';
import { FiBookmark, FiEye, FiDownload, FiTrash2, FiStar, FiSearch, FiFileText, FiCheck } from 'react-icons/fi';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserTier, SavedProperty } from '@/data/mockDashboardData';
import { exportSavedPropertiesToCSV } from '@/utils/exportHelpers';
import PropertyDetailsModal from './PropertyDetailsModal';

interface SavedPropertiesTabProps {
  userTier: UserTier;
  properties: SavedProperty[];
}

type SortField = 'date' | 'address' | 'zone';
type SortOrder = 'asc' | 'desc';

export default function SavedPropertiesTab({ userTier, properties }: SavedPropertiesTabProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterCounty, setFilterCounty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<SavedProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleExportPDF = (property: SavedProperty) => {
    if (userTier === 'whale') {
      alert('PDF export would happen here (backend not connected yet)');
    } else {
      alert('PDF export is only available for The Whale subscribers. Upgrade to export PDFs!');
    }
  };

  const handleDelete = (propertyId: string) => {
    if (confirm('Are you sure you want to delete this property from your saved list?')) {
      alert(`Would delete property ${propertyId} (backend not connected yet)`);
    }
  };

  // Filter and sort properties
  const filteredProperties = properties
    .filter((prop) => {
      // Filter by county
      if (filterCounty !== 'all' && prop.county !== filterCounty) {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          prop.address.toLowerCase().includes(query) ||
          prop.zoneCode.toLowerCase().includes(query) ||
          prop.zoneName.toLowerCase().includes(query) ||
          prop.city.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.dateSaved).getTime() - new Date(b.dateSaved).getTime();
          break;
        case 'address':
          comparison = a.address.localeCompare(b.address);
          break;
        case 'zone':
          comparison = a.zoneCode.localeCompare(b.zoneCode);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const counties = ['New Castle', 'Kent', 'Sussex'];

  const handleExportAll = () => {
    if (filteredProperties.length === 0) {
      alert('No properties to export');
      return;
    }
    exportSavedPropertiesToCSV(filteredProperties);
  };

  const handleViewDetails = (property: SavedProperty) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProperties.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProperties.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected properties?`)) {
      alert(`Would delete ${selectedIds.size} properties (backend not connected yet)`);
      setSelectedIds(new Set());
      setBulkActionMode(false);
    }
  };

  const handleBulkExport = () => {
    const selectedProperties = filteredProperties.filter(p => selectedIds.has(p.id));
    if (selectedProperties.length === 0) {
      alert('No properties selected');
      return;
    }
    exportSavedPropertiesToCSV(selectedProperties);
    setSelectedIds(new Set());
    setBulkActionMode(false);
  };

  return (
    <>
      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          userTier={userTier}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
      {/* Header with Filters */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Saved Properties
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
              {userTier === 'looker' && ' (max 10 for free users)'}
            </p>
          </div>
          <div className="flex gap-2">
            {filteredProperties.length > 0 && (
              <>
                <button
                  onClick={() => {
                    setBulkActionMode(!bulkActionMode);
                    setSelectedIds(new Set());
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    bulkActionMode
                      ? 'bg-delaware-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiCheck className="w-4 h-4" />
                  {bulkActionMode ? 'Cancel' : 'Select'}
                </button>
                {!bulkActionMode && (
                  <button
                    onClick={handleExportAll}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-delaware-gold text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    <FiFileText className="w-4 h-4" />
                    Export All
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {bulkActionMode && selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-delaware-blue/10 rounded-lg border-2 border-delaware-blue"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-delaware-blue">
                  {selectedIds.size} {selectedIds.size === 1 ? 'property' : 'properties'} selected
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkExport}
                    className="px-3 py-1.5 text-sm font-medium bg-delaware-gold text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Export Selected
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 text-sm font-medium bg-error text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* County Filter */}
          <select
            value={filterCounty}
            onChange={(e) => setFilterCounty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white text-gray-900"
          >
            <option value="all">All Counties</option>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-') as [SortField, SortOrder];
              setSortField(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="address-asc">Address (A-Z)</option>
            <option value="address-desc">Address (Z-A)</option>
            <option value="zone-asc">Zone Code (A-Z)</option>
            <option value="zone-desc">Zone Code (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Properties List/Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {filteredProperties.length === 0 ? (
          <div className="p-12 text-center">
            <FiBookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {properties.length === 0 ? 'No Saved Properties' : 'No Results Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {properties.length === 0
                ? "You haven't saved any properties yet. Start searching to add properties to your dashboard."
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {properties.length === 0 && (
              <Link href="/" className="btn-primary inline-block">
                Search Properties
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {bulkActionMode && (
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === filteredProperties.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-delaware-blue border-gray-300 rounded focus:ring-delaware-blue cursor-pointer"
                          aria-label="Select all properties"
                        />
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      County
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saved
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <motion.tr 
                      key={property.id} 
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {bulkActionMode && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(property.id)}
                            onChange={() => toggleSelect(property.id)}
                            className="w-4 h-4 text-delaware-blue border-gray-300 rounded focus:ring-delaware-blue cursor-pointer"
                            aria-label={`Select ${property.address}`}
                          />
                        </td>
                      )}
                      <td className="px-6 py-4">
                        {property.starred && (
                          <FiStar className="w-4 h-4 text-delaware-gold fill-current" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {property.address}
                          </p>
                          {property.tags && property.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {property.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-delaware-blue text-white">
                            {property.zoneCode}
                          </span>
                          <p className="text-xs text-gray-600 mt-1">{property.zoneName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {property.county}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(property.dateSaved)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(property)}
                            className="p-2 text-gray-600 hover:text-delaware-blue hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleExportPDF(property)}
                            className={`p-2 rounded transition-colors ${
                              userTier === 'whale'
                                ? 'text-gray-600 hover:text-delaware-gold hover:bg-yellow-50'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title={userTier === 'whale' ? 'Export PDF' : 'Whale feature only'}
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-gray-600 hover:text-error hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <motion.div 
                  key={property.id} 
                  className="p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      {bulkActionMode && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(property.id)}
                          onChange={() => toggleSelect(property.id)}
                          className="w-4 h-4 text-delaware-blue border-gray-300 rounded focus:ring-delaware-blue cursor-pointer mt-1"
                          aria-label={`Select ${property.address}`}
                        />
                      )}
                      <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {property.starred && (
                          <FiStar className="w-4 h-4 text-delaware-gold fill-current flex-shrink-0" />
                        )}
                        <p className="font-medium text-gray-900 text-sm">
                          {property.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-delaware-blue text-white">
                          {property.zoneCode}
                        </span>
                        <span className="text-xs text-gray-600">{property.zoneName}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {property.county} • {formatDate(property.dateSaved)}
                      </p>
                    </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      onClick={() => handleViewDetails(property)}
                      className="flex-1 text-center px-3 py-2 text-sm font-medium text-delaware-blue bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleExportPDF(property)}
                      className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded transition-colors ${
                        userTier === 'whale'
                          ? 'text-delaware-gold bg-yellow-50 hover:bg-yellow-100'
                          : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="px-3 py-2 text-sm font-medium text-error bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      </motion.div>
    </>
  );
}
