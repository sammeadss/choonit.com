# choonit.com
A music rating platform on the web.

# Purpose
Choonit lets you log music you've listened to and rank it by comparing it against music you've already logged. Instead of picking a number, you answer "which is better" a few times and Choonit places the record in your personal ranked list and derives a score from its position. You can also rate a record on a few factors to describe what makes it good.

# Scope 
- Solo-only for v1: no friends, feeds, or sharing.
- Two separate ranked lists: Albums (Album + EP) and Tracks (includes singles).
- Albums are ranked against albums, tracks against tracks.
- Build order: Albums first, then Tracks; both are in the MVP.

# Decisions
- Score is 0–10, derived from list position (relative; shifts as the list grows)
- Albums are MusicBrainz release groups (type Album or EP); Tracks are MusicBrainz recordings. A Single release group maps to its track.
- Optional factor sliders are stored with each rank event and never affect the score (factor list and N/A rule below)
- Re-ranking keeps history: each rank event (position, score, factor values) is stored with a date
- Search returns albums, tracks, and artists
- Factors are Production, Lyrics, Originality, Melody, Replay value, Emotion, Cultural impact; sliders are 0–10 in half steps; a slider only counts once touched; only Lyrics can be marked N/A
- Compare: the record being ranked stays pinned; the opposing card is replaced after each answer; The screen never shows list positions or ranges; the result is revealed only after the last answer; "Skip" swaps in another record from the same range (hidden on the final question), no undo

# Design notes
- Audience: casual listeners and audiophiles
- Vibe: record-store confident; cover art is the star; pink reserved for the verdict and the primary action
- Platform: mobile-first
- Key screen: Compare
- Cover art is the main visual element across the app
- Loading: skeletons mirror the final layout (cover, title, rows) so nothing jumps when data arrives

# Pages
| Page | Route | Auth |
|------|-------|------|
| Landing | `/` | No |
| Sign up | `/signup` | No |
| Log in | `/login` | No |
| Search results | `/search?q=` | Yes |
| Album page | `/release-group/:mbid` | Yes |
| Compare (album) | `/release-group/:mbid/rank` | Yes |
| Profile | `/me` | Yes |
| Edit profile | `/me/edit` | Yes |
| Artist page | `/artist/:mbid` | Yes |
| Track page | `/recording/:mbid` | Yes |
| Compare (track) | `/recording/:mbid/rank` | Yes |
| Factor sliders (album) | `/release-group/:mbid/factors` | Yes |
| Factor sliders (track) | `/recording/:mbid/factors` | Yes |
| Forgot password | `/forgot-password` | No |
| Reset password | `/reset-password` | No (reached from the emailed link) |

# Data sources
- **MusicBrainz:** music metadata (artists, release groups (albums), recordings (tracks), track lists, dates)
- **Cover Art Archive:** cover images, looked up by MBID

# MVP features
1. Auth: email/password sign-up, login, and password reset
2. Music search (MusicBrainz)
3. Album page and Track page: cover, artist, release date, track list (albums only), your rank/score, factor bars
4. Log + compare flow for albums and tracks: pairwise comparisons, inserted into the matching ranked list
5. Optional factor sliders after ranking (skippable)
6. Profile: username, avatar, short bio, your two ranked lists (Albums / Tracks)
7. Artist page (minimal): name, albums, and tracks
8. Error and loading states: custom 404 and error pages; loading skeletons for pages that fetch data (search results, Album/Artist/Track pages, Profile)

# Post-MVP features
- Friends, social feed, hot takes, Discover
- Recommendations, geographic taste
- Wishlist, custom lists, featured music
- Notifications, reactions/comments
- Privacy settings (public/private), expanded settings
- Lyrics, producers, labels, contributions
- Insights and recommendations from factor data

# Flows
1. **Onboarding**
    - Landing -> Sign up -> Profile (empty state: "Search for your first record")
2. **Log a new record**
    - Search (navbar) -> Search results (artists + albums + tracks)
    - Click a result -> Album page / Track page (shows "Not ranked yet" and a Rank it button)
    - Rank it -> Compare page (album or track)
    - The app picks a record from that same list and asks "Which is better?" You answer, and it narrows the range (binary insertion).
    - After about log2n answers, the position is fixed -> score computed
    - Optional factor sliders screen (skip or save)
    - Redirect to Album page / Track page, which now shows your rank and score
3. **Re-rank after another listen**
    - Album page / Track page (already ranked) -> Listen again / Re-rank button
    - Compare flow runs against your list (Albums or Tracks) without this record's current entry
    - New position is saved as a new rank event; the old one stays in history
    - Album page / Track page shows the new rank, plus a small history of past ranks/scores
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

# Edge cases
- If that list is empty, skip the comparisons and place it at #1
- Search with no results
- Profile with an empty list (e.g. no Tracks yet)
- Album with no cover art in the Cover Art Archive (needs a placeholder)
- A list with only one record: the new record gets exactly one comparison
- A track appears on several releases (single, album, compilation): rank the recording once; pick one release for its cover art, with a placeholder if none has art
- User skips the factor sliders, or marks a factor N/A: the rank still saves
- Track page needs a link to the album(s) it appears on
- Reset link expired or already used: show a clear message with a link to request a new one
- Page not found (bad URL, or an MBID that doesn't exist): custom 404
- MusicBrainz is slow, down, or rate-limiting us: show a friendly error with a retry, not a crash
- Server error: custom error page with a way back home

# Tech stack
- Language: TypeScript
- Framework: Next.js (React, App Router), full-stack
- Database: PostgreSQL (hosted on Supabase)
- ORM: Drizzle
- Auth: Supabase Auth
- Styling: Tailwind CSS
- Hosting: Vercel
- Testing: Vitest (unit), Playwright (end-to-end)
- Later: Redis cache for MusicBrainz responses