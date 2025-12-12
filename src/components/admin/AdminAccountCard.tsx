import { useState } from 'react';
import { FiDollarSign, FiCreditCard, FiTrendingUp, FiArrowUpRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminAccountCard() {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferMethod, setTransferMethod] = useState<'card' | 'bank' | null>(null);

  // Mock data - replace with real data from your backend
  const accountBalance = 12450.75;
  const pendingBalance = 1250.00;
  const lastTransfer = '2024-12-01';

  const handleTransfer = () => {
    if (transferMethod) {
      alert(`Would initiate ${transferMethod} transfer of $${accountBalance.toFixed(2)}\n\nBackend integration coming soon!`);
      setShowTransferModal(false);
      setTransferMethod(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Balance</h3>
              <p className="text-xs text-gray-500">Available for transfer</p>
            </div>
          </div>
          <FiTrendingUp className="w-5 h-5 text-green-500" />
        </div>

        {/* Balance Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">
              ${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-gray-500">USD</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-amber-600">
              <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
              <span>Pending: ${pendingBalance.toFixed(2)}</span>
            </div>
            <div className="text-gray-500">
              Last transfer: {new Date(lastTransfer).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs text-gray-600 mb-1">This Month</p>
            <p className="text-lg font-semibold text-gray-900">$8,450</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
            <p className="text-lg font-semibold text-gray-900">$42,890</p>
          </div>
        </div>

        {/* Transfer Button */}
        <button
          onClick={() => setShowTransferModal(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-delaware-blue to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <FiArrowUpRight className="w-5 h-5" />
          Transfer Funds
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Standard transfers take 1-3 business days
        </p>
      </div>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowTransferModal(false);
              setTransferMethod(null);
            }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Transfer Funds</h3>
              <p className="text-gray-600 mb-6">
                Choose your preferred transfer method
              </p>

              {/* Amount Display */}
              <div className="bg-gradient-to-r from-delaware-blue/10 to-blue-100/50 rounded-xl p-4 mb-6 border border-delaware-blue/20">
                <p className="text-sm text-gray-600 mb-1">Transfer Amount</p>
                <p className="text-3xl font-bold text-delaware-blue">
                  ${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Transfer Method Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setTransferMethod('card')}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                    transferMethod === 'card'
                      ? 'border-delaware-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    transferMethod === 'card' ? 'bg-delaware-blue' : 'bg-gray-100'
                  }`}>
                    <FiCreditCard className={`w-6 h-6 ${
                      transferMethod === 'card' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">Debit Card</p>
                    <p className="text-sm text-gray-500">Instant transfer • 1.5% fee</p>
                  </div>
                  {transferMethod === 'card' && (
                    <div className="w-5 h-5 bg-delaware-blue rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setTransferMethod('bank')}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                    transferMethod === 'bank'
                      ? 'border-delaware-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    transferMethod === 'bank' ? 'bg-delaware-blue' : 'bg-gray-100'
                  }`}>
                    <FiDollarSign className={`w-6 h-6 ${
                      transferMethod === 'bank' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">Bank Account</p>
                    <p className="text-sm text-gray-500">1-3 business days • No fee</p>
                  </div>
                  {transferMethod === 'bank' && (
                    <div className="w-5 h-5 bg-delaware-blue rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setTransferMethod(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={!transferMethod}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                    transferMethod
                      ? 'bg-delaware-blue text-white hover:bg-opacity-90'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Transfer
                </button>
              </div>

              {transferMethod && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  {transferMethod === 'card' 
                    ? `Fee: $${(accountBalance * 0.015).toFixed(2)} • You'll receive $${(accountBalance * 0.985).toFixed(2)}`
                    : 'No fees • Full amount will be transferred'
                  }
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

