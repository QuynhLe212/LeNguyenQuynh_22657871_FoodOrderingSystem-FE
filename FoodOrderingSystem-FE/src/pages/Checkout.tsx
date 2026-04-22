import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Phone, User, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { authStorageKey, normalizeErrorMessage, orderServiceApi, paymentServiceApi } from '../api/config';
import type { UserAuthResponse } from '../types/user';

export const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Banking'>('COD');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawAuth = localStorage.getItem(authStorageKey);
    if (!rawAuth) {
      setError('Ban can dang nhap truoc khi dat hang.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const auth = JSON.parse(rawAuth) as UserAuthResponse;
      const orderResponse = await orderServiceApi.createOrder({
        userId: auth.user.id,
        items: items.map((item) => ({ foodId: item.id, quantity: item.quantity })),
      });

      await paymentServiceApi.createPayment({
        orderId: orderResponse.data.id,
        paymentMethod,
        username: auth.user.username,
      });

      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(normalizeErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-500">
        <div className="bg-green-100 p-4 rounded-full mb-6">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-500 text-center max-w-md">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý và sẽ được giao trong thời gian sớm nhất.
        </p>
        <p className="text-sm text-gray-400 mt-4 animate-pulse">Đang tự động chuyển về trang chủ...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Thông tin giao hàng</h2>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên người nhận</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="0987.xxx.xxx"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value as 'COD' | 'Banking')}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white"
              >
                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                <option value="Banking">Chuyen khoan (Banking)</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tổng thanh toán</p>
            <p className="text-2xl font-bold text-orange-600">{formatPrice(totalPrice)}</p>
          </div>
          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors focus:ring-4 focus:ring-orange-100"
          >
            {submitting ? 'Dang xu ly...' : 'Xác nhận đặt hàng'}
          </button>
        </div>
      </form>
    </div>
  );
};
