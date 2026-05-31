import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPrefixes = ["/user", "/partner", "/admin"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirected", "1");
    return NextResponse.redirect(loginUrl);
  }

  if (!user) return response;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "customer";

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/partner") && role !== "partner") {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  if (pathname.startsWith("/user") && role === "partner") {
    return NextResponse.redirect(new URL("/partner", request.url));
  }

  if (pathname.startsWith("/user") && role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (
    pathname.startsWith("/partner") &&
    pathname !== "/partner/pending" &&
    role === "partner"
  ) {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("approval_status")
      .eq("owner_id", user.id)
      .single();

    if (restaurant && restaurant.approval_status !== "approved") {
      return NextResponse.redirect(new URL("/partner/pending", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};