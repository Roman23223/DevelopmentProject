import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@hooks/UseLocalStorage';
import ProductForm from '@components/warehouse/ProductForm';
import ProductFilters from '@components/warehouse/ProductFilters';
import ProductTable from '@components/warehouse/ProductTable';
import WarehouseStats from '@components/warehouse/WarehouseStats';
import Styles from '@styles/warehouse/Warehouse.module.css';

export default function Warehouse() {
  useEffect(() => {
    document.title = 'Склад';
  }, []);

  // Товары хранятся в localStorage
  const [products, setProducts] = useLocalStorage('warehouseProducts', []);

  // Состояние фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // ⭐ useMemo: фильтрация пересчитывается ТОЛЬКО при изменении зависимостей
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === '' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Добавить новый товар
  function handleAddProduct(newProduct) {
    const productWithId = {
      ...newProduct,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, productWithId]);
  }

  // Удалить товар
  function handleDeleteProduct(id) {
    setProducts(products.filter((p) => p.id !== id));
  }

  // Обновить товар (редактирование)
  function handleUpdateProduct(updatedProduct) {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
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

      <WarehouseStats products={filteredProducts} totalProducts={products.length} />

      <ProductTable
        products={filteredProducts}
        totalProducts={products.length}
        onDelete={handleDeleteProduct}
        onUpdate={handleUpdateProduct}
      />
    </div>
  );
}