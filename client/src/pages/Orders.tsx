import React, { useState, useEffect } from 'react';
import { Calendar, Package, Truck, CheckCircle, Clock, Eye, Download, Filter, Search, X } from 'lucide-react';

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 45.99,
    items: 3,
    books: [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 12.99, qty: 1, image: "/api/placeholder/60/80" },
      { title: "To Kill a Mockingbird", author: "Harper Lee", price: 14.99, qty: 1, image: "/api/placeholder/60/80" },
      { title: "1984", author: "George Orwell", price: 18.01, qty: 1, image: "/api/placeholder/60/80" }
    ],
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-20"
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 78.50,
    items: 2,
    books: [
      { title: "Dune", author: "Frank Herbert", price: 24.99, qty: 1, image: "/api/placeholder/60/80" },
      { title: "The Hobbit", author: "J.R.R. Tolkien", price: 53.51, qty: 1, image: "/api/placeholder/60/80" }
    ],
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-25"
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "processing",
    total: 32.99,
    items: 1,
    books: [
      { title: "Pride and Prejudice", author: "Jane Austen", price: 32.99, qty: 1, image: "/api/placeholder/60/80" }
    ],
    trackingNumber: null,
    estimatedDelivery: "2024-01-30"
  },
  {
    id: "ORD-2024-004",
    date: "2024-01-25",
    status: "pending",
    total: 156.75,
    items: 4,
    books: [
      { title: "The Lord of the Rings", author: "J.R.R. Tolkien", price: 89.99, qty: 1, image: "/api/placeholder/60/80" },
      { title: "Harry Potter Set", author: "J.K. Rowling", price: 66.76, qty: 1, image: "/api/placeholder/60/80" }
    ],
    trackingNumber: null,
    estimatedDelivery: "2024-02-01"
  }
];

// Custom Drawer Component
const Drawer = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-xl shadow-xl transform transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.books.some(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const openDrawer = (order) => {
    setSelectedOrder(order);
  };

  const closeDrawer = () => {
    setSelectedOrder(null);
  };

  const OrderDetails = ({ order }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order {order.id}</h3>
          <p className="text-sm text-gray-500">
            Ordered on {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <button 
          onClick={closeDrawer}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Order Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">${order.total}</p>
            <p className="text-sm text-gray-500">{order.items} item{order.items > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Books List */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Items Ordered</h4>
          <div className="space-y-3">
            {order.books.map((book, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-12 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">Book</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 truncate">{book.title}</h5>
                  <p className="text-sm text-gray-600 truncate">by {book.author}</p>
                  <p className="text-sm text-gray-500">Qty: {book.qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${book.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-3">Shipping Information</h5>
          <div className="space-y-2 text-sm">
            {order.trackingNumber && (
              <p><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</p>
            )}
            <p><span className="font-medium">Estimated Delivery:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
            <p><span className="font-medium">Shipping Address:</span> 123 Book Street, Reading City, RC 12345</p>
          </div>
        </div>
        
        {/* Payment Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-3">Payment Summary</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${(order.total - 5.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total:</span>
              <span>${order.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-3">
          {order.trackingNumber && (
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Truck className="w-4 h-4" />
              Track Package
            </button>
          )}
          
          {order.status === 'delivered' && (
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your book orders</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders or books..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-500">
                          <Calendar className="inline w-4 h-4 mr-1" />
                          Ordered on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">${order.total}</p>
                        <p className="text-sm text-gray-500">{order.items} item{order.items > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button 
                      onClick={() => openDrawer(order)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    {order.trackingNumber && (
                      <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors">
                        <Truck className="w-4 h-4" />
                        Track Package
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <button className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors">
                        <Download className="w-4 h-4" />
                        Download Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Drawer */}
      <Drawer isOpen={selectedOrder !== null} onClose={closeDrawer}>
        {selectedOrder && <OrderDetails order={selectedOrder} />}
      </Drawer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default OrdersPage;