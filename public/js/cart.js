const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("product-id");
      const quanity = input.value;

      window.location.href = `/cart/update/${productId}/${quanity}`;
    });
  });
}
