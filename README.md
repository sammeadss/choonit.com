# choonit.com

A music rating platform on the web.

# Purpose

Choonit lets you log music you've listened to and rank it by comparing it against music you've already logged. Instead of picking a number, you tell Choonit how you felt (loved it, it was fine, or not for me) and answer a few "which is better" comparisons, and Choonit places the record in your personal ranked list and mathematically derives a score from its position.

# Scope

- Solo-only for v1: no friends, feeds, or sharing.
- Two separate ranked lists: Albums (Album + EP) and Tracks (includes singles).
- Albums are ranked against albums, tracks against tracks.
- Build order: Albums first, then Tracks; both are in the MVP.
- Users can remove a ranked record (deletes their ranking and all of its history)
- Profile avatars can be uploaded (image only, re-encoded on the server)

# Decisions

- Score is 0–10: the record's sentiment sets a range, and its position within that range sets the exact score (formula to be defined; relative, shifts as the list grows)
- Albums are MusicBrainz release groups (type Album or EP); Tracks are MusicBrainz recordings. A Single release group maps to its track.
- Optional factor sliders are stored with each rank event and never affect the score (factor list and N/A rule below)
- Re-ranking keeps history: each rank event (position, score, factor values) is stored with a date
- Search returns albums, tracks, and artists
- Factors are Production, Lyrics, Originality, Melody, Replay value, Emotion, Cultural impact; sliders are 0–10 in half steps; a slider only counts once touched; only Lyrics can be marked N/A
- Compare: the record being ranked stays pinned; the opposing card is replaced after each answer; The screen never shows list positions or ranges; the result is revealed only after the last answer; "Skip" swaps in another record from the same range (hidden on the final question), no undo
- Username: chosen at sign-up, 3–20 characters (letters, numbers, underscores), unique
- Sentiment (loved / fine / not for me) is asked before comparisons; comparisons only happen within the same sentiment
- Profile rows are created by a database trigger on sign-up, so sign-up either fully succeeds or fully fails
- Avatars: server-side upload, JPEG/PNG/WebP only, 2 MB cap, magic-byte check, re-encoded and resized, server-generated filename, stored in Supabase Storage
- Factors: optional; a profile setting (`show_factors`) controls whether bars are displayed
- Removing a record deletes your `rankings` row and your `rank_events` for it; the shared `items` row stays
- Duplicate songs: one ranking per MusicBrainz Work per user; a recording whose Work is already ranked shows a link to the existing entry instead of "Rank it"
- Leaving mid-compare loses progress; nothing is saved until the last answer
- The sentiment step is the first screen of the Compare routes (no separate route)
- Google login uses Supabase OAuth; Google accounts get a generated temporary username and must choose a real one before using the app
- Google profile pictures are ignored; avatars are always uploaded
- Email/password sign-ups must confirm their email before logging in; Google sign-ins are already verified
- Delete account removes the auth user (which cascades to profile, rankings and rank events) and the user's avatar file in Storage
- Sentiment is an input to ranking only and is never shown back to the user (no tags, section headers or "last time" hints)
- Usernames can be changed from Edit profile (same format rules, still unique); a cooldown will be added if profiles become public
- The emailed confirmation link opens /auth/confirm (a route handler, not a page), which exchanges the code (or verifies the token hash once the email template can be customized) and sends the user to Profile

# Design notes

- Audience: casual listeners and audiophiles
- Vibe: record-store confident; cover art is the star; pink reserved for the verdict and the primary action
- Platform: mobile-first
- Key screen: Compare
- Cover art is the main visual element across the app
- Loading: skeletons mirror the final layout (cover, title, rows) so nothing jumps when data arrives

# Pages

| Page                   | Route                          | Auth                                  |
| ---------------------- | ------------------------------ | ------------------------------------- |
| Landing                | `/`                            | No                                    |
| Sign up                | `/signup`                      | No                                    |
| Log in                 | `/login`                       | No                                    |
| Search results         | `/search?q=`                   | Yes                                   |
| Album page             | `/release-group/:mbid`         | Yes                                   |
| Compare (album)        | `/release-group/:mbid/rank`    | Yes                                   |
| Profile                | `/me`                          | Yes                                   |
| Edit profile           | `/me/edit`                     | Yes                                   |
| Artist page            | `/artist/:mbid`                | Yes                                   |
| Track page             | `/recording/:mbid`             | Yes                                   |
| Compare (track)        | `/recording/:mbid/rank`        | Yes                                   |
| Factor sliders (album) | `/release-group/:mbid/factors` | Yes                                   |
| Factor sliders (track) | `/recording/:mbid/factors`     | Yes                                   |
| Forgot password        | `/forgot-password`             | No                                    |
| Reset password         | `/reset-password`              | No (reached from the emailed link)    |
| Choose username        | `/choose-username`             | Yes (only until a username is chosen) |
| Check email            | `/check-email`                 | No                                    |

# Data sources

- **MusicBrainz:** music metadata (artists, release groups (albums), recordings (tracks), track lists, dates)
  - free for non-commercial use and needs a commercial plan otherwise; requests need a User-Agent with a contact address (from an env var, MUSICBRAINZ_CONTACT)
- **Cover Art Archive:** cover images, looked up by MBID

# MVP features

