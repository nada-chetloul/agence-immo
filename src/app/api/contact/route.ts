import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      civilite,
      nom,
      prenom,
      email,
      telephone,
      typeMessage,
      message,
      disponibilites,
    } = body;

    // Validation
    if (!civilite || !nom || !prenom || !email || !typeMessage || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        civilite,
        nom,
        prenom,
        email,
        telephone: telephone || null,
        typeMessage,
        message,
        disponibilites: JSON.stringify(disponibilites || []),
      },
    });

    return NextResponse.json(
      { success: true, id: contact.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur API contact:", error);
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Erreur GET contacts:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
