import { useState, useEffect } from "react";

const STORAGE_KEY = "briefgen_subscribed_v5";
const PAYPAL_PLAN_ID = "P-0L485261T33273038NHWKF6Y";
const PAYPAL_CLIENT_ID = "ATLqqstarq-l-QBFlBsTpllSUKw48UA4_Y09qO7Nvwh5wioh9zIRIzfrctBJiUfhiHvCqsgWGkgCHjYA";
const CONTACT_EMAIL = "digitaldaydreams77@gmail.com";
const GEMINI_API_KEY = "AIzaSyCLoTmYeZD2CuxTk-hmVnS8Plille2qmwU";

const projectTypes = [
  { label: "Logo & identité", icon: "◈" },
  { label: "Site web", icon: "⬡" },
  { label: "Campagne pub", icon: "◎" },
  { label: "Packaging", icon: "▣" },
  { label: "App mobile", icon: "◐" },
  { label: "Réseaux sociaux", icon: "◉" },
  { label: "Motion design", icon: "◌" },
  { label: "Direction artistique", icon: "◆" },
];

const tones = [
  "Luxe & premium", "Minimaliste", "Audacieux", "Chaleureux",
  "Tech & futuriste", "Organique", "Vintage", "Énergique",
];

const sectors = [
  "Mode & beauté", "Tech & SaaS", "Food & lifestyle", "Santé",
  "Finance", "Immobilier", "Sport", "Art & culture",
];

const USE_CASES = [
  { icon: "🎨", who: "Tu es créatif·ve", what: "Aligne ton client dès le départ. Plus d'allers-retours inutiles." },
  { icon: "🏢", who: "Tu lances un projet", what: "Envoie le brief à ton agence ou freelance. Ils sauront exactement quoi faire." },
  { icon: "💼", who: "Tu gères une équipe", what: "Partage-le en réunion pour que tout le monde parte dans la même direction." },
];

const REVIEWS = [
  { name: "Julie M.", role: "Directrice artistique", text: "Ça m'a économisé 2h de réunion de cadrage. Je l'utilise maintenant pour chaque nouveau client.", stars: 5 },
  { name: "Thomas R.", role: "Fondateur de startup", text: "Enfin un outil qui génère un vrai brief professionnel. Mon agence a été impressionnée.", stars: 5 },
  { name: "Sarah K.", role: "Freelance design", text: "Je l'envoie à tous mes clients avant de commencer. Les projets se passent tellement mieux.", stars: 5 },
];

// ── PayPal Button ─────────────────────────────────────────────────────────────
function PayPalButton({ onSuccess }) {
  useEffect(() => {
    const existingScript = document.getElementById("paypal-sdk");
    if (existingScript) {
      existingScript.remove();
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.setAttribute("data-sdk-integration-source", "button-factory");
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          style: { shape: "pill", color: "blue", layout: "vertical", label: "subscribe" },
          createSubscription: (data, actions) => actions.subscription.create({ plan_id: PAYPAL_PLAN_ID }),
          onApprove: (data) => onSuccess(data.subscriptionID),
          onError: () => alert("Une erreur est survenue. Réessaie."),
        }).render("#paypal-button-container");
      }
    };
    document.body.appendChild(script);
    return () => {
      const s = document.getElementById("paypal-sdk");
      if (s) s.remove();
    };
  }, [onSuccess]);

  return <div id="paypal-button-container" style={{ marginBottom: "0.7rem" }} />;
}

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ label, icon, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: "0.3rem",
      padding: "0.55rem 1rem",
      border: `1.5px solid ${selected ? "#2D6EF5" : "#E8E8E8"}`,
      borderRadius: "100px",
      background: selected ? "#EEF3FF" : "#fff",
      color: selected ? "#2D6EF5" : "#888",
      fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
      fontWeight: selected ? 600 : 400,
      cursor: "pointer", transition: "all 0.15s",
      whiteSpace: "nowrap",
    }}>
      {icon && <span style={{ fontSize: "0.65rem", opacity: 0.6 }}>{icon}</span>}
      {label}
    </button>
  );
}

