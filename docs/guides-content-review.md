# Applied Cryptography guide — comprehensive content review

Synthesis of a multi-reviewer pass (crypto SME + content editor + crypto nerd) over
all 35 pages. De-duplicated and prioritized: **Critical → Major → Easy-win**.
Status column for tracking as we apply fixes.

## Progress — ✅ COMPLETE

**All review items applied and pushed to `euzun/guides`.** 8 criticals, the 6
original issues, all majors (M1–M29), all easy-wins (E1–E31), the per-page
"Builds on:" line, plus two author requests (no interview framing; NVIDIA-as-
example note) and removal of leftover persona text. Build green (55 pages).

<details><summary>Original tracking notes</summary>

## Progress

- ✅ **All 8 criticals (C1–C8)** + the **original 6** (RSA model, non-repudiation,
  SLSA L4, Sony dedup, WebAuthn parallel) fixed and pushed.
- ✅ Majors done: M1–M9, M15, M16, M19, M20, M28 + (this batch) M2, M4–M8.
  Wait — done set: **M1–M9, M15, M16, M19, M20, M28** (M3=TLS1.2 done in
  foundations batch; M2,M4,M5,M6,M7,M8 done).
- ✅ Easy-wins done: E1, E3–E7, E9, E16, E17, E20, E24, E25, E26, E31.
- ✅ Structural reorg + rename; "Textbook vs. reality" callout; NVIDIA example
  note; interview phrasing removed.
- ⏳ **Remaining majors:** M10–M14, M17, M18, M21–M27 (excl. 28), M29.
- ⏳ **Remaining easy-wins:** E2, E8, E10–E15, E18, E19, E21, E22, E23, E27–E30.
- ⏳ **Deferred:** the per-page "Builds on:" prerequisite line (cross-page pass).

## Cross-cutting themes (read first)

- **EK-signs-AIK error (3 pages)** — the single most important fix; see C1.
- **"Strong headline the page then walks back" anti-pattern** — recurs in: sign-verify
  (RSA model), tls (TLS 1.2), attestation (`parallel is exact`, `every TEE broken`),
  sbom (`hashes cannot be lied about`). Worth a dedicated self-edit pass: assert it
  right the first time, qualify in place.
- **Vendor-specific (NVIDIA) framing** throughout — fine but reads as insider shorthand
  for a beginner guide; consider genericizing or labeling as illustrative.

---

## 🔴 CRITICAL

- [x] **C1. EK does not sign the AIK — AIK is certified via credential activation.** ✅ DONE
  (fixed on all 4 occurrences incl. fido2 table; added "Textbook vs. reality" callout)
  Pages: `04-hardware-security/06-ek-aik.md`, `05-attestation/01-remote-attestation.md`,
  `08-end-to-end/01-firmware-lifecycle.md` (all say "AIK cert signed by EK").
  In TPM 2.0 the EK is a *restricted decryption key* and cannot sign. AIK certification
  uses `TPM2_ActivateCredential`: the CA encrypts a challenge to the EK pubkey; only the
  TPM holding that EK can decrypt it, proving the AIK is co-resident. Fix all 3 pages +
  their diagram edges. (For NVIDIA/IDevID, the identity key *is* a signing key — note the
  distinction rather than applying the EK model uniformly.)

