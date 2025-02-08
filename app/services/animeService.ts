import prisma from "@/app/lib/prisma";

// 📌 Créer un anime
export async function createAnime(
  userId: number,
  title: string,
  saison: number,
  episodeWatched: number,
  episodeTotal: number,
  status: boolean
) {
  try {
    const newAnime = await prisma.anime.create({
      data: {
        userId,
        title,
        saison,
        episodeWatched,
        episodeTotal,
        status,
      },
    });
    return newAnime;
  } catch (error) {
    throw new Error("Erreur lors de la création de l'anime");
  }
}

// 📌 Récupérer un anime par ID
export async function getAnimeById(id: number) {
  try {
    const anime = await prisma.anime.findUnique({
      where: { id },
      include: {
        user: true, // Inclure les informations de l'utilisateur associé
      },
    });

    if (!anime) {
      throw new Error("Anime non trouvé");
    }

    return anime;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'anime");
  }
}

// 📌 Récupérer tous les animes d'un utilisateur
export async function getAllAnimesByUser(userId: number) {
  try {
    const animes = await prisma.anime.findMany({
      where: { userId },
    });
    return animes;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des animes");
  }
}

// 📌 Mettre à jour un anime
export async function updateAnime(
  id: number,
  title: string,
  saison: number,
  episodeWatched: number,
  episodeTotal: number,
  status: boolean
) {
  try {
    const updatedAnime = await prisma.anime.update({
      where: { id },
      data: {
        title,
        saison,
        episodeWatched,
        episodeTotal,
        status,
      },
    });

    return updatedAnime;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour de l'anime");
  }
}

// 📌 Supprimer un anime
export async function deleteAnime(id: number) {
  try {
    const deletedAnime = await prisma.anime.delete({
      where: { id },
    });

    return deletedAnime;
  } catch (error) {
    throw new Error("Erreur lors de la suppression de l'anime");
  }
}
