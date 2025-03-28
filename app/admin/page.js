"use client";

const AdminPage = () => {
  const reset = async () => {
    await fetch("/api/reset", {
      method: "POST",
    });
    alert("Reset complete!");
  };

  return <button onClick={reset}>Reset</button>;
};

export default AdminPage;
