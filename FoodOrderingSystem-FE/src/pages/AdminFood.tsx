import { useState } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import type { FoodItem } from '../types/food';
import { foodServiceApi, normalizeErrorMessage } from '../api/config';
import { useEffect } from 'react';

export const AdminFood = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setLoading(true);
        const response = await foodServiceApi.getFoods();
        setFoods(response.data);
      } catch (err) {
        setError(normalizeErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  const openModalForAdd = () => {
    setEditingFood(null);
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setCategory('');
    setIsModalOpen(true);
  };

  const openModalForEdit = (food: FoodItem) => {
    setEditingFood(food);
    setName(food.name);
    setDescription(food.description ?? '');
    setPrice(food.price.toString());
    setImage(food.imageUrl ?? '');
    setCategory(food.category ?? '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món này?')) {
      try {
        await foodServiceApi.deleteFood(id);
        setFoods(foods.filter((f) => f.id !== id));
      } catch (err) {
        setError(normalizeErrorMessage(err));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      alert('Vui lòng điền đủ thông tin cơ bản!');
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      imageUrl: image || undefined,
      category,
      available: true,
    };

    try {
      if (editingFood) {
        const response = await foodServiceApi.updateFood(editingFood.id, payload);
        setFoods(foods.map((f) => (f.id === editingFood.id ? response.data : f)));
      } else {
        const response = await foodServiceApi.createFood(payload);
        setFoods([...foods, response.data]);
      }
      closeModal();
    } catch (err) {
      setError(normalizeErrorMessage(err));
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý món ăn</h1>
          <p className="text-gray-500">Thêm, sửa, xóa các món ăn trong hệ thống</p>
        </div>
        <button
          onClick={openModalForAdd}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Thêm món mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && <p className="px-6 py-4 text-gray-500">Dang tai danh sach mon...</p>}
        {error && <p className="px-6 py-4 text-red-500">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold text-gray-600">Hình ảnh</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Tên món</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Danh mục</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Giá</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {foods.map(food => (
                <tr key={food.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={food.imageUrl || 'https://via.placeholder.com/200x200?text=Food'} alt={food.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">{food.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                      {food.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatPrice(food.price)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModalForEdit(food)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {foods.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Chưa có món ăn nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingFood ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="food-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên món <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="VD: Burger bò"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="VD: Đồ uống, Món chính..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="VD: 50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn ảnh (URL)</label>
                  <input
                    type="text"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn gọn</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Mô tả về món ăn..."
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                form="food-form"
                className="px-6 py-2.5 rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm"
              >
                {editingFood ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
