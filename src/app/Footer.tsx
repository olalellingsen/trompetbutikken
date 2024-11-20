import React from "react";

function Footer() {
  return (
    <footer className="py-4">
      <div className="flex justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Trompetbutikken AS
        </p>
      </div>
    </footer>
  );
}

export default Footer;