// ── Paywall ───────────────────────────────────────────────────────────────────
function Paywall({ onClose, onSubscribed }) {
  const [success, setSuccess] = useState(false);

  const handleSuccess = (subscriptionID) => {
    localStorage.setItem(STORAGE_KEY, "true");
    setSuccess(true);
    setTimeout(() => { onSubscribed(); }, 2500);
  };

  if (success) return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(20,30,60,0.65)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px", background: "#fff",
        borderRadius: "24px", padding: "2.5rem 1.8rem", textAlign: "center",
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#111", marginBottom: "0.5rem" }}>
          Bienvenue dans Pro !
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#777", lineHeight: 1.6 }}>
          Ton abonnement est actif. Tu as maintenant accès à tous tes briefs complets, illimités.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(20,30,60,0.65)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", overflowY: "auto",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px", background: "#fff",
        borderRadius: "24px", padding: "2.2rem 1.8rem", textAlign: "center",
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)", margin: "auto",
      }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#EEF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", margin: "0 auto 1.2rem" }}>🔓</div>

        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.45rem", color: "#111", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Ton brief est prêt !
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#777", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Débloque le brief complet (7 sections)<br />avec un abonnement Pro.
        </p>

        <div style={{ background: "#F7F8FA", borderRadius: "16px", padding: "1.4rem", marginBottom: "1.5rem", textAlign: "left" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2.2rem", color: "#111", lineHeight: 1, marginBottom: "0.2rem" }}>
            19,90€<span style={{ fontSize: "0.95rem", color: "#aaa", fontWeight: 400 }}>/mois</span>
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#bbb", marginBottom: "1rem" }}>
            Sans engagement · Annule quand tu veux
          </div>
          {["Briefs illimités & complets", "7 sections détaillées", "Copie en 1 clic", "Support prioritaire"].map(f => (
            <div key={f} style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#444", marginBottom: "0.4rem" }}>
              <span style={{ color: "#2D6EF5", fontWeight: 700 }}>✓</span> {f}
            </div>
          ))}
        </div>

        <PayPalButton onSuccess={handleSuccess} />

        <button onClick={onClose} style={{ width: "100%", background: "transparent", border: "1.5px solid #EBEBEB", color: "#bbb", padding: "0.75rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", cursor: "pointer", borderRadius: "12px" }}>
          Voir l'aperçu seulement
        </button>

        <div style={{ marginTop: "1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", color: "#ccc" }}>
          🔒 Paiement sécurisé via PayPal
        </div>
      </div>
    </div>
  );
}

