import React, { useState } from "react";

function AddUser() {
  const [form, setForm] = useState({ name: "", email: "", amount: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    console.log("Server response:", data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="amount" placeholder="Amount" onChange={handleChange} />
      <button type="submit">Add User</button>
    </form>
  );
}

export default AddUser;
