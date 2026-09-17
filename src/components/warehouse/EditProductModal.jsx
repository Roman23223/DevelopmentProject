import { useState, useEffect } from 'react';
import Styles from '@styles/warehouse/EditProductModal.module.css';

const CATEGORIES = ['Электроника', 'Одежда', 'Продукты', 'Инструменты', 'Другое'];

export default function EditProductModal({ product, onSave, onCancel }) {
  // Инициализируем форму данными товара
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [price, setPrice] = useState(String(product.price));
  const [category, setCategory] = useState(product.category);

  // Закрытие по Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  function handleSubmit(e) {
    e.preventDefault();

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

    // Отправляем обновлённые данные наверх
    onSave({
      ...product,                          // сохраняем id, createdAt
      name: name.trim(),
      quantity: qty,
      price: prc,
      category,
    });
  }

  return (
    <div className={Styles.overlay} onClick={onCancel}>
      <form
        className={Styles.modal}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={Styles.modalTitle}>Редактировать товар</h3>

        <div className={Styles.formGrid}>
          <div className={Styles.field}>
            <label className={Styles.label}>Название</label>
            <input
              className={Styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className={Styles.field}>
            <label className={Styles.label}>Количество</label>
            <input
              className={Styles.input}
              type="number"
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

        <div className={Styles.modalButtons}>
          <button type="button" className={Styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className={Styles.saveButton}>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}