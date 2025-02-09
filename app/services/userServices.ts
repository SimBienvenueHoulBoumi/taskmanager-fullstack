import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret";

/**
 * Inscription d'un utilisateur avec retour d'un token JWT
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    if (await isUserExist(email, username)) {
      throw new Error("Cet email ou ce nom d'utilisateur est déjà utilisé");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword, email },
    });

    // Génération du token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "24h",
    });

    return { message: "Utilisateur créé avec succès", token };
  } catch (error) {
    throw new Error("Erreur interne du serveur");
  }
}

/**
 * Connexion d'un utilisateur avec retour d'un token JWT
 */
export async function loginUser(email: string, password: string) {
  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Mot de passe incorrect");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return { message: "Connexion réussie", token };
  } catch (error) {
    throw new Error("Erreur interne du serveur");
  }
}

/**
 * Vérifier l'existence d'un utilisateur par email ou nom d'utilisateur
 */
export async function isUserExist(email: string, username: string) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    return existingUser !== null;
  } catch (error) {
    throw new Error("Erreur interne du serveur");
  }
}
