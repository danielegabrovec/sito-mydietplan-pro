# 🛒 sito-mydietplan-pro — Stato e Cose da Fare

Landing di vendita + **API serverless** (Vercel) per MyDietPlan (modello **solo web**).
Aggiornato: **2 giugno 2026**. Branch fix: `fix/pagamenti-webhook-disdette` (commit `06d275c`).
Report esteso: `Antigravity/Report-Fix-MyDietPlan-2026-06-02.pdf`.

API in `api/`: `lemon-squeezy.js` (webhook), `cancel-subscription.js` (disdetta), `send.js` (email).

---

## ✅ Cosa è stato fatto

### Webhook `api/lemon-squeezy.js`
* **Stop al `lifetime` forzato** su ogni ordine pagato: `order_created` attiva il Premium solo per il
  vero acquisto one-time (Lifetime); gli abbonamenti mensile/annuale sono gestiti dagli eventi
  `subscription_*` (un abbonato mensile non diventa più "a vita").
* **Rimborsi gestiti**: handler `order_refunded` e `subscription_payment_refunded` → `is_subscribed=false`.
* **Grace period** `past_due`; **firma HMAC resiliente** (niente 500 su firma malformata).
* `user_id` letto da `meta.custom_data` e salvato su Supabase (match pagamento↔account).
* Rimosso l'hack delle email di test "invertite".

### Disdetta `api/cancel-subscription.js`
* Se manca `LEMON_SQUEEZY_API_KEY` → **503** (niente più finto "200 success").
* Short-circuit per `lifetime`/`tester` (nessuna fatturazione ricorrente).
* Dopo la disdetta su Lemon Squeezy imposta `is_subscribed=false` su Supabase (evita record "attivi" orfani).
* **CORS** ristretti a una allowlist (`ALLOWED_ORIGINS`).

### Email `api/send.js`
* CORS allowlist + mittente configurabile via `RESEND_FROM_EMAIL`.

### Landing `src/components/LandingPage.tsx`
* La modale "checkout" non simula più il successo: **reindirizza al flusso REALE** — *trial* alla
  registrazione nella web-app (prova 7 giorni senza carta), piani a pagamento al **checkout Lemon
  Squeezy** con email precompilata. Rimossi i messaggi fuorvianti "PROVA ATTIVATA".
* Le card prezzi puntano già ai checkout reali (monthly/yearly/lifetime).

### Config
* `.env.example` con le variabili server.

---

## ✅ Operativo già fatto
- **Env su Vercel** (Production): `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`,
  `LEMON_SQUEEZY_WEBHOOK_SECRET` (allineato al webhook), `LEMON_SQUEEZY_API_KEY`,
  `RESEND_API_KEY`, `ALLOWED_ORIGINS`.
- **Webhook registrato** su Lemon Squeezy → `midietplan-pro.vercel.app/api/lemon-squeezy`
  (eventi `subscription_*` + `order_created` + `order_refunded`; signing secret combaciante).
- **Mergiato in `main` e deployato in produzione** (endpoint live: `GET`→405, `POST` senza firma→401).

## 🎯 Cosa manca da fare
1. **Test end-to-end** (in corso): pagamento → webhook → `subscriptions` (`user_id`) → sblocco → disdetta → revoca.
2. **Store Lemon Squeezy approvato** (onboarding venditore: dati fiscali + IBAN) per incassare davvero.
3. **Dominio mittente Resend verificato** (SPF/DKIM) + `RESEND_FROM_EMAIL`, per non finire in SPAM.
4. **Idempotenza webhook** (dedup `event_id`) per i retry di Lemon Squeezy.
5. **Rotazione segreti** (erano nel repo) prima del lancio pubblico.
6. **Pagine legali** (privacy art.13/consenso salute, EULA + disclaimer medico, policy rimborsi).

> Nota: il progetto Vercel del sito si chiama `midietplan-pro` (dominio `midietplan-pro.vercel.app`);
> la web-app è il progetto `mydietplan` (`mydietplan-green.vercel.app`). Gli schemi DB stanno nel repo
> dell'app (`MyDietPlan/scratch/`) e in copia in `Antigravity/supabase-MyDietPlan/`.
