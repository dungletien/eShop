import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../shared/api';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data.items));
  }, []);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.get('/products', { params: { q } });
    setProducts(res.data.items);
  };

  return (
    <div>
      <form onSubmit={onSearch} style={{ marginBottom: 16 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm" />
        <button type="submit">Tìm</button>
      </form>
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {products.map((p) => (
          <li key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div>{Number(p.price).toLocaleString('vi-VN')} ₫</div>
            <Link to={`/products/${p.slug}`}>Xem</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


