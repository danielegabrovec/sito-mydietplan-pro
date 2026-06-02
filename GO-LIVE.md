# 🚀 Runbook GO-LIVE — passaggio a Live mode (dopo approvazione store)

> Da eseguire **solo dopo** che Lemon Squeezy ha **approvato/attivato lo store** (tipicamente 1-2 giorni
> lavorativi). Prima dell'approvazione si lavora **solo in Test mode** — non c'è il toggle Live.
> Questo file riguarda il **sito + API serverless** (`midietplan-pro` → `midietplan-pro.vercel.app`),
> dove vive il **webhook**. La web-app è nel repo `MyDietPlan` (vedi il suo `GO-LIVE.md`).

## Valori di riferimento
- Webhook URL: `https://midietplan-pro.vercel.app/api/lemon-squeezy`
- Signing secret (uguale per test e live): **stesso valore della var Vercel `LEMON_SQUEEZY_WEBHOOK_SECRET`** — il valore reale è nel file locale `lemon_squeezy_credentials.md` (fuori dal repo), NON va scritto qui.
- Eventi webhook: tutti i `subscription_*` + `order_created` + `order_refunded`
- Button link (Confirmation modal, per prodotto): `https://mydietplan-green.vercel.app/?checkout=success`
- Toggle Test/Live: **in basso a sinistra** nell'admin Lemon Squeezy.
- Checkout UUID attualmente nel codice (probabilmente di **Test mode** — DA VERIFICARE in live):
  - Mensile  → `100d5e69-fc9c-4b58-a105-e5d295317336`
  - Annuale  → `416e640a-5105-4c15-9a93-10de16f7a32a`
  - Lifetime → `40334f9e-cb2f-477c-9508-1bfa4d6b54d6`

## Checklist (in ordine)
1. **Toggle su Live mode** (basso a sinistra). Sparisce il banner "Test mode".
2. **Webhook in Live** (Settings → Webhooks): crealo se non c'è, **stesso URL e stesso secret** di sopra,
   stessi eventi (`subscription_*` + `order_created` + `order_refunded`).
   (I webhook di test NON scattano in live.) Verifica una delivery di test → **200**.
3. **API key LIVE** (Settings → API in Live mode): genera la chiave **live** e mettila su Vercel
   (questo progetto, `midietplan-pro`) come `LEMON_SQUEEZY_API_KEY` → poi **redeploy**.
   ⚠️ Le API key test/live sono separate: con una key di test la **disdetta** (`/api/cancel-subscription`)
   fallisce in produzione.
4. **Prodotti in Live** (Products): se esistevano solo in Test, usa **"Copy to Live Mode"**.
   Apri ogni prodotto live → copia il **checkout link** → confronta gli UUID con quelli sopra.
5. **Se gli UUID live DIFFERISCONO** → aggiorna i link (vedi "Dove si toccano" sotto) e **redeploy**.
6. **Button link** `…/?checkout=success` impostato anche sui **prodotti live** (è per-prodotto).
7. **Prova reale**: acquisto vero → delivery **200** → riga `subscriptions` con `is_subscribed=true`
   (+ `subscription_tier`, `user_id`) → sblocco Premium nell'app → disdetta → `is_subscribed=false`.

## Variabili d'ambiente Vercel (progetto `midietplan-pro`)
Devono essere **LIVE** al go-live:
- `LEMON_SQUEEZY_API_KEY` → **chiave live** (vedi punto 3).
- `LEMON_SQUEEZY_WEBHOOK_SECRET` = stesso valore del Signing secret del webhook live (già impostata su Vercel; il valore reale è in `lemon_squeezy_credentials.md`, fuori dal repo).
- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` (già impostate).
- `ALLOWED_ORIGINS` = `https://mydietplan-green.vercel.app,https://midietplan-pro.vercel.app`
- `RESEND_API_KEY` (+ opzionale `RESEND_FROM_EMAIL` con dominio verificato).
> Dopo OGNI modifica env → **Redeploy** (le env si attivano solo su un nuovo deploy).

## Dove si toccano i link di checkout (in QUESTO repo — sito)
- File: `src/components/LandingPage.tsx` → costante `LEMON_SQUEEZY_CHECKOUT_URLS` (`monthly`/`yearly`/`lifetime`).
  Sostituisci gli UUID con quelli live, commit, `git push origin main` → Vercel auto-deploy.
- Le API (`api/lemon-squeezy.js`, `api/cancel-subscription.js`, `api/send.js`) non contengono UUID:
  leggono tutto dagli eventi e dalle env.

## Sicurezza (prima del lancio pubblico)
- **Ruota i segreti** che erano nel repo (`scratch/` dell'app + file credenziali): nuovo Signing secret
  in LS (+ var Vercel), *roll* `service_role` Supabase, nuova `LEMON_SQUEEZY_API_KEY`. Redeploy.
- **Dominio mittente Resend** verificato (`RESEND_FROM_EMAIL`, SPF/DKIM).
- Considera l'**idempotenza webhook** (dedup `event_id`) per i retry di Lemon Squeezy.

## Rollback
- Tag pre-fix: `restore-point-pre-fix-2026-06-02` (`git checkout` per tornare allo stato precedente).
