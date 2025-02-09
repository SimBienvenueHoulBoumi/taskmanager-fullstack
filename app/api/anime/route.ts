import { createAnime, getAllAnimesByUser } from "@/app/services/animeService";
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/services/userServices";
import { NextRequest } from "next/server"; 

/**
 * Fonction pour gérer la création d'un anime pour un utilisateur authentifié.
 *
 * Cette fonction est appelée lorsqu'une requête POST est effectuée pour créer un nouvel anime.
 * Elle vérifie d'abord si un token JWT est présent et valide. Ensuite, elle traite les données 
 * envoyées dans la requête pour créer un anime dans la base de données.
 * En cas de succès, un message de confirmation est renvoyé avec le statut 201. 
 * Si le token est manquant, malformé ou expiré, des erreurs spécifiques sont retournées.
 *
 * @param {NextRequest} req - La requête HTTP contenant les informations de l'anime à créer.
 * @returns {NextResponse} - La réponse avec le résultat de la création ou des erreurs.
 */
export async function POST(req: NextRequest) {
  try {
    // Récupérer le token JWT depuis les cookies
    const token = req.cookies.get("token")?.value;

    // Vérification si le token est présent
    if (!token) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // Vérification de la validité du token
    const userId = await verifyToken(token);

    // Récupérer les données de l'anime depuis la requête JSON
    const { title, saison, episodeWatched, episodeTotal, status } =
      await req.json();

    // Vérification de la présence de tous les champs nécessaires
    if (
      !title ||
      !saison ||
      episodeWatched === undefined ||
      episodeTotal === undefined ||
      status === undefined
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Créer l'anime dans la base de données
    const anime = await createAnime(
      userId,
      title,
      saison,
      episodeWatched,
      episodeTotal,
      status
    );

    // Retourner une réponse avec le message de succès
    return NextResponse.json({ message: anime }, { status: 201 });
  } catch (error) {
    // Gestion des erreurs spécifiques liées au token
    if (error instanceof Error && error.message === "Token malformé") {
      return NextResponse.json(
        { error: "Token malformé. Veuillez vous reconnecter." },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Token expiré") {
      return NextResponse.json(
        { error: "Token expiré. Veuillez vous reconnecter." },
        { status: 401 }
      );
    }

    // Gestion d'autres erreurs inconnues
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Fonction pour récupérer tous les animes d'un utilisateur authentifié.
 *
 * Cette fonction est appelée lors d'une requête GET pour récupérer tous les animes associés 
 * à un utilisateur. Elle vérifie d'abord la présence et la validité du token JWT avant 
 * d'interroger la base de données pour récupérer les animes de l'utilisateur authentifié.
 * Si le token est invalide ou manquant, une erreur appropriée est retournée.
 *
 * @param {NextRequest} req - La requête HTTP pour récupérer les animes de l'utilisateur.
 * @returns {NextResponse} - La réponse contenant la liste des animes ou une erreur.
 */
export async function GET(req: NextRequest) {
  try {
    // Récupérer le token JWT depuis les cookies
    const token = req.cookies.get("token")?.value;

    // Vérification si le token est présent
    if (!token) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // Vérification de la validité du token
    const userIdFromToken = await verifyToken(token); 

    // Récupérer les animes associés à l'utilisateur
    const animes = await getAllAnimesByUser(Number(userIdFromToken));

    // Retourner la liste des animes
    return NextResponse.json({ animes }, { status: 200 });
  } catch (error) {
    console.error("Erreur API:", error);

    // Gestion des erreurs spécifiques liées au token
    if (error instanceof Error && error.message === "Token malformé") {
      return NextResponse.json(
        { error: "Token malformé. Veuillez vous reconnecter." },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Token expiré") {
      return NextResponse.json(
        { error: "Token expiré. Veuillez vous reconnecter." },
        { status: 401 }
      );
    }

    // Gestion d'autres erreurs inconnues
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
