export const incrementQuantity = (
  itemId,
  queryClient,
  id,
  setLocalMenuData
) => {
  queryClient.setQueryData(["menuView", id], (oldData) => {
    const updatedMenuData = { ...oldData };
    for (
      let menuItemIndex = 0;
      menuItemIndex < updatedMenuData.menuItems.length;
      menuItemIndex++
    ) {
      const itemIndex = updatedMenuData.menuItems[
        menuItemIndex
      ].items.findIndex((item) => item._id === itemId);
      if (itemIndex !== -1) {
        updatedMenuData.menuItems[menuItemIndex].items[itemIndex].quantity++;
        break;
      }
    }
    setLocalMenuData(updatedMenuData);
    return updatedMenuData;
  });

  setLocalMenuData(queryClient.getQueryData(["menuView", id]));
};

export const decrementQuantity = (
  itemId,
  queryClient,
  id,
  setLocalMenuData
) => {
  queryClient.setQueryData(["menuView", id], (oldData) => {
    const updatedMenuData = { ...oldData };
    for (
      let menuItemIndex = 0;
      menuItemIndex < updatedMenuData.menuItems.length;
      menuItemIndex++
    ) {
      const itemIndex = updatedMenuData.menuItems[
        menuItemIndex
      ].items.findIndex((item) => item._id === itemId);
      if (
        itemIndex !== -1 &&
        updatedMenuData.menuItems[menuItemIndex].items[itemIndex].quantity > 1
      ) {
        updatedMenuData.menuItems[menuItemIndex].items[itemIndex].quantity--;
        break;
      }
    }
    setLocalMenuData(updatedMenuData);
    return updatedMenuData;
  });

  setLocalMenuData(queryClient.getQueryData(["menuView", id]));
};

export const addToCart = (
  itemId,
  menuData,
  cartItems,
  setCartItems,
  callback
) => {
  const selectedItem = menuData.menuItems
    .flatMap((menuItem) => menuItem.items)
    .find((item) => item._id === itemId);
  const newCartItems = [...cartItems, selectedItem];
  setCartItems(newCartItems);
  localStorage.setItem("cartItems", JSON.stringify(newCartItems));

  if (callback) {
    callback();
  }
};
