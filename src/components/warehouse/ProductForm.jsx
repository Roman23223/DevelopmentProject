import { useState } from 'react';
import Styles from '@styles/warehouse/ProductForm.module.css';

const CATEGORIES = ['Электроника', 'Одежда', 'Продукты', 'Инструменты', 'Другое'];

export default function ProductForm({ onAdd }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  function handleSubmit(e) {
    e.preventDefault();

    // Валидация
    if (!name.trim()) {
      alert('Введите название товара');
      return;
    }

    const qty = parseInt(quantity, 10);
    const prc = parseFloat(price);

    if (isNaN(qty) || qty < 0) {
      alert('Количество должно быть числом ≥ 0');
      return;
    }

    if (isNaN(prc) || prc < 0) {
      alert('Цена должна быть числом ≥ 0');
      return;
    }

    // Отправляем данные наверх
    onAdd({
      name: name.trim(),
      quantity: qty,
      price: prc,
      category,
    });

    // Очищаем форму
    setName('');
    setQuantity('');
    setPrice('');
    setCategory(CATEGORIES[0]);
  }

  return (
    <form className={Styles.form} onSubmit={handleSubmit}>
      <h2 className={Styles.formTitle}>Добавить товар</h2>

      <div className={Styles.formGrid}>
        <div className={Styles.field}>
          <label className={Styles.label}>Название</label>
          <input
            className={Styles.input}
            type="text"
            placeholder="Например: Ноутбук"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={Styles.field}>
          <label className={Styles.label}>Количество</label>
          <input
            className={Styles.input}
            type="number"
            placeholder="0"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className={Styles.field}>
          <label className={Styles.label}>Цена (₽)</label>
          <input
            className={Styles.input}
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className={Styles.field}>
          <label className={Styles.label}>Категория</label>
          <select
            className={Styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <button className={Styles.submitButton} type="submit">
        + Добавить товар
      </button>
    </form>
  );
}