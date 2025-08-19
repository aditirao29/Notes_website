fetch("http://localhost:8080/api/auth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "mark_addy@gameofthron.es",
    password: "Password123!"
  })
})
.then(res => res.json())
.then(data => {
  console.log("Login response:", data);

  if (data.data) {
    console.log("\nJWT Token:", data.data);
  }
})
.catch(console.error);
