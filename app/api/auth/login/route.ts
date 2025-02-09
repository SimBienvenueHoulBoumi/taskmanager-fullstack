
import { NextResponse } from "next/server";
import { loginUser } from "@/app/services/userServices";

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
