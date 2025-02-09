import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "secret_key"
);

/**
 * Middleware de vérification du token JWT pour protéger certaines routes.
 *
 * Cette fonction est exécutée avant d'atteindre la route ciblée pour vérifier
 * la présence et la validité d'un token JWT dans les cookies de la requête.
 * Si le token est manquant ou invalide, l'accès est refusé (erreur 401).
 * Si la vérification est réussie, la requête est autorisée à passer.
 *
 * @param {NextRequest} request - La requête entrante qui est vérifiée.
 * @returns {NextResponse} - La réponse appropriée en fonction de la validation du token.
 *   - Si le token est valide, la requête continue avec `NextResponse.next()`.
 *   - Si le token est invalide ou manquant, une réponse 401 (Unauthorized) est retournée.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Si le token est manquant, on renvoie une réponse 401 ou une redirection
  if (!token) {
    return request.nextUrl.pathname.startsWith("/api")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Vérification du token avec `jose`
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Si le payload est valide, autoriser la requête à passer
    if (payload) {
      return NextResponse.next();
    }
  } catch (error) {
    // Si une erreur survient (par exemple token invalide), on renvoie une erreur 401
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }

  // Si aucune erreur n'est trouvée, la requête continue normalement
  return NextResponse.next();
}

/**
 * Configuration du middleware.
 *
 * Ce middleware s'applique uniquement aux routes spécifiées dans `matcher`,
 * ici les routes `/api/anime` et `/dashboard`. Toutes les autres routes
 * ne seront pas affectées par ce middleware.
 */
export const config = {
  matcher: ["/api/anime/:path*", "/dashboard/:path*"],
};
