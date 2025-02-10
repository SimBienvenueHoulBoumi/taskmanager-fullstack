"use client";

import Link from "next/link";
import { JSX, useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiHome, FiInfo, FiPhone, FiLogOut } from "react-icons/fi";

import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

/**
 * Composant Sidebar représentant la barre latérale de navigation du tableau de bord.
 * Ce composant gère l'affichage des liens de navigation et un bouton de déconnexion.
 * Il permet également de basculer l'état du menu latéral et de le fermer lorsqu'on clique en dehors.
 *
 * @component
 * @returns {JSX.Element} Élément JSX représentant la barre latérale avec les éléments de navigation et de déconnexion.
 */
export default function Sidebar(): JSX.Element {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // État indiquant si le menu est ouvert ou fermé
  const pathname = usePathname(); // Récupère le chemin de l'URL pour gérer l'état actif des liens

  // Référence pour la sidebar, utilisée pour détecter les clics en dehors de celle-ci
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  /**
   * Fonction pour basculer l'état du menu latéral (ouvert/fermé).
   */
  const toggleMenu = (): void => setMenuOpen(!menuOpen);

  /**
   * Gère la déconnexion de l'utilisateur.
   * Remplacer par la logique réelle de déconnexion.
   */
  const handleLogout = (): void => {
    deleteCookie("token");
    router.refresh();
  };

  /**
   * Liste des liens de navigation du tableau de bord. Chaque lien inclut un chemin (`href`), une icône (`icon`) et un label (`label`).
   */
  const links: { href: string; icon: JSX.Element; label: string }[] = [
    { href: "/dashboard/home", icon: <FiHome size={15} />, label: "Home" },
    { href: "/dashboard/about", icon: <FiInfo size={15} />, label: "About" },
    {
      href: "/dashboard/contact",
      icon: <FiPhone size={15} />,
      label: "Contact",
    },
  ];

  /**
   * Effet qui gère la fermeture de la sidebar lorsqu'un clic est effectué en dehors de celle-ci.
   * Utilise l'événement `mousedown` pour vérifier si l'utilisateur clique à l'extérieur de la sidebar.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false); // Ferme la sidebar si l'utilisateur clique à l'extérieur
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Ajoute l'événement de clic

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Nettoie l'événement lorsqu'on démonte le composant
    };
  }, []);

  return (
    <div
      ref={sidebarRef} // Attache la référence à la sidebar pour la gestion des clics en dehors
      className={`h-full bg-blue-200 transition-all duration-200 ease-in-out shadow-lg flex flex-col justify-between z-50 ${
        menuOpen ? "w-64 bg-opacity-100" : "w-16 bg-opacity-75"
      }`}
    >
      <div>
        <div>
          {/* Bouton Menu pour ouvrir ou fermer la sidebar */}
          <div className="w-full flex justify-start py-4 bg-blue-400">
            {menuOpen ? (
              <div className="pl-5">
                <FiX
                  size={17}
                  onClick={toggleMenu} // Permet de fermer le menu
                  className="cursor-pointer text-white"
                />
              </div>
            ) : (
              <div className="pl-6">
                <FiMenu
                  size={17}
                  onClick={toggleMenu} // Permet d'ouvrir le menu
                  className="cursor-pointer text-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="flex flex-col items-start space-y-2 mt-4 w-full px-2">
          {links.map((link, index) => {
            const isActive: boolean = pathname === link.href; // Vérifie si le lien est actif (correspond au chemin actuel)
            return (
              <Link
                key={index}
                href={link.href}
                className={`flex items-center ${
                  menuOpen
                    ? "justify-start px-1 py-1 rounded-md"
                    : "justify-center p-2 rounded-full"
                } w-full transition-all ${
                  isActive
                    ? "bg-white text-blue-500 shadow-md rounded-full"
                    : "text-white hover:text-gray-200"
                }`}
              >
                <div
                  className={`p-2 rounded-full shadow-md ${
                    isActive ? "bg-blue-500 text-white" : "bg-gray-400"
                  }`}
                >
                  {link.icon} {/* Affiche l'icône associée au lien */}
                </div>
                {menuOpen && <span className="text-sm ml-3">{link.label}</span>}{" "}
                {/* Affiche le texte du lien si le menu est ouvert */}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bouton Déconnexion */}
      <div className="mb-4">
        <button
          onClick={handleLogout} // Appelle la fonction de déconnexion
          className={`flex items-center ${
            menuOpen
              ? "justify-start px-3 py-2 rounded-md"
              : "justify-center p-2 rounded-full"
          } w-full transition-all text-white`}
        >
          <div className="p-1.5 rounded-full shadow-md bg-red-400">
            <FiLogOut size={17} />
          </div>
          {menuOpen && (
            <span className="text-sm ml-3 hover:text-gray-400">
              Déconnexion
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
