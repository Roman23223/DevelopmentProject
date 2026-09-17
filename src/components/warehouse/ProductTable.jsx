import { useState } from 'react';
import ProductRow from '@components/warehouse/ProductRow';
import ConfirmDialog from '@components/warehouse/ConfirmDialog';
import EditProductModal from '@components/warehouse/EditProductModal';
import Styles from '@styles/warehouse/ProductTable.module.css';

export default function ProductTable({ products, totalProducts, onUpdate, onDelete }) {
  // Товар, который СОБИРАЕМСЯ удалить (null = модалка закрыта)
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  function handleConfirmDelete() {
    onDelete(productToDelete.id);   // реальное удаление наверху
    setProductToDelete(null);       // закрываем модалку
  }

  function handleSaveEdit(updatedProduct) {
    onUpdate(updatedProduct); // редактирование 
    setProductToEdit(null);  // закрываем модалку
  }

  if (products.length === 0) {
    return (
      <div className={Styles.empty}>
        <p className={Styles.emptyIcon}>📭</p>
        <p className={Styles.emptyText}>Склад пуст. Добавьте первый товар!</p>
      </div>
    );
  }

  return (
    <div className={Styles.tableWrapper}>
      <h2 className={Styles.tableTitle}>
        {products.length === totalProducts ? `Товары (${products.length})` : `Найдено: ${products.length} из ${totalProducts}`}
      </h2>
      <table className={Styles.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Категория</th>
            <th>Кол-во</th>
            <th>Цена</th>
            <th>Сумма</th>
            <th>Дата добавления</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} onEditRequest={setProductToEdit} onDeleteRequest={setProductToDelete}/>
          ))}
        </tbody>  
      </table>

      {/* Модалка удаления — одна на всю таблицу */}
      {productToDelete && (
        <ConfirmDialog title="Удалить товар?"
          text={`«${productToDelete.name}» будет удалён без возможности восстановления.`}
          confirmLabel="Удалить"
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}

      {/* Модалка редактирования */}
      {productToEdit && (
        <EditProductModal product={productToEdit} onSave={handleSaveEdit} onCancel={() => setProductToEdit(null)}/>
      )}
    </div>
  );
}