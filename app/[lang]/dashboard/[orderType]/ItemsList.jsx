const ItemsList = ({ displayedItems, handleItemClick, language }) => {
  const columnCount = 4; // عدد الأعمدة (ممكن نعملها responsive بعدين)
  const rowCount = Math.ceil(displayedItems.length / columnCount);

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={250}   // عرض الكارت (px)
      rowCount={rowCount}
      rowHeight={300}     // ارتفاع الكارت (px)
      height={800}        // ارتفاع منطقة العرض (px)
      width={1000}        // عرض الشبكة الكاملة (px)
    >
      {({ columnIndex, rowIndex, style }) => {
        const itemIndex = rowIndex * columnCount + columnIndex;
        const item = displayedItems[itemIndex];
        if (!item) return null;

        return (
          <CardItem
            key={item.id}
            item={item}
            style={style}
            handleItemClick={handleItemClick}
            language={language}
          />
        );
      }}
    </Grid>
  );
};

export default ItemsList;