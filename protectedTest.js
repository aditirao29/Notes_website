const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODk4ZDE3MGFkMTQ1MDVkMzA2OWI1MjciLCJpYXQiOjE3NTQ4NDU2MzcsImV4cCI6MTc1NTQ1MDQzN30.PxtMxqo-JYGb1WVidQ8hFP9uPaQ-0wSUC77qbAwyy0s";

fetch("http://localhost:8080/api/protected", {
  method: "GET",
  headers: {
    "x-auth-token": token
  }
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
