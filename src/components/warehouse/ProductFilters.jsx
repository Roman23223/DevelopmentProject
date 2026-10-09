import Styles from "@styles/warehouse/ProductFilters.module.css";

const CATEGORIES = ["Электроника", "Одежда", "Продукты", "Инструменты", "Другое"];

export default function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) {
  function handleClearFilters() {
    onSearchChange("");
    onCategoryChange("");
  }

  const hasFilters = searchQuery !== "" || selectedCategory !== "";

  return (
    <div className={Styles.filters}>
      <div className={Styles.field}>
        <label className={Styles.label}>Поиск</label>
        <input
          className={Styles.input}
          type="text"
          placeholder="Введите название товара..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={Styles.field}>
        <label className={Styles.label}>Категория</label>
        <select
          className={Styles.select}
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Все категории</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button type="button" className={Styles.clearButton} onClick={handleClearFilters}>
          ✕ Сбросить фильтры
        </button>
      )}
    </div>
  );
}
