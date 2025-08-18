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