"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";

type Civilite = "Mme" | "M";
type TypeMessage = "visite" | "rappel" | "photos";

interface Disponibilite {
  id: string;
  jour: string;
  heure: number;
  minute: number;
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const HEURES = Array.from({ length: 17 }, (_, i) => i + 7); // 7h à 23h
const MINUTES = [0, 15, 30, 45];

export default function ContactForm() {
  const [civilite, setCivilite] = useState<Civilite | "">("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [typeMessage, setTypeMessage] = useState<TypeMessage | "">("");
  const [message, setMessage] = useState("");
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);

  const [selectedJour, setSelectedJour] = useState("Lundi");
  const [selectedHeure, setSelectedHeure] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const addDisponibilite = () => {
    const newDispo: Disponibilite = {
      id: crypto.randomUUID(),
      jour: selectedJour,
      heure: selectedHeure,
      minute: selectedMinute,
    };
    setDisponibilites((prev) => [...prev, newDispo]);
  };

  const removeDisponibilite = (id: string) => {
    setDisponibilites((prev) => prev.filter((d) => d.id !== id));
  };

  const formatDispo = (d: Disponibilite) =>
    `${d.jour} à ${d.heure}h${d.minute.toString().padStart(2, "0")}`;

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!civilite || !nom || !prenom || !email || !typeMessage || !message) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          civilite,
          nom,
          prenom,
          email,
          telephone,
          typeMessage,
          message,
          disponibilites: disponibilites.map(({ jour, heure, minute }) => ({
            jour,
            heure,
            minute,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erreur lors de l'envoi.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Impossible de contacter le serveur.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h2>Message envoyé !</h2>
        <p>Nous vous recontacterons dans les meilleurs délais.</p>
        <button
          className={styles.btnGold}
          onClick={() => {
            setStatus("idle");
            setCivilite("");
            setNom("");
            setPrenom("");
            setEmail("");
            setTelephone("");
            setTypeMessage("");
            setMessage("");
            setDisponibilites([]);
          }}
        >
          Nouveau message
        </button>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {/* Background image overlay */}
      <div className={styles.bgImage} />

      <div className={styles.content}>
        <h1 className={styles.title}>CONTACTEZ L'AGENCE</h1>

        <div className={styles.columns}>
          {/* LEFT COLUMN */}
          <div className={styles.left}>
            <h2 className={styles.sectionLabel}>VOS COORDONNÉES</h2>

            {/* Civilité */}
            <div className={styles.radioGroup}>
              {(["Mme", "M"] as Civilite[]).map((c) => (
                <label key={c} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civilite"
                    value={c}
                    checked={civilite === c}
                    onChange={() => setCivilite(c)}
                    className={styles.radio}
                  />
                  <span className={styles.radioText}>{c}</span>
                </label>
              ))}
            </div>

            {/* Nom / Prénom */}
            <div className={styles.row}>
              <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className={styles.input}
              />
            </div>

            <input
              type="email"
              placeholder="Adresse mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputFull}
            />

            <input
              type="tel"
              placeholder="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className={styles.inputFull}
            />

            {/* Disponibilités */}
            <h2 className={styles.sectionLabel} style={{ marginTop: "20px" }}>
              DISPONIBILITÉS POUR UNE VISITE
            </h2>

            <div className={styles.dispoRow}>
              <select
                value={selectedJour}
                onChange={(e) => setSelectedJour(e.target.value)}
                className={styles.select}
              >
                {JOURS.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>

              <select
                value={selectedHeure}
                onChange={(e) => setSelectedHeure(Number(e.target.value))}
                className={styles.selectSmall}
              >
                {HEURES.map((h) => (
                  <option key={h} value={h}>{h}h</option>
                ))}
              </select>

              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(Number(e.target.value))}
                className={styles.selectSmall}
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>{m}m</option>
                ))}
              </select>

              <button
                type="button"
                onClick={addDisponibilite}
                className={styles.btnPurple}
              >
                AJOUTER<br />DISPO
              </button>
            </div>

            {/* Tags disponibilités */}
            <div className={styles.dispoTags}>
              {disponibilites.map((d) => (
                <span key={d.id} className={styles.tag}>
                  {formatDispo(d)}
                  <button
                    type="button"
                    onClick={() => removeDisponibilite(d.id)}
                    className={styles.tagRemove}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.right}>
            <h2 className={styles.sectionLabel}>VOTRE MESSAGE</h2>

            {/* Type de message */}
            <div className={styles.radioGroup}>
              {([
                { value: "visite", label: "Demande de visite" },
                { value: "rappel", label: "Être rappelé·e" },
                { value: "photos", label: "Plus de photos" },
              ] as { value: TypeMessage; label: string }[]).map((opt) => (
                <label key={opt.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="typeMessage"
                    value={opt.value}
                    checked={typeMessage === opt.value}
                    onChange={() => setTypeMessage(opt.value)}
                    className={styles.radio}
                  />
                  <span className={styles.radioText}>{opt.label}</span>
                </label>
              ))}
            </div>

            <textarea
              placeholder="Votre message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Error */}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        {/* Submit */}
        <div className={styles.submitRow}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className={styles.btnGold}
          >
            {status === "loading" ? "ENVOI EN COURS..." : "ENVOYER"}
          </button>
        </div>
      </div>
    </div>
  );
}
