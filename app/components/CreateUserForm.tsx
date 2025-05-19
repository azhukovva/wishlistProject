"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage(`User "${data.userId}" created successfully!`);
    } else {
      const errorText = await response.text();
      setMessage(`Error: ${errorText}`);
    }
  };

  const handleAddWishlist = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`api/wishlists/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: "Nike Sneakers",
        description: "Shoes I want for summer",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessage(`Wishlist "${data.wishlist.name}" for "${data.wishlist.userId}" created successfully!`);
    } else {
      const errorText = await response.text();
      setMessage(`Error: ${errorText}`);
    }
  };

  return (
    <form className="space-y-4 bg-blue-500">
      <input
        type="text"
        placeholder="Enter user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-20 rounded"
      />
      <button onClick={handleSubmit} className="text-white px-4 py-2 rounded">
        Create User
      </button>
      <button onClick={handleAddWishlist} className="text-white px-4 py-2 rounded">
        Create WIshlist
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