- [ ] **C2. Sigstore keyless verification path is wrong (online vs offline).**
  `06-modern-protocols/03-sigstore-keyless.md`. Shows verification as a live Rekor lookup;
  modern Sigstore verification is **offline**: the bundle ships Rekor's SignedEntryTimestamp
  (SET) + inclusion proof, checked against Rekor's key from the **TUF trust root**. Also
  "look up entry by inclusion proof" is backwards (look up by hash, receive a proof). And
  the **CT log / SCT** step is missing entirely (how you trust Fulcio didn't mint rogue certs).

- [ ] **C3. mTLS handshake message ordering is wrong.**
  `01-foundations/06-mtls.md`. Diagram/walkthrough put `CertificateRequest` after
  `CertificateVerify`. In TLS 1.3 the server sends `CertificateRequest` *before* its
  `Certificate` (right after `EncryptedExtensions`, RFC 8446 §4.3.2). Reorder + renumber.

- [ ] **C4. PCR assignments contradict TCG and each other.**
  `04-hardware-security/04-secure-boot.md` extends bootloader→PCR[0], firmware→PCR[1];
  `05-measured-boot.md` diagram uses PCR 0/1/2/3 but its own TCG table says bootloader→PCR[4],
  kernel→PCR[8-15]. Make all three agree, or use generic "boot-stage PCR" labels + one note
  that exact indices follow the TCG table.

- [ ] **C5. Chain verification conflates trust models / overstates root verification.**
  `02-pki-and-trust/02-chain-verification.md`. The root is trusted because it's in the trust
  store (or matches a fingerprint/fuse), NOT because a signature is verified. Diagram mixes
  "is root in trust store" and "root hash matches embedded value" (two different anchors).
  State the rule explicitly; pick one mechanism per arrow.

- [ ] **C6. CA does not trust CSR-asserted names + text/diagram contradiction.**
  `02-pki-and-trust/01-certificate-issuance.md`. CSR proves key possession, not name
  ownership; the CA validates identity itself (esp. domain-validated web PKI). Also "sends
  the hash to its HSM" contradicts the diagram's "Sign TBS cert." Reconcile + add the caveat.

- [ ] **C7. Transparency-log inclusion proof omits the consistency/gossip requirement.**
  `07-supply-chain/04-transparency-logs.md`, Phase 3. Inclusion proof alone only proves the
  entry matches *some* signed root — split-view detection needs that root to be on a
  consistency-checked/gossiped history. As drawn ("recompute, compare, done") it implies the
  exact weakness the prose claims is defended.

- [ ] **C8. Firmware-lifecycle Act 2/3: anti-rollback source + "reference PCR for firmware version".**
  `08-end-to-end/01-firmware-lifecycle.md`. Anti-rollback "minimum" is compared against nothing
  sourced (should read from fuses/monotonic counter). Act 3 looks up a "reference PCR for
  firmware version" — but PCR_0 holds a *measurement hash*, not a version. Reword to "expected
  PCR measurement for the claimed build."

---

## 🟠 MAJOR

- [ ] **M1.** `01-foundations/01-sign-verify.md` step 5–7 "uses the public key to recover what
  hash the signer claimed" — RSA-recovery model again (wrong for ECDSA/EdDSA/RSA-PSS). Separate
  location from the known lede issue.
- [ ] **M2.** `01-foundations/05-tls.md` "one round trip" framing vs unexplained "0.5-RTT";
  state "1-RTT handshake; server may send 0.5-RTT data."
- [ ] **M3.** `01-foundations/05-tls.md` "no reason to accept TLS 1.2" overstated — TLS 1.2 with
  ECDHE+AEAD is still forward-secret/FIPS-fine. Soften to "prefer 1.3; if 1.2, restrict suites."
- [ ] **M4.** `01-foundations/04-trng.md` conditioner phrasing implies it can increase entropy;
  state conservation: conditioning packs existing entropy into fewer full-entropy bits.
- [ ] **M5.** `01-foundations/02-key-hierarchy.md` "1GB and 1KB both one HSM call" invites
  reusing one DEK forever; add AES-GCM per-key safe-data/invocation-limit caveat.
- [ ] **M6.** `01-foundations/03-pkcs11.md` `CKA_SENSITIVE` "prevents any retrieval" — wrong;
  a sensitive key can still be exported *wrapped* unless `CKA_EXTRACTABLE=FALSE`.
- [ ] **M7.** `02-pki-and-trust/03-key-rotation.md` hybrid certs "both must verify" contradicts
  "classical-only verifiers still work." Clarify legacy-ignores-PQC vs dual-aware-checks-both.
- [ ] **M8.** `02-pki-and-trust/03-key-rotation.md` gantt `dateFormat YYYY` but uses `2025-07`/`18M`
  — rendering bug; set `dateFormat YYYY-MM`.
- [ ] **M9.** `03-key-ceremonies/03-backup-shamir.md` omits the finite-field requirement — Shamir
  is information-theoretic only over GF(p)/GF(2^k); without it shares leak. (Most common Shamir error.)
- [ ] **M10.** `03-key-ceremonies/02-generation.md` distributes shares via static pubkey encryption,
  but `04-recovery.md` uses ephemeral ECDH mutual-auth — asymmetric + generation doesn't authenticate
  the card. Make symmetric or explain.
- [ ] **M11.** `03-key-ceremonies/01-overview.md` "Three ceremony types" but there are four
  (Gen/Backup/Recovery/Refresh); diagram shows five boxes. Fix the count.
- [ ] **M12.** `03-key-ceremonies/02-generation.md` "3-of-N" auth quorum vs recovery M never pinned
  on the page where polynomial degree M−1 is chosen. Disambiguate the two M-of-N policies.
- [ ] **M13.** `04-hardware-security/01-hsm.md` presents FIPS 140-2/140-3 as co-equal; 140-2 is
  sunset (historical 2026). Lead with 140-3.
- [ ] **M14.** `04-hardware-security/06-ek-aik.md` Apple WebAuthn "same pattern" undercuts the
  privacy point (Apple anonymized/batch attestation); IDevID "= analog of EK" overstates (signing
  vs decryption key usage differs).
- [ ] **M15.** `05-attestation/03-fido2-webauthn.md` attestation signs `authenticatorData ||
  clientDataHash`, not "credential pubkey + challenge" (pubkey is inside authData). Fix step 6.
- [ ] **M16.** `05-attestation/03-fido2-webauthn.md` auth-phase verification incomplete — add
  challenge match, rpIdHash, origin, UP/UV flags, counter; note the *browser* enforces origin/RP-ID
  binding (the actual phishing resistance).
- [ ] **M17.** `05-attestation/02-universal-pattern.md` App Attest ≠ "DeviceCheck key" (distinct APIs;
  App Attest = per-app SE key attested by Apple); Play Integrity is server-mediated verdict, not a
  device-key cert chain — overstates structural identity.
- [ ] **M18.** `05-attestation/02-universal-pattern.md` "Every TEE attestation has been broken" +
  unsubstantiated Secure Enclave claim — overclaim/walkback. Retitle to "most TEEs have faced
  serious side-channel breaks"; drop or source the SE claim.
- [ ] **M19.** `06-modern-protocols/03-sigstore-keyless.md` Cosign listed as a core architectural
  pillar — it's one client; the third component is the TUF-distributed trust root.
- [ ] **M20.** `06-modern-protocols/03-sigstore-keyless.md` Fulcio "10 minutes" repeated 3× as a
  protocol constant — stop quoting an exact number; "short-lived (minutes)."
- [ ] **M21.** `06-modern-protocols/01-pkce.md` `plain` "should never be used" but never explains why
  (challenge==verifier, so request interception reveals it; S256 is one-way). Add the threat.
- [ ] **M22.** `06-modern-protocols/01-pkce.md` "classic vuln" oversimplified — for confidential
  clients the code also needs client_secret; PKCE's value there is defeating code *injection*
  (tie to RFC 9700 "all clients").
- [ ] **M23.** `06-modern-protocols/02-dpop.md` make scheme explicit: `Authorization: DPoP <token>`
  + `DPoP: <proof>`; "access token signature valid" assumes JWT — opaque tokens use introspection.
- [ ] **M24.** `06-modern-protocols/02-dpop.md` "replay window problem" omits the `DPoP-Nonce`
  mechanism (RFC 9449) — the actual robust anti-replay control.
- [ ] **M25.** `07-supply-chain/01-sbom.md` "hash = immutable identifier" + "SHA-256 cannot be lied
  about" — false if attacker controls the SBOM; only meaningful when signed + recomputed. Walkback.
- [ ] **M26.** `08-end-to-end/02-supply-chain-pipeline.md` backdated-signature defense over-credits a
  bare Rekor timestamp; trust depends on Rekor auditability / optional RFC3161 TSA.
- [ ] **M27.** `07-supply-chain/03-in-toto.md` DSSE "algorithm agility" overstated — DSSE just allows
  multiple signatures; no algorithm negotiation. Soften.
- [ ] **M28.** `07-supply-chain/04-transparency-logs.md` "modify an entry breaks all subsequent root
  hashes" imprecise — changes the path to the (single) root; detection = inclusion/consistency proof
  against the previously signed root fails.
- [ ] **M29.** `08-end-to-end/03-signing-service-design.md` RSA-4096 "~100–1000 signings/sec/HSM"
  optimistic at top end (that's RSA-2048 territory); lower or relabel.

---

## 🟢 EASY-WIN (low effort, high gain)

- [ ] **E1.** `01-sign-verify.md` lede/description still assert "non-repudiation" flatly — qualify/drop.
- [ ] **E2.** `05-tls.md` cross-ref numbering: PKI cited as "2.1 preview" up top but "2.2" later for
  chain verification — make consistent (issuance 2.1, chain 2.2).
- [ ] **E3.** `04-trng.md` `RNDR`/`RNDRRS` is the *optional* FEAT_RNG (Armv8.5-A+), not guaranteed.
- [ ] **E4.** `04-trng.md` Bell tests rule out *local hidden variables*, not "confirm indeterminism."
- [ ] **E5.** `03-pkcs11.md` `C_Verify` also covers HMAC/MAC, not only public-key.
- [ ] **E6.** `01-certificate-issuance.md` relabel "self-sign CSR" → "sign CSR (proof of possession)"
  (avoid confusion with self-signed root).
- [ ] **E7.** `02-key-hierarchy.md` AES-KW: add "deterministic is fine here — wrapping high-entropy
  key material, not user data."
- [ ] **E8.** `02-trust-domains.md` / `03-key-rotation.md` genericize NVIDIA node names or label as
  illustrative.
- [ ] **E9.** `06-mtls.md` "eliminate the CRL/OCSP problem" → "largely sidestep."
- [ ] **E10.** `03-otp-fuses.md` reconcile "RSA-4096 = 512 bytes" with "few hundred bits"; add "a hash
  is ~32 bytes regardless of key type."
- [ ] **E11.** `03-otp-fuses.md` checkm8 is unpatchable but *tethered/non-persistent* — fix "permanent
  unsigned code execution."
- [ ] **E12.** `02-smartcards.md` Titan M → Titan M2 (Pixel 6+); note table mixes removable cards vs
  embedded secure elements.
- [ ] **E13.** `04-recovery.md` single `SC` participant vs "repeated per custodian" — annotate per-card
  sessions.
- [ ] **E14.** `05-share-refresh.md` proactive-SS citation: Herzberg, Jarecki, Krawczyk, Yung, CRYPTO
  **1995** (not "Jakobsson, late 1990s").
- [ ] **E15.** `05-share-refresh.md` add the rule "tolerates N−M lost shares" next to the examples.
- [ ] **E16.** `04-secure-boot.md` "Bricked … permanently disables itself" — rare/anti-tamper only;
  most devices fall back to recovery/DFU.
- [ ] **E17.** `05-attestation/01.md` relabel `AIKCert --> AIKSig` edge ("signs"/"produces", not chain).
- [ ] **E18.** `06-pkce` refresh tokens for public clients must be rotated/sender-constrained (RFC 9700).
- [ ] **E19.** `06-dpop` "ephemeral per-session" key over-specified — key must outlive the bound tokens.
- [ ] **E20.** `05-fido2-webauthn.md` split conveyance preferences (none/indirect/direct/enterprise) from
  attestation types (None/Self/Basic-AttCA/AnonCA); drop "Full."
- [ ] **E21.** `06-dpop` "DPoP wins on deployability" → soften; mTLS-bound tokens stronger in FAPI/high-assurance.
- [ ] **E22.** `06-pkce` code_verifier: add "≥256 bits (32 bytes) entropy, base64url."
- [ ] **E23.** `05-attestation/01.md` "single round trip" contradicts the reference-value lookup — reword.
- [ ] **E24.** `06-sigstore` "replaces RFC 3161 timestamping" — Sigstore now also supports/recommends a
  dedicated RFC 3161 TSA in the bundle.
- [ ] **E25.** `07-slsa.md` lede/description + "## The four SLSA levels" heading also say "four" —
  fix alongside the known L4 table correction.
- [ ] **E26.** `08-firmware-lifecycle.md` add note: root cert comes from untrusted flash; the fuse-hash
  match is what makes it trustworthy.
- [ ] **E27.** `07-sbom.md` + `08-supply-chain-pipeline.md` placeholder CVE strings (`CVE-2024-XXXXX`,
  `CVE-2024-{{various}}`) look unrendered — use generic wording or a real example (e.g. xz/CVE-2024-3094).
- [ ] **E28.** `07-sbom.md` PURL/CPE are for naming/matching, not bit-unique identification (the hash is).
- [ ] **E29.** `07-ai-model-provenance.md` model-cards: note adopters use "model-card-style" docs, not the
  exact Mitchell et al. schema.
- [ ] **E30.** `08-signing-service-design.md` "no plaintext ever exits" → "no plaintext *key material*."
- [ ] **E31.** `07-transparency-logs.md` Rekor logs keyless *and* key-based entries, not only keyless.

---

## Already identified earlier (not re-listed above)
- SLSA L4 table outdated (v1.0 = Build L1–L3) — `07-slsa.md` (see also E25).
- `01-sign-verify.md` "encrypt with private key / decrypt with public key" RSA misconception (lede + body).
- `01-sign-verify.md` non-repudiation overstated (needs PKI + timestamp).
- Add a "Builds on:" prerequisite line per page.
- De-duplicate the Sony PS3 war story (keep in `04-trng.md`).
- `05-fido2-webauthn.md` "the parallel is exact" overclaim (per-device EK vs batch key).
