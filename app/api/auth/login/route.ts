import { NextResponse } from "next/server";
import { loginUser } from "@/app/services/userServices";

/**
 * Fonction pour gérer la connexion de l'utilisateur.
 *
 * Cette fonction est appelée lors d'une requête POST pour connecter un utilisateur. Elle récupère l'email et
 * le mot de passe dans le corps de la requête. Si l'un des champs est manquant, une erreur est renvoyée.
 * Si les informations sont valides, elle tente de connecter l'utilisateur via un service externe.
 * En cas de succès, une réponse avec les informations de l'utilisateur connecté est retournée.
 * En cas d'erreur, un message d'erreur approprié est retourné (email déjà utilisé ou erreur interne du serveur).
 *
 * @param {Request} req - La requête HTTP contenant les données de l'utilisateur (email, mot de passe).
 * @returns {NextResponse} - La réponse contenant le résultat de la tentative de connexion ou une erreur.
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!password || !email) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Inscription de l'utilisateur via le service
    const result = await loginUser(email, password);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {

    if (error instanceof Error && error.message === "Cet email est déjà utilisé") {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
