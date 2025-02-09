import {
  deleteAnime,
  getAnimeById,
  updateAnime,
} from "@/app/services/animeService";
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/services/userServices";
import { NextRequest } from "next/server";

/**
 * Fonction pour récupérer un anime par son ID.
 *
 * Cette fonction est appelée lors d'une requête GET pour récupérer un anime spécifique.
 * Elle vérifie d'abord la validité du token JWT, puis elle tente de récupérer l'anime en
 * fonction de son ID passé dans les paramètres de la requête.
 * Si l'ID est invalide ou manquant, une erreur est renvoyée.
 * En cas de succès, l'anime trouvé est retourné dans la réponse.
 *
 * @param {Object} param0 - Contient les paramètres et la requête de la requête HTTP.
 * @param {Object} param0.params - Les paramètres de la requête contenant l'ID de l'anime.
 * @param {NextRequest} param0.request - La requête HTTP.
 * @returns {NextResponse} - La réponse contenant l'anime ou une erreur.
 */
export async function GET({
  params,
  request,
}: {
  params: { id: string };
  request: NextRequest;
}) {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Vérification du token
    const payload = await verifyToken(token);
    const id = parseInt(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "ID de l'anime requis" },
        { status: 400 }
      );
    }

    const anime = await getAnimeById(id);

    return NextResponse.json({ anime }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Fonction pour mettre à jour un anime par son ID.
 *
 * Cette fonction est appelée lors d'une requête PUT pour mettre à jour un anime spécifique.
 * Elle vérifie d'abord la validité du token JWT, puis elle tente de mettre à jour l'anime
 * en fonction de l'ID passé dans les paramètres de la requête et des données envoyées dans le corps de la requête.
 * Si l'ID ou certains champs sont manquants, une erreur est renvoyée.
 * En cas de succès, un message de confirmation est retourné.
 *
 * @param {Object} param0 - Contient les paramètres et la requête de la requête HTTP.
 * @param {Object} param0.params - Les paramètres de la requête contenant l'ID de l'anime.
 * @param {NextRequest} param0.request - La requête HTTP contenant les nouvelles données de l'anime.
 * @returns {NextResponse} - La réponse contenant un message de succès ou une erreur.
 */
export async function PUT({
  params,
  request,
}: {
  params: { id: string };
  request: NextRequest; // Utiliser NextRequest
}) {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Vérification du token
    const payload = await verifyToken(token);
    const id = parseInt(params.id);
    const { title, saison, episodeWatched, episodeTotal, status } =
      await request.json();

    // Vérification de la présence de tous les champs nécessaires
    if (
      !id ||
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

    // Mettre à jour l'anime dans la base de données
    const updatedAnime = await updateAnime(
      id,
      title,
      saison,
      episodeWatched,
      episodeTotal,
      status
    );

    // Retourner un message de confirmation
    return NextResponse.json({ message: `${updatedAnime}` }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * Fonction pour supprimer un anime par son ID.
 *
 * Cette fonction est appelée lors d'une requête DELETE pour supprimer un anime spécifique.
 * Elle vérifie d'abord la validité du token JWT, puis elle tente de supprimer l'anime en
 * fonction de son ID passé dans les paramètres de la requête.
 * Si l'ID est invalide ou manquant, une erreur est renvoyée.
 * En cas de succès, un message de confirmation est retourné.
 *
 * @param {Object} param0 - Contient les paramètres et la requête de la requête HTTP.
 * @param {Object} param0.params - Les paramètres de la requête contenant l'ID de l'anime.
 * @param {NextRequest} param0.request - La requête HTTP.
 * @returns {NextResponse} - La réponse contenant un message de confirmation ou une erreur.
 */
export async function DELETE({
  params,
  request,
}: {
  params: { id: string };
  request: NextRequest;
}) {
  try {
    // Récupérer le token depuis les cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Vérification du token
    const payload = await verifyToken(token);
    const id = parseInt(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "ID de l'anime requis" },
        { status: 400 }
      );
    }

    // Supprimer l'anime de la base de données
    const deletedAnime = await deleteAnime(id);

    // Retourner un message de confirmation
    return NextResponse.json({ message: deletedAnime }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
