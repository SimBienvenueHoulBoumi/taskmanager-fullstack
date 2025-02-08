import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";

/**
 * Inscription d'un utilisateur
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  // Vérification de l'email unique
  const existingUser = await prisma.user.findFirst({
    where: { email, username },
  });

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé");
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création de l'utilisateur
  prisma.user.create({
    data: { username, password: hashedPassword, email },
  });

  return { message: "Utilisateur créé avec succès" };
}

/**
 * Connexion d'un utilisateur
 */
export async function loginUser(email: string, password: string) {
  // Recherche de l'utilisateur par email
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  // Vérification du mot de passe
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Mot de passe incorrect");
  }

  return { message: "Connexion réussie" };
}
