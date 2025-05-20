"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [userId, setUserId] = useState("");
  const [wishlistId, setWishlistId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const text = await response.text();
    setMessage(response.ok ? `User "${userId}" created!` : `Error: ${text}`);
  };

  const handleAddWishlist = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`/api/wishlists/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Nike Sneakers",
        description: "Shoes I want for summer",
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setWishlistId(data.wishlist.id); // save wishlist's ID 
      setMessage(`Wishlist "${data.wishlist.name}" created!`);
    } else {
      setMessage(`Error: ${data}`);
    }
  };

  const handleAddProductToApp = async () => {
    const response = await fetch(`/api/products/mbpro2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "MacBook Pro M2",
        description: "This too!",
        price: 999,
      }),
    });

    const text = await response.text();
    setMessage(response.ok ? "Product added to app!" : `Error: ${text}`);
  };

  const handleAddProductToWishlist = async () => {
    const response = await fetch(
      `/api/wishlists/${userId}/${wishlistId}/products/abc123`,
      { method: "POST" }
    );

    const text = await response.text();
    setMessage(response.ok ? "Product added to wishlist!" : `Error: ${text}`);
  };

  const handleDeleteProductFromApp = async () => {
    const response = await fetch(`/api/products/abc123`, {
      method: "DELETE",
    });

    const text = await response.text();
    setMessage(response.ok ? "Product deleted from app!" : `Error: ${text}`);
  };

  const handleDeleteProductFromWishlist = async () => {
    const response = await fetch(
      `/api/wishlists/${userId}/${wishlistId}/products/abc123`,
      { method: "DELETE" }
    );

    const text = await response.text();
    setMessage(
      response.ok ? "Product removed from wishlist!" : `Error: ${text}`
    );
  };

  return (
    <form className="space-y-4 bg-blue-500 p-4 rounded text-white">
      <input
        type="text"
        placeholder="Enter user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border p-2 rounded text-black"
      />
      <input
        type="text"
        placeholder="Enter wishlist ID (optional)"
        value={wishlistId}
        onChange={(e) => setWishlistId(e.target.value)}
        className="border p-2 rounded text-black"
      />

      <button onClick={handleSubmit} className="bg-green-600 px-4 py-2 rounded">
        Create User
      </button>
      <button
        onClick={handleAddWishlist}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Create Wishlist
      </button>
      <button
        onClick={handleAddProductToApp}
        className="bg-yellow-600 px-4 py-2 rounded"
      >
        Add Product to App
      </button>
      <button
        onClick={handleAddProductToWishlist}
        className="bg-yellow-600 px-4 py-2 rounded"
      >
        Add Product to Wishlist
      </button>
      <button
        onClick={handleDeleteProductFromApp}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Delete Product from App
      </button>
      <button
        onClick={handleDeleteProductFromWishlist}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Remove Product from Wishlist
      </button>

      {message && <p className="mt-4">{message}</p>}
    </form>
  );
}
