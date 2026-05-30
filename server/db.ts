import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, photos, comments, likes, InsertPhoto, InsertComment, InsertLike } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Photo queries
export async function uploadPhoto(photo: InsertPhoto) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(photos).values(photo);
  return result;
}

export async function getApprovedPhotos() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(photos)
    .where(eq(photos.approvalStatus, "approved"))
    .orderBy(desc(photos.uploadedAt));
}

export async function getPendingPhotos() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(photos)
    .where(eq(photos.approvalStatus, "pending"))
    .orderBy(desc(photos.uploadedAt));
}

export async function getPhotoById(photoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(photos)
    .where(eq(photos.id, photoId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function approvePhoto(photoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(photos)
    .set({ approvalStatus: "approved", approvedAt: new Date() })
    .where(eq(photos.id, photoId));
}

export async function rejectPhoto(photoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(photos)
    .set({ approvalStatus: "rejected" })
    .where(eq(photos.id, photoId));
}

// Comment queries
export async function addComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(comments).values(comment);
}

export async function getPhotoComments(photoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(comments)
    .where(eq(comments.photoId, photoId))
    .orderBy(desc(comments.createdAt));
}

// Like queries
export async function toggleLike(photoId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.photoId, photoId), eq(likes.userId, userId)))
    .limit(1);
  
  if (existing.length > 0) {
    // Unlike
    return db
      .delete(likes)
      .where(and(eq(likes.photoId, photoId), eq(likes.userId, userId)));
  } else {
    // Like
    return db.insert(likes).values({ photoId, userId });
  }
}

export async function getLikeCount(photoId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(likes)
    .where(eq(likes.photoId, photoId));
  return result.length > 0 ? result.length : 0;
}

export async function getUserLikeStatus(photoId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(likes)
    .where(and(eq(likes.photoId, photoId), eq(likes.userId, userId)))
    .limit(1);
  return result.length > 0;
}
