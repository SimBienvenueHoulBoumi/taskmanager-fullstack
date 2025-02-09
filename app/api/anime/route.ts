import { createAnime, getAllAnimesByUser } from "@/app/services/animeService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, title, saison, episodeWatched, episodeTotal, status } =
      await req.json();

    if (
      !userId ||
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

    const anime = await createAnime(
      userId,
      title,
      saison,
      episodeWatched,
      episodeTotal,
      status
    );

    return NextResponse.json({ message: anime }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "ID de l'utilisateur requis" },
        { status: 400 }
      );
    }

    const animes = await getAllAnimesByUser(userId);

    return NextResponse.json({ animes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
