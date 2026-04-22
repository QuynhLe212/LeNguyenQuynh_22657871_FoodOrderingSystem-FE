import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <div className="bg-orange-50 p-6 rounded-full mb-6">
          <ShoppingBag className="h-16 w-16 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">Bạn chưa có món ăn nào trong giỏ. Hãy quay lại trang chủ để chọn những món ăn ngon nhất nhé!</p>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2"
        >
          Quay lại thực đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/200x200?text=Food'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    aria-label="Xóa món"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-orange-600">{formatPrice(item.price)}</span>
                  
                  <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-lg hover:bg-white text-gray-600 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-lg hover:bg-white text-gray-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng đơn hàng</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí giao hàng</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-orange-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-4 rounded-xl transition-colors focus:ring-4 focus:ring-orange-100"
            >
              Tiến hành đặt hàng
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
