import { useMemo } from "react";
import Styles from "@styles/warehouse/WarehouseStats.module.css";

function formatMoney(value) {
  return value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  });
}

export default function WarehouseStats({ products, totalProducts }) {
  const stats = useMemo(() => {
    const positions = products.length;
    const units = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
    const avgPrice = positions > 0 ? products.reduce((sum, p) => sum + p.price, 0) / positions : 0;

    return { positions, units, totalValue, avgPrice };
  }, [products]);

  const items = [
    { value: stats.positions.toLocaleString("ru-RU"), label: "Позиций" },
    { value: stats.units.toLocaleString("ru-RU"), label: "Единиц товара" },
    { value: formatMoney(stats.totalValue), label: "Сумма склада" },
    { value: formatMoney(stats.avgPrice), label: "Средняя цена" },
  ];

  // Склад полностью пуст
  if (totalProducts === 0) {
    return (
      <div className={Styles.stats}>
        <div className={Styles.emptyState}>
          <div className={Styles.emptyIcon}>📭</div>
          <div className={Styles.emptyText}>Склад пуст. Добавьте первый товар!</div>
        </div>
      </div>
    );
  }

  // Есть товары, но фильтр всё отсёк
  if (stats.positions === 0) {
    return (
      <div className={Styles.stats}>
        <div className={Styles.emptyState}>
          <div className={Styles.emptyIcon}>🔍</div>
          <div className={Styles.emptyText}>По текущим фильтрам ничего не найдено</div>
        </div>
      </div>
    );
  }

  // Всё хорошо — рендерим карточки
  return (
    <div className={Styles.stats}>
      {items.map((item) => (
        <div key={item.label} className={Styles.statCard}>
          <div className={Styles.statValue}>{item.value}</div>
          <div className={Styles.statLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