// ── Brief Result ──────────────────────────────────────────────────────────────
function BriefResult({ sections, isSubscribed, onUnlock, onReset }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const fullText = sections.map(s => `${s.title}\n${s.content}`).join("\n\n");

  const copy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: "BriefGen — Mon brief créatif", text: "J'ai généré un brief créatif professionnel en 10 secondes avec BriefGen !", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const VISIBLE_COUNT = 2;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>Brief généré</span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {isSubscribed && (
            <button onClick={copy} style={{ background: copied ? "#F0FDF4" : "#EEF3FF", border: `1.5px solid ${copied ? "#86EFAC" : "#C7D9FF"}`, color: copied ? "#16A34A" : "#2D6EF5", padding: "0.45rem 0.9rem", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
              {copied ? "✓ Copié !" : "Copier"}
            </button>
          )}
          <button onClick={share} style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8", color: "#888", padding: "0.45rem 0.9rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", cursor: "pointer", borderRadius: "8px" }}>
            {shared ? "✓ Lien copié" : "Partager"}
          </button>
          <button onClick={onReset} style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8", color: "#888", padding: "0.45rem 0.9rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", cursor: "pointer", borderRadius: "8px" }}>
            Nouveau
          </button>
        </div>
      </div>

      <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: "12px", padding: "0.9rem 1.1rem", marginBottom: "1.2rem", display: "flex", gap: "0.7rem" }}>
        <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#92400E", lineHeight: 1.55, margin: 0 }}>
          <strong>Quoi faire avec ce brief ?</strong> Copie-le et envoie-le à ton designer ou ton agence. Il remplace 2h de réunion de cadrage.
        </p>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid #E8E8E8", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.05)", marginBottom: "1rem" }}>
        {sections.map((section, i) => {
          const isLocked = !isSubscribed && i >= VISIBLE_COUNT;
          return (
            <div key={i} style={{ padding: "1.2rem 1.4rem", borderBottom: i < sections.length - 1 ? "1px solid #F0F0F0" : "none", filter: isLocked ? "blur(4px)" : "none", userSelect: isLocked ? "none" : "auto", pointerEvents: isLocked ? "none" : "auto" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.12em", color: "#2D6EF5", textTransform: "uppercase", marginBottom: "0.6rem" }}>{section.title}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "#444", lineHeight: 1.7, whiteSpace: "pre-line" }}>{section.content}</div>
            </div>
          );
        })}
      </div>

      {!isSubscribed && (
        <div style={{ background: "linear-gradient(160deg, #EEF3FF 0%, #F0F4FF 100%)", border: "1.5px solid #C7D9FF", borderRadius: "16px", padding: "1.5rem", textAlign: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.6rem" }}>🔒</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#111", marginBottom: "0.4rem" }}>5 sections sont masquées</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#666", marginBottom: "1.2rem", lineHeight: 1.5 }}>
            Direction artistique, livrables, contraintes...<br />Débloque le brief complet avec Pro à 19,90€/mois.
          </div>
          <button onClick={onUnlock} style={{ width: "100%", background: "#2D6EF5", color: "#fff", border: "none", padding: "1rem", borderRadius: "12px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 6px 20px rgba(45,110,245,0.3)" }}>
            DÉBLOQUER LE BRIEF COMPLET →
          </button>
        </div>
      )}

      {isSubscribed && (
        <div style={{ background: "#F7F8FA", borderRadius: "14px", padding: "1.2rem" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.68rem", color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Et maintenant ?</div>
          {[
            { icon: "📋", text: "Copie le brief et envoie-le à ton designer ou agence" },
            { icon: "🤝", text: "Partage-le en réunion pour aligner ton équipe" },
            { icon: "🖨️", text: "Colle-le dans Notion, Google Drive ou imprime-le" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>{icon}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#555", lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Legal Pages ───────────────────────────────────────────────────────────────
function LegalPage({ type, onBack }) {
  return (
    <div style={{ paddingTop: "1.5rem", animation: "fadeUp 0.3s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#2D6EF5", cursor: "pointer", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
        ← Retour
      </button>

      {type === "cgv" && (
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#111", marginBottom: "0.4rem" }}>Conditions Générales de Vente</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#aaa", marginBottom: "2rem" }}>Dernière mise à jour : Avril 2026</p>
          {[
            { title: "1. Service", content: "BriefGen est un service de génération de briefs créatifs par intelligence artificielle, accessible via briefgen-7yt5.vercel.app. En utilisant ce service, vous acceptez les présentes conditions." },
            { title: "2. Abonnement", content: "L'abonnement Pro est proposé au tarif de 19,90€/mois. Le paiement est effectué via PayPal. L'abonnement est sans engagement et peut être annulé à tout moment depuis votre espace PayPal." },
            { title: "3. Remboursement", content: "Aucun remboursement n'est effectué pour les mois entamés. En cas de problème technique, contactez-nous à " + CONTACT_EMAIL + "." },
            { title: "4. Propriété intellectuelle", content: "Les briefs générés vous appartiennent et sont libres d'utilisation. BriefGen conserve la propriété de sa plateforme, de son design et de sa technologie." },
            { title: "5. Limitation de responsabilité", content: "BriefGen est un outil d'aide à la création. Nous ne garantissons pas les résultats obtenus à partir des briefs générés." },
            { title: "6. Contact", content: CONTACT_EMAIL },
          ].map(({ title, content }) => (
            <div key={title} style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#111", marginBottom: "0.4rem" }}>{title}</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#555", lineHeight: 1.7 }}>{content}</p>
            </div>
          ))}
        </div>
      )}

      {type === "privacy" && (
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#111", marginBottom: "0.4rem" }}>Politique de Confidentialité</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#aaa", marginBottom: "2rem" }}>Dernière mise à jour : Avril 2026</p>
          {[
            { title: "1. Données collectées", content: "Nous collectons uniquement les informations que vous saisissez dans le formulaire (type de projet, secteur, ton, etc.). Aucune donnée personnelle n'est collectée sans votre consentement." },
            { title: "2. Utilisation des données", content: "Vos saisies sont utilisées uniquement pour générer votre brief. Nous ne vendons ni ne partageons vos données avec des tiers." },
            { title: "3. Stockage local", content: "Nous utilisons le localStorage de votre navigateur pour mémoriser votre statut d'abonnement. Aucun cookie de tracking n'est utilisé." },
            { title: "4. Paiements", content: "Les paiements sont traités par PayPal. Nous n'avons accès à aucune donnée bancaire. Consultez la politique de confidentialité de PayPal pour plus d'informations." },
            { title: "5. Vos droits", content: "Vous pouvez demander la suppression de vos données à tout moment en nous contactant à " + CONTACT_EMAIL + "." },
            { title: "6. Contact", content: CONTACT_EMAIL },
          ].map(({ title, content }) => (
            <div key={title} style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#111", marginBottom: "0.4rem" }}>{title}</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#555", lineHeight: 1.7 }}>{content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ onNav }) {
  return (
    <div style={{ borderTop: "1px solid #E8E8E8", padding: "2rem 1.2rem", textAlign: "center", marginTop: "2rem" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#111", marginBottom: "0.8rem" }}>BriefGen</div>
      <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
        <button onClick={() => onNav("cgv")} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#999", cursor: "pointer" }}>CGV</button>
        <button onClick={() => onNav("privacy")} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#999", cursor: "pointer" }}>Confidentialité</button>
        <button onClick={() => onNav("contact")} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#999", cursor: "pointer" }}>Contact</button>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#ccc" }}>© 2026 BriefGen · Tous droits réservés</div>
    </div>
  );
}

// ── EmailJS Config ────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_ii6eps8";
const EMAILJS_TEMPLATE_ID = "template_kqubcth";
const EMAILJS_PUBLIC_KEY = "KIsEJo9NV1c4XoXVs";

// ── Contact Page ──────────────────────────────────────────────────────────────
function ContactPage({ onBack }) {
  const [cform, setCform] = useState({ nom: "", prenom: "", email: "", societe: "", produit: "", message: "" });
  const [status, setStatus] = useState("idle");

  const setC = (k, v) => setCform(f => ({ ...f, [k]: v }));

  const send = async () => {
    if (!cform.nom || !cform.prenom || !cform.email || !cform.message) {
      setStatus("error"); return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            nom: cform.nom,
            prenom: cform.prenom,
            email: cform.email,
            societe: cform.societe || "Non renseigné",
            produit: cform.produit || "Non renseigné",
            message: cform.message,
          },
        }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") return (
    <div style={{ paddingTop: "3rem", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#111", marginBottom: "0.5rem" }}>Message envoyé !</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#777", lineHeight: 1.6, marginBottom: "2rem" }}>
        On te répondra rapidement à <strong>{cform.email}</strong>.
      </p>
      <button onClick={onBack} style={{ background: "#2D6EF5", color: "#fff", border: "none", padding: "1rem 2rem", borderRadius: "12px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}>
        Retour à l'accueil
      </button>
    </div>
  );

  return (
    <div style={{ paddingTop: "1.5rem", animation: "fadeUp 0.3s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#2D6EF5", cursor: "pointer", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>← Retour</button>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#111", marginBottom: "0.4rem" }}>Nous contacter</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "#777", lineHeight: 1.6, marginBottom: "2rem" }}>
        Une question, un problème, une suggestion ? Remplis ce formulaire et on te répond rapidement.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem", marginBottom: "0.7rem" }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Nom *</div>
          <input className="field" placeholder="Dupont" value={cform.nom} onChange={e => setC("nom", e.target.value)} />
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Prénom *</div>
          <input className="field" placeholder="Marie" value={cform.prenom} onChange={e => setC("prenom", e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: "0.7rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Email *</div>
        <input className="field" type="email" placeholder="marie@exemple.com" value={cform.email} onChange={e => setC("email", e.target.value)} />
      </div>

      <div style={{ marginBottom: "0.7rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Société (optionnel)</div>
        <input className="field" placeholder="Studio Créatif" value={cform.societe} onChange={e => setC("societe", e.target.value)} />
      </div>

      <div style={{ marginBottom: "0.7rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Sujet</div>
        <select className="field" value={cform.produit} onChange={e => setC("produit", e.target.value)} style={{ appearance: "none", WebkitAppearance: "none" }}>
          <option value="">Sélectionne un sujet</option>
          <option value="Abonnement Pro">Abonnement Pro</option>
          <option value="Problème technique">Problème technique</option>
          <option value="Question sur un brief">Question sur un brief</option>
          <option value="Remboursement">Remboursement</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Message *</div>
        <textarea className="field" rows={5} placeholder="Décris ta question ou ton problème..." value={cform.message} onChange={e => setC("message", e.target.value)} />
      </div>

      {status === "error" && (
        <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "12px", padding: "0.8rem 1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#DC2626", marginBottom: "1rem" }}>
          ⚠ Remplis les champs obligatoires et réessaie.
        </div>
      )}

      <button onClick={send} disabled={status === "sending"} style={{ width: "100%", background: status === "sending" ? "#93B4FA" : "#2D6EF5", color: "#fff", border: "none", padding: "1.15rem", borderRadius: "16px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", cursor: status === "sending" ? "not-allowed" : "pointer", boxShadow: "0 8px 24px rgba(45,110,245,0.25)" }}>
        {status === "sending" ? "Envoi en cours..." : "ENVOYER MON MESSAGE →"}
      </button>
    </div>
  );
}

// ── Brief Generation (IA réelle + fallback local) ─────────────────────────────
async function generateBrief(form) {
  const prompt = `Tu es un directeur artistique senior dans une agence créative parisienne de renom.

Génère un brief créatif complet, professionnel et immédiatement utilisable :

TYPE DE PROJET : ${form.projectType}
SECTEUR : ${form.sector}
TON & UNIVERS : ${form.tone}
${form.brand ? `MARQUE : ${form.brand}` : ""}
${form.audience ? `PUBLIC CIBLE : ${form.audience}` : ""}
${form.objective ? `OBJECTIF : ${form.objective}` : ""}
${form.extra ? `CONTEXTE : ${form.extra}` : ""}

Génère exactement 7 sections avec ce format JSON :
{
  "sections": [
    {"title": "CONTEXTE & VISION", "content": "..."},
    {"title": "OBJECTIFS CRÉATIFS", "content": "..."},
    {"title": "PUBLIC CIBLE", "content": "..."},
    {"title": "DIRECTION ARTISTIQUE", "content": "..."},
    {"title": "LIVRABLES ATTENDUS", "content": "..."},
    {"title": "CONTRAINTES", "content": "..."},
    {"title": "CRITÈRES DE SUCCÈS", "content": "..."}
  ]
}

Réponds UNIQUEMENT avec le JSON valide, sans texte avant ou après. Écris en français.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (parsed.sections?.length === 7) return parsed.sections;
  } catch (e) {}

  // Fallback local si l'API échoue
  return generateLocalBrief(form);
}

function generateLocalBrief(form) {
  const toneMap = {
    "Luxe & premium": "raffiné, codes visuels haut de gamme, typographies serif élégantes",
    "Minimaliste": "épuré, espace blanc généreux, palette réduite à 2-3 couleurs",
    "Audacieux": "couleurs saturées, typographies impactantes, compositions asymétriques",
    "Chaleureux": "tons terre, textures organiques, sentiment d'authenticité",
    "Tech & futuriste": "dark mode, gradients néon, typographies monospace",
    "Organique": "formes libres, textures naturelles, palette inspirée de la nature",
    "Vintage": "grain photographique, palettes désaturées, références rétro",
    "Énergique": "dynamisme visuel, contrastes forts, mouvement et rythme",
  };
  const tone = toneMap[form.tone] || form.tone;
  const brand = form.brand || "la marque";
  const obj = form.objective || "renforcer la présence et la notoriété";

  return [
    { title: "CONTEXTE & VISION", content: `${brand} opère dans le secteur ${form.sector} avec l'ambition de se démarquer par une identité visuelle forte.\n\nLe projet de ${form.projectType.toLowerCase()} s'inscrit dans une stratégie de ${obj}.` },
    { title: "OBJECTIFS CRÉATIFS", content: `- Créer une identité visuelle distinctive et reconnaissable\n- Traduire les valeurs : ${form.tone.toLowerCase()}, modernité, crédibilité\n- Générer une émotion forte au premier contact\n- Assurer une cohérence sur tous les points de contact` },
    { title: "PUBLIC CIBLE", content: `Cible principale : ${form.audience || "définie par le secteur " + form.sector}\n\nMotivations : recherche de qualité, besoin de confiance, aspiration à quelque chose de singulier.` },
    { title: "DIRECTION ARTISTIQUE", content: `Univers visuel : ${tone}.\n\n- Palette : 1 couleur primaire forte + 1-2 secondaires\n- Typographie : police signature (titres) + police lisibilité (corps)\n- Style photo : éditorial, lumière naturelle\n- À éviter : clichés du secteur, stock photos génériques` },
    { title: "LIVRABLES ATTENDUS", content: `- Fichiers sources éditables (AI, Figma ou équivalent)\n- Exports web (PNG, SVG, WebP) et print (PDF 300dpi)\n- Guide d'utilisation (dos & don'ts)\n- Déclinaisons pour les formats principaux` },
    { title: "CONTRAINTES", content: `${form.extra ? `Contraintes spécifiques : ${form.extra}\n\n` : ""}Contraintes générales :\n- Accessibilité (contraste suffisant, lisibilité)\n- Compatibilité web et mobile\n- Validation par étapes : concept → développement → finalisation` },
    { title: "CRITÈRES DE SUCCÈS", content: `- La cible reconnaît immédiatement le secteur ET la singularité\n- Le livrable est utilisable en production sans refonte\n- L'équipe se retrouve dans le résultat\n- La direction artistique est extensible sur de futurs supports` },
  ];
}

// ── Review Page ──────────────────────────────────────────────────────────────
function ReviewPage({ onBack }) {
  const [rform, setRform] = useState({ nom: "", role: "", stars: 5, message: "" });
  const [status, setStatus] = useState("idle");

  const setR = (k, v) => setRform(f => ({ ...f, [k]: v }));

  const send = async () => {
    if (!rform.nom || !rform.message) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            nom: rform.nom,
            prenom: "—",
            email: "Avis utilisateur",
            societe: rform.role || "Non renseigné",
            produit: `⭐ ${rform.stars}/5 étoiles`,
            message: rform.message,
          },
        }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") return (
    <div style={{ paddingTop: "3rem", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#111", marginBottom: "0.5rem" }}>Merci pour ton avis !</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#777", lineHeight: 1.6, marginBottom: "2rem" }}>
        Ton avis sera publié sur la page d'accueil après validation.
      </p>
      <button onClick={onBack} style={{ background: "#2D6EF5", color: "#fff", border: "none", padding: "1rem 2rem", borderRadius: "12px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}>
        Retour à l'accueil
      </button>
    </div>
  );

  return (
    <div style={{ paddingTop: "1.5rem", animation: "fadeUp 0.3s ease" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#2D6EF5", cursor: "pointer", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>← Retour</button>

      <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#111", marginBottom: "0.4rem" }}>Laisser un avis</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "#777", lineHeight: 1.6, marginBottom: "2rem" }}>
        Tu as utilisé BriefGen ? Partage ton expérience — ça aide les autres utilisateurs.
      </p>

      <div style={{ marginBottom: "0.7rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Ton prénom / pseudo *</div>
        <input className="field" placeholder="Marie D." value={rform.nom} onChange={e => setR("nom", e.target.value)} />
      </div>

      <div style={{ marginBottom: "0.7rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Ton rôle (optionnel)</div>
        <input className="field" placeholder="ex: Directrice artistique, Freelance, Entrepreneur..." value={rform.role} onChange={e => setR("role", e.target.value)} />
      </div>

      <div style={{ marginBottom: "0.7rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.5rem" }}>Note *</div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setR("stars", s)} style={{ fontSize: "1.6rem", background: "none", border: "none", cursor: "pointer", opacity: s <= rform.stars ? 1 : 0.25, transition: "opacity 0.15s" }}>★</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#aaa", marginBottom: "0.3rem" }}>Ton avis *</div>
        <textarea className="field" rows={5} placeholder="Qu'est-ce que tu as aimé ? Comment BriefGen t'a aidé ?" value={rform.message} onChange={e => setR("message", e.target.value)} />
      </div>

      {status === "error" && (
        <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "12px", padding: "0.8rem 1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#DC2626", marginBottom: "1rem" }}>
          ⚠ Remplis les champs obligatoires et réessaie.
        </div>
      )}

      <button onClick={send} disabled={status === "sending"} style={{ width: "100%", background: status === "sending" ? "#93B4FA" : "#2D6EF5", color: "#fff", border: "none", padding: "1.15rem", borderRadius: "16px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", cursor: status === "sending" ? "not-allowed" : "pointer", boxShadow: "0 8px 24px rgba(45,110,245,0.25)" }}>
        {status === "sending" ? "Envoi en cours..." : "ENVOYER MON AVIS →"}
      </button>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "#bbb", textAlign: "center", marginTop: "0.8rem" }}>
        Ton avis sera publié après validation de notre équipe.
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BriefGen() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [screen, setScreen] = useState("home");
  const [showPaywall, setShowPaywall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    projectType: "", sector: "", tone: "",
    brand: "", audience: "", objective: "", extra: "",
  });

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") setIsSubscribed(true);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generate = async () => {
    if (!form.projectType || !form.sector || !form.tone) {
      setError("Sélectionne un type de projet, un secteur et un ton."); return;
    }
    setError(""); setLoading(true); setScreen("loading");
    const result = await generateBrief(form);
    setSections(result);
    setLoading(false);
    setScreen("result");
    if (!isSubscribed) setTimeout(() => setShowPaywall(true), 800);
  };

  const handleSubscribed = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsSubscribed(true);
    setShowPaywall(false);
  };

  const reset = () => {
    setSections(null);
    setForm({ projectType: "", sector: "", tone: "", brand: "", audience: "", objective: "", extra: "" });
    setScreen("form");
  };

  if (screen === "cgv" || screen === "privacy") {
    return (
      <div style={{ minHeight: "100vh", background: "#F4F5F7" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1.2rem 4rem" }}>
          <LegalPage type={screen} onBack={() => setScreen("home")} />
        </div>
      </div>
    );
  }

  if (screen === "review") {
    return (
      <div style={{ minHeight: "100vh", background: "#F4F5F7" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .field { width: 100%; background: #fff; border: 1.5px solid #E8E8E8; color: #111; padding: 0.85rem 1rem; font-family: "DM Sans", sans-serif; font-size: 0.85rem; border-radius: 12px; outline: none; resize: none; transition: border-color 0.18s; } .field:focus { border-color: #2D6EF5; } .field::placeholder { color: #bbb; } @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1.2rem 4rem" }}>
          <ReviewPage onBack={() => setScreen("home")} />
        </div>
      </div>
    );
  }

  if (screen === "contact") {
    return (
      <div style={{ minHeight: "100vh", background: "#F4F5F7" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .field { width: 100%; background: #fff; border: 1.5px solid #E8E8E8; color: #111; padding: 0.85rem 1rem; font-family: "DM Sans", sans-serif; font-size: 0.85rem; border-radius: 12px; outline: none; resize: none; transition: border-color 0.18s; } .field:focus { border-color: #2D6EF5; } .field::placeholder { color: #bbb; } @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1.2rem 4rem" }}>
          <ContactPage onBack={() => setScreen("home")} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4F5F7" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { -webkit-font-smoothing: antialiased; }
        button { cursor: pointer; }
        .field { width: 100%; background: #fff; border: 1.5px solid #E8E8E8; color: #111; padding: 0.85rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; border-radius: 12px; outline: none; resize: none; transition: border-color 0.18s; -webkit-appearance: none; }
        .field:focus { border-color: #2D6EF5; box-shadow: 0 0 0 3px rgba(45,110,245,0.08); }
        .field::placeholder { color: #bbb; }
        .card { background: #fff; border-radius: 18px; padding: 1.4rem; margin-bottom: 0.9rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
        .section-label { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.72rem; letter-spacing: 0.08em; color: #999; text-transform: uppercase; margin-bottom: 0.8rem; display: block; }
        .chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 36px; height: 36px; border: 2.5px solid #E8E8E8; border-top-color: #2D6EF5; border-radius: 50%; animation: spin 0.85s linear infinite; }
      `}</style>

      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onSubscribed={handleSubscribed} />}

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(244,245,247,0.94)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "0.85rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("home")} style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", padding: 0 }}>
          <div style={{ width: "32px", height: "32px", background: "#2D6EF5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#fff" }}>B</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#111" }}>BriefGen</span>
        </button>
        {isSubscribed ? (
          <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: "20px", padding: "0.3rem 0.8rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 600, color: "#16A34A" }}>✓ Pro</div>
        ) : (
          <button onClick={() => setShowPaywall(true)} style={{ background: "#EEF3FF", border: "1.5px solid #C7D9FF", borderRadius: "20px", padding: "0.3rem 0.8rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#2D6EF5" }}>Passer Pro</button>
        )}
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 1.2rem 2rem" }}>

        {/* ── HOME ── */}
        {screen === "home" && (
          <div style={{ paddingTop: "2.5rem", animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "inline-block", background: "#EEF3FF", borderRadius: "100px", padding: "0.3rem 0.9rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#2D6EF5", marginBottom: "1rem" }}>
              ✦ Pour designers, agences & porteurs de projet
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 8vw, 2.8rem)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "#111", marginBottom: "1rem" }}>
              Génère un brief créatif<br /><span style={{ color: "#2D6EF5" }}>professionnel en 10 sec.</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#777", lineHeight: 1.65, marginBottom: "2rem" }}>
              Tu remplis quelques champs, l'IA rédige un brief complet prêt à envoyer à ton designer, ton agence ou ton équipe.
            </p>

            {/* What's a brief */}
            <div className="card" style={{ marginBottom: "1rem", border: "1.5px solid #E8E8E8" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#111", marginBottom: "0.7rem" }}>🤔 C'est quoi un brief créatif ?</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "#666", lineHeight: 1.65, marginBottom: "0.7rem" }}>
                C'est le document que tu donnes à un designer ou une agence <strong>avant qu'ils commencent à travailler</strong>. Il décrit ton projet, ton public, tes objectifs et le style que tu veux.
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "#666", lineHeight: 1.65 }}>
                Sans brief clair, les créatifs partent dans n'importe quel sens. Avec un bon brief, tu <strong>économises des semaines de corrections</strong>.
              </p>
            </div>

            {/* Use cases */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.7rem" }}>Qui utilise BriefGen ?</div>
              {USE_CASES.map(({ icon, who, what }) => (
                <div key={who} className="card" style={{ display: "flex", gap: "0.9rem", marginBottom: "0.6rem", border: "1.5px solid #E8E8E8" }}>
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#111", marginBottom: "0.2rem" }}>{who}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#777", lineHeight: 1.5 }}>{what}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div style={{ background: "#EEF3FF", borderRadius: "18px", padding: "1.4rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#2D6EF5", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>Comment ça marche</div>
              {["Tu choisis ton type de projet, secteur et style", "Tu ajoutes quelques infos optionnelles", "L'IA génère un brief de 7 sections en 10 secondes", "Tu copies et envoies le brief à qui tu veux"].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start", marginBottom: "0.7rem" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#2D6EF5", color: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.65rem" }}>{i + 1}</div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#1E40AF", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase" }}>Ce qu'ils en disent</div>
                <button onClick={() => setScreen("review")} style={{ background: "#EEF3FF", border: "1.5px solid #C7D9FF", borderRadius: "20px", padding: "0.3rem 0.8rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 500, color: "#2D6EF5", cursor: "pointer" }}>
                  + Laisser un avis
                </button>
              </div>
              {REVIEWS.map(({ name, role, text, stars }) => (
                <div key={name} className="card" style={{ border: "1.5px solid #E8E8E8", marginBottom: "0.6rem" }}>
                  <div style={{ color: "#F59E0B", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{"★".repeat(stars)}</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#444", lineHeight: 1.6, marginBottom: "0.5rem", fontStyle: "italic" }}>"{text}"</p>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#111" }}>{name} <span style={{ color: "#aaa", fontWeight: 400 }}>— {role}</span></div>
                </div>
              ))}
            </div>

            <button onClick={() => setScreen("form")} style={{ width: "100%", background: "#2D6EF5", color: "#fff", border: "none", padding: "1.2rem", borderRadius: "16px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.03em", boxShadow: "0 8px 24px rgba(45,110,245,0.3)", marginBottom: "0.7rem" }}>
              GÉNÉRER MON BRIEF →
            </button>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#bbb", textAlign: "center", marginBottom: "2rem" }}>
              Aperçu gratuit · Brief complet avec Pro à 19,90€/mois
            </div>

            <Footer onNav={(page) => setScreen(page)} />
          </div>
        )}

        {/* ── FORM ── */}
        {screen === "form" && !loading && (
          <div style={{ paddingTop: "1.8rem", animation: "fadeUp 0.35s ease" }}>
            <div className="card">
              <span className="section-label">① Type de projet *</span>
              <div className="chips">
                {projectTypes.map(({ label, icon }) => <Chip key={label} label={label} icon={icon} selected={form.projectType === label} onClick={() => set("projectType", form.projectType === label ? "" : label)} />)}
              </div>
            </div>
            <div className="card">
              <span className="section-label">② Secteur *</span>
              <div className="chips">
                {sectors.map(s => <Chip key={s} label={s} selected={form.sector === s} onClick={() => set("sector", form.sector === s ? "" : s)} />)}
              </div>
            </div>
            <div className="card">
              <span className="section-label">③ Ton visuel *</span>
              <div className="chips">
                {tones.map(t => <Chip key={t} label={t} selected={form.tone === t} onClick={() => set("tone", form.tone === t ? "" : t)} />)}
              </div>
            </div>
            <div className="card">
              <span className="section-label">④ Détails optionnels</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                <input className="field" placeholder="Nom de la marque (ex: Studio Volta)" value={form.brand} onChange={e => set("brand", e.target.value)} />
                <input className="field" placeholder="Public cible (ex: femmes 25-40 ans urbaines)" value={form.audience} onChange={e => set("audience", e.target.value)} />
                <input className="field" placeholder="Objectif (ex: lancement d'une nouvelle gamme)" value={form.objective} onChange={e => set("objective", e.target.value)} />
                <textarea className="field" rows={3} placeholder="Contexte, contraintes, inspirations..." value={form.extra} onChange={e => set("extra", e.target.value)} />
              </div>
            </div>

            {error && <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: "12px", padding: "0.8rem 1rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#DC2626", marginBottom: "1rem" }}>⚠ {error}</div>}

            <button onClick={generate} style={{ width: "100%", background: "#2D6EF5", color: "#fff", border: "none", padding: "1.15rem", borderRadius: "16px", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", letterSpacing: "0.03em", boxShadow: "0 8px 24px rgba(45,110,245,0.25)", marginBottom: "0.6rem" }}>
              GÉNÉRER MON BRIEF →
            </button>
            {!isSubscribed && <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#bbb" }}>Aperçu gratuit — brief complet avec Pro (19,90€/mois)</p>}
          </div>
        )}

        {/* ── LOADING ── */}
        {screen === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1.2rem", animation: "fadeUp 0.3s ease" }}>
            <div className="spinner" />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#111", marginBottom: "0.3rem" }}>Rédaction en cours...</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#aaa", fontStyle: "italic" }}>Le DA IA prépare ton brief ✍️</div>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {screen === "result" && sections && !loading && (
          <div style={{ paddingTop: "1.8rem" }}>
            <BriefResult sections={sections} isSubscribed={isSubscribed} onUnlock={() => setShowPaywall(true)} onReset={reset} />
            <Footer onNav={(page) => setScreen(page)} />
          </div>
        )}
      </div>
    </div>
  );
}