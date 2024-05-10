const deleteProduct = async (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productEl = btn.closest("article");

  try {
    await fetch("/admin/product/" + productId, {
      method: "DELETE",
      headers: {
        "csrf-token": csrf,
      },
    });
    productEl.parentNode.removeChild(productEl);
  } catch (err) {
    console.log(err);
  }
};
