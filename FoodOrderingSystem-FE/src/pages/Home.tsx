import { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';
import type { FoodItem } from '../types/food';
import { authStorageKey, bookingServiceApi, foodServiceApi, normalizeErrorMessage } from '../api/config';
import type { UserAuthResponse } from '../types/user';

export const Home = () => {
  const [movies, setMovies] = useState<FoodItem[]>([]);
  const [seatMap, setSeatMap] = useState<Record<number, string>>({});
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingStatusMessage, setBookingStatusMessage] = useState('');
  const [latestBookingId, setLatestBookingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await foodServiceApi.getFoods();
        setMovies(
          response.data
            .map((item) => ({
              ...item,
              name: item.name ?? item.title ?? '',
              price: item.price ?? item.ticketPrice ?? 0,
              category: item.category ?? item.genre ?? '',
              imageUrl: item.imageUrl ?? item.posterUrl ?? '',
            }))
            .filter((item) => item.available)
        );
      } catch (err) {
        setError(normalizeErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  useEffect(() => {
    if (!latestBookingId) {
      return;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const response = await bookingServiceApi.getBookings();
        const booking = response.data.find((item) => item.id === latestBookingId);
        if (!booking) {
          return;
        }

        if (booking.status === 'PAYMENT_COMPLETED') {
          setBookingStatusMessage(`Booking #${booking.id} thanh toan thanh cong!`);
          window.clearInterval(intervalId);
          return;
        }

        if (booking.status === 'PAYMENT_FAILED') {
          setBookingStatusMessage(`Booking #${booking.id} thanh toan that bai.`);
          window.clearInterval(intervalId);
        }
      } catch (pollError) {
        setError(normalizeErrorMessage(pollError));
      }
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [latestBookingId]);

  const bookMovie = async (movie: FoodItem) => {
    const authRaw = localStorage.getItem(authStorageKey);
    if (!authRaw) {
      setError('Vui long dang nhap de dat ve.');
      return;
    }

    const seatNumber = seatMap[movie.id];
    if (!seatNumber || !seatNumber.trim()) {
      setError('Vui long nhap so ghe truoc khi dat ve.');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      const auth = JSON.parse(authRaw) as UserAuthResponse;
      const response = await bookingServiceApi.createBooking({
        userId: auth.user.id,
        username: auth.user.username,
        movieId: movie.id,
        movieTitle: movie.name,
        seatNumber: seatNumber.trim().toUpperCase(),
      });
      setLatestBookingId(response.data.id);
      setBookingStatusMessage(`Booking #${response.data.id} dang cho payment xu ly...`);
      setBookingMessage(
        `Da tao booking cho phim "${movie.name}" ghe ${seatNumber.trim().toUpperCase()}. Vui long doi ket qua thanh toan va thong bao.`
      );
    } catch (err) {
      setError(normalizeErrorMessage(err));
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Movie Ticket Booking</h1>
          <p className="text-gray-500">Chon phim va dat ghe. Payment se duoc xu ly bat dong bo qua Kafka.</p>
        </div>
      </div>

      {loading && <p className="text-gray-500">Dang tai danh sach phim...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {bookingMessage && <p className="text-green-600 mb-4">{bookingMessage}</p>}
      {bookingStatusMessage && <p className="text-blue-600 mb-4">{bookingStatusMessage}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
              <img 
                src={item.imageUrl || 'https://via.placeholder.com/640x480?text=Movie'} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-blue-600 shadow-sm">
                {item.category}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
              
              <div className="mt-auto space-y-3">
                <span className="text-lg font-bold text-blue-600 block">
                  {formatPrice(item.price)}
                </span>
                <input
                  value={seatMap[item.id] ?? ''}
                  onChange={(event) =>
                    setSeatMap((prev) => ({ ...prev, [item.id]: event.target.value }))
                  }
                  placeholder="So ghe (VD: A1)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => bookMovie(item)}
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2.5 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                  <Ticket className="h-5 w-5" />
                  {bookingLoading ? 'Dang tao booking...' : 'Dat ve'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
