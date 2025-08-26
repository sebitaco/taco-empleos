import { pgTable, text, uuid, boolean, integer, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const waitlist = pgTable('waitlist', {
  id: uuid('id').defaultRandom().primaryKey(),
  audience: text('audience').notNull(),
  email: text('email').notNull(),
  city: text('city').notNull(),
  source: text('source'),
  
  // Employer fields
  companyName: text('company_name'),
  needs: text('needs'),
  
  // Candidate fields
  role: text('role'),
  experienceYears: integer('experience_years'),
  preferredCity: text('preferred_city'),
  
  // Meta fields
  consent: boolean('consent').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueEmailAudience: uniqueIndex('waitlist_email_audience_unique').on(table.email, table.audience),
  createdAtIdx: index('idx_waitlist_created_at').on(table.createdAt),
  audienceIdx: index('idx_waitlist_audience').on(table.audience),
  emailIdx: index('idx_waitlist_email').on(table.email),
}));

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  salary: text('salary').notNull(),
  bodyContent: text('body_content').notNull(),
  facebookUrl: text('facebook_url').notNull(),
  tags: text('tags').array(),
  featured: boolean('featured').default(false),
  isNew: boolean('is_new').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  titleIdx: index('idx_jobs_title').on(table.title),
  locationIdx: index('idx_jobs_location').on(table.location),
  featuredIdx: index('idx_jobs_featured').on(table.featured),
  isActiveIdx: index('idx_jobs_is_active').on(table.isActive),
  createdAtIdx: index('idx_jobs_created_at').on(table.createdAt),
}));