fetch("http://localhost:8080/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    firstName: "Ned",
    lastName: "Stark",
    email: "sean_bean@gameofthron.es",
    password: "Password123!"
  })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
