import { useState, useEffect, useMemo, useReducer } from "react";
import ProductForm from "@components/warehouse/ProductForm";
import ProductFilters from "@components/warehouse/ProductFilters";
import ProductTable from "@components/warehouse/ProductTable";
import WarehouseStats from "@components/warehouse/WarehouseStats";
import Styles from "@styles/warehouse/Warehouse.module.css";
import { productsReducer, PRODUCT_ACTIONS } from "@/reducers/productsReducer";

const STORAGE_KEY = "warehouseProducts";

function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function Warehouse() {
  useEffect(() => {
    document.title = "Склад";
  }, []);

  // Товары хранятся в localStorage
  const [products, dispatch] = useReducer(productsReducer, undefined, init);

  // Сохраняем при каждом изменении товаров
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Не удалось сохранить товары:', e);
    }
  }, [products]);

  // Состояние фильтров
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // ⭐ useMemo: фильтрация пересчитывается ТОЛЬКО при изменении зависимостей
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Добавить новый товар
  function handleAddProduct(newProduct) {
    dispatch({
      type: PRODUCT_ACTIONS.ADD,
      payload: {
        ...newProduct,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
    });
  }

  // Удалить товар
  function handleDeleteProduct(id) {
    dispatch({
      type: PRODUCT_ACTIONS.DELETE,
      payload: id,
    });
  }

  // Обновить товар (редактирование)
  function handleUpdateProduct(updatedProduct) {
    dispatch({
      type: PRODUCT_ACTIONS.UPDATE,
      payload: updatedProduct,
    });
  }

  return (
    <div className={Styles.page}>
      <h1 className={Styles.pageTitle}>📦 Учёт товаров</h1>

      <ProductForm onAdd={handleAddProduct} />

      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <WarehouseStats
        products={filteredProducts}
        totalProducts={products.length}
      />

      <ProductTable
        products={filteredProducts}
        totalProducts={products.length}
        onDelete={handleDeleteProduct}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
}
