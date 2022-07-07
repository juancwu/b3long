import { FC } from "react";

export interface NavBarProps {
  isLogged: boolean;
  className?: string;
  signOutCallback?: () => void;
  signInCallback?: () => void;
}

const NavBar: FC<NavBarProps> = ({
  isLogged,
  signInCallback,
  signOutCallback,
  className,
}) => {
  return (
    <nav className={`p-6 flex items-center justify-between ${className ?? ""}`}>
      <span className={`uppercase text-dark font-bold shrink-0 grow-0`}>
        B3LONG
      </span>
      <span
        className={`uppercase text-dark font-bold hidden sm:block text-xl shrink-0 grow-0`}
      >
        My Discord Communities
      </span>
      {isLogged ? (
        <button
          onClick={signOutCallback}
          className={`px-3 py-2 bg-sky-blue text-white rounded-md shrink-0 grow-0`}
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={signInCallback}
          className={`px-3 py-2 bg-sky-blue text-white rounded-md shrink-0 grow-0`}
        >
          Sign In
        </button>
      )}
    </nav>
  );
};

export default NavBar;
