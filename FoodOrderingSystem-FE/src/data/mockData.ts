export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const menuItems: FoodItem[] = [
  {
    id: '1',
    name: 'Burger Bò Pho Mát',
    description: 'Burger bò nướng lửa với lớp pho mát tan chảy và sốt đặc biệt.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    category: 'Burger'
  },
  {
    id: '2',
    name: 'Pizza Hải Sản',
    description: 'Pizza hải sản tươi ngon với phô mai mozzarella và xốt cà chua Ý.',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    category: 'Pizza'
  },
  {
    id: '3',
    name: 'Gà Rán Giòn Gia Vị',
    description: 'Gà rán tẩm gia vị giòn rụm bên ngoài, mềm ngọt bên trong.',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    category: 'Gà rán'
  },
  {
    id: '4',
    name: 'Bún Chả Hà Nội',
    description: 'Thịt xiên nướng thơm lừng, chả băm đậm đà cùng nước chấm chua ngọt.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1615486171434-2e9ee0efb7da?auto=format&fit=crop&w=800&q=80',
    category: 'Món Việt'
  },
  {
    id: '5',
    name: 'Phở Bò Đặc Biệt',
    description: 'Phở bò tái nạm gầu, nước dùng hầm xương 24h đậm đà truyền thống.',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb438?auto=format&fit=crop&w=800&q=80',
    category: 'Món Việt'
  },
  {
    id: '6',
    name: 'Salad Rau Củ Tươi',
    description: 'Salad tổng hợp rau củ tươi ngon, sốt chanh leo thanh mát.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    category: 'Healthy'
  },
  {
    id: '7',
    name: 'Sushi Cá Hồi',
    description: 'Sushi cá hồi Nhật Bản tươi sống, mềm béo ăn kèm mù tạt.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    category: 'Món Nhật'
  },
  {
    id: '8',
    name: 'Mì Ý Sốt Bò Băm',
    description: 'Spaghetti với xốt bò băm cà chua đậm chất Ý.',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1621996311210-ea96b0143a53?auto=format&fit=crop&w=800&q=80',
    category: 'Món Ý'
  }
];