1. Auth: email/password and Google sign-up/login, email confirmation, password reset
2. Music search (MusicBrainz)
3. Album page and Track page: cover, artist, release date, track list (albums only), your rank/score, factor bars
4. Log + compare flow for albums and tracks: pairwise comparisons, inserted into the matching ranked list
5. Optional factor sliders after ranking (skippable)
6. Profile: username, avatar upload, short bio, factor display toggle, delete account, your two ranked lists (Albums / Tracks)
7. Artist page (minimal): name, albums, and tracks
8. Error and loading states: custom 404 and error pages; loading skeletons for pages that fetch data (search results, Album/Artist/Track pages, Profile)
9. Remove from my list
10. Sentiment step before Compare

# Post-MVP features

- Friends, social feed, hot takes, Discover
- Recommendations, geographic taste
- Wishlist, custom lists, featured music
- Notifications, reactions/comments
- Privacy settings (public/private), expanded settings
- Lyrics, producers, labels, contributions
- Insights and recommendations from factor data
- Import listening history

# Before launch

- Buy the domain; set up custom SMTP (Resend or similar) and edit the confirmation email to use `token_hash`
- Confirm "Confirm email" is on, and RLS is enabled on every table
- Choose a license; review MusicBrainz commercial terms and cover art licensing

# Flows

1. **Onboarding**
   - Landing -> Sign up (username availability checked) -> "Check your email" -> emailed link -> Profile
2. **Log a new record**
   - Search (navbar) -> Search results (artists + albums + tracks)
   - Click a result -> Album page / Track page (shows "Not ranked yet" and a Rank it button)
   - Rank it -> Choose Loved / Fine / Not for me -> Compare page (album or track)
   - The app picks a record from the same list and the same sentiment and asks "Which is better?" You answer, and it narrows the range (binary insertion).
   - After about log2n answers, the position is fixed -> score computed
   - Optional factor sliders screen (skip or save)
   - Redirect to Album page / Track page, which now shows your rank and score
3. **Re-rank after another listen**
   - Album page / Track page (already ranked) -> Listen again / Re-rank button
   - Compare flow runs against your list (Albums or Tracks) without this record's current entry
   - New position is saved as a new rank event; the old one stays in history
   - Album page / Track page shows the new rank, plus a small history of past ranks/scores
   - Sentiment is asked again for re-rank
4. **Browse your taste**
   - Profile -> pick the Albums / Tracks tab -> ranked list -> click a record -> Album page / Track page
5. **Explore an Artist**
   - Album page / Track page -> click artist -> Artist page (albums + tracks) -> click a track -> Track page
6. **Returning user**
   - Landing -> Log in -> Profile
7. **Edit profile**
   - Profile -> Edit profile -> save -> Profile
8. **Forgot password**
   - Log in -> Forgot password (enter email) -> confirmation ("check your email") -> emailed link -> Reset password (new password) -> Log in
9. **Remove a record**
   - Album/Track page -> Remove from my list -> confirm -> Profile
10. **Google sign-in**
    - Landing -> Continue with Google -> (new user) Choose username -> Profile; (returning user) -> Profile
11. **Delete account**
    - Profile -> Edit profile -> Delete account -> confirm (type username) -> Landing

# Edge cases

- If the chosen sentiment bucket is empty, skip the comparisons and place the record at the start of that bucket's section (position #1 only if the whole list is empty)
- Search with no results
- Profile with an empty list (e.g. no Tracks yet)
- Album with no cover art in the Cover Art Archive (needs a placeholder)
- A sentiment bucket with only one record: the new record gets exactly one comparison
- A track appears on several releases (single, album, compilation): rank the recording once; pick one release for its cover art, with a placeholder if none has art
- User skips the factor sliders, or marks a factor N/A: the rank still saves
- Track page needs a link to the album(s) it appears on
- Reset link expired or already used: show a clear message with a link to request a new one
- Page not found (bad URL, or an MBID that doesn't exist): custom 404
- MusicBrainz is slow, down, or rate-limiting us: show a friendly error with a retry, not a crash
- Server error: custom error page with a way back home
- Song already ranked under another recording: show a link to the existing ranking instead of "Rank it"
- Avatar rejected by validation: show a clear error and keep the current avatar
- Username already taken at sign-up: inline error before submit; also handle two people claiming it at the same moment
- Removing a record closes the gap in positions
- Login attempted before email is confirmed: "Confirm your email first" with a resend button
- Confirmation link expired: message with a way to request a new one
- Google sign-in cancelled or denied: back to Log in with a clear message
- Same email used for email/password and Google: Supabase links them by verified email (verify this behavior when building)
- Forgot password for a Google-only account: same generic confirmation message, no hint about how the account signs in
- User closes the Choose username screen: the app keeps redirecting them there until a username is chosen

# Tech stack

- Language: TypeScript
- Framework: Next.js (React, App Router), full-stack
- Database: PostgreSQL (hosted on Supabase)
- ORM: Drizzle
- Auth: Supabase Auth (email/password + Google OAuth)
- Styling: Tailwind CSS
- Hosting: Vercel
- Testing: Vitest (unit), Playwright (end-to-end)
- Storage: Supabase Storage
- Image processing: sharp
- Later: Redis cache for MusicBrainz responses
