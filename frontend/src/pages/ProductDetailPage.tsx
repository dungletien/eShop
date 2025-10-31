import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../shared/api';

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.get(`/products/${slug}`).then((res) => setProduct(res.data));
  }, [slug]);

  const addToCart = async () => {
    if (!product) return;
    await api.post('/cart', { productId: product.id, quantity: 1 });
    alert('Đã thêm vào giỏ');
  };

  if (!product) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <div>{Number(product.price).toLocaleString('vi-VN')} ₫</div>
      <p>{product.description}</p>
      <button onClick={addToCart}>Thêm vào giỏ</button>
    </div>
  );
}


