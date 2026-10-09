import { useState, useMemo } from "react";
import ProductRow from "@components/warehouse/ProductRow";
import ConfirmDialog from "@components/warehouse/ConfirmDialog";
import EditProductModal from "@components/warehouse/EditProductModal";
import Styles from "@styles/warehouse/ProductTable.module.css";
import { useProductsDispatch } from "@/contexts/productsContext";
import { PRODUCT_ACTIONS } from "@/reducers/productsReducer";

// Типы колонок для сортировки
const SORT_KEYS = {
  NAME: "name",
  CATEGORY: "category",
  QUANTITY: "quantity",
  PRICE: "price",
  TOTAL: "total",
  CREATED: "createdAt",
};

// Иконка сортировки для колонки
function SortIcon({ sort, columnKey }) {
  if (sort?.key !== columnKey) return <span className={Styles.sortIcon}>↕</span>;
  return <span className={Styles.sortIconActive}>{sort.direction === "asc" ? "↑" : "↓"}</span>;
}

// Колонка таблицы (заголовок + сортировка)
function SortableHeader({ label, columnKey, sort, onSort }) {
  return (
    <th>
      <button type="button" className={Styles.sortButton} onClick={() => onSort(columnKey)}>
        {label}
        <SortIcon sort={sort} columnKey={columnKey} />
      </button>
    </th>
  );
}

export default function ProductTable({ products, totalProducts }) {
  const dispatch = useProductsDispatch();
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  // Состояние сортировки: { key, direction } или null
  // По умолчанию — по дате добавления, новые сверху
  const [sort, setSort] = useState({
    key: SORT_KEYS.CREATED,
    direction: "desc",
  });

  // Клик по заголовку колонки
  function handleSort(key) {
    setSort((prev) => {
      // Клик по той же колонке — меняем направление
      if (prev?.key === key) {
        const next = prev.direction === "asc" ? "desc" : "asc";
        return { key, direction: next };
      }
      // Клик по новой колонке — asc по умолчанию
      return { key, direction: "asc" };
    });
  }

  // Отсортированный массив товаров
  const sortedProducts = useMemo(() => {
    if (!sort) return products;

    const copy = [...products];
    const dir = sort.direction === "asc" ? 1 : -1;

    copy.sort((a, b) => {
      switch (sort.key) {
        case SORT_KEYS.NAME:
          return a.name.localeCompare(b.name, "ru") * dir;

        case SORT_KEYS.CATEGORY:
          return a.category.localeCompare(b.category, "ru") * dir;

        case SORT_KEYS.QUANTITY:
          return (a.quantity - b.quantity) * dir;

        case SORT_KEYS.PRICE:
          return (a.price - b.price) * dir;

        case SORT_KEYS.TOTAL:
          return (a.quantity * a.price - b.quantity * b.price) * dir;

        case SORT_KEYS.CREATED:
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;

        default:
          return 0;
      }
    });

    return copy;
  }, [products, sort]);

  function handleConfirmDelete() {
    dispatch({ type: PRODUCT_ACTIONS.DELETE, payload: productToDelete.id });
    setProductToDelete(null);
  }

  function handleSaveEdit(updatedProduct) {
    dispatch({ type: PRODUCT_ACTIONS.UPDATE, payload: updatedProduct });
    setProductToEdit(null);
  }

  // Заглушки пустых состояний
  if (products.length === 0 && totalProducts === 0) {
    return (
      <div className={Styles.empty}>
        <p className={Styles.emptyIcon}>📭</p>
        <p className={Styles.emptyText}>Склад пуст. Добавьте первый товар!</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={Styles.empty}>
        <p className={Styles.emptyIcon}>🔍</p>
        <p className={Styles.emptyText}>По текущим фильтрам ничего не найдено.</p>
      </div>
    );
  }

  return (
    <div className={Styles.tableWrapper}>
      <h2 className={Styles.tableTitle}>
        {products.length === totalProducts
          ? `Товары (${products.length})`
          : `Найдено: ${products.length} из ${totalProducts}`}
      </h2>

      <table className={Styles.table}>
        <thead>
          <tr>
            <SortableHeader
              label="Название"
              columnKey={SORT_KEYS.NAME}
              sort={sort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Категория"
              columnKey={SORT_KEYS.CATEGORY}
              sort={sort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Кол-во"
              columnKey={SORT_KEYS.QUANTITY}
              sort={sort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Цена"
              columnKey={SORT_KEYS.PRICE}
              sort={sort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Сумма"
              columnKey={SORT_KEYS.TOTAL}
              sort={sort}
              onSort={handleSort}
            />
            <SortableHeader
              label="Дата добавления"
              columnKey={SORT_KEYS.CREATED}
              sort={sort}
              onSort={handleSort}
            />
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              index={index}
              onEditRequest={setProductToEdit}
              onDeleteRequest={setProductToDelete}
            />
          ))}
        </tbody>
      </table>

      {productToDelete && (
        <ConfirmDialog
          title="Удалить товар?"
          text={`«${productToDelete.name}» будет удалён без возможности восстановления.`}
          confirmLabel="Удалить"
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}

      {productToEdit && (
        <EditProductModal
          product={productToEdit}
          onSave={handleSaveEdit}
          onCancel={() => setProductToEdit(null)}
        />
      )}
    </div>
  );
}
