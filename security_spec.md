# Security Specification - Torneo Frazioni Castiglion Fiorentino 2026

## 1. Data Invariants
- Teams, matches, and scorers are grouped by a specific tournament `edition` (e.g., 2026).
- Public users (not signed in) can only read (`get`, `list`) all collections.
- Only authenticated admins can write (`create`, `update`, `delete`) to any collection.
- Admin status is verified by checking the user's uid or by standard admin credentials.
- In this app, we have a bootstrapped admin with email `admin@torneo.local` and a password or authenticated admin records.
- To prevent any tampering, only authenticated users can write data.

## 2. The Dirty Dozen Payloads (Targeting Security Rule Bypasses)
1. **Unauthenticated Team Creation**: Attempting to create a team when not signed in.
2. **Unauthenticated Match Score Update**: Attempting to modify match scores when not signed in.
3. **Unauthenticated Scorer Insertion**: Attempting to add a scorer record when not signed in.
4. **Ad-hoc Admin Settings Modification**: Attempting to change active tournament edition when not signed in.
5. **Team Name Value Poisoning**: Injecting an extremely long team name string (e.g. >1MB) to crash storage/wallet.
6. **Self-Assigned Admin Account**: Attempting to write into `admins/` or change settings when not a valid admin.
7. **Malformed Match Document**: Match document with missing required field `edition`.
8. **Invalid Team Group**: Setting a team's group to "Z" instead of "A" or "B".
9. **Negative Score Input**: Updating homeGoals or awayGoals to a negative integer.
10. **Tampering with Immutable Edition**: Modifying the edition field of an existing match.
11. **Injecting Orphaned Matches**: Creating a match with non-existent teams.
12. **Malicious ID Poisoning**: Creating a match with a 10KB string as Document ID.

All of these malicious payloads must return `PERMISSION_DENIED` under the rules.
