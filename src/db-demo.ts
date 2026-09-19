import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { departments } from "./db/schema/index.js";

async function main() {
    try {
        console.log("Performing CRUD operations...");

        const [newUser] = await db
            .insert(departments)
            .values({ code: "DEMO", name: "Demo Department" })
            .returning();

        if (!newUser) {
            throw new Error("Failed to create user");
        }

        console.log("CREATE: New user created:", newUser);

        const [foundUser] = await db
            .select()
            .from(departments)
            .where(eq(departments.id, newUser.id));
        console.log("READ: Found user:", foundUser);

        const [updatedUser] = await db
            .update(departments)
            .set({ name: "Updated Demo Department" })
            .where(eq(departments.id, newUser.id))
            .returning();

        if (!updatedUser) {
            throw new Error("Failed to update user");
        }

        console.log("UPDATE: User updated:", updatedUser);

        await db.delete(departments).where(eq(departments.id, newUser.id));
        console.log("DELETE: User deleted.");
        console.log("CRUD operations completed successfully.");
    } catch (error) {
        console.error("Error performing CRUD operations:", error);
        process.exitCode = 1;
    }
}

await main();