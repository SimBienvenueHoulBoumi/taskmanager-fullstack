import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "secret_key"
);

/**
 * Générer un token JWT avec `jose`
 */
async function generateToken(userId: string, email: string) {
  return await new SignJWT({ id: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(SECRET_KEY);
}

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

    // Génération du token avec `jose`
    const token = await generateToken(user.id.toString(), user.email);

    return { message: "Utilisateur créé avec succès", token };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { error: error.message };
    }
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

    // Génération du token avec `jose`
    const token = await generateToken(user.id.toString(), user.email);

    return { message: "Connexion réussie", token };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    throw new Error(`erreur interne : ${error instanceof Error ? error.message : 'Inconnu'}`);
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
    throw new Error(`erreur interne : ${error instanceof Error ? error.message : 'Inconnu'}`);
  }
}

/**
 * Vérifier un token JWT
 */
export async function verifyToken(token: string) {
  try {
    // Décodage et vérification du token
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });

    // Vérification de la validité du token (expiration)
    const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
    if (payload.exp && payload.exp < currentTime) {
      throw new Error("Token expiré");
    }

    // Vérification de la présence de l'ID utilisateur dans le payload
    if (!payload.id) {
      throw new Error("Token malformé : ID utilisateur absent");
    }

    // Retourne l'ID utilisateur extrait du token
    return Number(payload.id);
  } catch (error) {
    // Gestion des erreurs détaillées
    if (error instanceof Error) {
      if (error.message === "Token expired") {
        throw new Error("Token expiré");
      }
      if (error.message.includes("malformé")) {
        throw new Error(`Token malformé : ${error instanceof Error ? error.message : 'Inconnu'}`);
      }
    }

    // Erreur de décodage générale
    throw new Error(`Token invalide : ${error instanceof Error ? error.message : 'Inconnu'}`);
  }
}
