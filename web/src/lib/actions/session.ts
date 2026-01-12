"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PocketBase from "pocketbase";
import { ClientResponseError } from "pocketbase";
import { PB_URL } from "@/lib/pocketbase/config";
import { logger } from "@/lib/logger";
import { escapePBFilter } from "@/lib/security";

interface AuthResult {
  error?: string;
  errors?: string[];
  redirect?: string;
}

export async function login(prevState: AuthResult | undefined, formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const defaultRedirect = formData.get("redirect") as string || "/dashboard";

  logger.debug("Login attempt", { email });

  let finalRedirect = defaultRedirect;

  try {
    // Create a temporary client for authentication
    const pb = new PocketBase(PB_URL);

    // Perform authentication
    const authData = await pb.collection("users").authWithPassword(email, password);
    logger.debug("Auth successful", { userId: authData.record.id, role: authData.record.role });

    // Set the httpOnly cookie
    const cookieStore = await cookies();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1 year expiration

    // Store just the token and model as JSON (not the full cookie string)
    const cookiePayload = JSON.stringify({
      token: pb.authStore.token,
      record: pb.authStore.record,
    });

    cookieStore.set("pb_auth", cookiePayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && PB_URL.startsWith("https"),
      sameSite: "lax",
      path: "/",
      expires: expires,
    });

    // Determine redirect based on role and client portal status
    const isAdmin = authData.record.role === 'admin';
    const isClientPortalEnabled = process.env.ENABLE_CLIENT_PORTAL === 'true';

    // Extract locale from default redirect
    const localeMatch = defaultRedirect.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : 'en';

    if (isAdmin) {
      // Admin users go to admin panel
      finalRedirect = `/${locale}/admin/requests`;
    } else if (!isClientPortalEnabled) {
      // Non-admin + client portal disabled = redirect to home
      finalRedirect = `/${locale}/`;
    }
    // else: use the default redirect (dashboard)

    // Revalidate paths
    revalidatePath("/", "layout");
  } catch (error) {
    logger.error("Login error", error as Error);
    if (error instanceof ClientResponseError) {
      return { error: "Invalid email or password" };
    }
    return { error: "An unexpected error occurred" };
  }

  // Redirect MUST be outside try/catch as it throws a special error
  redirect(finalRedirect);
}

export async function register(formData: FormData): Promise<AuthResult> {
  const pb = new PocketBase(PB_URL);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;
  const language = formData.get("language") as string;

  try {
    // First check name existence
    const nameExists = await pb.collection("users").getList(1, 1, {
      filter: `name = "${escapePBFilter(name)}"`,
    });

    if (nameExists.totalItems > 0) {
      return { errors: ["This name is already taken"] };
    }

    // Then check email existence
    const emailExists = await pb.collection("users").getList(1, 1, {
      filter: `email = "${escapePBFilter(email)}"`,
    });

    if (emailExists.totalItems > 0) {
      return { errors: ["This email is already registered"] };
    }

    // Create new user
    await pb.collection("users").create({
      name,
      email,
      password,
      passwordConfirm,
      language,
    });

    // Login after registration
    await pb.collection("users").authWithPassword(email, password);

    // Set the httpOnly cookie
    const cookieStore = await cookies();
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    const cookiePayload = JSON.stringify({
      token: pb.authStore.token,
      record: pb.authStore.record,
    });

    cookieStore.set("pb_auth", cookiePayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && PB_URL.startsWith("https"),
      sameSite: "lax",
      path: "/",
      expires: expires,
    });

    return { redirect: `/dashboard` };
  } catch (error: unknown) {
    if (error instanceof ClientResponseError) {
      const validationErrors = error.data?.data;
      if (validationErrors) {
        const errors: string[] = [];
        for (const field in validationErrors) {
          const fieldError = validationErrors[field];
          if (fieldError.code === "validation_not_unique") {
            if (field === "name") {
              errors.push("This name is already taken");
            } else if (field === "email") {
              errors.push("This email is already registered");
            }
          } else if (fieldError.message) {
            errors.push(fieldError.message);
          }
        }
        if (errors.length > 0) {
          return { errors };
        }
      }
      if (error.message) {
        return { errors: [error.message] };
      }
    }
    return { errors: ["Registration failed. Please try again."] };
  }
}

export async function logout(): Promise<void> {
  try {
    // Clear the httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.delete("pb_auth");

    // Revalidate and redirect
    revalidatePath("/", "layout");
    redirect("/login");
  } catch (error) {
    logger.error("Logout error", error as Error);
    // Even if there's an error, try to redirect
    redirect("/login");
  }
}
