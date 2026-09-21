import Styles from '@styles/warehouse/ProductTable.module.css';

export default function ProductRow({
  product,
  index,
  onEditRequest,
  onDeleteRequest,
}) {
  const total = product.quantity * product.price;

  return (
    <tr
      className={Styles.row}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <td className={Styles.nameCell}>{product.name}</td>
      <td>
        <span className={Styles.categoryBadge}>{product.category}</span>
      </td>
      <td>{product.quantity}</td>
      <td>{product.price.toFixed(2)} ₽</td>
      <td className={Styles.totalCell}>{total.toFixed(2)} ₽</td>
      <td className={Styles.dateCell}>
        {new Date(product.createdAt).toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      <td>
        <div className={Styles.actionsCell}>
          <button
            type="button"
            className={Styles.editButton}
            onClick={() => onEditRequest(product)}
            title="Редактировать товар"
          >
            ✏️ Изменить
          </button>
          <button
            type="button"
            className={Styles.deleteButton}
            onClick={() => onDeleteRequest(product)}
            title="Удалить товар"
          >
            🗑 Удалить
          </button>
        </div>
      </td>
    </tr>
  );
}