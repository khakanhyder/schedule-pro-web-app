import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  method: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};

  // Add team member session header if available
  const teamMemberContext = localStorage.getItem("teamMemberContext");
  if (teamMemberContext) {
    try {
      const context = JSON.parse(teamMemberContext);
      const sessionData = {
        teamMemberId: context.teamMemberId,
        permissions: context.permissions,
        clientId: context.clientId || localStorage.getItem('currentClientId') || 'client_1'
      };
      headers['X-Team-Member-Session'] = JSON.stringify(sessionData);
    } catch (error) {
      console.error("Error parsing team member context for API request:", error);
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {};

    // Add team member session header if available
    const teamMemberContext = localStorage.getItem("teamMemberContext");
    if (teamMemberContext) {
      try {
        const context = JSON.parse(teamMemberContext);
        const sessionData = {
          teamMemberId: context.teamMemberId,
          permissions: context.permissions,
          clientId: context.clientId || localStorage.getItem('currentClientId') || 'client_1'
        };
        headers['X-Team-Member-Session'] = JSON.stringify(sessionData);
      } catch (error) {
        console.error("Error parsing team member context for API request:", error);
      }
    }

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true, // Refetch when window gains focus
      staleTime: 30000, // 30 seconds instead of Infinity to allow fresh data
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
