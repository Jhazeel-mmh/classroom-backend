import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

const timpestamps = {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),

};

export const departments = pgTable("departments", {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timpestamps
});

export const subjects = pgTable("subjects", {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    departmentId: integer('department_id').notNull().references(() => departments.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }).unique().notNull(),
    description: varchar('description', { length: 255 }),
    ...timpestamps
});


export const departmentsRelations = relations(departments, ({ many }) => ({ subjects: many(subjects) }));
export const subjectRelation = relations(subjects, ({ one, many }) => ({ departement: one(departments, { fields: [subjects.departmentId], references: [departments.id] }) }));


export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;