export function debounce(func, delay) {
  let timeOut;
  return (...args) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function toggleForm() {
  const form = document.getElementById("formContainer");
  const btn = document.getElementById("openFormBtn");
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "block";
    btn.style.display = "none";
  } else {
    form.style.display = "none";
    btn.style.display = "block";
  }
}
