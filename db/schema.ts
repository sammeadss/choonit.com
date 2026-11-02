import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';

export type FactorKey =
  'production' | 'lyrics' | 'originality' | 'melody' | 'replayValue' | 'emotion' | 'culturalImpact';

export const itemType = pgEnum('item_type', ['album', 'track']);
export const sentiment = pgEnum('sentiment', ['loved', 'fine', 'disliked']);

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    username: text('username').notNull(),
    usernameChosen: boolean('username_chosen').notNull().default(true),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
    showFactors: boolean('show_factors').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('profiles_username_lower_idx').on(sql`lower(${t.username})`),
    // Must match usernameSchema in lib/validation/auth.ts.
    check('profiles_username_format', sql`${t.username} ~ '^[A-Za-z0-9_]{3,20}$'`),
    check('profiles_bio_length', sql`char_length(${t.bio}) <= 160`),
  ],
).enableRLS();

export const items = pgTable('items', {
  mbid: uuid('mbid').primaryKey(),
  type: itemType('type').notNull(),
  title: text('title').notNull(),
  artistName: text('artist_name').notNull(),
  artistMbid: uuid('artist_mbid'),
  workMbid: uuid('work_mbid'),
  releaseDate: text('release_date'),
  coverUrl: text('cover_url'),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

export const rankings = pgTable(
  'rankings',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    itemMbid: uuid('item_mbid')
      .notNull()
      .references(() => items.mbid),
    workMbid: uuid('work_mbid'),
    sentiment: sentiment('sentiment').notNull(),
    position: integer('position').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.itemMbid] }),
    uniqueIndex('rankings_user_work_idx').on(t.userId, t.workMbid),
    index('rankings_user_position_idx').on(t.userId, t.position),
    check('rankings_position_positive', sql`${t.position} >= 1`),
  ],
).enableRLS();

export const rankEvents = pgTable(
  'rank_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    itemMbid: uuid('item_mbid')
      .notNull()
      .references(() => items.mbid),
    sentiment: sentiment('sentiment').notNull(),
    position: integer('position').notNull(),
    listSize: integer('list_size').notNull(),
    score: numeric('score', { precision: 3, scale: 1 }).notNull(),
    factors: jsonb('factors').$type<Partial<Record<FactorKey, number | null>>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('rank_events_user_item_idx').on(t.userId, t.itemMbid, t.createdAt),
    check('rank_events_score_range', sql`${t.score} >= 0 and ${t.score} <= 10`),
  ],
).enableRLS();
