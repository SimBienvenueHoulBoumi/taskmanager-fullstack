import {
  deleteAnime,
  getAnimeById,
  updateAnime,
} from "@/app/services/animeService";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
  try {
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
    console.error("Erreur lors de la récupération de l'anime:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function PUT({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) {
  try {
    const id = parseInt(params.id);
    const { title, saison, episodeWatched, episodeTotal, status } =
      await request.json();

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

    const updatedAnime = await updateAnime(
      id,
      title,
      saison,
      episodeWatched,
      episodeTotal,
      status
    );

    return NextResponse.json(
      { message: "Anime mis à jour avec succès", anime: updatedAnime },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'anime:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "ID de l'anime requis" },
        { status: 400 }
      );
    }

    const deletedAnime = await deleteAnime(id);

    return NextResponse.json(
      { message: "Anime supprimé avec succès", anime: deletedAnime },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'anime:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
