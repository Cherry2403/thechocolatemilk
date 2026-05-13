"use client";

import { useState, useCallback, useMemo } from "react";
import { CONNECTIONS_MOCK } from "@/lib/data/connectionsMock";
import type { Connection } from "@/lib/types/connection";
import PendingRequests from "./components/PendingRequests";
import FriendList from "./components/FriendList";
import UsernameSearch from "./components/UsernameSearch";

const CURRENT_USER_ID = "user-01";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>(CONNECTIONS_MOCK);

  /* ── Derived lists ── */
  const accepted = useMemo(() => connections.filter((c) => c.status === "accepted"), [connections]);

  const pendingIncoming = useMemo(
    () => connections.filter((c) => c.status === "pending" && c.initiatedBy !== CURRENT_USER_ID),
    [connections]
  );

  const pendingOutgoing = useMemo(
    () => connections.filter((c) => c.status === "pending" && c.initiatedBy === CURRENT_USER_ID),
    [connections]
  );

  /** IDs already connected or pending — filter from search results. */
  const existingIds = useMemo(
    () => new Set(connections.map((c) => c.friendId).filter(Boolean) as string[]),
    [connections]
  );

  /* ── Actions ── */

  const handleAccept = useCallback((id: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "accepted" as const } : c))
    );
  }, []);

  const handleDecline = useCallback((id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleRemove = useCallback((id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleAdd = useCallback((userId: string, username: string, assistantName: string) => {
    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      userId: CURRENT_USER_ID,
      friendId: userId,
      friendUsername: username,
      friendAssistantName: assistantName,
      status: "pending",
      initiatedBy: CURRENT_USER_ID,
      createdAt: new Date().toISOString(),
    };
    setConnections((prev) => [newConn, ...prev]);
  }, []);

  return (
    <div className="mt-2 px-5 rounded-3xl bg-cream pt-5 pb-6 text-text shadow-[0_-8px_24px_rgba(0,0,0,0.1)]">
      <UsernameSearch onAdd={handleAdd} existingIds={existingIds} />

      {/* Pending incoming requests — shown above friends */}
      <PendingRequests
        incoming={pendingIncoming}
        outgoing={pendingOutgoing}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />

      {/* Accepted friends */}
      <FriendList connections={accepted} onRemove={handleRemove} />
    </div>
  );
}
