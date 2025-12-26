const handleSubmit = async (e) => {
  e.preventDefault();

  const t = toast.loading("Creating order...");
  try {
    // 🔴 UPDATED: email parameter नाही
    const order = await createOrderFromGalleryApi(code, selectedIds);

    toast.dismiss(t);
    toastSuccess("Order created!");

    navigate(`/download/${order.downloadToken}`, {
      state: { orderId: order.orderId },
    });
  } catch {
    toast.dismiss(t);
    toastError("Order failed");
  }
};