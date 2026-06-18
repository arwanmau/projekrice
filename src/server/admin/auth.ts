const ADMIN_HEADER = "x-gfl-admin-email";

export function assertAdminRequest(request: Request): Response | null {
  const email = request.headers.get(ADMIN_HEADER);
  if (!email || !/admin/i.test(email)) {
    return Response.json(
      { error: "Unauthorized", message: "Admin email header required (x-gfl-admin-email)" },
      { status: 401 },
    );
  }
  return null;
}

export function jsonResponse<T>(data: T, init?: ResponseInit) {
  return Response.json(data, {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    ...init,
  });
}
