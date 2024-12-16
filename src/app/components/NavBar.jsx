"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openModal = () => {
    const modal = document.getElementById("my_modal_3");
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_3");
    if (modal) modal.close();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoading(false);
      return;
    } else if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="navbar bg-transparent p-5 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/">Beranda</Link>
            </li>
            <li>
              <Link href="/tentang-kami">Tentang Kami</Link>
            </li>
            <li>
              <Link href="/kontak">Kontak</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center px-3 py-1 -bg-primary bg-opacity-25 rounded-md">
        <Link href="/" className="text-2xl -text-tertiary font-bold">
          Last
        </Link>
        <Link href="/" className="-text-quaternary text-2xl font-bold">
          ron
        </Link>
      </div>
      <div className="navbar-end flex gap-3">
        {/* Indicator Button */}
        <button className="btn btn-ghost btn-circle" onClick={openModal}>
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
        {/* Modal */}
        <dialog id="my_modal_3" className="modal w-full">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
            <div className="w-16">
              <button className="">
                <div className="avatar">
                  <div className="w-full rounded-full">
                    <Image
                      width={100}
                      height={100}
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt="avatar"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </dialog>

        {isLoading ? (
          <div>Loading...</div>
        ) : user ? (
          <div className="flex items-center">
            <Link href="/profile" className="mr-2">
              Welcome, {user.nama}
            </Link>
            <button
              className="btn -bg-tertiary -text-primary -border-tertiary hover:-bg-background hover:-text-tertiary hover:-border-background"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              href={"/login"}
              className="btn -bg-tertiary -text-primary -border-tertiary hover:-bg-background hover:-text-tertiary hover:-border-background"
            >
              Masuk
            </Link>
            <Link
              href={"/register"}
              className="btn -bg-background -text-secondary -border-background hover:-bg-tertiary hover:-text-primary"
            >
              Daftar
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
